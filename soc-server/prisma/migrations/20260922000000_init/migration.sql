CREATE TYPE "FonteAlerta" AS ENUM ('FIREWALL', 'SIEM', 'IDS', 'EDR', 'OUTRO');

CREATE TYPE "Severidade" AS ENUM ('BAIXA', 'MEDIA', 'ALTA', 'CRITICA');

CREATE TYPE "StatusIncidente" AS ENUM ('ALERTA', 'QUALIFICACAO', 'CONTENCAO', 'ERRADICACAO', 'POS_MORTEM');

CREATE TABLE "incidents" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "fonte_alerta" "FonteAlerta" NOT NULL DEFAULT 'SIEM',
    "ativo_afetado" TEXT NOT NULL,
    "analista" TEXT NOT NULL,
    "severidade" "Severidade" NOT NULL DEFAULT 'MEDIA',
    "status" "StatusIncidente" NOT NULL DEFAULT 'ALERTA',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "incidents_pkey" PRIMARY KEY ("id")
);
