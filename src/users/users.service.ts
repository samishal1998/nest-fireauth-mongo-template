import { Injectable, Inject } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Prisma } from '@prisma/client';
import { Connection } from 'mongoose';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ObjectId } from 'mongodb';

@Injectable()
export class UsersService {
	@Inject()
	private prisma: PrismaService;
	// @InjectConnection() private connection: Connection;

	create(createUserDto: CreateUserDto) {
		return this.prisma.user.create({ data: createUserDto });
	}

	async findAll() {
		return this.prisma.user.findMany();
		// return (await this.connection
		// 	.collection('users')
		// 	.find({ _id: new ObjectId('6305898b48794f7979819a25') })
		// 	.toArray()) as any;
	}

	findOne(id: string, include?: Prisma.UserInclude) {
		return this.prisma.user.findUnique({
			where: { id },
			include,
		});
	}

	findOneByFirebaseUID(id: string, include?: Prisma.UserInclude) {
		return this.prisma.user.findUnique({
			where: { firebaseUID: id },
			include,
		});
	}

	update(id: string, updateUserDto: UpdateUserDto) {
		return this.prisma.user.update({
			where: { id },
			data: updateUserDto,
		});
	}

	remove(id: string) {
		return this.prisma.user.delete({ where: { id } });
	}
}
