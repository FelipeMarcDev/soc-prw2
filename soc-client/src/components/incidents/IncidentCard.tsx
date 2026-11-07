import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ACAO_POR_STATUS,
  AcaoIncidente,
  FONTE_LABEL,
  Incident,
  SEVERIDADE_LABEL,
  STATUS_LABEL,
} from "@/lib/config";

interface IncidentCardProps {
  incident: Incident;
  onAction: (incident: Incident, acao: AcaoIncidente) => void;
}

function severidadeVariant(severidade: Incident["severidade"]) {
  if (severidade === "CRITICA") return "destructive" as const;
  if (severidade === "ALTA") return "warning" as const;
  if (severidade === "MEDIA") return "secondary" as const;
  return "default" as const;
}

export function IncidentCard({ incident, onAction }: IncidentCardProps) {
  const proxima = ACAO_POR_STATUS[incident.status];
  const finalizado = incident.status === "POS_MORTEM";

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-start justify-between gap-2 pb-2">
        <div>
          <CardTitle>{incident.title}</CardTitle>
          <p className="text-xs text-slate-500 mt-1">
            {incident.ativoAfetado} · fonte: {FONTE_LABEL[incident.fonteAlerta]} · analista:{" "}
            {incident.analista}
          </p>
        </div>
        <Badge variant={severidadeVariant(incident.severidade)}>
          {SEVERIDADE_LABEL[incident.severidade]}
        </Badge>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-slate-600">{incident.description}</p>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
          <span
            className={`text-xs font-semibold ${
              finalizado ? "text-emerald-600" : "text-amber-600"
            }`}
          >
            {STATUS_LABEL[incident.status]}
          </span>

          <div className="flex flex-wrap gap-2">
            {proxima && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onAction(incident, proxima.acao)}
              >
                {proxima.label}
              </Button>
            )}
            <Link
              href={`/incidents/${incident.id}/edit`}
              className="inline-flex h-8 items-center justify-center rounded-md px-3 text-sm font-medium hover:bg-slate-100"
            >
              Editar
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
