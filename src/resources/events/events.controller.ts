import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Req,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { CreateEventDto } from './dto/create-event.dto';
import { FindAllEventsDto } from './dto/find-all.dto';
import { Event } from './entities/event.entity';
import { EventsService } from './events.service';

@ApiTags('events')
@Controller('events')
export class EventsController {
	constructor(private readonly eventsService: EventsService) {}

	@Post()
	@ApiResponse({ type: Event })
	create(@Body() createEventDto: CreateEventDto): Promise<Event> {
		return this.eventsService.create(createEventDto);
	}

	@Get()
	@ApiResponse({ type: Event, isArray: true })
	async findAll(@Req() request: Request): Promise<Event[]> {
		return this.eventsService.findAll();
	}
	@Post('query')
	@ApiResponse({ type: Event, isArray: true })
	findAllFiltered(
		@Req() request: Request,
		@Body() query: FindAllEventsDto,
	): Promise<Event[]> {
		return this.eventsService.findAll(query);
	}

	@Get(':id')
	@ApiResponse({ type: Event })
	findOne(@Param('id') id: string): Promise<Event> {
		return this.eventsService.findOne(id);
	}

	@Delete(':id')
	@ApiResponse({ type: Event })
	remove(@Param('id') id: string) {
		return this.eventsService.remove(id);
	}
}
