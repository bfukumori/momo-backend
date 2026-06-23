import { UserRepository } from "@modules/users/domain/user.repository";
import {
	Injectable,
	InternalServerErrorException,
	Logger,
	UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { LoginDto } from "./dtos/login.dto";

export interface JwtPayload {
	sub: string;
	email: string;
}

@Injectable()
export class AuthService {
	private readonly logger = new Logger(AuthService.name);

	constructor(
		private readonly userRepository: UserRepository,
		private readonly jwtService: JwtService,
	) {}

	async login(dto: LoginDto) {
		this.logger.log(`Tentativa de login para: ${dto.email}`);

		const user = await this.userRepository.findByEmail(dto.email);

		if (!user) {
			this.logger.warn(`Login falhou: Email não encontrado (${dto.email})`);
			throw new UnauthorizedException("Credenciais inválidas.");
		}

		const userId = user.id;
		const hashedPassword = user.password;

		if (!userId || !hashedPassword) {
			this.logger.error(
				`Inconsistência de dados: Utilizador recuperado sem ID ou Password. Email: ${dto.email}`,
			);

			throw new InternalServerErrorException(
				"Erro interno ao processar a autenticação.",
			);
		}

		const isPasswordValid = await bcrypt.compare(dto.password, user.password);

		if (!isPasswordValid) {
			this.logger.warn(`Login falhou: Palavra-passe incorreta (${dto.email})`);
			throw new UnauthorizedException("Credenciais inválidas.");
		}

		const payload: JwtPayload = { sub: userId, email: user.email };

		return {
			access_token: await this.jwtService.signAsync(payload),
			user: {
				id: userId,
				name: user.name,
				email: user.email,
			},
		};
	}
}
