import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { UserRepository } from "../domain/user.repository";
import { UpdateTargetsDto } from "./dtos/update-targets.dto";

@Injectable()
export class UpdateUserTargetsService {
	private readonly logger = new Logger(UpdateUserTargetsService.name);

	constructor(private readonly userRepository: UserRepository) {}

	async execute(userId: string, dto: UpdateTargetsDto): Promise<void> {
		this.logger.log(`A atualizar metas para o utilizador: ${userId}`);

		const user = await this.userRepository.findById(userId);

		if (!user) {
			this.logger.warn(
				`Tentativa de atualizar metas num perfil inexistente: ${userId}`,
			);
			throw new NotFoundException("Perfil de utilizador não encontrado.");
		}

		user.updateTargets(dto.targetWaterMl, dto.targetProteinGrams);

		await this.userRepository.save(user);

		this.logger.log(`Metas diárias atualizadas com sucesso para: ${userId}`);
	}
}
