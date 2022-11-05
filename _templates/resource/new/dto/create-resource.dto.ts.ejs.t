---
to: src/<%=name%>/dto/create-<%=name%>.dto.ts
---
<% Name = h.capitalize(name) %>
import { Options } from '@nestjs/common';
import {
	ApiExtraModels,
	ApiProperty,
	ApiPropertyOptions,
} from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { OptionalApiProperty } from 'src/openapi/decorators';
import {
	PrismaGenericConnect,
	PrismaGenericConnectMany,
} from 'src/prisma/types';


export class Create<%=Name%>Dto implements Partial<Prisma.<%=Name%>CreateInput> {
	@OptionalApiProperty({})
	id?: string;

	@OptionalApiProperty({ type: Date })
	createdAt?: string | Date;


	@ApiProperty({ enum: <%=Name%>Type })
	<%=name%>Type: <%=Name%>Type;

}
