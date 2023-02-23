import {
	Body,
	Controller,
	Delete,
	ForbiddenException,
	Get,
	Headers,
	Param,
	Patch,
	Post,
	Put,
	Query,
	Req,
	Res,
	StreamableFile,
	Version,
} from '@nestjs/common';
import {
	ApiBody,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { Connection } from '@prisma/client';
import { Request } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

import type { Response } from 'express';
import { UpdateResult } from 'mongodb';
import { Product } from '../products/entities/product.entity';
import { AddAppDto } from './dto/add-app.dto';
import { AddCustomAppDto } from './dto/custom-apps/add-custom-app.dto';
import { AddCustomAppsCategoryDto } from './dto/custom-apps/add-custom-apps-category.dto';
import { EditCustomAppDto } from './dto/custom-apps/edit-custom-app.dto copy';
import { EditCustomAppsCategoryDto } from './dto/custom-apps/edit-custom-apps-category.dto';
import { LinkProductDto } from './dto/link-product.dto';
import { ReportUserDto } from './dto/report-user.dto';
import { CreateTagDto } from './dto/tags/create-tag.dto';
import { UpdateTagDto } from './dto/tags/update-tag.dto';
import { AppEnum, User } from './entities/user.entity';

@ApiTags('users')
@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	//#region  Basic CRUD
	@Post()
	@ApiResponse({ type: User })
	create(@Body() createUserDto: CreateUserDto): Promise<User> {
		return this.usersService.create(createUserDto) as any;
	}

	@Get()
	@ApiResponse({ type: User, isArray: true })
	findAll(@Req() request: Request & { user: any }): Promise<User[]> {
		// console.log({ user: request.user });
		return this.usersService.findAll() as any;
	}

	@Get('test')
	test(@Req() request: Request): Promise<string> {
		// console.log({ user: request.user });
		return this.usersService.generateUsername({
			fullName: 'Sami Sameer',
			firebaseUID: '123',
		});
	}

	@Get(':id')
	@ApiResponse({ type: User })
	findOne(@Param('id') id: string): Promise<User> {
		return this.usersService.findOne(id) as any;
	}

	@Post('username-available')
	@ApiResponse({
		schema: {
			title: 'IsUsernameAvailableResponse',
			type: 'object',
			properties: { available: { type: 'boolean' } },
			required: ['available'],
		},
	})
	@ApiBody({
		schema: {
			title: 'IsUsernameAvailableDto',
			type: 'object',
			properties: { username: { type: 'string' } },
			required: ['username'],
		},
	})
	async isUsernameAvailable(
		@Body('username') username: string,
	): Promise<{ available: boolean }> {
		return {
			available: await this.usersService.isUserNameAvailable(username),
		};
	}

	@Get(':id/vcard')
	@ApiResponse({
		content: {
			'text/x-vcard': {
				schema: { type: 'string', format: 'binary' },
			},
		},
	})
	async getVCard(
		@Param('id') id: string,
		@Query('device') device: string | null | undefined,
		@Headers() headers,
		@Res({ passthrough: true }) res: Response,
	): Promise<StreamableFile> {
		const { vcard, filename, user } = await this.usersService.getVCard(id);

		const file = new TextEncoder().encode(vcard);
		res.set({
			'Content-Type': 'text/x-vcard',
			'Content-Disposition': `attachment; filename="${filename}"`,
		});
		return new StreamableFile(file);
	}

	@Get('/fireUID/:id')
	@ApiResponse({ type: User })
	findOneByFirebaseUid(@Param('id') id: string): Promise<User> {
		return this.usersService.findOneIncludeAllByFirebaseUID(id) as any;
	}

	@Get('/username/:username')
	@ApiResponse({ type: User })
	async findOneByUsername(
		@Param('username') username: string,
	): Promise<User> {
		return this.usersService.findOneByUsername(username) as any;
	}

	@Version('2')
	@Get('/fireUID/:id')
	@ApiResponse({ type: User })
	findOneByFirebaseUidV2(@Param('id') id: string): Promise<User> {
		return this.usersService.findOneIncludeAllByFirebaseUID(id) as any;
	}

	@Get('/fireUID/:id/include-all')
	@ApiResponse({ type: User })
	async findOneIncludeAllByFirebaseUid(
		@Param('id') id: string,
	): Promise<User> {
		const t = (await this.usersService.findOneIncludeAllByFirebaseUID(
			id,
		)) as any;
		console.log(t);
		return t;
	}
	@Version('2')
	@Get('/fireUID/:id/include-all')
	@ApiResponse({ type: User })
	async findOneIncludeAllByFirebaseUidV2(
		@Param('id') id: string,
	): Promise<User> {
		const t = (await this.usersService.findOneIncludeAllByFirebaseUID(
			id,
		)) as any;
		console.log(t);
		return t;
	}

	@Patch(':id')
	@ApiResponse({ type: User })
	update(
		@Param('id') id: string,
		@Body() updateUserDto: UpdateUserDto,
	): Promise<User> {
		try {
			console.log({ id, updateUserDto });
			return this.usersService.update(id, updateUserDto) as any;
		} catch (e) {
			console.error(e);
			throw e;
		}
	}

	//#endregion

	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				token: {
					type: 'string',
				},
			},
			required: ['token'],
		},
	})
	@Patch(':id/fcm-token')
	addFcmToken(@Param('id') id: string, @Body('token') token: string) {
		return this.usersService.addFcmToken(id, token);
	}
	//#region CustomApps
	@Post(':id/apps/custom/app')
	async addCustomApp(
		@Param('id') id: string,
		@Body() addCustomAppDto: AddCustomAppDto,
	) {
		console.log({ addCustomAppDto });
		return this.usersService.addCustomApp(id, addCustomAppDto);
	}

	@Put(':id/apps/custom/app')
	async editCustomApp(
		@Param('id') id: string,
		@Body() editCustomAppDto: EditCustomAppDto,
	) {
		return this.usersService.editCustomApp(id, editCustomAppDto);
	}

	@ApiOperation({ deprecated: true })
	@Patch(':id/apps/custom/:categoryId/app/:appId/enable')
	async enableCustomAppV1(
		@Param('id') id: string,
		@Param('appId') appId: string,
		@Param('categoryId') categoryId: string,
	): Promise<UpdateResult> {
		return this.usersService.enableCustomApp(id, appId, categoryId);
	}

	@ApiOperation({ deprecated: true })
	@Patch(':id/apps/custom/:categoryId/app/:appId/disable')
	async disableCustomAppV1(
		@Param('id') id: string,
		@Param('appId') appId: string,
		@Param('categoryId') categoryId: string,
	) {
		return this.usersService.disableCustomApp(id, appId, categoryId);
	}

	@ApiOperation({ deprecated: true })
	@Delete(':id/apps/custom/:categoryId/app/:appId')
	async deleteCustomAppV1(
		@Param('id') id: string,
		@Param('appId') appId: string,
		@Param('categoryId') categoryId: string,
	) {
		return this.usersService.deleteCustomApp(id, appId, categoryId);
	}

	@Version('v2')
	@Patch(':id/apps/custom/:appId/enable')
	async enableCustomApp(
		@Param('id') id: string,
		@Param('appId') appId: string,
	): Promise<UpdateResult> {
		return this.usersService.enableCustomApp(id, appId);
	}

	@Version('v2')
	@Patch(':id/apps/custom/:appId/disable')
	async disableCustomApp(
		@Param('id') id: string,
		@Param('appId') appId: string,
	) {
		return this.usersService.disableCustomApp(id, appId);
	}

	@Version('v2')
	@Delete(':id/apps/custom/:categoryId/app/:appId')
	async deleteCustomApp(
		@Param('id') id: string,
		@Param('appId') appId: string,
		@Param('categoryId') categoryId: string,
	) {
		return this.usersService.deleteCustomApp(id, appId, categoryId);
	}
	//#endregion

	//#region CustomAppsCategory

	@Post(':id/apps/custom')
	async addCustomAppCategory(
		@Param('id') id: string,
		@Body() addCustomAppsCategoryDto: AddCustomAppsCategoryDto,
	) {
		return this.usersService.addCustomAppsCategory(
			id,
			addCustomAppsCategoryDto,
		);
	}

	@Put(':id/apps/custom')
	async editCustomAppCategory(
		@Param('id') id: string,
		@Body() editCustomAppsCategoryDto: EditCustomAppsCategoryDto,
	) {
		return this.usersService.editCustomAppsCategory(
			id,
			editCustomAppsCategoryDto,
		);
	}

	@Patch(':id/apps/custom/:categoryId/disable')
	async disableCustomAppCategory(
		@Param('id') id: string,
		@Param('categoryId') categoryId: string,
	) {
		return this.usersService.editCustomAppsCategory(id, {
			categoryId,
			enabled: false,
		});
	}
	@Patch(':id/apps/custom/:categoryId/enable')
	async enableCustomAppCategory(
		@Param('id') id: string,
		@Param('categoryId') categoryId: string,
	) {
		return this.usersService.editCustomAppsCategory(id, {
			categoryId,
			enabled: true,
		});
	}

	@Delete(':id/apps/custom/:categoryId')
	async deleteCustomAppCategory(
		@Param('id') id: string,
		@Param('categoryId') categoryId: string,
	) {
		return this.usersService.deleteCustomAppsCategory(id, categoryId);
	}

	//#endregion

	//#region Apps
	@ApiOperation({ deprecated: true })
	@Patch(':id/apps/:app/add') //TODO remove
	@ApiParam({ name: 'app', enum: AppEnum })
	async addAppOld(
		@Param('id') id: string,
		@Param('app') app: AppEnum,
		@Body() addAppDto: AddAppDto,
	) {
		return this.usersService.addApp(
			id,
			app.toString(),
			addAppDto.value,
			addAppDto.enabled,
		);
	}

	@ApiOperation({ deprecated: true })
	@Post(':id/apps/:app')
	@ApiParam({ name: 'app', enum: AppEnum })
	async addAppV1(
		@Param('id') id: string,
		@Param('app') app: AppEnum,
		@Body() addAppDto: AddAppDto,
	) {
		return this.usersService.addApp(
			id,
			app.toString(),
			addAppDto.value,
			addAppDto.enabled,
		);
	}
	@Version('2')
	@Post(':id/apps/:app')
	async addApp(
		@Param('id') id: string,
		@Param('app') appId: string,
		@Body() addAppDto: AddAppDto,
	) {
		return this.usersService.addApp(
			id,
			appId,
			addAppDto.value,
			addAppDto.enabled,
			addAppDto.labels,
		);
	}

	@ApiOperation({ deprecated: true })
	@Delete(':id/apps/:app')
	@ApiParam({ name: 'app', enum: AppEnum })
	async deleteAppV1(@Param('id') id: string, @Param('app') app: AppEnum) {
		return this.usersService.deleteApp(id, app.toString());
	}
	@Version('2')
	@Delete(':id/apps/:app')
	async deleteApp(@Param('id') id: string, @Param('app') appId: string) {
		return this.usersService.deleteApp(id, appId);
	}

	@ApiOperation({ deprecated: true })
	@Patch(':id/apps/:app/enable')
	@ApiParam({ name: 'app', enum: AppEnum })
	async enableAppV1(@Param('id') id: string, @Param('app') app: AppEnum) {
		return this.usersService.enableApp(id, app.toString());
	}

	@Version('2')
	@Patch(':id/apps/:app/enable')
	async enableApp(@Param('id') id: string, @Param('app') appId: string) {
		return this.usersService.enableApp(id, appId);
	}
	@ApiOperation({ deprecated: true })
	@Patch(':id/apps/:app/disable')
	@ApiParam({ name: 'app', enum: AppEnum })
	async disableAppV1(@Param('id') id: string, @Param('app') app: AppEnum) {
		return this.usersService.disableApp(id, app);
	}

	@Version('2')
	@Patch(':id/apps/:app/disable')
	async disableApp(@Param('id') id: string, @Param('app') appId: string) {
		return this.usersService.disableApp(id, appId);
	}

	//#endregion

	//#region Connections
	@Patch(':id/connections/connect/:receiver')
	connectWith(
		@Param('id') id: string,
		@Param('receiver') receiver: string,
	): Promise<Connection> {
		console.log({ id, receiver });
		return this.usersService.initiateConnectionWith(id, receiver);
	}

	@Patch(':id/connections/:connection/disconnect')
	endConnection(
		@Param('id') id: string,
		@Param('connection') connection: string,
	) {
		return this.usersService.endConnection(id, connection);
	}

	@Patch(':id/connections/:connection/reject')
	rejectConnectionRequest(
		@Param('id') id: string,
		@Param('connection') connection: string,
	) {
		return this.usersService.rejectConnectionRequest(connection);
	}

	@Patch(':id/connections/:connection/accept')
	acceptConnectionRequest(
		@Param('id') id: string,
		@Param('connection') connection: string,
	) {
		console.log({ id, connection });
		return this.usersService.acceptConnectionRequest(connection);
	}

	@Patch(':id/connections/:connection/seen')
	seeConnection(
		@Param('id') id: string,
		@Param('connection') connection: string,
	) {
		return this.usersService.markConnectionAsSeen(connection);
	}

	@Post(':id/flag-report')
	report(@Param('id') id: string, @Body() reportUserDto: ReportUserDto) {
		return this.usersService.reportUser(reportUserDto);
	}

	@Patch(':id/connections/:connection/block')
	blockConnection(
		@Param('id') id: string,
		@Param('connection') connection: string,
	) {
		return this.usersService.blockConnection(id, connection);
	}
	@Patch(':id/connections/:connection/unblock')
	unblockConnection(
		@Param('id') id: string,
		@Param('connection') connection: string,
	) {
		return this.usersService.unblockConnection(connection);
	}
	//#endregion
	//#region tags
	@Post(':id/tags')
	createTag(@Param('id') id: string, @Body() createTagDto: CreateTagDto) {
		return this.usersService.createTag(id, createTagDto);
	}

	@Patch(':id/tags')
	updateTag(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
		return this.usersService.updateTag(
			id,
			updateTagDto.originalName,
			updateTagDto,
		);
	}

	@Delete(':id/tags/:tag/delete')
	deleteTag(@Param('id') id: string, @Param('tag') tagId: string) {
		return this.usersService.deleteTag(id, tagId);
	}
	//#endregion

	@Patch(':id/events/:event/book')
	bookEvent(@Param('id') id: string, @Param('event') event: string) {
		return this.usersService.attendEvent(id, event);
	}

	//#region Products
	@Patch(':id/products/link')
	@ApiResponse({ type: Product })
	linkProduct(
		@Param('id') uid: string,
		@Body() { productUuid }: LinkProductDto,
	): Promise<Product> {
		return this.usersService.linkProduct(uid, productUuid);
	}

	@Patch(':id/products/unlink')
	unlinkProduct(
		@Param('id') uid: string,
		@Body() { productUuid }: LinkProductDto,
	): Promise<void> {
		return this.usersService.unlinkProduct(uid, productUuid);
	}
	//#endregion

	// @Delete(':id')
	// remove(@Param('id') id: string) {
	// 	return this.usersService.remove(id);
	// }

	@Post('migrate/:token')
	migrate(@Param('token') token): Promise<any> {
		if (token != '9553cb68-b2b4-11ed-afa1-0242ac120002')
			throw new ForbiddenException();

		return this.usersService.migrateAllUsersToV2();
	}
}
