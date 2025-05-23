// redis/redis.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit {
  private client: RedisClientType;

  async onModuleInit() {
    this.client = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });
    
    this.client.on('error', (err) => console.error('Redis Client Error', err));
    await this.client.connect();
  }

  // Online kullanıcıları yönetmek için metodlar
  async setUserSocket(userId: string, socketId: string): Promise<void> {
    await this.client.hSet('online_users', userId, socketId);
  }

  async removeUserSocket(userId: string): Promise<void> {
    await this.client.hDel('online_users', userId);
  }

  async getUserSocket(userId: string): Promise<string | undefined> {
    return await this.client.hGet('online_users', userId);
  }

  async getAllOnlineUsers(): Promise<Record<string, string>> {
    return await this.client.hGetAll('online_users');
  }

  // Socket-User eşleştirmesi için metodlar
  async setSocketUser(socketId: string, userId: string): Promise<void> {
    await this.client.set(`socket_user:${socketId}`, userId);
  }

  async getSocketUser(socketId: string): Promise<string | null> {
    return await this.client.get(`socket_user:${socketId}`);
  }

  async removeSocketUser(socketId: string): Promise<void> {
    await this.client.del(`socket_user:${socketId}`);
  }
}
