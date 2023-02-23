/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, User as PrismaUser } from '@prisma/client';
import { Connection as MongoConnection } from 'mongoose';
import { PrismaService } from 'src/prisma/prisma.service';
import { FirebaseService } from '../../../../firebase/firebase.service';
import { UsersService } from '../../users.service';

const DEFAULT_CATEGORY_ID = 'default';
const DEFAULT_LABEL_ID = 'default';
@Injectable()
export class UserConnectionsService {
	@Inject()
	private prisma: PrismaService;
	@Inject()
	private userService: UsersService;
	@Inject()
	private firebase: FirebaseService;

	@InjectConnection()
	private connection: MongoConnection;

	//#region Connections

	markConnectionAsSeen(connection: string) {
		return this.prisma.connection.update({
			where: { id: connection },
			data: {
				seenAt: new Date(),
				seen: true,
			},
		});
	}
	async acceptConnectionRequest(connection: string) {
		// console.log({ connection, accept: true });

		const output = await this.prisma.connection.update({
			where: { id: connection },
			data: {
				seenAt: new Date(),
				seen: true,
				response: 'accepted',
				responseAt: new Date(),
			},
			include: {
				receivedBy: true,
				initiatedBy: true,
			},
		});

		await this.userService.notifyUser(output.initiatedBy, {
			data: {
				notificationType: 'ACTION',
				actionType: 'ACCEPT_CONNECTION',
				body: `${output.receivedBy.fullName} accepted your connection request`,
				title: 'Connection Request Accepted',
				click_action: 'FLUTTER_NOTIFICATION_CLICK',
			},
		});
		return output;
	}
	rejectConnectionRequest(connection: string) {
		console.log({ connection, reject: true });
		return this.prisma.connection.update({
			where: { id: connection },
			data: {
				seenAt: new Date(),
				seen: true,
				response: 'rejected',
				responseAt: new Date(),
			},
		});
	}
	blockConnection(userId: string, connection: string) {
		return this.prisma.connection.update({
			where: { id: connection },
			data: {
				blocker: { connect: { id: userId } },
			},
		});
	}
	unblockConnection(connection: string) {
		return this.prisma.connection.update({
			where: { id: connection },
			data: {
				blocker: { disconnect: true },
			},
		});
	}
	async initiateConnectionWith(
		initiatedByID: string,
		receivedByID: string,
	): Promise<Connection> {
		if (initiatedByID == receivedByID) {
			throw new HttpException(
				"Users Can't connect to themselves",
				HttpStatus.NOT_ACCEPTABLE,
			);
		}
		let existingRequests: Connection[] | null = null;
		try {
			existingRequests = await this.prisma.connection.findMany({
				where: {
					OR: [
						{ initiatedByID, receivedByID },
						{
							initiatedByID: receivedByID,
							receivedByID: initiatedByID,
						},
					],
				},
			});
		} catch (e) {}
		const blockedConnection = existingRequests.find((c) => c.blockerID);
		if (blockedConnection) {
			if (blockedConnection.blockerID == initiatedByID) {
				throw new HttpException(
					'You have blocked this user',
					HttpStatus.NOT_ACCEPTABLE,
				);
			} else {
				throw new HttpException(
					'Request is not Allowed',
					HttpStatus.NOT_ACCEPTABLE,
				);
			}
		}

		const existingConnection = existingRequests.some(
			(c) => c.response === 'accepted',
		);
		if (existingConnection) {
			throw new HttpException(
				'Users are already connected',
				HttpStatus.NOT_ACCEPTABLE,
			);
		}

		const pendingRequest = existingRequests.find(
			(c) => c.response === 'pending',
		);
		if (pendingRequest) {
			if (pendingRequest.initiatedByID == initiatedByID) {
				throw new HttpException(
					'Users Already Requested Connection before',
					HttpStatus.NOT_ACCEPTABLE,
				);
			} else {
				return this.prisma.connection.update({
					where: { id: pendingRequest.id },
					data: {
						seenAt: new Date(),
						seen: true,
						response: 'accepted',
						responseAt: new Date(),
					},
				});
			}
		} else {
			const output = await this.prisma.connection.create({
				data: {
					initiatedBy: { connect: { id: initiatedByID } },
					receivedBy: { connect: { id: receivedByID } },
				},
				include: {
					initiatedBy: true,
					receivedBy: true,
				},
			});
			await this.userService.notifyUser(output.receivedBy, {
				data: {
					notificationType: 'ACTION',
					actionType: 'NEW_CONNECTION',
					body: `${output.initiatedBy.fullName} sent you a connection request`,
					title: 'New Connection Request',
					click_action: 'FLUTTER_NOTIFICATION_CLICK',
				},
			});
			return output;
		}
	}

	async endConnection(
		uid: string,
		connectionID: string,
		shouldPushChange = true,
		shouldNotify = false,
	) {
		const connection = await this.prisma.connection.delete({
			where: { id: connectionID },
			include: { initiatedBy: true, receivedBy: true },
		});
		if (shouldPushChange) {
			let endingInitiatedBy: PrismaUser;
			let endingReceivedBy: PrismaUser;
			if (connection.initiatedByID === uid) {
				endingInitiatedBy = connection.initiatedBy;
				endingReceivedBy = connection.receivedBy;
			} else if (connection.receivedByID === uid) {
				endingInitiatedBy = connection.receivedBy;
				endingReceivedBy = connection.initiatedBy;
			}
			await this.userService.notifyUser(endingReceivedBy, {
				data: {
					notificationType: 'ACTION',
					actionType: 'NEW_CONNECTION',
					...(shouldNotify
						? {
								body: `${endingInitiatedBy.fullName} ended connection with you`,
								title: 'Ending Connection Request',
						  }
						: {}),
					click_action: 'FLUTTER_NOTIFICATION_CLICK',
				},
			});
		}
		return connection;
	}

	//#endregion
}
