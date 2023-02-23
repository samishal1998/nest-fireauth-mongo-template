import { Injectable, Inject } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Prisma } from '@prisma/client';
import { Connection } from 'mongoose';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ObjectId } from 'mongodb';

@Injectable()
export class EventsService {
	@Inject()
	private prisma: PrismaService;

	create(createEventDto: CreateEventDto) {
		return 'This action adds a new Event';
	}

	async findAll() {
		return this.prisma.event.findMany({
			where: {
				date: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
			},
		});
	}

	findOne(id: string, include?: Prisma.EventInclude) {
		return this.prisma.event.findUnique({
			where: { id },
			include,
		});
	}
	findOneWithAttendanceIds(id: string) {
		return this.prisma.event.findUnique({
			where: { id },
			include: { attendees: true },
		});
	}

	// update(id: string, updateEventDto: UpdateEventDto) {
	// 	return this.prisma.event.update({
	// 		where: { id },
	// 		data: updateEventDto,
	// 	});
	// }

	remove(id: string) {
		return this.prisma.event.delete({ where: { id } });
	}
}
