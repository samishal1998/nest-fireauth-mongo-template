import { PartialType } from '@nestjs/swagger';
import { Prisma, UserType } from '@prisma/client';
import { OptionalApiProperty } from 'src/openapi/decorators';
import { ControlledValue } from '../entities/controlled-value.entity';
export class UpdateUserDto implements Prisma.UserUpdateInput {
	@OptionalApiProperty({ type: Date })
	createdAt?: Date | string;

	@OptionalApiProperty()
	firebaseUID?: string;

	@OptionalApiProperty()
	fullName?: string;

	@OptionalApiProperty()
	username?: string;
	@OptionalApiProperty()
	title: string;

	@OptionalApiProperty()
	bio: string;

	@OptionalApiProperty()
	primaryEmailEnabled?: boolean;

	@OptionalApiProperty()
	primaryEmail?: string;

	@OptionalApiProperty()
	primaryPhoneEnabled?: boolean;

	@OptionalApiProperty()
	primaryPhone?: string;

	@OptionalApiProperty({ type: ControlledValue, isArray: true })
	emails?: ControlledValue[];

	@OptionalApiProperty({ type: ControlledValue, isArray: true })
	phones?: ControlledValue[];

	@OptionalApiProperty({ enum: UserType })
	userType?: UserType;

	@OptionalApiProperty({ type: Date })
	birthday?: Date | string;
}
