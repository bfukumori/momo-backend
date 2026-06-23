import { Injectable } from "@nestjs/common";
import { DailyLogRepository } from "../domain/daily-log.repository";
import { FindMonthlyLogsQueryDto } from "./dtos/find-monthly-logs.query.dto";

@Injectable()
export class FindMonthlyLogsService {
	constructor(private readonly dailyLogRepository: DailyLogRepository) {}

	async execute(userId: string, query: FindMonthlyLogsQueryDto) {
		const logs = await this.dailyLogRepository.findByMonth(
			userId,
			query.year,
			query.month,
		);

		return logs.map((log) => {
			const props = log.getProps();
			return {
				id: props.id,
				date: props.date.toISOString().split("T")[0],
				waterConsumedMl: props.waterConsumedMl,
				proteinConsumedG: props.proteinConsumedG,
				didExercise: props.didExercise,
				tookMedication: props.tookMedication,
				pointsEarned: props.pointsEarned,
			};
		});
	}
}
