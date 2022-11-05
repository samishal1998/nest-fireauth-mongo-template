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
