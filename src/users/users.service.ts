/* eslint-disable prettier/prettier */
import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Prisma, User } from '@prisma/client';
import { Connection as MongoConnection } from 'mongoose';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ObjectId, UpdateResult } from 'mongodb';
import { App } from './entities/user.entity';
import { AddCustomAppDto } from './dto/add-custom-app.dto';
import { Tag } from './entities/tag.entity';

@Injectable()
export class UsersService {
	async deleteTag(id: string, tagName: string): Promise<UpdateResult> {
		return await this.connection.collection('users').updateOne(
			{ _id: new ObjectId(id) },
			{
				$unset: {
					[`tags.${tagName}`]: '',
				},
			},
		);
	}
	async createTag(id: string, tag: Tag): Promise<UpdateResult> {
		return await this.connection.collection('users').updateOne(
			{ _id: new ObjectId(id) },
			{
				$set: {
					[`tags.${tag.name}`]: tag,
				},
			},
		);
	}
	async updateTag(
		id: string,
		tagName: string,
		tag: Tag,
	): Promise<UpdateResult> {
		let update: any = {
			$set: {
				[`tags.${tag.name}`]: tag,
			},
		};
		if (tagName != tag.name)
			update = {
				...update,
				$unset: {
					[`tags.${tagName}`]: '',
				},
			};
		return await this.connection.collection('users').updateOne(
			{ _id: new ObjectId(id) },
			{
				...update,
			},
		);
	}
	markConnectionAsSeen(connection: string) {
		return this.prisma.connection.update({
			where: { id: connection },
			data: {
				seenAt: new Date(),
				seen: true,
			},
		});
	}
	acceptConnectionRequest(connection: string) {
		return this.prisma.connection.update({
			where: { id: connection },
			data: {
				seenAt: new Date(),
				seen: true,
				response: 'accepted',
				responseAt: new Date(),
			},
		});
	}
	rejectConnectionRequest(connection: string) {
		this.prisma.connection.update({
			where: { id: connection },
			data: {
				seenAt: new Date(),
				seen: true,
				response: 'rejected',
				responseAt: new Date(),
			},
		});
	}

	async disableApp(id: string, app: App): Promise<UpdateResult> {
		return await this.connection.collection('users').updateOne(
			{ _id: new ObjectId(id) },
			{
				$set: {
					[`apps.${app}.enabled`]: false,
				},
			},
		);
	}
	async enableApp(id: string, app: App): Promise<UpdateResult> {
		return await this.connection.collection('users').updateOne(
			{ _id: new ObjectId(id) },
			{
				$set: {
					[`apps.${app}.enabled`]: true,
				},
			},
		);
	}
	async addApp(
		id: string,
		app: App,
		value,
		enabled = true,
	): Promise<UpdateResult> {
		return await this.connection.collection('users').updateOne(
			{ _id: new ObjectId(id) },
			{
				$set: {
					[`apps.${app}`]: { enabled, value },
				},
			},
		);
	}

	async disableCustomApp(id: string, app: string): Promise<UpdateResult> {
		return await this.connection.collection('users').updateOne(
			{ _id: new ObjectId(id) },
			{
				$set: {
					[`customApps.${app}.enabled`]: false,
				},
			},
		);
	}
	async enableCustomApp(id: string, app: string): Promise<UpdateResult> {
		return await this.connection.collection('users').updateOne(
			{ _id: new ObjectId(id) },
			{
				$set: {
					[`customApps.${app}.enabled`]: true,
				},
			},
		);
	}
	async deleteCustomApp(id: string, app: string): Promise<UpdateResult> {
		return await this.connection.collection('users').updateOne(
			{ _id: new ObjectId(id) },
			{
				$unset: { [`customApps.${app}`]: '' },
			},
		);
	}
	async addCustomApp(
		id: string,
		{ value, name, icon }: AddCustomAppDto,
	): Promise<UpdateResult> {
		console.log({ id, value, name, icon });
		return await this.connection.collection('users').updateOne(
			{ _id: new ObjectId(id) },
			{
				$set: {
					[`customApps.${name}`]: {
						enabled: true,
						value,
						name,
						icon,
					},
				},
			},
		);
	}

	@Inject()
	private prisma: PrismaService;

	@InjectConnection() private connection: MongoConnection;

	create({
		firebaseUID,
		fullName,
		birthday,
		email,
		phone,
	}: CreateUserDto): Promise<User> {
		return this.prisma.user.create({
			data: {
				firebaseUID,
				fullName,
				birthday,
				primaryEmail: email,
				primaryPhone: phone,
			},
		});
	}

	async findAll(): Promise<User[]> {
		return this.prisma.user.findMany();
		// return (await this.connection
		// 	.collection('users')
		// 	.find({ _id: new ObjectId('6305898b48794f7979819a25') })
		// 	.toArray()) as any;
	}

	findOne(id: string, include?: Prisma.UserInclude): Promise<User> {
		return this.prisma.user.findUnique({
			where: { id },
			include,
		});
	}
	private includeAll = {
		attendedEvents: true,
		connectionsInitiated: { include: { receivedBy: true } },
		connectionsReceived: { include: { initiatedBy: true } },
		products: true,
	};

	findOneIncludeAll(id: string): Promise<User> {
		return this.prisma.user.findUnique({
			where: { id },
			include: this.includeAll,
		});
	}

	async findOneIncludeAllByFirebaseUID(id: string): Promise<User> {
		const t = await this.prisma.user.findUnique({
			where: { firebaseUID: id },
			include: this.includeAll,
		});
		// console.log(t);
		return t;
	}
	findOneByFirebaseUID(
		id: string,
		include?: Prisma.UserInclude,
	): Promise<User> {
		return this.prisma.user.findUnique({
			where: { firebaseUID: id },
			include,
		});
	}

	update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
		return this.prisma.user.update({
			where: { id },
			data: updateUserDto,
		});
	}

	// addApp(id: string, addAppDto: AddAppDto) {
	// 	return this.prisma.user.update({
	// 		where: { id },
	// 		data: {
	// 			apps:{
	// 				push
	// 			}
	// 		},
	// 	});
	// }

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
		let existingRequest: Connection | null = null;
		try {
			existingRequest = await this.prisma.connection.findFirstOrThrow({
				where: {
					OR: [
						{ initiatedByID, receivedByID },
						{
							initiatedByID: receivedByID,
							receivedByID: initiatedByID,
						},
					],
					NOT: {
						OR: [
							{ response: 'rejected' },
							{ response: 'accepted' },
						],
					},
				},
			});
		} catch (e) {}
		if (existingRequest) {
			if (existingRequest.initiatedByID == initiatedByID) {
				throw new HttpException(
					'Users Already Requested Connection before',
					HttpStatus.NOT_ACCEPTABLE,
				);
			} else {
				return this.prisma.connection.update({
					where: { id: existingRequest.id },
					data: {
						seenAt: new Date(),
						seen: true,
						response: 'accepted',
						responseAt: new Date(),
					},
				});
			}
		} else {
			return this.prisma.connection.create({
				data: {
					initiatedBy: { connect: { id: initiatedByID } },
					receivedBy: { connect: { id: receivedByID } },
				},
			});
		}
	}

	endConnection(connectionID: string) {
		return this.prisma.connection.delete({ where: { id: connectionID } });
	}

	attendEvent(id: string, eventID: string) {
		return this.prisma.user.update({
			where: { id },
			data: {
				attendedEvents: {
					connect: {
						id: eventID,
					},
				},
			},
		});
	}

	remove(id: string) {
		return this.prisma.user.delete({ where: { id } });
	}


	/* #region Product */

	async linkProduct(uid: string, productUuid: string): Promise<void> {
		await this.prisma.product.update({
			where: {
				uuid: productUuid,
			},
			data: {
				owner: { connect: { id: uid } },
				activated: true,
			},
		});
	}
	async unlinkProduct(uid: string, productUuid: string): Promise<void> {
		await this.prisma.product.update({
			where: {
				uuid: productUuid,
			},
			data: {
				owner: { disconnect: true },
				activated: false,
			},
		});
	}

	/* #endregion */

}
