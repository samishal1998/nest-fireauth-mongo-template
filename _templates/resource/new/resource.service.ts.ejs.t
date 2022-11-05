---
to: src/<%=name%>/<%=name%>.service.ts
---
<% Name = h.capitalize(name) %>
import { Injectable, Inject } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Prisma } from '@prisma/client';
import { Connection } from 'mongoose';
import { PrismaService } from 'src/prisma/prisma.service';
import { Create<%=Name%>Dto } from './dto/create-<%=name%>.dto';
import { Update<%=Name%>Dto } from './dto/update-<%=name%>.dto';
import { ObjectId } from 'mongodb';

@Injectable()
export class <%=Name%>Service {
	@Inject()
	private prisma: PrismaService;

	create(create<%=Name%>Dto: Create<%=Name%>Dto) {
		return 'This action adds a new <%=Name%>';
	}

	async findAll() {
		return this.prisma.<%=name%>.findMany();
	}

	findOne(id: string, include?: Prisma.<%=Name%>Include) {
		return this.prisma.<%=name%>.findUnique({
			where: { id },
			include,
		});
	}

	update(id: string, update<%=Name%>Dto: Update<%=Name%>Dto) {
		return this.prisma.<%=name%>.update({
			where: { id },
			data: update<%=Name%>Dto,
		});
	}

	remove(id: string) {
		return this.prisma.<%=name%>.delete({ where: { id } });
	}
}
