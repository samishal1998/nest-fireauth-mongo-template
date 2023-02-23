import { ApiResponseProperty } from '@nestjs/swagger';
import {
	ControlledValue as PrismaControlledValue,
	Prisma,
	Event as PrismaEvent,
	EventAttendance as PrismaEventAttendance,
	User as PrismaUser,
	UserType,
} from '@prisma/client';
import { OptionalApiProperty } from 'src/openapi/decorators';
import { DeepPartial } from '../../helpers/deep-partial';
import { Product } from '../../products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import { EventAttendance } from './event-attendance.entity';

const includeAll: Partial<Prisma.EventInclude> = {
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

	@OptionalApiProperty({ type: () => User })
	creator?: PrismaUser;

	@OptionalApiProperty({ type: () => EventAttendance, isArray: true })
	attendees?: PrismaEventAttendance[];

	@OptionalApiProperty()
	_count?: Prisma.EventCountOutputType;
}
