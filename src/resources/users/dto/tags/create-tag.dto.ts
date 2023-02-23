import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Tag } from '../../entities/tag.entity';
export class CreateTagDto implements Tag {
	@ApiProperty()
	name: string;
	@ApiProperty()
	ids: string[];
}
