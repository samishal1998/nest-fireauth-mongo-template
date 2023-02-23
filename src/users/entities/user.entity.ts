import { ApiResponseProperty } from '@nestjs/swagger';
import {
	ControlledValue as PrismaControlledValue,
	Prisma,
	User as PrismaUser,
	UserType,
	EventAttendance,
} from '@prisma/client';
import { OptionalApiProperty } from 'src/openapi/decorators';
import { ControlledValue } from './controlled-value.entity';
import { Connection } from './connection.entity';
import { DeepPartial } from '../../helpers/deep-partial';
import { Product } from '../../products/entities/product.entity';
const includeAll = {
	attendedEvents: true,
	connectionsInitiated: { include: { receivedBy: true } },
	connectionsReceived: { include: { initiatedBy: true } },
	products: true,
};

export class User
	implements
		DeepPartial<
			PrismaUser & Prisma.UserGetPayload<{ include: typeof includeAll }>
		>
{
	@OptionalApiProperty()
	title?: string;
	@OptionalApiProperty()
	bio?: string;

	@OptionalApiProperty()
	attendedEvents?: EventAttendance[];

	@OptionalApiProperty({ type: () => Connection, isArray: true })
	connectionsInitiated?: Connection[];

	@OptionalApiProperty({ type: () => Connection, isArray: true })
	connectionsReceived?: Connection[];

	@OptionalApiProperty({ type: () => Product, isArray: true })
	products?: Product[];

	@OptionalApiProperty()
	id: string;
	@OptionalApiProperty()
	createdAt: Date;
	@OptionalApiProperty()
	firebaseUID: string;
	@OptionalApiProperty()
	fullName: string;
	@OptionalApiProperty()
	username?: string;
	@OptionalApiProperty()
	primaryEmail?: string;
	@OptionalApiProperty()
	primaryPhone?: string;
	@OptionalApiProperty()
	primaryPhoneEnabled?: boolean;
	@OptionalApiProperty()
	primaryEmailEnabled?: boolean;
	@OptionalApiProperty({ type: ControlledValue, isArray: true })
	emails?: PrismaControlledValue[];
	@OptionalApiProperty({ type: ControlledValue, isArray: true })
	phones?: PrismaControlledValue[];
	@OptionalApiProperty()
	userType?: UserType;
	@OptionalApiProperty()
	birthday?: Date;
	@OptionalApiProperty()
	apps?: Prisma.JsonValue; //Record<string, ControlledValue>;
	@OptionalApiProperty()
	customApps?: Prisma.JsonValue; //Record<string,ControlledValue & { name: string; icon: string }>;
	@OptionalApiProperty()
	tags?: Prisma.JsonValue; //Record<string, Tag>;
}

export enum App {
	FACEBOOK = 'FACEBOOK',
	WHATSAPP = 'WHATSAPP',
	TWITTER = 'TWITTER',
	INSTAGRAM = 'INSTAGRAM',
	TIKTOK = 'TIKTOK',
	SNAPCHAT = 'SNAPCHAT',
	AMAZON = 'AMAZON',
	SPOTIFY = 'SPOTIFY',
	YOUTUBE = 'YOUTUBE',
	LINKEDIN = 'LINKEDIN',
	SOUNDCLOUD = 'SOUNDCLOUD',
	PAYPAL = 'PAYPAL',
}
