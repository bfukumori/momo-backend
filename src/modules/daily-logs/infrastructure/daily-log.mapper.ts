import { DailyLog as PrismaDailyLog } from "@infra/prisma/generated/client";
import { DailyLog } from "../domain/daily-log.entity";

export class DailyLogMapper {
	static toDomain(raw: PrismaDailyLog): DailyLog {
		return new DailyLog({
			id: raw.id,
			userId: raw.userId,
			date: raw.date,
			waterConsumedMl: raw.waterConsumedMl,
			proteinConsumedG: raw.proteinConsumedG,
			medication: raw.medication,
			tookMedication: raw.tookMedication,
			didExercise: raw.didExercise,
			weight: raw.weight,
			bodyFatPercentage: raw.bodyFatPercentage,
			muscleMass: raw.muscleMass,
			sideEffects: raw.sideEffects,
			pointsEarned: raw.pointsEarned,
		});
	}

	static toPersistence(
		entity: DailyLog,
	): Omit<PrismaDailyLog, "createdAt" | "updatedAt"> {
		const props = entity.getProps();
		return {
			id: props.id!,
			userId: props.userId,
			date: props.date,
			waterConsumedMl: props.waterConsumedMl,
			proteinConsumedG: props.proteinConsumedG,
			medication: props.medication ?? null,
			tookMedication: props.tookMedication,
			didExercise: props.didExercise,
			weight: props.weight ?? null,
			bodyFatPercentage: props.bodyFatPercentage ?? null,
			muscleMass: props.muscleMass ?? null,
			sideEffects: props.sideEffects ?? null,
			pointsEarned: props.pointsEarned!,
		};
	}
}
