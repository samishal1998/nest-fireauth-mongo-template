import { ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { OptionalApiProperty } from 'src/openapi/decorators';
import {
	PrismaDateTimeNullableFilter,
	PrismaStringFilter,
	PrismaStringNullableListFilter,
} from 'src/prisma/types';

@ApiExtraModels(PrismaDateTimeNullableFilter, PrismaStringFilter)
export class FindAllEventsDto
	implements Partial<Prisma.EventFindManyArgs['where']>
{
	@OptionalApiProperty({
		oneOf: [
			{ type: 'string', format: 'date-time' },
			{ $ref: getSchemaPath(PrismaDateTimeNullableFilter) },
		],
	})
	date: string | PrismaDateTimeNullableFilter | Date;

	@OptionalApiProperty()
	activated: boolean;

	@OptionalApiProperty({
		oneOf: [
			{ type: 'string' },
			{ $ref: getSchemaPath(PrismaStringFilter) },
		],
	})
	creatorID: string | PrismaStringFilter;

	// attendees: Prisma.EventAttendanceListRelationFilter; //TODO

	@OptionalApiProperty()
	isFeatured: boolean;
	@OptionalApiProperty({ type: PrismaStringNullableListFilter })
	tags: PrismaStringNullableListFilter;
	@OptionalApiProperty({ type: PrismaStringFilter })
	category: PrismaStringFilter;
}
