import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateUserDto {
	/**
	 * O nome completo ou de exibição do utilizador.
	 * @example João Silva
	 */
	@IsString({ message: "O nome deve ser em formato de texto." })
	@IsNotEmpty({ message: "O nome é obrigatório." })
	name!: string;

	/**
	 * Endereço de email válido que servirá como credencial de acesso.
	 * @example joao.silva@email.com
	 */
	@IsEmail({}, { message: "Forneça um endereço de email válido." })
	email!: string;

	/**
	 * A palavra-passe para autenticação. Deve ser forte e segura.
	 * @example SenhaSuperForte123!
	 */
	@IsString({ message: "A palavra-passe deve ser em formato de texto." })
	@MinLength(8, { message: "A palavra-passe deve ter no mínimo 8 caracteres." })
	password!: string;
}
