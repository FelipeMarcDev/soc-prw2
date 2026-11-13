"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import {
  FONTE_LABEL,
  FonteAlerta,
  IncidentInput,
  SEVERIDADE_LABEL,
  Severidade,
} from "@/lib/config";

const EMPTY: IncidentInput = {
  title: "",
  description: "",
  fonteAlerta: "SIEM",
  ativoAfetado: "",
  analista: "",
  severidade: "MEDIA",
};

interface IncidentFormProps {
  initialValues?: IncidentInput;
  submitLabel: string;
  submittingLabel: string;
  onSubmit: (data: IncidentInput) => Promise<void>;
  onCancel: () => void;
  /** Na edição a severidade não muda aqui: use a ação Reclassificar. */
  ocultarSeveridade?: boolean;
}

export function IncidentForm({
  initialValues = EMPTY,
  submitLabel,
  submittingLabel,
  onSubmit,
  onCancel,
  ocultarSeveridade = false,
}: IncidentFormProps) {
  const [values, setValues] = React.useState<IncidentInput>(initialValues);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  function set<K extends keyof IncidentInput>(key: K, value: IncidentInput[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onSubmit(values);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar o incidente.");
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 border rounded-lg bg-white max-w-xl mx-auto space-y-4 text-left shadow-sm"
    >
      <div>
        <label className="text-xs font-medium text-slate-500">Título</label>
        <Input
          placeholder="Título do incidente"
          value={values.title}
          onChange={(e) => set("title", e.target.value)}
          required
        />
      </div>

      <div>
        <label className="text-xs font-medium text-slate-500">Descrição</label>
        <Textarea
          placeholder="Descrição do que foi observado"
          value={values.description}
          onChange={(e) => set("description", e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-slate-500">Fonte do alerta</label>
          <Select
            value={values.fonteAlerta}
            onChange={(e) => set("fonteAlerta", e.target.value as FonteAlerta)}
          >
            {Object.entries(FONTE_LABEL).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </div>

        {!ocultarSeveridade && (
          <div>
            <label className="text-xs font-medium text-slate-500">Severidade</label>
            <Select
              value={values.severidade}
              onChange={(e) => set("severidade", e.target.value as Severidade)}
            >
              {Object.entries(SEVERIDADE_LABEL).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </div>
        )}
      </div>

      <div>
        <label className="text-xs font-medium text-slate-500">Ativo afetado</label>
        <Input
          placeholder="ex: srv-web-01, 10.0.0.5"
          value={values.ativoAfetado}
          onChange={(e) => set("ativoAfetado", e.target.value)}
          required
        />
      </div>

      <div>
        <label className="text-xs font-medium text-slate-500">Analista responsável</label>
        <Input
          placeholder="Analista responsável"
          value={values.analista}
          onChange={(e) => set("analista", e.target.value)}
          required
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-2">
        <Button type="button" variant="outline" className="flex-1" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? submittingLabel : submitLabel}
        </Button>
      </div>
    </form>
  );
}
