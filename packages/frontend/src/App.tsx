import { useState, useEffect } from "react";
import { ParameterInput } from "./components/ParameterInput";
import { Sidebar } from "./components/Sidebar";
import {
  SimulationParameterInput,
  RunSimulationMutation,
} from "./types/__generated__/graphql";
import { useRunSimulation } from "./graphql/useRunSimulation";
import {
  deserializeParametersFromUrl,
  updateUrlParameters,
} from "./utils/urlParams";
import { MenuIcon } from "./components/icons/MenuIcon";
import { DEFAULT_SIMULATION_PARAMETERS } from "./consts";
import { Dashboard } from "./components/Dashboard";

function App() {
  // Initialize parameters from URL or use defaults
  const [parameters, setParameters] = useState<SimulationParameterInput>(() => {
    const urlParams = deserializeParametersFromUrl();
    return urlParams || DEFAULT_SIMULATION_PARAMETERS;
  });
  const [results, setResults] = useState<
    RunSimulationMutation["runSimulation"] | null
  >(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { runSimulation, loading: isRunning } = useRunSimulation();

  // Update URL when parameters change
  useEffect(() => {
    updateUrlParameters(parameters);
  }, [parameters]);

  // Run initial simulation on mount with initial parameters
  useEffect(() => {
    let cancelled = false;
    runSimulation(parameters)
      .then((results) => {
        if (!cancelled) {
          setResults(results);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          console.error("Failed to run initial simulation:", error);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleRunSimulation = async () => {
    try {
      const newResults = await runSimulation(parameters);
      setResults(newResults);
      // Close sidebar on mobile after running simulation
      setSidebarOpen(false);
    } catch (error) {
      console.error("Failed to run simulation:", error);
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex">
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
      <div className="flex-1 flex flex-col lg:ml-0 w-full">
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
            <MenuIcon />
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
        <main className="flex-1 overflow-y-auto p-0 lg:p-6 sm:p-4">
          <div className="max-w-7xl mx-auto space-y-6">
            <Dashboard results={results} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
