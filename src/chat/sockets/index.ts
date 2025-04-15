import { 
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection, 
    OnGatewayDisconnect,
    OnGatewayInit,
  } from '@nestjs/websockets';
  import { Logger } from '@nestjs/common';
  import { Server, Socket } from 'socket.io';
  import { Client } from 'socket.io/dist/client';
  
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
    // Create a dedicated logger for the gateway
    private logger = new Logger('ChatGateway');
    // Called after gateway initialization
    afterInit() {
      this.logger.log('WebSocket Gateway initialized');
    }
    
    // Handle new client connections
    async handleConnection(client: Socket) {
      try {
        const token = client.handshake.auth.token;
        this.logger.log(`Client connected: ${client.id}`);
        this.logger.log(`User token: ${token}`);

      }
      catch (error) {
        this.logger.error(`Error handling connection: ${error.message}`, error.stack);
        client.disconnect();
      }
    }
  
    // Handle client disconnections
    async handleDisconnect(client: Socket) {
      this.logger.log(`Client disconnected: ${client.id}`);
      // Log remaining connected clients
    }
  }