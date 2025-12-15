import { useState, useEffect } from "react";
import { ParameterInput } from "./components/ParameterInput";
import { StatisticsDisplay } from "./components/StatisticsDisplay";
import { AggregatedDailyDataChart } from "./components/AggregatedDailyDataChart";
import { PowerDistributionChart } from "./components/PowerDistributionChart";
import { Sidebar } from "./components/Sidebar";
import { SimulationParameters, SimulationResults } from "./types";
import { useRunSimulation } from "./graphql/useRunSimulation";
import {
  deserializeParametersFromUrl,
  updateUrlParameters,
} from "./utils/urlParams";

const defaultParameters: SimulationParameters = {
  chargepoints: [
    { count: 5, powerKw: 11.0 },
    { count: 3, powerKw: 22.0 },
    { count: 1, powerKw: 50.0 },
  ],
  consumptionKwhPer100km: 18.0,
  days: 365,
  intervalMinutes: 15,
  arrivalProbabilityMultiplier: 100,
};

function App() {
  // Initialize parameters from URL or use defaults
  const [parameters, setParameters] = useState<SimulationParameters>(() => {
    const urlParams = deserializeParametersFromUrl();
    return urlParams || defaultParameters;
  });
  const [results, setResults] = useState<SimulationResults | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { runSimulation, loading: isRunning } = useRunSimulation();

  // Update URL when parameters change
  useEffect(() => {
    updateUrlParameters(parameters);
  }, [parameters]);

  // Run initial simulation on mount
  useEffect(() => {
    runSimulation(parameters)
      .then((results) => {
        setResults(results);
      })
      .catch((error) => {
        console.error("Failed to run initial simulation:", error);
      });
  }, []);

  const handleRunSimulation = async () => {
    try {
      const newResults = await runSimulation(parameters);
      setResults(newResults);
      // Close sidebar on mobile after running simulation
      setSidebarOpen(false);
    } catch (error) {
      console.error("Failed to run simulation:", error);
      // TODO: Show error message to user
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}>
        <ParameterInput
          parameters={parameters}
          onParametersChange={setParameters}
          onRunSimulation={handleRunSimulation}
          isRunning={isRunning}
        />
      </Sidebar>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Mobile header with menu button */}
        <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <h1 className="text-xl font-bold text-gray-800">
            EV Charging Simulator
          </h1>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Open parameters"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </header>

        {/* Desktop header */}
        <header className="hidden lg:block bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-1">
            EV Charging Station Simulator
          </h1>
          <p className="text-gray-600 text-sm">
            Configure parameters and visualize simulation results
          </p>
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {results && (
              <>
                <StatisticsDisplay results={results} />
                <AggregatedDailyDataChart results={results} />
                <PowerDistributionChart results={results} />
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
