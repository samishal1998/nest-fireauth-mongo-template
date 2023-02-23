import { ApiProperty } from '@nestjs/swagger';
import { ControlledValue as PrismaControlledValue } from '@prisma/client';

export class ControlledValue implements PrismaControlledValue {
	@ApiProperty()
	value: string;
	@ApiProperty()
	enabled: boolean;
}
