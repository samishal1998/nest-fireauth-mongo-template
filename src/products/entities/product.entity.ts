import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import {
	Product as PrismaProduct,
	Prisma,
	User as PrismaUser,
	UserType,
	ProductType,
} from '@prisma/client';
import { OptionalApiProperty } from 'src/openapi/decorators';
import { User } from '../../users/entities/user.entity';
import { DeepPartial } from 'src/helpers/deep-partial';

export class Product
	implements
		DeepPartial<
			PrismaProduct & {
				Owner: PrismaUser;
			}
		>
{
	@OptionalApiProperty()
	id?: string;
	@OptionalApiProperty()
	uuid?: string;
	@OptionalApiProperty({ enum: ProductType })
	type?: ProductType;
	@OptionalApiProperty()
	activated?: boolean;
	@OptionalApiProperty()
	ownerID?: string;
	@OptionalApiProperty({ type: () => User })
	owner?: User;
}
