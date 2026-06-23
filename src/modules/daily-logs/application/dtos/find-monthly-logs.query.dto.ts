import { Type } from "class-transformer";
import { IsInt, Max, Min } from "class-validator";

export class FindMonthlyLogsQueryDto {
	/**
	 * O ano para o qual deseja buscar os registos.
	 * @example 2026
	 */
	@Type(() => Number)
	@IsInt()
	@Min(2020)
	year!: number;

	/**
	 * O mês (1 a 12) para o qual deseja buscar os registos.
	 * @example 6
	 */
	@Type(() => Number)
	@IsInt()
	@Min(1)
	@Max(12)
	month!: number;
}
