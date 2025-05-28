import "./App.css";

import PowerBIEmbed from "./components/PowerBI/PowerBI";
import { usePowerBIEmbed } from "./components/PowerBI/usePowerBIEmbed";

function App() {
  const { embedInfo, loading, error } = usePowerBIEmbed();

  if (loading) return <p>Loading Power BI report...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1 className="text-red-950">{embedInfo.reportTitle}</h1>
      <PowerBIEmbed embedInfo={embedInfo} />
    </div>
  );
}

export default App;
