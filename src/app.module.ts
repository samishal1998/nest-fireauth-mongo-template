import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { FirebaseModule } from './firebase/firebase.module';
import { PrismaModule } from './prisma/prisma.module';
import { EventsModule } from './resources/events/events.module';
import { ProductsModule } from './resources/products/products.module';
import { UsersModule } from './resources/users/users.module';

@Module({
	imports: [
		EventsModule,
		ProductsModule,
		UsersModule,
		PrismaModule,
		AuthModule,
		FirebaseModule,
		MongooseModule.forRoot(process.env.DATABASE_URL),
	],
	controllers: [AppController],
	providers: [AppService],
	exports: [],
})
export class AppModule {}
