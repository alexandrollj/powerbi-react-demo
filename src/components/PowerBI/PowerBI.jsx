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
      console.log("REPORT DETAILS", report);

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
    } catch (error) {}
  };

  return (
    <div className="min-h-screen w-full bg-slate-100">
      <main className="p-6 max-w-screen-xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-white rounded shadow p-4">
            <h2 className="text-lg font-bold mb-4">Select Page</h2>
            {pages.length > 0 && (
              <select
                data-theme="light"
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
            )}
          </section>
          <section className="bg-white rounded shadow p-4">
            <h2 className=" text-lg font-bold mb-4">Selected Data</h2>
            {selection?.length > 0 ? (
              <ul className="space-y-2 list-none">
                {selection.map((item, index) => (
                  <li key={index}>
                    <strong className="text-blue-600">{item.measure}</strong>
                    <div className="text-sm-gray-600">
                      {item.table}:{parseFloat(item.value).toFixed(2)}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="italic text-gray-500">No data selected yet.</p>
            )}
          </section>
        </div>
        <section>
          <div
            ref={reportRef}
            className="w-full h-[600px] border rounded shadow bg-white"
          />
        </section>
      </main>
    </div>
  );
};

export default PowerBIEmbed;
