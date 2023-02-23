import { ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { OptionalApiProperty } from 'src/openapi/decorators';

export class PrismaGenericConnect<T = any> {
	@OptionalApiProperty()
	connect?: { id? } & any;

	@OptionalApiProperty()
	connectOrCreate?: { where: { id? } & any; create: T };

	@OptionalApiProperty()
	create?: T;
}
export class PrismaGenericConnectMany<T = any> {
	@OptionalApiProperty()
	connect?: ({ id? } & any)[];

	@OptionalApiProperty()
	connectOrCreate?: { where: ({ id? } & any)[]; create: T[] };

	@OptionalApiProperty()
	create?: T;

	@OptionalApiProperty()
	createMany?: { data: T[] };
}
export class PrismaStringNullableListFilter
	implements Partial<Prisma.StringNullableListFilter>
{
	@OptionalApiProperty({ isArray: true })
	equals?: string[];
	@OptionalApiProperty()
	has?: string;
	@OptionalApiProperty({ isArray: true })
	hasEvery?: string[];
	@OptionalApiProperty({ isArray: true })
	hasSome?: string[];
	@OptionalApiProperty()
	isEmpty?: boolean;
}
export class PrismaNestedDateTimeNullableFilter
	implements Partial<Prisma.NestedDateTimeNullableFilter>
{
	@OptionalApiProperty({ type: Date })
	equals: string | Date;
	@OptionalApiProperty({ type: Date })
	in: string[] | Date[];
	@OptionalApiProperty({ type: Date, isArray: true })
	notIn: string[] | Date[];
	@OptionalApiProperty({ type: Date, isArray: true })
	lt: string | Date;
	@OptionalApiProperty({ type: Date })
	lte: string | Date;
	@OptionalApiProperty({ type: Date })
	gt: string | Date;
	@OptionalApiProperty({ type: Date })
	gte: string | Date;
	@OptionalApiProperty({
		oneOf: [
			{ type: 'string', format: 'date-time' },
			{ $ref: getSchemaPath(PrismaNestedDateTimeNullableFilter) },
		],
	})
	not: string | Date | PrismaNestedDateTimeNullableFilter;
	@OptionalApiProperty()
	isSet: boolean;
}
@ApiExtraModels(PrismaNestedDateTimeNullableFilter)
export class PrismaDateTimeNullableFilter
	implements Partial<Prisma.DateTimeNullableFilter>
{
	@OptionalApiProperty({ type: Date })
	equals: string | Date;
	@OptionalApiProperty({ type: Date })
	in: string[] | Date[];
	@OptionalApiProperty({ type: Date, isArray: true })
	notIn: string[] | Date[];
	@OptionalApiProperty({ type: Date, isArray: true })
	lt: string | Date;
	@OptionalApiProperty({ type: Date })
	lte: string | Date;
	@OptionalApiProperty({ type: Date })
	gt: string | Date;
	@OptionalApiProperty({ type: Date })
	gte: string | Date;
	@OptionalApiProperty({
		oneOf: [
			{ type: 'string', format: 'date-time' },
			{ $ref: getSchemaPath(PrismaNestedDateTimeNullableFilter) },
		],
	})
	not: string | Date | PrismaNestedDateTimeNullableFilter;
	@OptionalApiProperty()
	isSet: boolean;
}
export class PrismaNestedStringFilter
	implements Partial<Prisma.NestedStringFilter>
{
	@OptionalApiProperty()
	equals?: string;
	@OptionalApiProperty({ isArray: true })
	in?: string[];
	@OptionalApiProperty({ isArray: true })
	notIn?: string[];
	@OptionalApiProperty()
	lt?: string;
	@OptionalApiProperty()
	lte?: string;
	@OptionalApiProperty()
	gt?: string;
	@OptionalApiProperty()
	gte?: string;
	@OptionalApiProperty()
	contains?: string;
	@OptionalApiProperty()
	startsWith?: string;
	@OptionalApiProperty()
	endsWith?: string;
	// @OptionalApiProperty()
	// mode?: Prisma.QueryMode;
	@OptionalApiProperty({
		oneOf: [
			{ type: 'string' },
			{ $ref: getSchemaPath(PrismaNestedStringFilter) },
		],
	})
	not?: string | PrismaNestedStringFilter;
}
@ApiExtraModels(PrismaNestedStringFilter)
export class PrismaStringFilter implements Partial<Prisma.StringFilter> {
	@OptionalApiProperty()
	equals?: string;
	@OptionalApiProperty({ isArray: true })
	in?: string[];
	@OptionalApiProperty({ isArray: true })
	notIn?: string[];
	@OptionalApiProperty()
	lt?: string;
	@OptionalApiProperty()
	lte?: string;
	@OptionalApiProperty()
	gt?: string;
	@OptionalApiProperty()
	gte?: string;
	@OptionalApiProperty()
	contains?: string;
	@OptionalApiProperty()
	startsWith?: string;
	@OptionalApiProperty()
	endsWith?: string;
	// @OptionalApiProperty()
	// mode?: Prisma.QueryMode;
	@OptionalApiProperty({
		oneOf: [
			{ type: 'string' },
			{ $ref: getSchemaPath(PrismaNestedStringFilter) },
		],
	})
	not?: string | PrismaNestedStringFilter;
}
