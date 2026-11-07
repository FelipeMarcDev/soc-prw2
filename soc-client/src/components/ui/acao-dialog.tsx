"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface AcaoDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  loading?: boolean;
  onConfirm: (justificativa: string) => void;
  onCancel: () => void;
}

/** Pede a justificativa obrigatória antes de executar uma ação do incidente. */
export function AcaoDialog({
  open,
  title,
  description,
  confirmLabel,
  loading,
  onConfirm,
  onCancel,
}: AcaoDialogProps) {
  const [justificativa, setJustificativa] = React.useState("");

  React.useEffect(() => {
    if (open) setJustificativa("");
  }, [open]);

  if (!open) return null;

  const vazia = justificativa.trim().length === 0;

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
          <h3 className="font-bold text-base">{title}</h3>
          <p className="text-sm text-slate-600">{description}</p>
        </div>
        <Textarea
          placeholder="Justificativa (obrigatória)"
          value={justificativa}
          onChange={(e) => setJustificativa(e.target.value)}
          disabled={loading}
          autoFocus
        />
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel} disabled={loading}>
            Cancelar
          </Button>
          <Button
            onClick={() => onConfirm(justificativa.trim())}
            disabled={loading || vazia}
          >
            {loading ? "Enviando..." : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
