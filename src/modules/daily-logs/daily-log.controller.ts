import {
	type AuthenticatedUser,
	CurrentUser,
} from "@modules/auth/application/decorators/current-user.decorator";
import { JwtAuthGuard } from "@modules/auth/application/guards/jwt-auth.guard";
import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	Query,
	UseGuards,
} from "@nestjs/common";
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiCreatedResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
	ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { CreateDailyLogService } from "./application/create-daily-log.service";
import { CreateDailyLogDto } from "./application/dtos/create-daily-log.dto";
import { FindMonthlyLogsQueryDto } from "./application/dtos/find-monthly-logs.query.dto";
import { FindMonthlyLogsService } from "./application/find-monthly-logs.service";

@ApiTags("Registros Diários (Gamificação)")
@ApiBearerAuth()
@Controller("daily-logs")
@UseGuards(JwtAuthGuard)
export class DailyLogController {
	constructor(
		private readonly createDailyLogService: CreateDailyLogService,
		private readonly findMonthlyLogsService: FindMonthlyLogsService,
	) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({ summary: "Criar ou atualizar os hábitos e métricas do dia" })
	@ApiCreatedResponse({
		description:
			"Registo diário salvo com sucesso. Os pontos de gamificação foram recalculados e aplicados ao saldo do utilizador.",
	})
	@ApiBadRequestResponse({
		description:
			"Falha de validação. Os dados enviados não cumprem as regras do DTO (ex: excesso de água, formato de data inválido).",
	})
	@ApiUnauthorizedResponse({
		description: "O Token JWT está ausente, expirado ou inválido.",
	})
	async create(
		@Body() dto: CreateDailyLogDto,
		@CurrentUser() user: AuthenticatedUser,
	): Promise<void> {
		await this.createDailyLogService.execute(user.id, dto);
	}

	@Get()
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: "Listar o histórico de hábitos por mês e ano" })
	@ApiOkResponse({
		description: "Lista de registos recuperada em ordem cronológica.",
	})
	async findMonthly(
		@Query() query: FindMonthlyLogsQueryDto,
		@CurrentUser() user: AuthenticatedUser,
	) {
		return this.findMonthlyLogsService.execute(user.id, query);
	}
}
