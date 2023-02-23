import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards,
	Req,
	UseInterceptors,
	UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, CreateUserWithImageDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FirebaseAuthGuard } from 'src/auth/guards/firebase-auth.guard';
import { Request } from 'express';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Connection, Prisma, UserType } from '@prisma/client';
import { Auth } from 'src/auth/decorators/auth.decorator';
import {
	ApiBearerAuth,
	ApiBody,
	ApiConsumes,
	ApiParam,
	ApiProduces,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { InjectConnection } from '@nestjs/mongoose';
import { App, User } from './entities/user.entity';
import { AddCustomAppDto } from './dto/add-custom-app.dto';
import { AddAppDto } from './dto/add-app.dto';
import { CreateTagDto } from './dto/create-tag.dto';
import { LinkProductDto } from './dto/link-product.dto';
import { UpdateResult } from 'mongodb';
import { UpdateTagDto } from './dto/update-tag.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post()
	@ApiResponse({ type: User })
	create(@Body() createUserDto: CreateUserDto): Promise<User> {
		return this.usersService.create(createUserDto) as any;
	}

	@Get()
	//@Auth(UserType.CUSTOMER)
	@ApiResponse({ type: User, isArray: true })
	findAll(@Req() request: Request & { user: any }): Promise<User[]> {
		// console.log({ user: request.user });
		return this.usersService.findAll() as any;
	}

	@Get(':id')
	@ApiResponse({ type: User })
	findOne(@Param('id') id: string): Promise<User> {
		return this.usersService.findOne(id) as any;
	}
	@Get('/fireUID/:id')
	@ApiResponse({ type: User })
	findOneByFirebaseUID(@Param('id') id: string): Promise<User> {
		return this.usersService.findOneIncludeAllByFirebaseUID(id) as any;
	}

	@Get('/fireUID/:id/include-all')
	@ApiResponse({ type: User })
	findOneIncludeAllByFirebaseUID(@Param('id') id: string): Promise<User> {
		return this.usersService.findOneIncludeAllByFirebaseUID(id) as any;
	}

	@Patch(':id')
	@ApiResponse({ type: User })
	update(
		@Param('id') id: string,
		@Body() updateUserDto: UpdateUserDto,
	): Promise<User> {
		try {
			console.log({ id, updateUserDto });
			return this.usersService.update(id, updateUserDto);
		} catch (e) {
			console.error(e);
			throw e;
		}
	}

	@Patch(':id/apps/custom/add')
	async addCustomApp(
		@Param('id') id: string,
		@Body() addCustomAppDto: AddCustomAppDto,
	) {
		return this.usersService.addCustomApp(id, addCustomAppDto);
	}
	@Patch(':id/apps/custom/:app/enable')
	async enableCustomApp(
		@Param('id') id: string,
		@Param('app') app: string,
	): Promise<UpdateResult> {
		return this.usersService.enableCustomApp(id, app);
	}
	@Patch(':id/apps/custom/:app/delete')
	async deleteCustomApp(@Param('id') id: string, @Param('app') app: string) {
		return this.usersService.deleteCustomApp(id, app);
	}

	@Patch(':id/apps/custom/:app/disable')
	async disableCustomApp(@Param('id') id: string, @Param('app') app: string) {
		return this.usersService.disableCustomApp(id, app);
	}

	@Patch(':id/apps/:app/add')
	@ApiParam({ name: 'app', enum: App })
	async addApp(
		@Param('id') id: string,
		@Param('app') app: App,
		@Body() addAppDto: AddAppDto,
	) {
		return this.usersService.addApp(
			id,
			app,
			addAppDto.value,
			addAppDto.enabled,
		);
	}
	@Patch(':id/apps/:app/enable')
	@ApiParam({ name: 'app', enum: App })
	async enableApp(@Param('id') id: string, @Param('app') app: App) {
		return this.usersService.enableApp(id, app);
	}

	@Patch(':id/apps/:app/disable')
	@ApiParam({ name: 'app', enum: App })
	async disableApp(@Param('id') id: string, @Param('app') app: App) {
		return this.usersService.disableApp(id, app);
	}

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
		return this.usersService.endConnection(connection);
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

	@Patch(':id/events/:event/book')
	bookEvent(@Param('id') id: string, @Param('event') event: string) {
		return this.usersService.attendEvent(id, event);
	}

	@Patch(':id/products/link')
	linkProduct(
		@Param('id') uid: string,
		@Body() { productUuid }: LinkProductDto,
	): Promise<void> {
		return this.usersService.linkProduct(uid, productUuid);
	}

	@Patch(':id/products/unlink')
	unlinkProduct(
		@Param('id') uid: string,
		@Body() { productUuid }: LinkProductDto,
	): Promise<void> {
		return this.usersService.unlinkProduct(uid, productUuid);
	}

	// @Delete(':id')
	// remove(@Param('id') id: string) {
	// 	return this.usersService.remove(id);
	// }
}
