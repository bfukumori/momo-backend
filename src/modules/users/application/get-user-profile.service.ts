import { DailyLogRepository } from "@modules/daily-logs/domain/daily-log.repository";
import { Injectable, NotFoundException } from "@nestjs/common";
import { UserRepository } from "../domain/user.repository";

@Injectable()
export class GetUserProfileService {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly dailyLogRepository: DailyLogRepository,
	) {}

	async execute(userId: string) {
		const user = await this.userRepository.findById(userId);

		if (!user) {
			throw new NotFoundException("Perfil de utilizador não encontrado.");
		}

		const todayStr = new Date().toISOString().split("T")[0];
		const todayDate = new Date(todayStr);
		const todayLog = await this.dailyLogRepository.findByDate(
			userId,
			todayDate,
		);

		return {
			id: user.id,
			name: user.name,
			email: user.email,
			totalPoints: user.totalPoints,
			targets: {
				waterMl: user.targetWaterMl,
				proteinGrams: user.targetProteinGrams,
			},
			todayProgress: {
				waterConsumedMl: todayLog ? todayLog.waterConsumedMl : 0,
				proteinConsumedG: todayLog ? todayLog.proteinConsumedG : 0,
			},
		};
	}
}
