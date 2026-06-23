import { randomUUID } from "node:crypto";
import * as bcrypt from "bcrypt";

export interface UserProps {
	id?: string;
	email: string;
	name: string;
	password?: string;
	totalPoints?: number;
	targetWaterMl?: number;
	targetProteinGrams?: number;
}

export class User {
	private props: UserProps;

	constructor(props: UserProps) {
		this.props = {
			...props,
			id: props.id ?? randomUUID(),
			totalPoints: props.totalPoints ?? 0,
			targetWaterMl: props.targetWaterMl ?? 3000,
			targetProteinGrams: props.targetProteinGrams ?? 120,
		};
	}

	get id(): string | undefined {
		return this.props.id;
	}
	get email(): string {
		return this.props.email;
	}
	get name(): string {
		return this.props.name;
	}
	get password(): string | undefined {
		return this.props.password;
	}
	get totalPoints(): number {
		return this.props.totalPoints ?? 0;
	}
	get targetWaterMl(): number {
		return this.props.targetWaterMl ?? 3000;
	}
	get targetProteinGrams(): number {
		return this.props.targetProteinGrams ?? 120;
	}

	public async changePassword(newPassword: string): Promise<void> {
		if (!newPassword || newPassword.length < 8) {
			throw new Error("A palavra-passe deve conter pelo menos 8 caracteres.");
		}
		this.props.password = await bcrypt.hash(newPassword, 12);
	}

	public updatePoints(delta: number): void {
		const calculatedPoints = (this.props.totalPoints ?? 0) + delta;
		this.props.totalPoints = calculatedPoints < 0 ? 0 : calculatedPoints;
	}

	public updateTargets(waterMl: number, proteinG: number): void {
		if (waterMl < 500 || proteinG < 10) {
			throw new Error(
				"As metas diárias fornecidas estão abaixo dos limites saudáveis permitidos.",
			);
		}
		this.props.targetWaterMl = waterMl;
		this.props.targetProteinGrams = proteinG;
	}

	public getProps(): UserProps {
		return this.props;
	}
}
