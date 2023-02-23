import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Tag } from '../../entities/tag.entity';
export class UpdateTagDto implements Tag {
	@ApiProperty()
	originalName: string;
	@ApiProperty()
	name: string;
	@ApiProperty()
	ids: string[];
}
