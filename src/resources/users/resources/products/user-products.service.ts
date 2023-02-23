/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection as MongoConnection } from 'mongoose';
import { PrismaService } from 'src/prisma/prisma.service';
import { FirebaseService } from '../../../../firebase/firebase.service';
import { Product } from '../../../products/entities/product.entity';

const DEFAULT_CATEGORY_ID = 'default';
const DEFAULT_LABEL_ID = 'default';
@Injectable()
export class UserProductsService {
	
	@Inject()
	private prisma: PrismaService;
	@Inject()
	private firebase: FirebaseService;

	@InjectConnection()
	private connection: MongoConnection;

	//#region Product

	async linkProduct(uid: string, productUuid: string): Promise<Product> {
		const product = await this.prisma.product.findFirst({
			where: {
				OR: [
					{
						qrUuid: productUuid,
					},
					{
						uuid: productUuid,
					},
				],
			},
		});
		if (!product) {
			throw new HttpException('unknown-product', HttpStatus.NOT_FOUND);
		}
		if (product.ownerID == uid) {
			throw new HttpException(
				'product-already-registered',
				HttpStatus.NOT_ACCEPTABLE,
			);
		}
		if (product.ownerID) {
			throw new HttpException(
				'product-already-registered-to-another-user',
				HttpStatus.NOT_ACCEPTABLE,
			);
		}
		return await this.prisma.product.update({
			where: {
				id: product.id,
			},
			data: {
				owner: { connect: { id: uid } },
				activated: true,
			},
		});
	}

	async unlinkProduct(uid: string, productUuid: string): Promise<void> {
		await this.prisma.product.update({
			where: {
				uuid: productUuid,
			},
			data: {
				owner: { disconnect: true },
				activated: false,
			},
		});
	}

	//#endregion
}
