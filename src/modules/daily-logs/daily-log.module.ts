import { PrismaModule } from "@infra/prisma/prisma.module";
import { UserModule } from "@modules/users/users.module";
import { forwardRef, Module } from "@nestjs/common";
import { CreateDailyLogService } from "./application/create-daily-log.service";
import { FindMonthlyLogsService } from "./application/find-monthly-logs.service";
import { DailyLogController } from "./daily-log.controller";
import { DailyLogRepository } from "./domain/daily-log.repository";
import { PrismaDailyLogRepository } from "./infrastructure/prisma-daily-log.repository";

@Module({
	imports: [PrismaModule, forwardRef(() => UserModule)],
	controllers: [DailyLogController],
	providers: [
		CreateDailyLogService,
		FindMonthlyLogsService,
		{
			provide: DailyLogRepository,
			useClass: PrismaDailyLogRepository,
		},
	],
	exports: [DailyLogRepository],
})
export class DailyLogModule {}
