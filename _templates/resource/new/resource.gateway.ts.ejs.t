---
to: "<%= Boolean(websocket) ? `src/${name}/${name}.gateway.ts` : null %>"
---
<% Name = h.capitalize(name) %>
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
	namespace: '<%=name%>s',
})
export class <%=Name%>Gateway implements OnGatewayDisconnect, OnGatewayInit {
	@WebSocketServer()
	server: Server;
	private changeStream: ChangeStream;
	@InjectConnection() private connection: Connection;

	async afterInit(server: Server) {
		this.changeStream = this.connection
			.collection('<%=name%>s')
			.watch([], { fullDocument: 'updateLookup' });

		this.changeStream?.addListener('change', (change: any) => {
			//of namespace not required
			// this.server.of('<%=name%>s').in(`<%=name%>s:change:${change.documentKey._id.toString()}`).emit('change',change)
			console.log('<%=name%>s:change', {
				change,
			});
			this.server
				.in(`<%=name%>s:change:${change.documentKey._id.toString()}`)
				.emit(
					`<%=name%>s:change:${change.documentKey._id.toString()}`,
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
	@SubscribeMessage('<%=name%>:change')
	async findAll(
		@ConnectedSocket() client: Socket,
		@MessageBody() data: any,
	): Promise<WsResponse<any>> {
		try {
			await client.join(`<%=name%>s:change:${data}`);
			return {
				event: `join:room(<%=name%>s:change:${data})`,
				data: {
					success: true,
					message: `joined room <%=name%>s:change:${data}`,
				},
			};
		} catch (error) {
			return {
				event: `join:room(<%=name%>s:change:${data})`,
				data: {
					success: false,
					message: `failed to join room <%=name%>s:change:${data}`,
				},
			};
		}
	}

	@SubscribeMessage('identity')
	async identity(@MessageBody() data: number): Promise<number> {
		return data;
	}
}
