import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import {
	ApiOkResponse,
	ApiOperation,
	ApiTags,
	ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { AuthService } from "./application/auth.service";
import { LoginDto } from "./application/dtos/login.dto";

@ApiTags("Autenticação")
@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post("login")
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: "Autenticar utilizador e emitir token de acesso" })
	@ApiOkResponse({
		description: "Login bem-sucedido. Retorna o token JWT e dados do perfil.",
		schema: {
			example: {
				access_token: "eyJhbGciOiJIUzI1NiIsInR5c...",
				user: {
					id: "123e4567-e89b-12d3-a456-426614174000",
					name: "João Silva",
					email: "joao.silva@email.com",
				},
			},
		},
	})
	@ApiUnauthorizedResponse({
		description:
			"Credenciais inválidas (email não encontrado ou palavra-passe incorreta).",
	})
	async login(@Body() dto: LoginDto) {
		return this.authService.login(dto);
	}
}
