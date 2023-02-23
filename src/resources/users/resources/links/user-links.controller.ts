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
import type { Response } from 'express';
import { UpdateResult } from 'mongodb';

import { CreateUserDto } from '../../dto/create-user.dto';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { UsersService } from '../../users.service';
import { Product } from '../../../products/entities/product.entity';
import { AddAppDto } from '../../dto/add-app.dto';
import { AddCustomAppDto } from '../../dto/custom-apps/add-custom-app.dto';
import { AddCustomAppsCategoryDto } from '../../dto/custom-apps/add-custom-apps-category.dto';
import { EditCustomAppDto } from '../../dto/custom-apps/edit-custom-app.dto copy';
import { EditCustomAppsCategoryDto } from '../../dto/custom-apps/edit-custom-apps-category.dto';
import { LinkProductDto } from '../../dto/link-product.dto';
import { ReportUserDto } from '../../dto/report-user.dto';
import { CreateTagDto } from '../../dto/tags/create-tag.dto';
import { UpdateTagDto } from '../../dto/tags/update-tag.dto';
import { AppEnum, User } from '../../entities/user.entity';
import { UserLinksService } from './user-links.service';

@ApiTags('users')
@Controller('users/:uid/apps')
export class UserAppsController {
	constructor(private readonly usersService: UserLinksService) {}

	//#region CustomApps
	@Post('custom/app')
	async addCustomApp(
		@Param('uid') id: string,
		@Body() addCustomAppDto: AddCustomAppDto,
	) {
		console.log({ addCustomAppDto });
		return this.usersService.addCustomApp(id, addCustomAppDto);
	}

	@Put('custom/app')
	async editCustomApp(
		@Param('uid') id: string,
		@Body() editCustomAppDto: EditCustomAppDto,
	) {
		return this.usersService.editCustomApp(id, editCustomAppDto);
	}

	@ApiOperation({ deprecated: true })
	@Patch('custom/:categoryId/app/:appId/enable')
	async enableCustomAppV1(
		@Param('uid') id: string,
		@Param('appId') appId: string,
		@Param('categoryId') categoryId: string,
	): Promise<UpdateResult> {
		return this.usersService.enableCustomApp(id, appId, categoryId);
	}

	@ApiOperation({ deprecated: true })
	@Patch('custom/:categoryId/app/:appId/disable')
	async disableCustomAppV1(
		@Param('uid') id: string,
		@Param('appId') appId: string,
		@Param('categoryId') categoryId: string,
	) {
		return this.usersService.disableCustomApp(id, appId, categoryId);
	}

	@ApiOperation({ deprecated: true })
	@Delete('custom/:categoryId/app/:appId')
	async deleteCustomAppV1(
		@Param('uid') id: string,
		@Param('appId') appId: string,
		@Param('categoryId') categoryId: string,
	) {
		return this.usersService.deleteCustomApp(id, appId, categoryId);
	}

	@Version('v2')
	@Patch('custom/:appId/enable')
	async enableCustomApp(
		@Param('uid') id: string,
		@Param('appId') appId: string,
	): Promise<UpdateResult> {
		return this.usersService.enableCustomApp(id, appId);
	}

	@Version('v2')
	@Patch('custom/:appId/disable')
	async disableCustomApp(
		@Param('uid') id: string,
		@Param('appId') appId: string,
	) {
		return this.usersService.disableCustomApp(id, appId);
	}

	@Version('v2')
	@Delete('custom/:categoryId/app/:appId')
	async deleteCustomApp(
		@Param('uid') id: string,
		@Param('appId') appId: string,
		@Param('categoryId') categoryId: string,
	) {
		return this.usersService.deleteCustomApp(id, appId, categoryId);
	}
	//#endregion

	//#region CustomAppsCategory

	@Post('custom')
	async addCustomAppCategory(
		@Param('uid') id: string,
		@Body() addCustomAppsCategoryDto: AddCustomAppsCategoryDto,
	) {
		return this.usersService.addCustomAppsCategory(
			id,
			addCustomAppsCategoryDto,
		);
	}

	@Put('custom')
	async editCustomAppCategory(
		@Param('uid') id: string,
		@Body() editCustomAppsCategoryDto: EditCustomAppsCategoryDto,
	) {
		return this.usersService.editCustomAppsCategory(
			id,
			editCustomAppsCategoryDto,
		);
	}

	@Patch('custom/:categoryId/disable')
	async disableCustomAppCategory(
		@Param('uid') id: string,
		@Param('categoryId') categoryId: string,
	) {
		return this.usersService.editCustomAppsCategory(id, {
			categoryId,
			enabled: false,
		});
	}
	@Patch('custom/:categoryId/enable')
	async enableCustomAppCategory(
		@Param('uid') id: string,
		@Param('categoryId') categoryId: string,
	) {
		return this.usersService.editCustomAppsCategory(id, {
			categoryId,
			enabled: true,
		});
	}

	@Delete('custom/:categoryId')
	async deleteCustomAppCategory(
		@Param('uid') id: string,
		@Param('categoryId') categoryId: string,
	) {
		return this.usersService.deleteCustomAppsCategory(id, categoryId);
	}

	//#endregion

	//#region Apps
	@ApiOperation({ deprecated: true })
	@Patch(':app/add') //TODO remove
	@ApiParam({ name: 'app', enum: AppEnum })
	async addAppOld(
		@Param('uid') id: string,
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
	@Post(':app')
	@ApiParam({ name: 'app', enum: AppEnum })
	async addAppV1(
		@Param('uid') id: string,
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
	@Post(':app')
	async addApp(
		@Param('uid') id: string,
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
	@Delete(':app')
	@ApiParam({ name: 'app', enum: AppEnum })
	async deleteAppV1(@Param('uid') id: string, @Param('app') app: AppEnum) {
		return this.usersService.deleteApp(id, app.toString());
	}
	@Version('2')
	@Delete(':app')
	async deleteApp(@Param('uid') id: string, @Param('app') appId: string) {
		return this.usersService.deleteApp(id, appId);
	}

	@ApiOperation({ deprecated: true })
	@Patch(':app/enable')
	@ApiParam({ name: 'app', enum: AppEnum })
	async enableAppV1(@Param('uid') id: string, @Param('app') app: AppEnum) {
		return this.usersService.enableApp(id, app.toString());
	}

	@Version('2')
	@Patch(':app/enable')
	async enableApp(@Param('uid') id: string, @Param('app') appId: string) {
		return this.usersService.enableApp(id, appId);
	}
	@ApiOperation({ deprecated: true })
	@Patch(':app/disable')
	@ApiParam({ name: 'app', enum: AppEnum })
	async disableAppV1(@Param('uid') id: string, @Param('app') app: AppEnum) {
		return this.usersService.disableApp(id, app);
	}

	@Version('2')
	@Patch(':app/disable')
	async disableApp(@Param('uid') id: string, @Param('app') appId: string) {
		return this.usersService.disableApp(id, appId);
	}

	//#endregion
}

@ApiTags('users')
@Controller('users/:uid/links')
export class UserLinksController {
	constructor(private readonly usersService: UserLinksService) {}

	//#region CustomApps
	@Post('custom/app')
	async addCustomApp(
		@Param('uid') id: string,
		@Body() addCustomAppDto: AddCustomAppDto,
	) {
		console.log({ addCustomAppDto });
		return this.usersService.addCustomApp(id, addCustomAppDto);
	}

	@Put('custom/app')
	async editCustomApp(
		@Param('uid') id: string,
		@Body() editCustomAppDto: EditCustomAppDto,
	) {
		return this.usersService.editCustomApp(id, editCustomAppDto);
	}

	@ApiOperation({ deprecated: true })
	@Patch('custom/:categoryId/app/:appId/enable')
	async enableCustomAppV1(
		@Param('uid') id: string,
		@Param('appId') appId: string,
		@Param('categoryId') categoryId: string,
	): Promise<UpdateResult> {
		return this.usersService.enableCustomApp(id, appId, categoryId);
	}

	@ApiOperation({ deprecated: true })
	@Patch('custom/:categoryId/app/:appId/disable')
	async disableCustomAppV1(
		@Param('uid') id: string,
		@Param('appId') appId: string,
		@Param('categoryId') categoryId: string,
	) {
		return this.usersService.disableCustomApp(id, appId, categoryId);
	}

	@ApiOperation({ deprecated: true })
	@Delete('custom/:categoryId/app/:appId')
	async deleteCustomAppV1(
		@Param('uid') id: string,
		@Param('appId') appId: string,
		@Param('categoryId') categoryId: string,
	) {
		return this.usersService.deleteCustomApp(id, appId, categoryId);
	}

	@Version('v2')
	@Patch('custom/:appId/enable')
	async enableCustomApp(
		@Param('uid') id: string,
		@Param('appId') appId: string,
	): Promise<UpdateResult> {
		return this.usersService.enableCustomApp(id, appId);
	}

	@Version('v2')
	@Patch('custom/:appId/disable')
	async disableCustomApp(
		@Param('uid') id: string,
		@Param('appId') appId: string,
	) {
		return this.usersService.disableCustomApp(id, appId);
	}

	@Version('v2')
	@Delete('custom/:categoryId/app/:appId')
	async deleteCustomApp(
		@Param('uid') id: string,
		@Param('appId') appId: string,
		@Param('categoryId') categoryId: string,
	) {
		return this.usersService.deleteCustomApp(id, appId, categoryId);
	}
	//#endregion

	//#region CustomAppsCategory

	@Post('custom')
	async addCustomAppCategory(
		@Param('uid') id: string,
		@Body() addCustomAppsCategoryDto: AddCustomAppsCategoryDto,
	) {
		return this.usersService.addCustomAppsCategory(
			id,
			addCustomAppsCategoryDto,
		);
	}

	@Put('custom')
	async editCustomAppCategory(
		@Param('uid') id: string,
		@Body() editCustomAppsCategoryDto: EditCustomAppsCategoryDto,
	) {
		return this.usersService.editCustomAppsCategory(
			id,
			editCustomAppsCategoryDto,
		);
	}

	@Patch('custom/:categoryId/disable')
	async disableCustomAppCategory(
		@Param('uid') id: string,
		@Param('categoryId') categoryId: string,
	) {
		return this.usersService.editCustomAppsCategory(id, {
			categoryId,
			enabled: false,
		});
	}
	@Patch('custom/:categoryId/enable')
	async enableCustomAppCategory(
		@Param('uid') id: string,
		@Param('categoryId') categoryId: string,
	) {
		return this.usersService.editCustomAppsCategory(id, {
			categoryId,
			enabled: true,
		});
	}

	@Delete('custom/:categoryId')
	async deleteCustomAppCategory(
		@Param('uid') id: string,
		@Param('categoryId') categoryId: string,
	) {
		return this.usersService.deleteCustomAppsCategory(id, categoryId);
	}

	//#endregion

	//#region Apps
	@ApiOperation({ deprecated: true })
	@Patch(':app/add') //TODO remove
	@ApiParam({ name: 'app', enum: AppEnum })
	async addAppOld(
		@Param('uid') id: string,
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
	@Post(':app')
	@ApiParam({ name: 'app', enum: AppEnum })
	async addAppV1(
		@Param('uid') id: string,
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
	@Post(':app')
	async addApp(
		@Param('uid') id: string,
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
	@Delete(':app')
	@ApiParam({ name: 'app', enum: AppEnum })
	async deleteAppV1(@Param('uid') id: string, @Param('app') app: AppEnum) {
		return this.usersService.deleteApp(id, app.toString());
	}
	@Version('2')
	@Delete(':app')
	async deleteApp(@Param('uid') id: string, @Param('app') appId: string) {
		return this.usersService.deleteApp(id, appId);
	}

	@ApiOperation({ deprecated: true })
	@Patch(':app/enable')
	@ApiParam({ name: 'app', enum: AppEnum })
	async enableAppV1(@Param('uid') id: string, @Param('app') app: AppEnum) {
		return this.usersService.enableApp(id, app.toString());
	}

	@Version('2')
	@Patch(':app/enable')
	async enableApp(@Param('uid') id: string, @Param('app') appId: string) {
		return this.usersService.enableApp(id, appId);
	}
	@ApiOperation({ deprecated: true })
	@Patch(':app/disable')
	@ApiParam({ name: 'app', enum: AppEnum })
	async disableAppV1(@Param('uid') id: string, @Param('app') app: AppEnum) {
		return this.usersService.disableApp(id, app);
	}

	@Version('2')
	@Patch(':app/disable')
	async disableApp(@Param('uid') id: string, @Param('app') appId: string) {
		return this.usersService.disableApp(id, appId);
	}

	//#endregion
}
