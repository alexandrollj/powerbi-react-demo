import { useEffect, useRef } from "react";
import * as powerbi from "powerbi-client";

const PowerBIEmbed = ({ embedInfo }) => {
  const reportRef = useRef(null);

  useEffect(() => {
    if (!embedInfo || !reportRef.current) return;

    const reportConfig = {
      type: "report",
      tokenType: powerbi.models.TokenType.Embed,
      accessToken: embedInfo.embedToken,
      embedUrl: embedInfo.embedUrl,
      id: embedInfo.reportId,
      settings: {
        panes: {
          filters: { visible: false },
          pageNavigation: { visible: true },
        },
      },
    };
    const report = powerbi.embed(reportRef.current, reportConfig);
    return () => report?.destroy();
  }, [embedInfo]);

  return <div ref={reportRef} className="reportClass" />;
};

export default PowerBIEmbed;
