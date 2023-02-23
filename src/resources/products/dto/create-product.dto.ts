import { ApiProperty } from '@nestjs/swagger';
import { Prisma, ProductType } from '@prisma/client';

export class CreateProductDto implements Partial<Prisma.ProductCreateInput> {
	@ApiProperty()
	uuid: string;
	@ApiProperty()
	qrUuid: string;
	@ApiProperty({ enum: ProductType })
	type: ProductType;
}
