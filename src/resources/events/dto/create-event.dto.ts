import { ApiProperty } from '@nestjs/swagger';
import { Prisma, GeoPoint as PrismaGeoPoint } from '@prisma/client';
import { OptionalApiProperty } from 'src/openapi/decorators';
import { DeepPartial } from '../../../helpers/deep-partial';
import { GeoPoint } from '../entities/geo-point.entity';

export class CreateEventDto implements DeepPartial<Prisma.EventCreateInput> {
	@OptionalApiProperty({})
	id?: string;

	@OptionalApiProperty({ type: Date })
	createdAt?: Date;

	@ApiProperty({ type: Date })
	date: Date;

	@ApiProperty({})
	name: string;

	@ApiProperty({})
	creatorId: string;

	@OptionalApiProperty({})
	description?: string;

	@OptionalApiProperty({})
	activated?: boolean;

	@OptionalApiProperty({})
	duration?: number;

	@OptionalApiProperty({})
	isFeatured?: boolean;

	@OptionalApiProperty({ isArray: true })
	tags?: string[];

	@OptionalApiProperty()
	category?: string;

	@OptionalApiProperty({})
	eventUrl?: string;

	@OptionalApiProperty({ type: GeoPoint })
	location?: PrismaGeoPoint;

	@OptionalApiProperty({})
	address?: string;
}
