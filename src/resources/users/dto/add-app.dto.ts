import { ApiProperty } from '@nestjs/swagger';
import { OptionalApiProperty } from 'src/openapi/decorators';

export class AddAppDto {
	@ApiProperty({})
	value: string;

	@OptionalApiProperty({})
	enabled?: boolean;

	@OptionalApiProperty({ type: 'object' })
	labels?: any;
}
