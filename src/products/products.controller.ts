import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Req,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';

@ApiTags('products')
@Controller('products')
export class ProductsController {
	constructor(private readonly productService: ProductsService) {}

	@Post()
	@ApiResponse({ type: Product })
	create(@Body() createProductDto: CreateProductDto): Promise<Product> {
		return this.productService.create(createProductDto);
	}

	@Get()
	findAll(@Req() request: Request & { product: any }) {
		console.log({ product: request.product });
		return this.productService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.productService.findOne(id);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.productService.remove(id);
	}
}
