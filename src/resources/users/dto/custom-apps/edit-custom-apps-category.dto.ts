import { Options } from '@nestjs/common';
import {
	ApiExtraModels,
	ApiProperty,
	ApiPropertyOptions,
} from '@nestjs/swagger';
import { OptionalApiProperty } from 'src/openapi/decorators';

export class EditCustomAppsCategoryDto {
	@ApiProperty({})
	categoryId: string;
	@OptionalApiProperty({})
	labels?: Record<string, string>;
	@OptionalApiProperty({})
	enabled?: boolean;
}
