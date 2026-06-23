import {
	IsBoolean,
	IsDateString,
	IsNumber,
	IsOptional,
	IsString,
	Max,
	Min,
} from "class-validator";

export class CreateDailyLogDto {
	/**
	 * A data referente ao registo diário no formato ISO8601 (Apenas a data ou com timezone completo).
	 * @example 2026-06-22
	 */
	@IsDateString(
		{},
		{ message: "A data deve estar num formato válido (ex: YYYY-MM-DD)." },
	)
	date!: string;

	/**
	 * O volume total de água consumido ao longo do dia, em mililitros (ml).
	 * @example 2500
	 */
	@IsNumber({}, { message: "O consumo de água deve ser um número válido." })
	@Min(0, { message: "O consumo de água não pode ser negativo." })
	@Max(15000, {
		message: "O consumo de água não pode exceder 15.000 ml por dia.",
	})
	waterConsumedMl!: number;

	/**
	 * A quantidade total de macronutrientes de proteína consumidos, em gramas (g).
	 * @example 150
	 */
	@IsNumber(
		{},
		{ message: "A quantidade de proteína deve ser um número válido." },
	)
	@Min(0, { message: "A proteína não pode ser negativa." })
	@Max(1000, { message: "A proteína não pode exceder 1.000 g por dia." })
	proteinConsumedG!: number;

	/**
	 * Nome da medicação tomada, caso aplicável para o dia.
	 * @example Vitamina C, Ômega 3
	 */
	@IsOptional()
	@IsString({ message: "O nome da medicação deve ser em formato de texto." })
	medication?: string;

	/**
	 * Indicador de controlo se o utilizador tomou a medicação agendada.
	 * @example true
	 */
	@IsBoolean({
		message: "A confirmação de medicação deve ser verdadeira ou falsa.",
	})
	tookMedication!: boolean;

	/**
	 * Indicador de controlo se o utilizador realizou atividade física/treino no dia.
	 * @example true
	 */
	@IsBoolean({
		message: "A confirmação de exercício deve ser verdadeira ou falsa.",
	})
	didExercise!: boolean;

	/**
	 * Registo de peso corporal medido no dia, em quilogramas (kg).
	 * @example 78.5
	 */
	@IsOptional()
	@IsNumber({}, { message: "O peso deve ser um número válido." })
	@Min(30, { message: "O peso mínimo registrável é de 30 kg." })
	@Max(600, { message: "O peso máximo registrável é de 600 kg." })
	weight?: number;

	/**
	 * Quaisquer efeitos secundários sentidos ou notas adicionais sobre a saúde no dia.
	 * @example Ligeira dor de cabeça de manhã.
	 */
	@IsOptional()
	@IsString({ message: "Os efeitos secundários devem ser descritos em texto." })
	sideEffects?: string;
}
