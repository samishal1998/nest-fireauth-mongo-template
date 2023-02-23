import { ApiProperty } from '@nestjs/swagger';
import { OptionalApiProperty } from 'src/openapi/decorators';

export class AddCustomAppDto {
	@ApiProperty({})
	appId: string;
	@ApiProperty({})
	value: string;
	@OptionalApiProperty({})
	icon?: boolean;
	@OptionalApiProperty({})
	enabled?: boolean;
	@ApiProperty({})
	categoryId: string;
	@ApiProperty({})
	labels: Record<string, string>;
}
