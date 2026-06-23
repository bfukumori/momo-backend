import {
	type AuthenticatedUser,
	CurrentUser,
} from "@modules/auth/application/decorators/current-user.decorator";
import { JwtAuthGuard } from "@modules/auth/application/guards/jwt-auth.guard";
import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Patch,
	Post,
	UseGuards,
} from "@nestjs/common";
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiConflictResponse,
	ApiCreatedResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
} from "@nestjs/swagger";
import { CreateUserService } from "./application/create-user.service";
import { CreateUserDto } from "./application/dtos/create-user.dto";
import { UpdateTargetsDto } from "./application/dtos/update-targets.dto";
import { GetUserProfileService } from "./application/get-user-profile.service";
import { UpdateUserTargetsService } from "./application/update-user-targets.service";

@ApiTags("Usuários")
@Controller("users")
export class UserController {
	constructor(
		private readonly createUserService: CreateUserService,
		private readonly getUserProfileService: GetUserProfileService,
		private readonly updateUserTargetsService: UpdateUserTargetsService,
	) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({ summary: "Registar uma nova conta de utilizador" })
	@ApiCreatedResponse({
		description: "Utilizador criado com sucesso.",
		schema: {
			example: {
				id: "123e4567-e89b-12d3-a456-426614174000",
				name: "João Silva",
				email: "joao.silva@email.com",
			},
		},
	})
	@ApiConflictResponse({
		description:
			"Conflito de dados. Este endereço de email já se encontra registado na plataforma.",
	})
	@ApiBadRequestResponse({
		description:
			"A validação falhou (ex: palavra-passe fraca, email mal formatado).",
	})
	async create(@Body() dto: CreateUserDto) {
		return this.createUserService.execute(dto);
	}

	@Get("me")
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: "Obter o perfil e a pontuação atual do utilizador autenticado",
	})
	@ApiOkResponse({
		description: "Perfil recuperado com sucesso.",
		schema: {
			example: {
				id: "uuid",
				name: "Bruno",
				totalPoints: 1500,
				targets: { waterMl: 2500, proteinGrams: 120 },
				todayProgress: { waterConsumedMl: 500, proteinConsumedG: 30 },
			},
		},
	})
	async getProfile(@CurrentUser() user: AuthenticatedUser) {
		return this.getUserProfileService.execute(user.id);
	}

	@Patch("me/targets")
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: "Atualizar as metas diárias (Água e Proteína)" })
	@ApiOkResponse({
		description: "As metas foram validadas e atualizadas no sistema.",
	})
	@ApiBadRequestResponse({
		description:
			"Os valores submetidos não cumprem os limites de saúde biológica mínima permitida.",
	})
	async updateTargets(
		@Body() dto: UpdateTargetsDto,
		@CurrentUser() user: AuthenticatedUser,
	): Promise<void> {
		await this.updateUserTargetsService.execute(user.id, dto);
	}
}
