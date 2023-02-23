import { Options } from '@nestjs/common';
import {
	ApiExtraModels,
	ApiProperty,
	ApiPropertyOptions,
} from '@nestjs/swagger';
import { Prisma, UserType } from '@prisma/client';
import { OptionalApiProperty } from 'src/openapi/decorators';

export class CreateUserDto implements Partial<Prisma.UserCreateInput> {
	@OptionalApiProperty({})
	id?: string;

	@OptionalApiProperty({ type: Date })
	createdAt?: string | Date;

	@ApiProperty()
	firebaseUID: string;

	@OptionalApiProperty({})
	email?: string;

	@OptionalApiProperty({})
	phone?: string;

	@OptionalApiProperty({})
	fullName?: string;

	@OptionalApiProperty({ enum: UserType })
	userType?: UserType;

	@OptionalApiProperty({ type: Date })
	birthday?: string | Date;
}

export class CreateUserWithImageDto {
	@OptionalApiProperty({})
	id?: string;

	@OptionalApiProperty({ type: Date })
	createdAt?: string | Date;

	@OptionalApiProperty()
	email?: string;

	@OptionalApiProperty()
	phone?: string;

	@OptionalApiProperty()
	firstName?: string;

	@OptionalApiProperty()
	lastName?: string;

	@ApiProperty()
	firebaseUID: string;

	@OptionalApiProperty()
	profileImage?: string;

	@OptionalApiProperty()
	languageCode?: string;

	@OptionalApiProperty()
	countryCode?: string;

	@ApiProperty({ enum: UserType })
	userType: UserType;

	@OptionalApiProperty({ type: Date })
	birthday?: string | Date;

	@OptionalApiProperty({ type: 'string', format: 'binary' })
	profileImageFile: any;
}
