import { z } from "zod";

export const envSchema = z.object({
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
	PORT: z.coerce.number().default(3000),
	DATABASE_URL: z
		.url()
		.refine(
			(url) => url.startsWith("postgresql://") || url.startsWith("postgres://"),
			{
				message:
					"DATABASE_URL deve ser uma string de conexão válida do PostgreSQL.",
			},
		),
	JWT_SECRET: z
		.string()
		.min(
			32,
			"JWT_SECRET deve ser uma chave robusta de no mínimo 32 caracteres.",
		),
	FRONTEND_URL: z.url().default("http://10.0.2.2:3000"),
});

export type Env = z.infer<typeof envSchema>;
