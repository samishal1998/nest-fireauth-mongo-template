import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';
import {
	SwaggerModule,
	DocumentBuilder,
	SwaggerDocumentOptions,
	SwaggerCustomOptions,
} from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';

const OPENAPI_SPEC_FILENAME = 'knot_open_api_spec.json';
async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule, {
		cors: { origin: '*' },
	});
	const prismaService = app.get(PrismaService);
	await prismaService.enableShutdownHooks(app);
	const { httpAdapter } = app.get(HttpAdapterHost);
	app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));
	if (process.env.NODE_ENV != 'production') openApi(app);

	mvc(app);

	await app.listen(3000);
}

function mvc(app: NestExpressApplication) {
	app.useStaticAssets(join(__dirname, '..', 'mvc', 'public'));
	app.setBaseViewsDir(join(__dirname, '..', 'mvc', 'views'));
	app.setViewEngine('ejs');
}

function openApi(app: NestExpressApplication) {
	const config = new DocumentBuilder()
		.setTitle('API')
		.setDescription('API DOCS')
		.setVersion('1.0')
		.addBearerAuth({
			type: 'http',
			bearerFormat: 'JWT',
		})
		.addServer('http://localhost:3000')
		.build();
	const options: SwaggerDocumentOptions = {
		operationIdFactory: (controllerKey: string, methodKey: string) =>
			(process.env.dev ? controllerKey + '_' : '') + methodKey,
	};
	const document = SwaggerModule.createDocument(app, config, options);
	if (process.env.dev) {
		console.log(
			'Swagger:: writing to file: ' +
				join(process.cwd(), OPENAPI_SPEC_FILENAME),
		);
		writeFileSync(
			join(process.cwd(), OPENAPI_SPEC_FILENAME),
			JSON.stringify(
				document,
				// (key, value) => {
				// 	if (key === 'operationId') {
				// 		// return value.replace(/Controller_/, '');
				// 		// return value.replace(/\w+Controller_/, '');
				// 	}
				// 	return value;
				// }
				null,
				4,
			),
		);
	}

	const setupOptions: SwaggerCustomOptions = {
		// explorer: true,
		customSiteTitle: 'Moqawlaty API',
	};
	SwaggerModule.setup('api/docs', app, document, setupOptions);
}

bootstrap();
