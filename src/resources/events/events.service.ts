import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { FindAllEventsDto } from './dto/find-all.dto';
import { Event } from './entities/event.entity';
@Injectable()
export class EventsService {
	@Inject()
	private prisma: PrismaService;

	create({ creatorId, ...data }: CreateEventDto) {
		return this.prisma.event.create({
			data: {
				...data,
				creator: { connect: { id: creatorId } },
			},
		});
	}

	async findAll(query?: FindAllEventsDto): Promise<Event[]> {
		return await this.prisma.event.findMany({
			where: {
				date: query?.date || {
					gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
				},
				isFeatured: query?.isFeatured,
				activated: query?.activated,
				tags: query?.tags,
				category: query?.category,
				creatorID: query?.creatorID,
			},
			include: {
				creator: { include: { user: true } },
				_count: true,
			},
		});
	}

	findOne(id: string, include?: Prisma.EventInclude): Promise<Event> {
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
