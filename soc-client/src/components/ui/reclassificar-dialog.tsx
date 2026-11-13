"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SEVERIDADE_LABEL, Severidade } from "@/lib/config";

interface ReclassificarDialogProps {
  open: boolean;
  titulo: string;
  atual: Severidade;
  loading?: boolean;
  onConfirm: (severidade: Severidade, justificativa: string) => void;
  onCancel: () => void;
}

/** Troca a severidade (e, por consequência, o SLA) com justificativa obrigatória. */
export function ReclassificarDialog({
  open,
  titulo,
  atual,
  loading,
  onConfirm,
  onCancel,
}: ReclassificarDialogProps) {
  const [severidade, setSeveridade] = React.useState<Severidade>(atual);
  const [justificativa, setJustificativa] = React.useState("");

  React.useEffect(() => {
    if (open) {
      setSeveridade(atual);
      setJustificativa("");
    }
  }, [open, atual]);

  if (!open) return null;

  const invalido = justificativa.trim().length === 0 || severidade === atual;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-1">
          <h3 className="font-bold text-base">Reclassificar incidente</h3>
          <p className="text-sm text-slate-600">
            &quot;{titulo}&quot; — o SLA é recalculado, mas o relógio continua contando desde a abertura.
          </p>
        </div>
        <Select
          value={severidade}
          onChange={(e) => setSeveridade(e.target.value as Severidade)}
          disabled={loading}
        >
          {Object.entries(SEVERIDADE_LABEL).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
        <Textarea
          placeholder="Justificativa (obrigatória)"
          value={justificativa}
          onChange={(e) => setJustificativa(e.target.value)}
          disabled={loading}
        />
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel} disabled={loading}>
            Cancelar
          </Button>
          <Button
            onClick={() => onConfirm(severidade, justificativa.trim())}
            disabled={loading || invalido}
          >
            {loading ? "Enviando..." : "Reclassificar"}
          </Button>
        </div>
      </div>
    </div>
  );
}
