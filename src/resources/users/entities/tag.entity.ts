import { OptionalApiProperty } from 'src/openapi/decorators';

export class Tag {
	@OptionalApiProperty()
	name?: string;
	@OptionalApiProperty({ isArray: true, type: 'string' })
	ids?: string[];
}
