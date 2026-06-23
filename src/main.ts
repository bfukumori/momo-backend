import { Env } from "@infra/env/env";
import { Logger, ValidationPipe, VersioningType } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import helmet from "helmet";
import { AppModule } from "./app.module";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const logger = new Logger("Bootstrap");

	const configService = app.get<ConfigService<Env, true>>(ConfigService);

	app.use(helmet());

	app.enableCors({
		origin: true,
		methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	});

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
			stopAtFirstError: true,
		}),
	);

	app.enableVersioning({
		defaultVersion: "1",
		type: VersioningType.URI,
	});

	app.setGlobalPrefix("api");

	const config = new DocumentBuilder()
		.setTitle("Momo API")
		.setDescription("The Momo API for Momo App")
		.setVersion("1.0")
		.addBearerAuth()
		.build();
	const documentFactory = () => SwaggerModule.createDocument(app, config);
	SwaggerModule.setup("api/docs", app, documentFactory);

	const port = configService.get("PORT", { infer: true });
	await app.listen(port);

	logger.log(`🚀 Aplicação rodando na porta: ${port}`);
}
bootstrap();
