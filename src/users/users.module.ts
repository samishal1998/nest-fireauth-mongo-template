import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersGateway } from './users.gateway';

@Module({
	controllers: [UsersController],
	providers: [UsersService, UsersGateway],
})
export class UsersModule {}
