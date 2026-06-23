import { envSchema } from "@infra/env/env";
import { HealthModule } from "@infra/health/health.module";
import { AuthModule } from "@modules/auth/auth.module";
import { DailyLogModule } from "@modules/daily-logs/daily-log.module";
import { UserModule } from "@modules/users/users.module";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";

@Module({
	imports: [
		ConfigModule.forRoot({
			validate: (env) => envSchema.parse(env),
			isGlobal: true,
		}),
		ThrottlerModule.forRoot({
			throttlers: [
				{
					ttl: 60000,
					limit: 10,
				},
			],
		}),
		HealthModule,
		UserModule,
		AuthModule,
		DailyLogModule,
	],
	providers: [
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard,
		},
	],
})
export class AppModule {}
