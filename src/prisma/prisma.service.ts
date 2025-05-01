
import { Injectable, OnModuleInit,Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    async onModuleInit() {

        const logger = new Logger('DataBase');

        try{
            await this.$connect();
            logger.log("DataBase Connected Successfully!");

        }
        catch(error){
            logger.error("DataBase Connection Error!")

            throw error; 
        }
    }

    
}
