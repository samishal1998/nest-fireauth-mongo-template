import { ApiProperty } from '@nestjs/swagger';
import { OptionalApiProperty } from 'src/openapi/decorators';

export class AddCustomAppsCategoryDto {
	@ApiProperty({})
	categoryId: string;
	@ApiProperty({})
	labels: Record<string, string>;
	@OptionalApiProperty({})
	index?: number;
}
