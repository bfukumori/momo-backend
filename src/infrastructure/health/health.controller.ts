import { Controller, Get, HttpCode, HttpStatus, Res } from "@nestjs/common";
import { ApiOkResponse, ApiOperation } from "@nestjs/swagger";
import { type Response } from "express";
import { PrismaService } from "../prisma/prisma.service";

@Controller("health")
export class HealthController {
	constructor(private readonly prismaService: PrismaService) {}

	@Get()
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: "Health check" })
	@ApiOkResponse({
		description: "Verifica saúde do serviço",
	})
	async check(@Res() res: Response): Promise<void> {
		try {
			await this.prismaService.$queryRaw`SELECT 1`;

			res.status(HttpStatus.OK).json({
				status: "ok",
				timestamp: new Date().toISOString(),
				services: {
					database: "up",
					api: "up",
				},
			});
		} catch (error) {
			res.status(HttpStatus.SERVICE_UNAVAILABLE).json({
				status: "down",
				timestamp: new Date().toISOString(),
				services: {
					database: "down",
					api: "up",
					error: error instanceof Error ? error.message : "Unknown error",
				},
			});
		}
	}
}
