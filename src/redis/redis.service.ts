// redis/redis.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit {
  private client: RedisClientType;

  async onModuleInit() {
    this.client = createClient();
    await this.client.connect();
  }

  async addSocket(userId: string, socketId: string) {
    await this.client.sAdd(`online_users:${userId}`, socketId);
    await this.client.set(`socket_user_map:${socketId}`, userId);
  }

  async removeSocket(socketId: string) {
    const userId = await this.client.get(`socket_user_map:${socketId}`);
    if (userId) {
      await this.client.sRem(`online_users:${userId}`, socketId);
      await this.client.del(`socket_user_map:${socketId}`);
      const remaining = await this.client.sCard(`online_users:${userId}`);
      if (remaining === 0) {
        await this.client.del(`online_users:${userId}`);
      }
      return userId;
    }
    return null;
  }

  async isOnline(userId: string): Promise<boolean> {
    return (await this.client.sCard(`online_users:${userId}`)) > 0;
  }

  async getSockets(userId: string): Promise<string[]> {
    return await this.client.sMembers(`online_users:${userId}`);
  }
}
