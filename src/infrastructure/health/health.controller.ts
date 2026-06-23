import { Controller, Get, HttpCode, HttpStatus, Res } from "@nestjs/common";
import { ApiOkResponse, ApiOperation } from "@nestjs/swagger";
import { SkipThrottle } from "@nestjs/throttler"; // 1. Importe o SkipThrottle se usar o ThrottlerModule
import { type Response } from "express";
import { PrismaService } from "../prisma/prisma.service";

interface HealthCache {
	lastCheck: number;
	error: string | null;
}

@Controller("health")
@SkipThrottle()
export class HealthController {
	private dbCache: HealthCache = { lastCheck: 0, error: null };
	private readonly CACHE_TTL_MS = 10000;

	constructor(private readonly prismaService: PrismaService) {}

	@Get()
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: "Health check" })
	@ApiOkResponse({
		description: "Verifica saúde do serviço",
	})
	async check(@Res() res: Response): Promise<void> {
		const now = Date.now();
		let dbError = this.dbCache.error;

		if (now - this.dbCache.lastCheck > this.CACHE_TTL_MS) {
			try {
				await this.prismaService.$queryRaw`SELECT 1`;
				this.dbCache = { lastCheck: now, error: null };
				dbError = null;
			} catch (error) {
				const errMsg = error instanceof Error ? error.message : "Unknown error";
				this.dbCache = { lastCheck: now, error: errMsg };
				dbError = errMsg;
			}
		}

		if (!dbError) {
			res.status(HttpStatus.OK).json({
				status: "ok",
				timestamp: new Date().toISOString(),
				services: {
					database: "up",
					api: "up",
				},
			});
		} else {
			res.status(HttpStatus.SERVICE_UNAVAILABLE).json({
				status: "down",
				timestamp: new Date().toISOString(),
				services: {
					database: "down",
					api: "up",
					error: dbError,
				},
			});
		}
	}
}
