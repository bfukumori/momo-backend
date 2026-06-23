# Momo Backend API

API robusta e escalável desenvolvida para dar suporte ao ecossistema do **momo-app**. Construída com foco em tipagem estrita, performance e princípios de Clean Architecture.

> **Autor:** Bruno Fukumori  
> **Versão:** 1.0.0  
> **Licença:** MIT

---

## 🛠️ Stack Tecnológica e Ferramentas

O projeto utiliza um ecossistema moderno focado em TypeScript e alta performance:

* **Framework Core:** [NestJS](https://nestjs.com/) (v11)
* **Linguagem:** TypeScript (v6)
* **Banco de Dados & ORM:** PostgreSQL operando via [Prisma ORM](https://www.prisma.io/) (v7.8) com `@prisma/adapter-pg` para otimização nativa.
* **Validação de Dados:** Schema parsing rigoroso com Zod.
* **Linting & Formatação:** [Biome](https://biomejs.dev/) (Substituindo ESLint + Prettier por performance).
* **Segurança:** Autenticação via JWT (`@nestjs/jwt` + `passport`), Hash de senhas com `bcrypt`, Proteção de Headers com `helmet` e Rate Limiting com `@nestjs/throttler`.

---

## 🏗️ Requisitos do Sistema

Para rodar este projeto, você precisará de:

* **Node.js:** v24 ou superior (Recomendado o uso via nvm/fnm)
* **Gerenciador de Pacotes:** `pnpm` (Corepack habilitado recomendado)
* **Infraestrutura:** Docker e Docker Compose

---

## 🔐 Variáveis de Ambiente (.env)

A aplicação aplica o princípio *Fail-Fast*. Se as variáveis obrigatórias não estiverem presentes ou estiverem mal formatadas, o NestJS abortará a inicialização.

> **⚠️ AVISO CRÍTICO - URL ENCODING:** > O Prisma exige que caracteres especiais na senha (como `=`, `+`, `@`) sejam convertidos em https://www.encoding.com/(https://www.w3schools.com/tags/ref_urlencode.ASP) **apenas** dentro da variável `DATABASE_URL`.
> Exemplo: Se sua senha termina com `=`, na string de conexão ela deve ser `%3D`.

**Exemplo de `.env` para Servidor de Produção:**
```env
JWT_SECRET="sua_chave_secreta_base64_ou_hash"

# 1. Credenciais literais lidas pelo serviço do PostgreSQL
POSTGRES_USER="momo_user"
POSTGRES_PASSWORD="sua_senha_com_caracteres_especiais="
POSTGRES_DB="momo_db"

# 2. String de conexão lida pela API
# Host: "postgres-db" (Comunicação via rede interna do Docker)
DATABASE_URL="postgresql://momo_user:sua_senha_com_caracteres_especiais%3D@postgres-db:5432/momo_db?schema=public"