import {
	BadRequestException,
	Injectable,
	Logger,
	NotFoundException,
} from "@nestjs/common";
import { UserRepository } from "../../users/domain/user.repository";
import { DailyLog } from "../domain/daily-log.entity";
import { DailyLogRepository } from "../domain/daily-log.repository";
import { CreateDailyLogDto } from "./dtos/create-daily-log.dto";

@Injectable()
export class CreateDailyLogService {
	private readonly logger = new Logger(CreateDailyLogService.name);

	constructor(
		private readonly dailyLogRepository: DailyLogRepository,
		private readonly userRepository: UserRepository,
	) {}

	async execute(userId: string, dto: CreateDailyLogDto): Promise<void> {
		this.logger.log(
			`Iniciando registro diário para o usuário: ${userId} na data: ${dto.date}`,
		);

		const parsedDate = this.parseAndValidateDate(dto.date);

		const userTargets = await this.userRepository.findTargetsById(userId);
		if (!userTargets) {
			this.logger.warn(`Usuário não encontrado ou inativo: ${userId}`);
			throw new NotFoundException("Usuário não encontrado ou inativo.");
		}

		const existingLog = await this.dailyLogRepository.findByDate(
			userId,
			parsedDate,
		);
		const previousPoints = existingLog ? existingLog.pointsEarned : 0;

		const dailyLog = new DailyLog({
			id: existingLog?.id,
			userId,
			...dto,
			date: parsedDate,
		});

		dailyLog.calculateGamificationPoints(
			userTargets.targetWaterMl,
			userTargets.targetProteinGrams,
		);

		const currentPoints = dailyLog.pointsEarned;
		const pointsDelta = currentPoints - previousPoints;

		await this.dailyLogRepository.save(dailyLog);

		if (pointsDelta !== 0) {
			this.logger.log(
				`Atualizando saldo do usuário ${userId}. Delta: ${pointsDelta} pontos.`,
			);
			await this.userRepository.updatePoints(userId, pointsDelta);
		}

		this.logger.log(
			`Registro diário salvo com sucesso para o usuário: ${userId}`,
		);
	}

	private parseAndValidateDate(dateString: string): Date {
		const parsedDate = new Date(dateString);

		if (Number.isNaN(parsedDate.getTime())) {
			throw new BadRequestException(
				"Formato de data inválido. Utilize o padrão ISO8601 (ex: YYYY-MM-DD).",
			);
		}

		parsedDate.setUTCHours(0, 0, 0, 0);

		return parsedDate;
	}
}
