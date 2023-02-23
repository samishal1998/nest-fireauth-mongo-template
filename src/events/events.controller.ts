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
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
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

@ApiTags('events')
@Controller('events')
export class EventsController {
	constructor(private readonly eventsService: EventsService) {}

	@Post()
	create(@Body() createEventDto: CreateEventDto) {
		return this.eventsService.create(createEventDto);
	}

	@Get()
	findAll(@Req() request: Request) {
		return this.eventsService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.eventsService.findOne(id);
	}

	// @Patch(':id')
	// update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
	// 	return this.eventsService.update(id, updateEventDto);
	// }

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.eventsService.remove(id);
	}
}
