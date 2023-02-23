import { ApiProperty } from '@nestjs/swagger';

export class LinkProductDto {
	@ApiProperty()
	productUuid: string;
}
