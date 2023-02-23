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
import { UserConnectionsService } from './user-connections.service';

@ApiTags('users')
@Controller('users/:uid/connections')
export class UserConnectionsController {
	constructor(private readonly usersService: UserConnectionsService) {}

	//#region Connections
	@Patch('connect/:receiver')
	connectWith(
		@Param('uid') id: string,
		@Param('receiver') receiver: string,
	): Promise<Connection> {
		console.log({ id, receiver });
		return this.usersService.initiateConnectionWith(id, receiver);
	}

	@Patch(':connection/disconnect')
	endConnection(
		@Param('uid') id: string,
		@Param('connection') connection: string,
	) {
		return this.usersService.endConnection(id, connection);
	}

	@Patch(':connection/reject')
	rejectConnectionRequest(
		@Param('uid') id: string,
		@Param('connection') connection: string,
	) {
		return this.usersService.rejectConnectionRequest(connection);
	}

	@Patch(':connection/accept')
	acceptConnectionRequest(
		@Param('uid') id: string,
		@Param('connection') connection: string,
	) {
		console.log({ id, connection });
		return this.usersService.acceptConnectionRequest(connection);
	}

	@Patch(':connection/seen')
	seeConnection(
		@Param('uid') id: string,
		@Param('connection') connection: string,
	) {
		return this.usersService.markConnectionAsSeen(connection);
	}

	@Patch(':connection/block')
	blockConnection(
		@Param('uid') id: string,
		@Param('connection') connection: string,
	) {
		return this.usersService.blockConnection(id, connection);
	}
	@Patch(':connection/unblock')
	unblockConnection(
		@Param('uid') id: string,
		@Param('connection') connection: string,
	) {
		return this.usersService.unblockConnection(connection);
	}
	//#endregion
}
