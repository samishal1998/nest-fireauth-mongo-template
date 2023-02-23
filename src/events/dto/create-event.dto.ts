import { Options } from '@nestjs/common';
import {
	ApiExtraModels,
	ApiProperty,
	ApiPropertyOptions,
} from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { OptionalApiProperty } from 'src/openapi/decorators';
import {
	PrismaGenericConnect,
	PrismaGenericConnectMany,
} from 'src/prisma/types';


export class CreateEventDto implements Partial<Prisma.EventCreateInput> {
	@OptionalApiProperty({})
	id?: string;

	@OptionalApiProperty({ type: Date })
	createdAt?: string | Date;


	@ApiProperty({ enum: EventType })
	eventType: EventType;

}
