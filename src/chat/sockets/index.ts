import { 
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection, 
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket
} from '@nestjs/websockets';
import { Logger, Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { MessageType } from '@prisma/client'; // Import the enum

interface AuthenticatedSocket extends Socket {
  user?: any; // Kullanıcı bilgilerini ekleyeceğiz
}

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true
  },
  transports: ['websocket'],
  pingInterval: 10000,
  pingTimeout: 15000
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  
  private logger = new Logger('ChatGateway');
  private userSocketMap = new Map<string, string>(); // userId -> socketId

  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService
  ) {}

  afterInit() {
    this.logger.log('WebSocket Gateway initialized');
  }
  
  // Bağlantı işlemi
  async handleConnection(client: AuthenticatedSocket) {
    try {
      // Token doğrulama
      const token = client.handshake.auth.token;
      if (!token) {
        this.logger.warn(`No auth token provided: ${client.id}`);
        client.disconnect();
        return;
      }

      // JWT token'ı doğrulama
      client.user  = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET
      }).user;

      const userID =client.user.id.toString();
         
      // Kullanıcı -> Socket eşleştirmesini kaydet
      this.userSocketMap.set(userID, client.id);

      client.join(userID);

      this.logger.log(`Client connected: ${client.id} (User: ${client.user.username})`);
    }
    catch (error) {
      this.logger.error(`Error handling connection: ${error.message}`, error.stack);
      client.disconnect();
    }
  }

  // Bağlantı kesilmesi
  async handleDisconnect(client: AuthenticatedSocket) {
    // Kullanıcı bilgisi varsa haritadan kaldır
    if (client.user) {
      this.userSocketMap.delete(client.user.id.toString());
    }
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // Özel sohbet odasına katılma
  @SubscribeMessage('joinDirectChat')
  async handleJoinChat(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { recipientId: string | number }
  ) {
    try {
      if (!client.user) {
        return { success: false, message: 'Unauthorized' };
      }

      const { recipientId } = data;
      const senderId = client.user.id;
      
      // Diğer kullanıcının varlığını kontrol et
      const recipient = await this.prisma.user.findUnique({
        where: { id: Number(recipientId) }
      });

      if (!recipient) {
        return { success: false, message: 'Recipient not found' };
      }

      // Benzersiz oda ID'si oluştur
      const roomId = this.generateRoomId(senderId, recipientId);
      
      // Kullanıcıyı odaya ekle
      client.join(roomId);
      
      this.logger.log(`User ${client.user.username} joined room: ${roomId}`);

      // Önceki mesajları getir
      const messages = await this.prisma.message.findMany({
        where: {
          OR: [
            { senderId: Number(senderId), recipientId: Number(recipientId) },
            { senderId: Number(recipientId), recipientId: Number(senderId) }
          ]
        },
        orderBy: { createdAt: 'asc' }
      });

      // Okunmamış mesajları okundu olarak işaretle
      await this.prisma.message.updateMany({
        where: {
          senderId: Number(recipientId),
          recipientId: Number(senderId),
          isRead: false
        },
        data: { isRead: true }
      });

      return { 
        success: true, 
        roomId, 
        messages 
      };
    } catch (error) {
      this.logger.error(`Error joining chat: ${error.message}`, error.stack);
      return { success: false, message: 'Internal server error' };
    }
  }

  // Mesaj gönderme
  @SubscribeMessage('sendDirectMessage')
  async handleSendMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { recipientId: string | number, content: string, message_type?: string, metadata?: any }
  ) {
    try {
      if (!client.user) {
        return { success: false, message: 'Unauthorized' };
      }

      const { recipientId, content, message_type, metadata } = data;
      const senderId = client.user.id;
      
      // Convert string message_type to MessageType enum
      let messageTypeEnum: MessageType;
      switch(message_type) {
        case 'permission_request':
          messageTypeEnum = MessageType.permission_request;
          break;
        case 'system':
          messageTypeEnum = MessageType.system;
          break;
        case 'text':
        default:
          messageTypeEnum = MessageType.text;
          break;
      }
      
      // Mesajı veritabanına kaydet
      const message = await this.prisma.message.create({
        data: {
          content,
          senderId: Number(senderId),
          recipientId: Number(recipientId),
          message_type: messageTypeEnum, // Use the enum value here
          metadata: metadata || null,
          isRead: false
        }
      });

      const roomId = this.generateRoomId(senderId, recipientId);
      
      // Tüm odaya mesajı gönder (gönderen ve alıcı dahil)
      this.server.to(roomId).emit('directMessage', message);
      
      // Alıcı çevrimiçi mi kontrol et ve bildirim gönder
      const recipientSocketId = this.userSocketMap.get(recipientId.toString());
      if (recipientSocketId) {
        // Eğer alıcı çevrimiçi ancak başka bir kullanıcıyla konuşuyorsa
        if (recipientSocketId ) {
          this.server.to(recipientId.toString()).emit('newMessageNotification', {
            message: {
              ...message,
              sender: client.user
            }
          });
        }
      }

      return { success: true, message };
    } catch (error) {
      this.logger.error(`Error sending message: ${error.message}`, error.stack);
      return { success: false, message: 'Internal server error' };
    }
  }

  // Mesajları okundu olarak işaretleme
  @SubscribeMessage('markMessagesAsRead')
  async handleMarkAsRead(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { senderId: string | number }
  ) {
    try {
      if (!client.user) {
        return { success: false, message: 'Unauthorized' };
      }

      const { senderId } = data;
      const recipientId = client.user.id;
      
      // Mesajları veritabanında okundu olarak işaretle
      await this.prisma.message.updateMany({
        where: {
          senderId: Number(senderId),
          recipientId: Number(recipientId),
          isRead: false
        },
        data: { isRead: true }
      });

      // Gönderene mesajlarının okunduğu bilgisini ilet
      const senderSocketId = this.userSocketMap.get(senderId.toString());
      if (senderSocketId) {
        this.server.to(senderSocketId).emit('messagesRead', { 
          by: recipientId 
        });
      }

      return { success: true };
    } catch (error) {
      this.logger.error(`Error marking messages as read: ${error.message}`, error.stack);
      return { success: false, message: 'Internal server error' };
    }
  }

  // İzin isteği yanıtlarını işleme
  @SubscribeMessage('respondToPermissionRequest')
  async handlePermissionResponse(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { messageId: string | number, approved: boolean }
  ) {
    try {
      if (!client.user) {
        return { success: false, message: 'Unauthorized' };
      }

      const { messageId, approved } = data;

      // Mesaj durumunu güncelle
      await this.prisma.message.update({
        where: { id: Number(messageId) },
        data: {
          metadata: {
            status: approved ? 'approved' : 'rejected'
          }
        }
      });

      // Göndereni bilgilendir
      const message = await this.prisma.message.findUnique({
        where: { id: Number(messageId) }
      });

      if (message) {
        const senderSocketId = this.userSocketMap.get(message.senderId.toString());
        if (senderSocketId) {
          this.server.to(senderSocketId).emit('permissionRequestUpdated', {
            messageId,
            status: approved ? 'approved' : 'rejected'
          });
        }
      }

      return { success: true };
    } catch (error) {
      this.logger.error(`Error responding to permission request: ${error.message}`, error.stack);
      return { success: false, message: 'Internal server error' };
    }
  }

  // Benzersiz oda ID'si oluşturma yardımcı fonksiyonu
  private generateRoomId(userId1: string | number, userId2: string | number): string {
    // ID'leri sayısal olarak sıralayıp birleştir (her zaman aynı oda adını garanti eder)
    const sortedIds = [userId1, userId2].sort((a, b) => 
      Number(a) - Number(b)
    ).join('_');
    
    return `chat_${sortedIds}`;
  }
}