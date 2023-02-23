import {
	Connection as PrismaConnection,
	User as PrismaUser,
} from '@prisma/client';
import { DeepPartial } from 'src/helpers/deep-partial';
import { OptionalApiProperty } from 'src/openapi/decorators';
import { User } from './user.entity';

export class Connection
	implements
		DeepPartial<
			PrismaConnection & { initiatedBy: PrismaUser } & {
				receivedBy: PrismaUser;
			}
		>
{
	@OptionalApiProperty()
	id: string;
	@OptionalApiProperty()
	createdAt: Date;
	@OptionalApiProperty()
	responseAt: Date;
	@OptionalApiProperty()
	seen: boolean;
	@OptionalApiProperty()
	seenAt: Date;
	@OptionalApiProperty()
	response: string;
	@OptionalApiProperty()
	initiatedByID: string;
	@OptionalApiProperty()
	receivedByID: string;

	@OptionalApiProperty({ type: () => User })
	initiatedBy?: User;
	@OptionalApiProperty({ type: () => User })
	receivedBy?: User;
}
