import { DailyLog } from "./daily-log.entity";

export abstract class DailyLogRepository {
	abstract save(dailyLog: DailyLog): Promise<void>;
	abstract findByDate(userId: string, date: Date): Promise<DailyLog | null>;
	abstract findByMonth(
		userId: string,
		year: number,
		month: number,
	): Promise<DailyLog[]>;
}
