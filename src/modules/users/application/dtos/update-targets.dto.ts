import { IsNumber, Min } from "class-validator";

export class UpdateTargetsDto {
	/**
	 * Nova meta diária de consumo de água em mililitros (ml).
	 * @example 3500
	 */
	@IsNumber(
		{},
		{ message: "A meta de consumo de água deve ser um número válido." },
	)
	@Min(500, { message: "A meta de água mínima permitida é de 500ml." })
	targetWaterMl!: number;

	/**
	 * Nova meta diária de ingestão de proteínas em gramas (g).
	 * @example 150
	 */
	@IsNumber(
		{},
		{ message: "A meta de consumo de proteína deve ser um número válido." },
	)
	@Min(10, { message: "A meta de proteína mínima permitida é de 10g." })
	targetProteinGrams!: number;
}
