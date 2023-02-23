import { getSchemaPath } from '@nestjs/swagger';
import {
	EventAttendance,
	Prisma,
	ControlledValue as PrismaControlledValue,
	User as PrismaUser,
	WorkInfo as PrismaWorkInfo,
	UserType,
} from '@prisma/client';
import { OptionalApiProperty } from 'src/openapi/decorators';
import { DeepPartial } from '../../../helpers/deep-partial';
import { Product } from '../../products/entities/product.entity';
import { Connection } from './connection.entity';
import { ControlledValue } from './controlled-value.entity';

const includeAll = {
	attendedEvents: true,
	connectionsInitiated: { include: { receivedBy: true } },
	connectionsReceived: { include: { initiatedBy: true } },
	products: true,
};
class WorkInfo implements Partial<PrismaWorkInfo> {
	@OptionalApiProperty()
	companyName: string;
	@OptionalApiProperty()
	position: string;
	@OptionalApiProperty()
	companyUrl: string;
}

export class Link {
	@OptionalApiProperty()
	type?: string;

	@OptionalApiProperty()
	value: string;

	@OptionalApiProperty()
	enabled: boolean;

	@OptionalApiProperty()
	icon?: boolean;

	@OptionalApiProperty()
	labels?: any;
}

export class LinkCategory {
	@OptionalApiProperty()
	index: number;

	@OptionalApiProperty()
	enabled: boolean;

	@OptionalApiProperty()
	labels: any;

	@OptionalApiProperty()
	links: Array<string>;
}

export enum AppEnum {
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
	CUSTOM = 'CUSTOM',
}

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

	@OptionalApiProperty({
		type: 'object',
		additionalProperties: { $ref: getSchemaPath(Link) },
	})
	links?: DeepPartial<Record<string, Link>>;

	@OptionalApiProperty({
		type: 'object',
		additionalProperties: { $ref: getSchemaPath(LinkCategory) },
	})
	linksCategories?: DeepPartial<Record<string, LinkCategory>>;

	@OptionalApiProperty()
	apps?: Prisma.JsonValue; //Record<string, ControlledValue>;

	/**
	 *
	 * Record<
	 * 		string,
	 * 		{
	 * 			labels: Record<string,string>,
	 * 			enabled:boolean,
	 * 			apps: Record<string, ControlledValue & { labels: Record<string,string>, icon: string, type:App } >,
	 * 		}
	 * >;
	 */
	@OptionalApiProperty({
		type: 'object',
		additionalProperties: {
			type: 'object',
			properties: {
				enabled: { type: 'boolean' },
				labels: { type: 'object' },
				apps: {
					type: 'object',
					additionalProperties: {
						type: 'object',
						properties: {
							type: { type: 'string' },

							value: { type: 'string' },
							enabled: { type: 'boolean' },

							icon: { type: 'boolean' },
							labels: { type: 'object' },
						},
						required: [/*'type',*/ 'value', 'enabled'],
					},
				},
			},
		},
	})
	customApps?: Prisma.JsonValue;

	@OptionalApiProperty()
	tags?: Prisma.JsonValue; //Record<string, Tag>;
	@OptionalApiProperty({ type: 'string', isArray: true })
	fcmTokens?: string[];
	@OptionalApiProperty({ type: WorkInfo })
	workInfo?: PrismaWorkInfo;

	@OptionalApiProperty()
	userAccentColor?: string;

	@OptionalApiProperty()
	documentVersion?: string;
	//TODO reportsSent reportsAgainst
}
