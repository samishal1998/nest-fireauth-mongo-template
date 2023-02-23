import { ApiResponseProperty } from '@nestjs/swagger';
import {
	ControlledValue as PrismaControlledValue,
	Prisma,
	EventAttendance as PrismaEventAttendance,
	Event as PrismaEvent,
	User as PrismaUser,
	UserType,
} from '@prisma/client';
import { OptionalApiProperty } from 'src/openapi/decorators';
import { DeepPartial } from '../../../helpers/deep-partial';
import { Product } from '../../products/entities/product.entity';
import { User } from 'src/resources/users/entities/user.entity';

const includeAll: Partial<Prisma.EventAttendanceInclude> = {
	event: true,
	attendee: true,
};

export class EventAttendance
	implements
		DeepPartial<
			PrismaEvent &
				Prisma.EventAttendanceGetPayload<{ include: typeof includeAll }>
		>
{
	@OptionalApiProperty()
	id: string;
	@OptionalApiProperty({ type: Date })
	date: Date;

	@OptionalApiProperty()
	description?: string;

	@OptionalApiProperty()
	name: string;

	@OptionalApiProperty()
	activated: boolean;

	@OptionalApiProperty()
	creatorID: string;

	@OptionalApiProperty({ type: Date })
	created: Date;

	@OptionalApiProperty()
	eventId: string;

	@OptionalApiProperty()
	attendeeID: string;

	@OptionalApiProperty({ type: () => Event })
	event?: PrismaEvent;

	@OptionalApiProperty({ type: () => User })
	attendee?: PrismaUser;
}
