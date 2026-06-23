import { Env } from "@infra/env/env";
import { UserRepository } from "@modules/users/domain/user.repository";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "../application/auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly userRepository: UserRepository,
		config: ConfigService<Env, true>,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: config.get("JWT_SECRET", { infer: true }),
		});
	}

	async validate(payload: JwtPayload) {
		const user = await this.userRepository.findById(payload.sub);

		if (!user?.id) {
			throw new UnauthorizedException(
				"Sessão inválida ou utilizador removido.",
			);
		}

		return {
			id: user.id,
			email: user.email,
			name: user.name,
		};
	}
}
