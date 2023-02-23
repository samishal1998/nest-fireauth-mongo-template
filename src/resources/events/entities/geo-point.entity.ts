import { ApiProperty } from '@nestjs/swagger';
import { GeoPoint as PrismaGeoPoint } from '@prisma/client';

export class GeoPoint implements PrismaGeoPoint {
	@ApiProperty()
	lat: number;
	@ApiProperty()
	lng: number;
}
