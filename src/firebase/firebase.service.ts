import { Global, Injectable } from '@nestjs/common';
import * as firebase from 'firebase-admin';
import { Messaging } from 'firebase-admin/messaging';


@Injectable()
export class FirebaseService {
	private _defaultApp: firebase.app.App;
	private _messaging: Messaging;

	get defaultApp() {
		return this._defaultApp;
	}
	get messaging() {
		return this._messaging;
	}

	constructor() {
		this._defaultApp = firebase.initializeApp({
			credential: firebase.credential.cert(
				JSON.parse(
					Buffer.from(process.env.SERVICE_ACCOUNT, 'base64').toString(
						'utf-8',
					),
				),
			),
		});
		this._messaging = this._defaultApp.messaging();
	}
}
