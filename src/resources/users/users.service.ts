/* eslint-disable prettier/prettier */
import {
	BadRequestException,
	HttpException,
	HttpStatus,
	Inject,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Prisma, User as PrismaUser } from '@prisma/client';
import axios from 'axios';
import { error } from 'console';
import * as crypto from 'crypto';
import { MulticastMessage } from 'firebase-admin/messaging';
import { ObjectId, UpdateResult } from 'mongodb';
import { Connection as MongoConnection } from 'mongoose';
import { PrismaService } from 'src/prisma/prisma.service';
import { FirebaseService } from '../../firebase/firebase.service';
import { Product } from '../products/entities/product.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { AddCustomAppDto } from './dto/custom-apps/add-custom-app.dto';
import { AddCustomAppsCategoryDto } from './dto/custom-apps/add-custom-apps-category.dto';
import { EditCustomAppDto } from './dto/custom-apps/edit-custom-app.dto copy';
import { EditCustomAppsCategoryDto } from './dto/custom-apps/edit-custom-apps-category.dto';
import { ReportUserDto } from './dto/report-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Tag } from './entities/tag.entity';
import { Link, LinkCategory, User } from './entities/user.entity';

const DEFAULT_CATEGORY_ID = 'default';
const DEFAULT_LABEL_ID = 'default';
@Injectable()
export class UsersService {
	@Inject()
	private prisma: PrismaService;
	@Inject()
	private firebase: FirebaseService;

	@InjectConnection()
	private connection: MongoConnection;

	reportUser({
		description,
		reportedUserId,
		reportingUserId,
		title,
		state,
	}: ReportUserDto) {
		return this.prisma.userFlagReport.create({
			data: {
				description,
				reportedUser: { connect: { id: reportedUserId } },
				reportingUser: { connect: { id: reportingUserId } },
				title,
				state,
			},
		});
	}
	//#region Basic CRUD
	async generateUsername(
		dto: Pick<CreateUserDto, 'fullName' | 'firebaseUID'>,
	): Promise<string> {
		const basename = dto.fullName
			.trim()
			.replace(/[^\w\d_\-\.]+/g, '-')
			.split(/\s/)
			.join('.')
			.toLowerCase();
		const nameMap = { [basename]: true };
		for (let i = 0; i < 25; i++) {
			const extLength = i < 10 ? 1 : Math.floor(i / 5);
			nameMap[
				`${basename}-${crypto
					.randomBytes(extLength * 3)
					.toString('base64url')
					.toLowerCase()}` // base64url with lower case might reduce the final count of the possible names
			] = true;
		}
		const nameArray = Object.keys(nameMap);
		const users = await this.prisma.user.findMany({
			where: {
				username: { in: nameArray },
			},
			select: { username: true },
		});
		for (const user of users) {
			delete nameMap[user.username];
		}

		const finalUsernames = Object.keys(nameMap);
		if (!finalUsernames.length) return dto.firebaseUID;
		return finalUsernames[0];
	}

	async create(dto: CreateUserDto): Promise<PrismaUser> {
		const { firebaseUID, fullName, birthday, email, phone } = dto;
		const username = await this.generateUsername(dto);

		return this.prisma.user.create({
			data: {
				firebaseUID,
				fullName,
				username,
				birthday,
				primaryEmail: email,
				primaryPhone: phone,
				linksCategories: {
					'my-links': {
						index: 0,
						labels: { [DEFAULT_LABEL_ID]: 'My Links' },
						enabled: true,
						links: [],
					},
					[DEFAULT_CATEGORY_ID]: {
						index: 1,
						labels: { [DEFAULT_LABEL_ID]: 'Links' },
						enabled: true,
						links: [],
					},
				},
				customApps: {
					[DEFAULT_CATEGORY_ID]: {
						labels: { [DEFAULT_LABEL_ID]: 'Links' },
						enabled: true,
						apps: {},
					},
				},
			},
		});
	}

	async findAll(): Promise<PrismaUser[]> {
		return this.prisma.user.findMany();
		// return (await this.connection
		// 	.collection('users')
		// 	.find({ _id: new ObjectId('6305898b48794f7979819a25') })
		// 	.toArray()) as any;
	}

	findOne(id: string, include?: Prisma.UserInclude): Promise<PrismaUser> {
		return this.prisma.user.findUnique({
			where: { id },
			include,
		});
	}
	findOneByUsername(
		username: string,
		include?: Prisma.UserInclude,
	): Promise<PrismaUser> {
		return this.prisma.user.findUnique({
			where: { username },
			include,
		});
	}
	checkUsernameString(username: string): boolean {
		if (typeof username != 'string' || !username) return false;
		return new RegExp(/^[\w\d-_.]+$/).test(username);
	}

	async isUserNameAvailable(username: string): Promise<boolean> {
		console.log(1, { username });
		if (!this.checkUsernameString(username)) return false;

		console.log(2, { username });

		const user = await this.prisma.user.findUnique({
			where: { username: username.toLowerCase() },
			select: { username: true },
		});
		console.log(3, { username, user });

		return !user;
	}

	// async temp(): Promise<number> {
	// 	const users = await this.prisma.user.findMany({
	// 		where: { username: { isSet: false } },
	// 		select: { id: true, fullName: true, firebaseUID: true },
	// 	});
	// 	console.log({ users });
	// 	let count = 0;
	// 	for (const user of users) {
	// 		const newUsername = await this.generateUsername(user);
	// 		await this.prisma.user.update({
	// 			where: { id: user.id },
	// 			data: { username: newUsername },
	// 		});
	// 		count++;
	// 	}
	// 	return count;
	// }
	private includeAll = {
		attendedEvents: true,
		connectionsInitiated: { include: { receivedBy: true } },
		connectionsReceived: { include: { initiatedBy: true } },
		products: true,
	};

	async getVCard(id: string) {
		try {
			const user: PrismaUser = await this.findOne(id);

			const formattedName = [
				// user.title != null && user.title,
				user.fullName,
			].join(' ');

			const emails = user?.emails
				?.filter((element) => element.enabled)
				.map((value, key) => `EMAIL;PREF=${key + 2}:${value.value}`);

			if (user?.primaryEmailEnabled && user?.primaryEmail) {
				emails.unshift(`EMAIL;PREF=1;TYPE=main:${user!.primaryEmail!}`);
			}

			const phones = user?.phones
				?.filter((element) => element.enabled)
				.map(
					(value, key) =>
						`TEL;TYPE=voice;PREF=${key + 2}:${value.value}`,
				);

			if (user?.primaryPhoneEnabled && user?.primaryPhone) {
				phones.unshift(`TEL;TYPE=voice;PREF=1:${user!.primaryPhone!}`);
			}

			const apps = Object.entries(user.apps ?? {})
				.filter(([key, value]) => key != 'WHATSAPP' && value.enabled)
				.map(([key, value]) => `URL;TYPE=${key}:${value.value}`);

			const customApps = Object.entries(user.customApps ?? {})
				.filter(([_, group]) => group.enabled)
				.flatMap(([_, value]) =>
					Object.entries(value.apps).map(
						([_, value]: any) =>
							`URL;TYPE=${value.labels.default}:${value.value}`,
					),
				);
			const names = (user!.fullName ?? '').split(' ');

			const familyNames = [
				names.length > 1 && names[names.length - 1],
			].join(',');
			const givenNames = [
				names.length !== 0 ? names[0] : user.fullName ?? '',
			].join(',');
			const additionalNames = [
				...(names.length > 2 ? names.splice(1, names.length) : []),
			].join(',');
			const honorificPrefixes = [
				/*user.title ?? ''*/
			].join(',');
			const honorificSuffixes = [].join(',');

			const profileImg = `https://firebasestorage.googleapis.com/v0/b/${encodeURIComponent(
				'knot-k6789.appspot.com',
			)}/o/${encodeURIComponent(
				`users/${user.id}/profile_1280x720`,
			)}?alt=media&token=${encodeURIComponent(
				'E)H@McQfTjWnZr4t7w!z%C*F-JaNdRgUkXp2s5v8x/A?D(G+KbPeShVmYq3t6w9z',
			)}`;

			let image = null;
			try {
				const res = await axios.get(profileImg, {
					responseType: 'arraybuffer',
				});
				const dataImage = res.data.toString('base64');
				image = `PHOTO;TYPE=WEBP;ENCODING=b:${dataImage}`;
			} catch (e) {
				console.log(error);
				image = `PHOTO;TYPE=WEBP;VALUE=URI:${profileImg}`;
			}

			const lines = [
				'BEGIN:VCARD',
				'VERSION:3.0',
				image,
				`FN:${formattedName}`, //FORMATTED NAME
				`N:${familyNames};${givenNames};${additionalNames};${honorificPrefixes};${honorificSuffixes}`,

				...emails,

				...phones,
				...apps,
				...customApps,
				`NOTE:${user.bio}`,
				'END:VCARD',
			];
			return {
				vcard: lines.join('\n'),
				user,
				filename: `${user.fullName ?? ''}_knot.vcf`,
			};
		} catch (e) {
			console.log(e);
			throw new InternalServerErrorException(e);
		}
	}

	findOneIncludeAll(id: string): Promise<PrismaUser> {
		return this.prisma.user.findUnique({
			where: { id },
			include: this.includeAll,
		});
	}

	async findOneIncludeAllByFirebaseUID(id: string): Promise<PrismaUser> {
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
	): Promise<PrismaUser> {
		return this.prisma.user.findUnique({
			where: { firebaseUID: id },
			include,
		});
	}

	update(id: string, updateUserDto: UpdateUserDto): Promise<PrismaUser> {
		return this.prisma.user.update({
			where: { id },
			data: updateUserDto,
		});
	}

	remove(id: string) {
		return this.prisma.user.delete({ where: { id } });
	}
	//#endregion

	//#region Events
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
	//#endregion

	//#region Apps

	async addApp(
		uid: string,
		appId: string,
		value,
		enabled = true,
		labels?,
	): Promise<UpdateResult> {
		return await this.connection.collection('users').updateOne(
			{ _id: new ObjectId(uid) },
			{
				$set: {
					[`apps.${appId}`]: { enabled, value },
					[`links.${appId}`]: {
						enabled,
						value,
						labels: labels ?? { default: appId },
						type: appId,
					},
				},

				$push: { [`linksCategories.my-links.links`]: appId },
			},
		);
	}
	async deleteApp(id: string, appId: string): Promise<UpdateResult> {
		return await this.connection.collection('users').updateOne(
			{ _id: new ObjectId(id) },
			{
				$unset: {
					[`apps.${appId}`]: '',
					[`links.${appId}`]: '',
				},
				$pull: { [`linksCategories.my-links.links`]: appId },
			},
		);
	}

	async disableApp(uid: string, appId: string): Promise<UpdateResult> {
		return await this.connection.collection('users').updateOne(
			{ _id: new ObjectId(uid) },
			{
				$set: {
					[`apps.${appId}.enabled`]: false,
					[`links.${appId}.enabled`]: false,
				},
			},
		);
	}
	async enableApp(uid: string, appId: string): Promise<UpdateResult> {
		return await this.connection.collection('users').updateOne(
			{ _id: new ObjectId(uid) },
			{
				$set: {
					[`apps.${appId}.enabled`]: true,
					[`links.${appId}.enabled`]: true,
				},
			},
		);
	}

	//#region CustomApps

	async addCustomAppsCategory(
		id: string,
		{ categoryId, labels, index }: AddCustomAppsCategoryDto,
	): Promise<UpdateResult> {
		return await this.connection.collection('users').updateOne(
			{ _id: new ObjectId(id) },
			{
				$set: {
					[`customApps.${categoryId}`]: {
						enabled: true,
						labels,
						apps: {},
					},
					[`linkCategories.${categoryId}`]: {
						index,
						enabled: true,
						labels,
						links: [],
					},
				},
			},
		);
	}

	async editCustomAppsCategory(
		id: string,
		{ categoryId, ...data }: EditCustomAppsCategoryDto,
	): Promise<UpdateResult> {
		const $set: any = {};
		for (const [key, value] of Object.entries(data)) {
			if (value === null || value === undefined) continue;

			$set[`customApps.${categoryId}.${key}`] = value;
			$set[`linksCategories.${categoryId}.${key}`] = value;
		}
		// console.log({ data, $set });
		if (Object.keys($set).length === 0) {
			throw new BadRequestException(
				null,
				'No Correct Data is received to be edited',
			);
		}
		return await this.connection.collection('users').updateOne(
			{ _id: new ObjectId(id) },
			{
				$set,
			},
		);
	}

	async deleteCustomAppsCategory(
		id: string,
		categoryId = DEFAULT_CATEGORY_ID,
	): Promise<UpdateResult> {
		return await this.connection.collection('users').updateOne(
			{ _id: new ObjectId(id) },
			{
				$unset: {
					[`customApps.${categoryId}`]: '',
					[`linkCategories.${categoryId}`]: '',
				},
			},
		);
	}

	async addCustomApp(
		id: string,
		{
			value,
			appId,
			labels,
			icon,
			enabled, // = true, //didn't work depending on the env
			categoryId = DEFAULT_CATEGORY_ID,
		}: AddCustomAppDto,
	): Promise<UpdateResult> {
		// console.log({ id, value, name: appId, icon });
		return await this.connection.collection('users').updateOne(
			{ _id: new ObjectId(id) },
			{
				$set: {
					[`customApps.${categoryId}.apps.${appId}`]: {
						enabled: enabled === false ? false : true,
						value,
						labels,
						icon,
					},
					[`links.${appId}`]: {
						enabled: enabled === false ? false : true,
						value,
						labels,
						icon,
						type: 'CUSTOM',
					},
				},
				$push: { [`linksCategories.${categoryId}.links`]: appId },
			},
		);
	}

	async editCustomApp(
		id: string,
		{ appId, categoryId = DEFAULT_CATEGORY_ID, ...data }: EditCustomAppDto,
	): Promise<UpdateResult> {
		const $set: any = {};
		for (const [key, value] of Object.entries(data)) {
			if (value === null || value === undefined) continue;

			$set[`customApps.${categoryId}.apps.${appId}.${key}`] = value;
			$set[`links.${appId}.${key}`] = value;
		}
		if (Object.keys($set).length === 0) {
			throw new BadRequestException(
				null,
				'No Correct Data is received to be edited',
			);
		}
		return await this.connection.collection('users').updateOne(
			{ _id: new ObjectId(id) },
			{
				$set,
			},
		);
	}

	async disableCustomApp(
		id: string,
		app: string,
		categoryId = DEFAULT_CATEGORY_ID,
	): Promise<UpdateResult> {
		return await this.connection.collection('users').updateOne(
			{ _id: new ObjectId(id) },
			{
				$set: {
					[`customApps.${categoryId}.apps.${app}.enabled`]: false,
					[`links.${app}.enabled`]: false,
				},
			},
		);
	}
	async enableCustomApp(
		id: string,
		appId: string,
		categoryId = DEFAULT_CATEGORY_ID,
	): Promise<UpdateResult> {
		return await this.connection.collection('users').updateOne(
			{ _id: new ObjectId(id) },
			{
				$set: {
					[`customApps.${categoryId}.apps.${appId}.enabled`]: true,
					[`links.${appId}.enabled`]: true,
				},
			},
		);
	}
	async deleteCustomApp(
		id: string,
		appId: string,
		categoryId = DEFAULT_CATEGORY_ID,
	): Promise<UpdateResult> {
		return await this.connection.collection('users').updateOne(
			{ _id: new ObjectId(id) },
			{
				$unset: {
					[`customApps.${categoryId}.apps.${appId}`]: '',
					[`links.${appId}`]: '',
				},
				$pull: { [`linksCategories.${categoryId}.links`]: appId },
			},
		);
	}
	//#endregion

	//#endregion

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

		await this.notifyUser(output.initiatedBy, {
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
			await this.notifyUser(output.receivedBy, {
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
			await this.notifyUser(endingReceivedBy, {
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
	//#region Product

	async linkProduct(uid: string, productUuid: string): Promise<Product> {
		const product = await this.prisma.product.findFirst({
			where: {
				OR: [
					{
						qrUuid: productUuid,
					},
					{
						uuid: productUuid,
					},
				],
			},
		});
		if (!product) {
			throw new HttpException('unknown-product', HttpStatus.NOT_FOUND);
		}
		if (product.ownerID == uid) {
			throw new HttpException(
				'product-already-registered',
				HttpStatus.NOT_ACCEPTABLE,
			);
		}
		if (product.ownerID) {
			throw new HttpException(
				'product-already-registered-to-another-user',
				HttpStatus.NOT_ACCEPTABLE,
			);
		}
		return await this.prisma.product.update({
			where: {
				id: product.id,
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

	//#endregion

	//#region Tag
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
	//#endregion

	//#region Notification
	addFcmToken(uid: string, token: string): Promise<PrismaUser> {
		return this.prisma.user.update({
			where: { id: uid },
			data: {
				fcmTokens: {
					push: token,
				},
			},
		});
	}
	updateFcmTokens(uid: string, tokens: string[]): Promise<PrismaUser> {
		return this.prisma.user.update({
			where: { id: uid },
			data: {
				fcmTokens: tokens,
			},
		});
	}
	async notifyUser(
		user: PrismaUser,
		message: Omit<MulticastMessage, 'tokens'>,
	) {
		if (user.fcmTokens?.length > 0) {
			const tokens = Array.from(new Set(user.fcmTokens));
			try {
				const res = await this.firebase.defaultApp
					.messaging()
					.sendMulticast({
						tokens,
						...message,
					});

				if (res.failureCount) {
					const newTokens = [];
					res.responses.forEach((r, index) => {
						if (
							[
								'messaging/invalid-registration-token',
								'messaging/registration-token-not-registered',
							].includes(r.error?.code)
						) {
							return;
						}

						newTokens.push(tokens[index]);
					});
				}
			} catch (e) {}
		}
	}

	async testNotifyUser(uid: string) {
		if (process.env.NODE_ENV == 'production') {
			throw new BadRequestException();
		}
		const user = await this.prisma.user.findUnique({
			where: { id: uid },
		});
		console.log({ fcmTokens: user.fcmTokens });
		if (user.fcmTokens?.length > 0) {
			const tokens = Array.from(new Set(user.fcmTokens));
			try {
				const res = await this.firebase.messaging.sendMulticast({
					tokens,
					data: {
						notificationType: 'ACTION',
						actionType: 'ACCEPT_CONNECTION',
						body: `accepted your connection request`,
						title: 'Connection Request Accepted',
						click_action: 'FLUTTER_NOTIFICATION_CLICK',
					},
					// notification: {
					// 	// body: `accepted your connection request`,
					// 	// title: 'Connection Request Accepted',
					// },
				});

				if (res.failureCount) {
					console.log({ failureCount: res.failureCount });
					const newTokens = [];
					// res.results.forEach((r, index) => {
					// 	if (
					// 		[
					// 			'messaging/invalid-registration-token',
					// 			'messaging/registration-token-not-registered',
					// 		].includes(r.error?.code)
					// 	) {
					// 		return;
					// 	}

					// 	newTokens.push(tokens[index]);
					// });
				}
			} catch (e) {}
		}
	}

	//#endregion

	//#region Migrations

	async migrateAllUsersToV2() {
		const users = await this.prisma.user.findMany({
			where: {
				OR: [
					{ documentVersion: 'v1' },
					{ documentVersion: { isSet: false } },
				],
			},
		});
		let count = 0;
		const errors = [0];
		for (const user of users) {
			try {
				await this.migrateUserToV2(user);
				count++;
			} catch (e) {
				errors.push(e);
			}
		}
		return { count, errors };
	}

	async migrateUserToV2ById(id: string) {
		const user = await this.prisma.user.findUnique({ where: { id } });
		if (user.documentVersion == 'v2') return;
		return this.migrateUserToV2(user);
	}
	async migrateUserToV2(user: PrismaUser) {
		if (user.documentVersion == 'v2') return;
		const userV2 = await this.convertV1UserToV2(user);
		console.log({ userV2 });
		return this.prisma.user.update({
			where: { id: user.id },
			data: {
				links: userV2.links,
				linksCategories: userV2.linksCategories,
				documentVersion: 'v2',
			},
		});
	}

	async convertV1UserToV2(user: PrismaUser): Promise<User> {
		const links: Record<string, Link> = {};
		const linksCategories: Record<string, LinkCategory> = {
			'my-links': {
				enabled: true,
				labels: { default: 'My Links', ar: 'روابطي' },
				index: 0,
				links: [],
			},
		};

		Object.entries(user.apps ?? {}).forEach(([key, value]) => {
			const app = new Link();
			app.value = value.value;
			app.enabled = value.enabled;
			app.type = key;
			app.labels = { default: key };
			links[key] = app;
			linksCategories[`my-links`].links.push(key);
		});

		Object.entries(user.customApps).forEach(
			([categoryKey, category], i) => {
				const newCategory = new LinkCategory();
				newCategory.enabled = category.enabled;
				newCategory.labels = category.labels;
				newCategory.index = i + 1;
				newCategory.links = [];
				Object.entries(category.apps ?? {}).forEach(
					([key, value]: any) => {
						const app = new Link();
						app.value = value.value;
						app.enabled = value.enabled;
						app.type = 'CUSTOM';
						app.labels = value.labels;
						app.icon = value.icon;
						links[key] = app;
						newCategory.links.push(key);
					},
				);
				linksCategories[categoryKey] = newCategory;
			},
		);

		return { ...user, links, linksCategories, documentVersion: 'v2' };
	}
	//TODO update Vcard
	//#endregion
}
