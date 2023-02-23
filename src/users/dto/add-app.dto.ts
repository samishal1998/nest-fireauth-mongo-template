import { Options } from '@nestjs/common';
import {
	ApiExtraModels,
	ApiProperty,
	ApiPropertyOptions,
} from '@nestjs/swagger';
import { OptionalApiProperty } from 'src/openapi/decorators';

export class AddAppDto {
	@ApiProperty({})
	value: string;

	@OptionalApiProperty({})
	enabled?: boolean;
}
