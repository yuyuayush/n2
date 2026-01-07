import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { ProductsModule } from './products/products.module';
import { PaymentsModule } from './payments/payments.module'; // Assuming PaymentsModule is in './payments/payments.module'
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('MONGO_URI');
        if (!uri) {
          console.error('FATAL ERROR: MONGO_URI environment variable is not defined.');
          console.error('If running on Railway/Heroku, ensure you have added MONGO_URI to the Service Variables.');
          throw new Error('MONGO_URI is not defined');
        }
        console.log('Connecting to MongoDB with URI:', uri.replace(/:([^@]+)@/, ':****@'));
        return {
          uri: uri,
        };
      },
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    MailModule,
    ProductsModule,
    PaymentsModule,
    OrdersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
