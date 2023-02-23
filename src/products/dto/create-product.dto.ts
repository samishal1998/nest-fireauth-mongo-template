import { Options } from '@nestjs/common';
import {
	ApiExtraModels,
	ApiProperty,
	ApiPropertyOptions,
} from '@nestjs/swagger';
import { Prisma, ProductType } from '@prisma/client';
import { OptionalApiProperty } from 'src/openapi/decorators';
import {
	PrismaGenericConnect,
	PrismaGenericConnectMany,
} from 'src/prisma/types';

export class CreateProductDto implements Partial<Prisma.ProductCreateInput> {
	@ApiProperty()
	uuid: string;
	@ApiProperty({ enum: ProductType })
	type: ProductType;
}
