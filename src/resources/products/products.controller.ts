import {
	Body,
	Controller,
	Delete,
	Get,
	Inject,
	Param,
	Post,
	Req,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Connection as MongoConnection } from 'mongoose';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';

@ApiTags('products')
@Controller('products')
export class ProductsController {
	@Inject()
	private prisma: PrismaService;
	@InjectConnection()
	private connection: MongoConnection;
	constructor(private readonly productService: ProductsService) {}

	@Post()
	@ApiResponse({ type: Product })
	create(@Body() createProductDto: CreateProductDto): Promise<Product> {
		return this.productService.create(createProductDto);
	}

	@Get()
	@ApiResponse({ type: Product, isArray: true })
	findAll(@Req() request: Request & { product: any }) {
		console.log({ product: request.product });
		return this.productService.findAll();
	}

	@Get('uuid/:id/user')
	@ApiResponse({ type: Product })
	findOneByUuidIncludeUser(@Param('id') id: string) {
		return this.productService.findByUuid(id, { owner: true });
	}
	@Get('qr-uuid/:id/user')
	@ApiResponse({ type: Product })
	findOneByQrUuidIncludeUser(@Param('id') id: string) {
		return this.productService.findByQrUuid(id, { owner: true });
	}

	@Get(':id/user')
	@ApiResponse({ type: Product })
	findOneIncludeUser(@Param('id') id: string) {
		return this.productService.findOne(id, { owner: true });
	}

	@Get('qr-uuid/:id')
	@ApiResponse({ type: Product })
	findOneByQrUuid(@Param('id') id: string) {
		return this.productService.findByQrUuid(id);
	}
	@Get('uuid/:id')
	@ApiResponse({ type: Product })
	findOneByUuid(@Param('id') id: string) {
		return this.productService.findByUuid(id);
	}

	@Get(':id')
	@ApiResponse({ type: Product })
	findOne(@Param('id') id: string) {
		return this.productService.findOne(id);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.productService.remove(id);
	}
}
