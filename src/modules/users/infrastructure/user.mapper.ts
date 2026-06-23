import { User as PrismaUser } from "@infra/prisma/generated/client";
import { User } from "../domain/user.entity";

export class UserMapper {
	static toDomain(raw: PrismaUser): User {
		return new User({
			id: raw.id,
			email: raw.email,
			name: raw.name,
			password: raw.password,
			totalPoints: raw.totalPoints,
			targetWaterMl: raw.targetWaterMl,
			targetProteinGrams: raw.targetProteinGrams,
		});
	}

	static toPersistence(
		entity: User,
	): Omit<PrismaUser, "createdAt" | "updatedAt"> {
		const props = entity.getProps();
		return {
			id: props.id!,
			email: props.email,
			name: props.name,
			password: props.password!,
			totalPoints: props.totalPoints!,
			targetWaterMl: props.targetWaterMl!,
			targetProteinGrams: props.targetProteinGrams!,
		};
	}
}
