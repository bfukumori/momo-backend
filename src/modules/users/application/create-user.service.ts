import { ConflictException, Injectable, Logger } from "@nestjs/common";
import { User } from "../domain/user.entity";
import { UserRepository } from "../domain/user.repository";
import { CreateUserDto } from "./dtos/create-user.dto";

@Injectable()
export class CreateUserService {
	private readonly logger = new Logger(CreateUserService.name);

	constructor(private readonly userRepository: UserRepository) {}

	async execute(dto: CreateUserDto) {
		this.logger.log(`A processar a criação de utilizador: ${dto.email}`);

		const existingUser = await this.userRepository.findByEmail(dto.email);

		if (existingUser) {
			this.logger.warn(
				`Tentativa de registro duplicado para o email: ${dto.email}`,
			);
			throw new ConflictException(
				"Este endereço de email já se encontra registrado.",
			);
		}

		const user = new User({
			name: dto.name,
			email: dto.email,
		});

		await user.changePassword(dto.password);

		await this.userRepository.save(user);

		this.logger.log(`Utilizador criado com sucesso: ${user.email}`);

		return {
			id: user.id,
			name: user.name,
			email: user.email,
		};
	}
}
