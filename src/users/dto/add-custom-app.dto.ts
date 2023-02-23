import { Options } from '@nestjs/common';
import {
	ApiExtraModels,
	ApiProperty,
	ApiPropertyOptions,
} from '@nestjs/swagger';
import { OptionalApiProperty } from 'src/openapi/decorators';

export class AddCustomAppDto {
	@ApiProperty({})
	name: string;
	@ApiProperty({})
	value: string;
	@OptionalApiProperty({})
	icon: boolean;
}
