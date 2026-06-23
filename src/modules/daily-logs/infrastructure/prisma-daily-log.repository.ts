import { PrismaService } from "@infra/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { DailyLog } from "../domain/daily-log.entity";
import { DailyLogRepository } from "../domain/daily-log.repository";
import { DailyLogMapper } from "./daily-log.mapper";

@Injectable()
export class PrismaDailyLogRepository implements DailyLogRepository {
	constructor(private prisma: PrismaService) {}

	async save(dailyLog: DailyLog): Promise<void> {
		const data = DailyLogMapper.toPersistence(dailyLog);

		await this.prisma.dailyLog.upsert({
			where: {
				userId_date: { userId: data.userId, date: data.date },
			},
			update: data,
			create: data,
		});
	}

	async findByDate(userId: string, date: Date): Promise<DailyLog | null> {
		const log = await this.prisma.dailyLog.findUnique({
			where: { userId_date: { userId, date } },
		});
		return log ? DailyLogMapper.toDomain(log) : null;
	}

	async findByMonth(
		userId: string,
		year: number,
		month: number,
	): Promise<DailyLog[]> {
		const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
		const endDate = new Date(Date.UTC(year, month, 1, 0, 0, 0));

		const logs = await this.prisma.dailyLog.findMany({
			where: {
				userId,
				date: {
					gte: startDate,
					lt: endDate,
				},
			},
			orderBy: {
				date: "asc",
			},
		});

		return logs.map(DailyLogMapper.toDomain);
	}
}
