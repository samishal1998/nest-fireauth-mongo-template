import { ApiProperty } from '@nestjs/swagger';
import Prisma, { FlagReportState, UserFlagReport } from '@prisma/client';
import { OptionalApiProperty } from 'src/openapi/decorators';
import { DeepPartial } from '../../../helpers/deep-partial';

export class ReportUserDto implements DeepPartial<UserFlagReport> {
	@ApiProperty()
	title: string;
	@ApiProperty()
	description: string;
	@ApiProperty()
	reportingUserId: string;
	@ApiProperty()
	reportedUserId: string;
	@OptionalApiProperty({
		enum: FlagReportState,
		enumName: 'FlagReportState',
	})
	state?: Prisma.FlagReportState;
}
