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
import { UserProductsService } from './user-products.service';

@ApiTags('users')
@Controller('users/:uid/products')
export class UserProductsController {
	constructor(private readonly userProductsService: UserProductsService) {}

	@Patch('link')
	@ApiResponse({ type: Product })
	linkProduct(
		@Param('uid') uid: string,
		@Body() { productUuid }: LinkProductDto,
	): Promise<Product> {
		return this.userProductsService.linkProduct(uid, productUuid);
	}

	@Patch('unlink')
	unlinkProduct(
		@Param('uid') uid: string,
		@Body() { productUuid }: LinkProductDto,
	): Promise<void> {
		return this.userProductsService.unlinkProduct(uid, productUuid);
	}
}
