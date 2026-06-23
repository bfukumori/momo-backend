import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
	/**
	 * O endereço de email registado na conta do utilizador.
	 * @example joao.silva@email.com
	 */
	@IsEmail({}, { message: "Email inválido." })
	email!: string;

	/**
	 * A palavra-passe secreta da conta.
	 * @example SenhaSuperForte123!
	 */
	@IsString({ message: "A palavra-passe tem de ser um texto válido." })
	@IsNotEmpty({ message: "A palavra-passe é obrigatória." })
	password!: string;
}
