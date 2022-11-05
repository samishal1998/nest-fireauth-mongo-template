import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserType } from '@prisma/client';
import { FirebaseAuthGuard } from '../guards/firebase-auth.guard';
import { RolesGuard } from '../guards/roles.guard';

export function Auth(...roles: UserType[]) {
	return applyDecorators(
		SetMetadata('roles', roles),
		ApiBearerAuth(),
		UseGuards(FirebaseAuthGuard, RolesGuard),
	);
}
