import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';

export const OptionalApiProperty = (
	options?: Omit<ApiPropertyOptions, 'required'>,
) => ApiProperty({ ...(options ?? {}), required: false });

export const DateApiProperty = (options?: Omit<ApiPropertyOptions, 'type'>) =>
	ApiProperty({ ...(options ?? {}), type: Date });

export const OptionalDateApiProperty = (
	options?: Omit<ApiPropertyOptions, 'required' | 'type'>,
) => ApiProperty({ ...(options ?? {}), type: Date, required: false });
