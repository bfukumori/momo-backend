import { PrismaModule } from "@infra/prisma/prisma.module";
import { DailyLogModule } from "@modules/daily-logs/daily-log.module";
import { forwardRef, Module } from "@nestjs/common";
import { CreateUserService } from "./application/create-user.service";
import { GetUserProfileService } from "./application/get-user-profile.service";
import { UpdateUserTargetsService } from "./application/update-user-targets.service";
import { UserRepository } from "./domain/user.repository";
import { PrismaUserRepository } from "./infrastructure/prisma-user.repository";
import { UserController } from "./users.controller";

@Module({
	imports: [PrismaModule, forwardRef(() => DailyLogModule)],
	controllers: [UserController],
	providers: [
		CreateUserService,
		GetUserProfileService,
		UpdateUserTargetsService,
		{
			provide: UserRepository,
			useClass: PrismaUserRepository,
		},
	],
	exports: [UserRepository],
})
export class UserModule {}
