-- AlterTable
ALTER TABLE "incidents" ADD COLUMN     "closed_at" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "historico_status" (
    "id" TEXT NOT NULL,
    "incident_id" TEXT NOT NULL,
    "acao" TEXT NOT NULL DEFAULT 'TRANSICAO',
    "estado_anterior" "StatusIncidente" NOT NULL,
    "novo_estado" "StatusIncidente" NOT NULL,
    "severidade_anterior" "Severidade",
    "severidade_nova" "Severidade",
    "autor_id" TEXT NOT NULL,
    "justificativa" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "historico_status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_mortems" (
    "id" TEXT NOT NULL,
    "incident_id" TEXT NOT NULL,
    "causa_raiz" TEXT NOT NULL,
    "linha_do_tempo" TEXT NOT NULL,
    "licoes_aprendidas" TEXT NOT NULL,
    "acoes_corretivas" TEXT NOT NULL,
    "autor_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "post_mortems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "acoes_contencao" (
    "id" TEXT NOT NULL,
    "incident_id" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "autor_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "acoes_contencao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "historico_status_incident_id_idx" ON "historico_status"("incident_id");

-- CreateIndex
CREATE UNIQUE INDEX "post_mortems_incident_id_key" ON "post_mortems"("incident_id");

-- CreateIndex
CREATE INDEX "acoes_contencao_incident_id_idx" ON "acoes_contencao"("incident_id");

-- AddForeignKey
ALTER TABLE "historico_status" ADD CONSTRAINT "historico_status_incident_id_fkey" FOREIGN KEY ("incident_id") REFERENCES "incidents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historico_status" ADD CONSTRAINT "historico_status_autor_id_fkey" FOREIGN KEY ("autor_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_mortems" ADD CONSTRAINT "post_mortems_incident_id_fkey" FOREIGN KEY ("incident_id") REFERENCES "incidents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_mortems" ADD CONSTRAINT "post_mortems_autor_id_fkey" FOREIGN KEY ("autor_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acoes_contencao" ADD CONSTRAINT "acoes_contencao_incident_id_fkey" FOREIGN KEY ("incident_id") REFERENCES "incidents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acoes_contencao" ADD CONSTRAINT "acoes_contencao_autor_id_fkey" FOREIGN KEY ("autor_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


-- ============================================================
-- IMUTABILIDADE DOS LOGS
-- ============================================================

CREATE OR REPLACE FUNCTION bloquear_alteracao_log()
RETURNS trigger AS $$
BEGIN
    RAISE EXCEPTION 'Log imutável: % não é permitido em %',
        TG_OP, TG_TABLE_NAME
        USING ERRCODE = 'integrity_constraint_violation';
END;
$$ LANGUAGE plpgsql;

-- Proteção da tabela acoes_contencao
CREATE TRIGGER acoes_contencao_imutavel
    BEFORE UPDATE OR DELETE ON "acoes_contencao"
    FOR EACH ROW
    EXECUTE FUNCTION bloquear_alteracao_log();

CREATE TRIGGER acoes_contencao_sem_truncate
    BEFORE TRUNCATE ON "acoes_contencao"
    FOR EACH STATEMENT
    EXECUTE FUNCTION bloquear_alteracao_log();

-- Proteção da tabela historico_status
CREATE TRIGGER historico_status_imutavel
    BEFORE UPDATE OR DELETE ON "historico_status"
    FOR EACH ROW
    EXECUTE FUNCTION bloquear_alteracao_log();

CREATE TRIGGER historico_status_sem_truncate
    BEFORE TRUNCATE ON "historico_status"
    FOR EACH STATEMENT
    EXECUTE FUNCTION bloquear_alteracao_log();