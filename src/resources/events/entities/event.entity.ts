import {
	Prisma,
	Event as PrismaEvent,
	EventAttendance as PrismaEventAttendance,
	EventOrganizer as PrismaEventOrganizer,
	GeoPoint as PrismaGeoPoint,
} from '@prisma/client';
import { OptionalApiProperty } from 'src/openapi/decorators';
import { DeepPartial } from '../../../helpers/deep-partial';
import { EventAttendance } from './event-attendance.entity';
import { EventOrganizer } from './event-organizer.entity';
import { GeoPoint } from './geo-point.entity';

const includeAll: Required<Prisma.EventInclude> = {
	attendees: true,
	creator: true,
	_count: true,
};

export class Event
	implements
		DeepPartial<
			PrismaEvent & Prisma.EventGetPayload<{ include: typeof includeAll }>
		>
{
	@OptionalApiProperty()
	id?: string;
	@OptionalApiProperty({ type: Date })
	date?: Date;

	@OptionalApiProperty()
	description?: string;
	@OptionalApiProperty()
	name?: string;
	@OptionalApiProperty()
	activated?: boolean;
	@OptionalApiProperty()
	creatorID?: string;

	@OptionalApiProperty({ type: () => EventOrganizer })
	creator?: PrismaEventOrganizer;

	@OptionalApiProperty()
	isFeatured?: boolean;

	@OptionalApiProperty({ isArray: true })
	tags?: string[];

	@OptionalApiProperty()
	category?: string;

	@OptionalApiProperty()
	duration?: number;

	@OptionalApiProperty()
	eventUrl?: string;

	@OptionalApiProperty({ type: GeoPoint })
	location?: PrismaGeoPoint;

	@OptionalApiProperty()
	address?: string;

	@OptionalApiProperty({ type: () => EventAttendance, isArray: true })
	attendees?: PrismaEventAttendance[];

	@OptionalApiProperty()
	_count?: Prisma.EventCountOutputType;
}
