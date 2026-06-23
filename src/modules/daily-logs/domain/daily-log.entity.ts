export interface DailyLogProps {
	id?: string;
	userId: string;
	date: Date;
	waterConsumedMl: number;
	proteinConsumedG: number;
	medication?: string | null;
	tookMedication: boolean;
	didExercise: boolean;
	weight?: number | null;
	bodyFatPercentage?: number | null;
	muscleMass?: number | null;
	sideEffects?: string | null;
	pointsEarned?: number;
}

export class DailyLog {
	private props: DailyLogProps;

	constructor(props: DailyLogProps) {
		this.props = {
			...props,
			pointsEarned: props.pointsEarned ?? 0,
		};
	}

	get id(): string | undefined {
		return this.props.id;
	}
	get userId(): string {
		return this.props.userId;
	}
	get date(): Date {
		return this.props.date;
	}

	get waterConsumedMl(): number {
		return this.props.waterConsumedMl;
	}
	get proteinConsumedG(): number {
		return this.props.proteinConsumedG;
	}
	get tookMedication(): boolean {
		return this.props.tookMedication;
	}
	get didExercise(): boolean {
		return this.props.didExercise;
	}

	get medication(): string | null | undefined {
		return this.props.medication;
	}
	get weight(): number | null | undefined {
		return this.props.weight;
	}
	get bodyFatPercentage(): number | null | undefined {
		return this.props.bodyFatPercentage;
	}
	get muscleMass(): number | null | undefined {
		return this.props.muscleMass;
	}
	get sideEffects(): string | null | undefined {
		return this.props.sideEffects;
	}

	get pointsEarned(): number {
		return this.props.pointsEarned ?? 0;
	}

	public calculateGamificationPoints(
		targetWaterMl: number,
		targetProteinGrams: number,
	): void {
		let points = 0;

		if (this.props.tookMedication) points += 50;
		if (this.props.didExercise) points += 30;

		const hitWaterTarget = this.props.waterConsumedMl >= targetWaterMl;
		const hitProteinTarget = this.props.proteinConsumedG >= targetProteinGrams;

		if (hitWaterTarget) points += 10;
		if (hitProteinTarget) points += 10;

		this.props.pointsEarned = points;
	}

	public getProps(): DailyLogProps {
		return this.props;
	}
}
