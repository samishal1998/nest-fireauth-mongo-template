import {
	Prisma,
	Event as PrismaEvent,
	EventOrganizer as PrismaEventOrganizer,
	User as PrismaUser,
} from '@prisma/client';
import { OptionalApiProperty } from 'src/openapi/decorators';
import { User } from 'src/resources/users/entities/user.entity';
import { DeepPartial } from '../../../helpers/deep-partial';

const includeAll: Required<Prisma.EventOrganizerInclude> = {
	user: true,
	eventsCreated: true,
	_count: true,
};

export class EventOrganizer
	implements
		DeepPartial<
			PrismaEventOrganizer &
				Prisma.EventOrganizerGetPayload<{ include: typeof includeAll }>
		>
{
	@OptionalApiProperty()
	id?: string;
	@OptionalApiProperty({ type: Date })
	createdAt?: Date;
	@OptionalApiProperty()
	fullName?: string;
	@OptionalApiProperty({ type: () => User })
	user?: PrismaUser;
	@OptionalApiProperty({ type: () => Event, isArray: true })
	eventsCreated?: PrismaEvent[];
	_count?: Prisma.EventOrganizerCountOutputType;
}
