import { PrismaService } from "@infra/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { User } from "../domain/user.entity";
import { TargetGoals, UserRepository } from "../domain/user.repository";
import { UserMapper } from "./user.mapper";

@Injectable()
export class PrismaUserRepository implements UserRepository {
	constructor(private readonly prisma: PrismaService) {}

	async findByEmail(email: string): Promise<User | null> {
		const raw = await this.prisma.user.findUnique({
			where: { email },
		});
		return raw ? UserMapper.toDomain(raw) : null;
	}

	async findById(id: string): Promise<User | null> {
		const raw = await this.prisma.user.findUnique({
			where: { id },
		});
		return raw ? UserMapper.toDomain(raw) : null;
	}

	async findTargetsById(id: string): Promise<TargetGoals | null> {
		const raw = await this.prisma.user.findUnique({
			where: { id },
			select: { targetWaterMl: true, targetProteinGrams: true },
		});
		return raw
			? {
					targetWaterMl: raw.targetWaterMl,
					targetProteinGrams: raw.targetProteinGrams,
				}
			: null;
	}

	async save(user: User): Promise<void> {
		const data = UserMapper.toPersistence(user);

		await this.prisma.user.upsert({
			where: { email: data.email },
			update: data,
			create: data,
		});
	}

	async updatePoints(id: string, pointsDelta: number): Promise<void> {
		await this.prisma.user.update({
			where: { id },
			data: {
				totalPoints: {
					increment: pointsDelta,
				},
			},
		});
	}
}
