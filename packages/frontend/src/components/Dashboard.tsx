import { SimulationResults } from "../types";
import { StatisticsDisplay } from "./StatisticsDisplay";
import { AggregatedDailyDataChart } from "./AggregatedDailyDataChart";
import { PowerDistributionChart } from "./PowerDistributionChart";

type DashboardProps = {
  results: SimulationResults | null;
};

export const Dashboard = ({ results }: DashboardProps) => {
  if (!results) {
    return <div className="text-gray-600 text-center py-10">Loading...</div>;
  }

  return (
    <>
      <StatisticsDisplay results={results} />
      <AggregatedDailyDataChart results={results} />
      <PowerDistributionChart results={results} />
    </>
  );
};
