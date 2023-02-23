import { EventsModule } from './events/events.module';
import { ProductsModule } from './products/products.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { MainGateway } from './main.gateway';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
	imports: [
		EventsModule,
		ProductsModule,
		UsersModule,
		PrismaModule,
		AuthModule,
		MongooseModule.forRoot(process.env.DATABASE_URL),
	],
	controllers: [AppController],
	providers: [AppService, MainGateway],
	exports: [],
})
export class AppModule {}
