---
to: src/<%=names%>/<%=names%>.controller.ts
---

import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards,
	Req,
	UseInterceptors,
	UploadedFile,
} from '@nestjs/common';
import { <%=Names%>Service } from './<%=names%>.service';
import { Create<%=Name%>Dto } from './dto/create-<%=name%>.dto';
import { Update<%=Name%>Dto } from './dto/update-<%=name%>.dto';
import { FirebaseAuthGuard } from 'src/auth/guards/firebase-auth.guard';
import { Request } from 'express';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Prisma,UserType } from '@prisma/client';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@ApiTags('<%=names%>')
@Controller('<%=names%>')
export class <%=Names%>Controller {
	constructor(
		private readonly <%=names%>Service: <%=Names%>Service	) {}

	@Post()
	create(@Body() create<%=Name%>Dto: Create<%=Name%>Dto) {
		return this.<%=names%>Service.create(create<%=Name%>Dto);
	}


	@Get()
	@Auth(UserType.CUSTOMER)
	findAll(@Req() request: Request & { <%=name%>: any }) {
		console.log({ <%=name%>: request.<%=name%> });
		return this.<%=names%>Service.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.<%=names%>Service.findOne(id);
	}


	@Patch(':id')
	update(@Param('id') id: string, @Body() update<%=Name%>Dto: Update<%=Name%>Dto) {
		return this.<%=names%>Service.update(id, update<%=Name%>Dto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.<%=names%>Service.remove(id);
	}
}
