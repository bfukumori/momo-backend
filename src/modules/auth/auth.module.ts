import { Env } from "@infra/env/env";
import { UserModule } from "@modules/users/users.module";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthService } from "./application/auth.service";
import { AuthController } from "./auth.controller";
import { JwtStrategy } from "./infrastructure/jwt.strategy";

@Module({
	imports: [
		PassportModule,
		UserModule,
		JwtModule.registerAsync({
			inject: [ConfigService],
			useFactory: (config: ConfigService<Env, true>) => ({
				secret: config.get("JWT_SECRET", { infer: true }),
				signOptions: { expiresIn: "1d" },
			}),
		}),
	],
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
