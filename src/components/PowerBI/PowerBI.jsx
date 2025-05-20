import { useEffect, useRef } from "react";
import "./PowerBI.css";

const PowerBIEmbed = ({ embedInfo }) => {
  const reportRef = useRef(null);

  useEffect(() => {
    if (!embedInfo || !reportRef.current) return;

    const powerbiService = window.powerbi; // used for .embed()
    const powerbiSdk = window["powerbi-client"]; // used for .models.TokenType

    console.log("powerbiService", powerbiService);
    console.log("powerbi", powerbiSdk);

    if (!powerbiService?.embed || !powerbiSdk?.models?.TokenType) {
      console.error("Power BI SDK not fully loaded");
      return;
    }

    const reportConfig = {
      type: "report",
      tokenType: powerbiSdk.models.TokenType.Embed,
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

    const report = powerbiService.embed(reportRef.current, reportConfig);

    return () => {
      if (report && typeof report.destroy === "function") {
        report.destroy();
      } else {
        console.warn("No report instance to destroy");
      }
    };
  }, [embedInfo]);

  return <div ref={reportRef} className="reportClass" />;
};

export default PowerBIEmbed;
