import { useEffect, useRef, useState } from "react";
import "./PowerBI.css";

const PowerBIEmbed = ({ embedInfo }) => {
  const reportRef = useRef(null);
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState("");
  const [selection, setSelection] = useState(null);

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
    reportRef.current.powerBireport = report;

    // 💡 Log details once the report is loaded
    report.on("loaded", async () => {
      console.log("Report loaded ✅");

      // Pages
      const reportPages = await report.getPages();
      setPages(reportPages);
      setSelectedPage(reportPages[0]?.name || "");
    });

    report.on("dataSelected", (event) => {
      const dataPoints = event.detail?.dataPoints || [];

      const selectionData = dataPoints.flatMap((dp) => {
        console.log("🔍 RAW VALUE OBJECTS:", dp.values); // ✅ RIGHT HERE

        return (dp.values || []).map((val) => ({
          measure: val.target?.measure || "Unknown",
          table: val.target?.table || "Unknown",
          value: val.formattedValue || val.value || "N/A",
        }));
      });
      setSelection(selectionData);
      console.log("🟢 User selected:", selectionData);
    });

    return () => {
      if (report && typeof report.destroy === "function") {
        report.destroy();
      } else {
        console.warn("No report instance to destroy");
      }
    };
  }, [embedInfo]);

  const handlePageChange = async (event) => {
    const newPage = event.target.value;
    setSelectedPage(newPage);
    try {
      await reportRef.current?.powerBireport.setPage(newPage);
      console.log("📄 Switched to page:", newPage);
    } catch (error) {
      console.log("Failed to switch page", error);
    }
  };

  return (
    <div>
      {pages.length > 0 && (
        <div>
          <label htmlFor="pageSelector">Select Page:</label>
          <select
            id="pageSelector"
            value={selectedPage}
            onChange={handlePageChange}
          >
            {pages.map((page) => (
              <option key={page.name} value={page.name}>
                {page.displayName}
              </option>
            ))}
          </select>
        </div>
      )}
      {selection && (
        <div className="selection-panel">
          <h3>Selected Data</h3>
          <ul>
            {selection.map((item, index) => (
              <li key={index}>
                <strong>{item.measure}</strong> ({item.table}):{item.value}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div ref={reportRef} className="reportClass" />
    </div>
  );
};

export default PowerBIEmbed;
