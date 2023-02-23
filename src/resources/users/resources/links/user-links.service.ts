/* eslint-disable prettier/prettier */
import {
	BadRequestException,
	Inject,
	Injectable
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { User as PrismaUser } from '@prisma/client';
import { ObjectId, UpdateResult } from 'mongodb';
import { Connection as MongoConnection } from 'mongoose';
import { PrismaService } from 'src/prisma/prisma.service';
import { FirebaseService } from '../../../../firebase/firebase.service';
import { AddCustomAppDto } from '../../dto/custom-apps/add-custom-app.dto';
import { AddCustomAppsCategoryDto } from '../../dto/custom-apps/add-custom-apps-category.dto';
import { EditCustomAppDto } from '../../dto/custom-apps/edit-custom-app.dto copy';
import { EditCustomAppsCategoryDto } from '../../dto/custom-apps/edit-custom-apps-category.dto';
import { Link, LinkCategory, User } from '../../entities/user.entity';

const DEFAULT_CATEGORY_ID = 'default';
const DEFAULT_LABEL_ID = 'default';

@Injectable()
export class UserLinksService {
	@Inject()
	private prisma: PrismaService;
	@Inject()
	private firebase: FirebaseService;

	@InjectConnection()
	private connection: MongoConnection;

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

}
