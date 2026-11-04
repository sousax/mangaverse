import { useEffect, useState } from "react";

export function useApi(path) {
  const [state, setState] = useState({ loading: true });

  useEffect(() => {
    if (!path) return;
    let alive = true;
    setState({ loading: true });
    fetch(path)
      .then(async (r) => {
        const body = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(body.error ?? "Falha ao carregar");
        return body;
      })
      .then(
        (data) => alive && setState({ data }),
        (error) => alive && setState({ error })
      );
    return () => {
      alive = false;
    };
  }, [path]);

  return state;
}

export const STATUS = { ongoing: "Em andamento", completed: "Completo", hiatus: "Hiato", cancelled: "Cancelado" };
export const TYPE = { ja: "Mangá", ko: "Manhwa", zh: "Manhua", "zh-hk": "Manhua" };
