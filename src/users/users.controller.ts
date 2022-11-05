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
import { Prisma, UserType } from '@prisma/client';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@ApiTags('users')
@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post()
	create(@Body() createUserDto: CreateUserDto) {
		return this.usersService.create(createUserDto);
	}

	@UseInterceptors(FileInterceptor('profileImageFile'))
	@ApiConsumes('multipart/form-data')
	@Post('upload')
	@ApiBody({
		type: CreateUserWithImageDto,
	})
	createUserWithImage(
		@UploadedFile() profileImageFile: Express.Multer.File,
		@Body() createUserDto: CreateUserWithImageDto,
	) {
		console.log(createUserDto, profileImageFile);
	}

	@Get()
	//@Auth(UserType.CUSTOMER)
	findAll(@Req() request: Request & { user: any }) {
		console.log({ user: request.user });
		return this.usersService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.usersService.findOne(id);
	}
	@Get('/fireUID/:id')
	findOneByFirebaseUID(@Param('id') id: string) {
		return this.usersService.findOneByFirebaseUID(id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
		return this.usersService.update(id, updateUserDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.usersService.remove(id);
	}
}
