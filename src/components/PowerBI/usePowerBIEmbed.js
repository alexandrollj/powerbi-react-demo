import { useState, useEffect } from "react";
import { getPowerBIEmbedInfo } from "../../services/powerbiService";

export function usePowerBIEmbed() {
  const [embedInfo, setEmbedInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getPowerBIEmbedInfo()
      .then((data) => {
        setEmbedInfo(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);
  return { embedInfo, loading, error };
}
