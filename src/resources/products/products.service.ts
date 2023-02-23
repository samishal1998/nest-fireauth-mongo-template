import { Injectable, Inject } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Prisma } from '@prisma/client';
import { Connection } from 'mongoose';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ObjectId } from 'mongodb';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
	@Inject()
	private prisma: PrismaService;

	create(createProductDto: CreateProductDto): Promise<Product> {
		return this.prisma.product.upsert({
			where: {
				uuid: createProductDto.uuid,
			},
			create: createProductDto,
			update: {},
		});
	}

	async findAll() {
		return this.prisma.product.findMany();
	}

	findOne(id: string, include?: Prisma.ProductInclude) {
		return this.prisma.product.findUnique({
			where: { id },
			include,
		});
	}
	findByUuid(uuid: string, include?: Prisma.ProductInclude) {
		return this.prisma.product.findUnique({
			where: { uuid },
			include,
		});
	}
	findByQrUuid(qrUuid: string, include?: Prisma.ProductInclude) {
		return this.prisma.product.findUnique({
			where: { qrUuid },
			include,
		});
	}

	remove(id: string) {
		return this.prisma.product.delete({ where: { id } });
	}
}
