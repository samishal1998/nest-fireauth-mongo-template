import { OnModuleDestroy, UseGuards } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import {
	ConnectedSocket,
	MessageBody,
	OnGatewayDisconnect,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	WsResponse,
} from '@nestjs/websockets';
import type { ChangeStream } from 'mongodb';
import { from, interval, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server, Socket } from 'socket.io';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { FirebaseAuthGuard } from 'src/auth/guards/firebase-auth.guard';
import { Connection } from 'mongoose';

@WebSocketGateway({
	cors: {
		origin: '*',
	},
	namespace: 'users',
})
export class UsersGateway implements OnGatewayDisconnect, OnGatewayInit {
	@WebSocketServer()
	server: Server;
	private changeStream: ChangeStream;
	@InjectConnection() private connection: Connection;

	async afterInit(server: Server) {
		this.changeStream = this.connection
			.collection('users')
			.watch([], { fullDocument: 'updateLookup' });

		this.changeStream?.addListener('change', (change: any) => {
			//of namespace not required
			// this.server.of('users').in(`users:change:${change.documentKey._id.toString()}`).emit('change',change)
			console.log('users:change', {
				change,
			});
			this.server
				.in(`users:change:${change.documentKey._id.toString()}`)
				.emit(
					`users:change:${change.documentKey._id.toString()}`,
					change,
				);
		});
	}
	handleDisconnect(client: any) {}

	onModuleDestroy() {
		// console.log(':::::::::On Module Destroy::::::::::::::');
		if (this.changeStream) {
			this.changeStream.close();
			this.changeStream = undefined;
		}
	}
	// @Auth()
	@SubscribeMessage('user:change')
	async findAll(
		@ConnectedSocket() client: Socket,
		@MessageBody() data: any,
	): Promise<WsResponse<any>> {
		try {
			await client.join(`users:change:${data}`);
			return {
				event: `join:room(users:change:${data})`,
				data: {
					success: true,
					message: `joined room users:change:${data}`,
				},
			};
		} catch (error) {
			return {
				event: `join:room(users:change:${data})`,
				data: {
					success: false,
					message: `failed to join room users:change:${data}`,
				},
			};
		}
	}

	@SubscribeMessage('identity')
	async identity(@MessageBody() data: number): Promise<number> {
		return data;
	}
}
