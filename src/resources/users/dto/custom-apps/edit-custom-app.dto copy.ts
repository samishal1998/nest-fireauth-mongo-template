import { ApiProperty } from '@nestjs/swagger';
import { OptionalApiProperty } from 'src/openapi/decorators';

export class EditCustomAppDto {
	@ApiProperty({})
	categoryId: string;
	@ApiProperty({})
	appId: string;

	@OptionalApiProperty({})
	value?: string;
	@OptionalApiProperty({})
	icon?: boolean;
	@OptionalApiProperty({})
	enabled?: boolean;
	@OptionalApiProperty({})
	labels?: Record<string, string>;
}
