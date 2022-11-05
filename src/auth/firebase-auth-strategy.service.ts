import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import {
	Strategy as FirebaseJwtStrategy,
	ExtractJwt,
} from 'passport-firebase-jwt';
import * as firebase from 'firebase-admin';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FirebaseAuthStrategy extends PassportStrategy(
	FirebaseJwtStrategy,
) {
	private defaultApp: firebase.app.App;

	constructor(private prisma: PrismaService) {
		super({
			jwtFromRequest: (request) => {
				return (
					request.handshake?.headers ?? request.headers
				)?.authorization?.split(/\s/)[1];
				//ExtractJwt.fromAuthHeaderAsBearerToken
			},
		});
		this.defaultApp = firebase.initializeApp({
			credential: firebase.credential.cert(
				JSON.parse(
					Buffer.from(process.env.SERVICE_ACCOUNT, 'base64').toString(
						'utf-8',
					),
				),
			),
		});
	}

	async validate(token: string) {
		const firebaseUser: any = await this.defaultApp
			.auth()
			.verifyIdToken(token, true)
			.catch((err) => {
				// console.log(err);
				throw new UnauthorizedException(err.message);
			});
		if (!firebaseUser) {
			throw new UnauthorizedException();
		}
		const user = await this.prisma.user
			.findUnique({
				where: { firebaseUID: firebaseUser.uid },
			})
			.catch((err) => {
				console.log(err);
				throw new UnauthorizedException(err.message);
			});

		return { user, firebaseUser };
	}
}
