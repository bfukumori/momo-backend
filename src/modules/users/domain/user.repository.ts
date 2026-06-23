import { User } from "./user.entity";

export interface TargetGoals {
	targetWaterMl: number;
	targetProteinGrams: number;
}

export abstract class UserRepository {
	abstract findByEmail(email: string): Promise<User | null>;
	abstract findById(id: string): Promise<User | null>;
	abstract findTargetsById(id: string): Promise<TargetGoals | null>;
	abstract save(user: User): Promise<void>;
	abstract updatePoints(id: string, pointsDelta: number): Promise<void>;
}
