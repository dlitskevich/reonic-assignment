import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { SimulationParameters, SimulationResults } from "../types";

type GraphQLSimulationResult = SimulationResults;

const RUN_SIMULATION_MUTATION = gql`
  mutation RunSimulation($input: SimulationParameterInput!) {
    runSimulation(input: $input) {
      totalEnergyKwh
      maxPowerKw
      maxTheoreticalPowerKw
      concurrencyFactor
      aggregatedDailyData {
        dailyStats {
          avg
          max
          min
        }
        intervalDataPoints {
          interval
          time
          avg
          max
          min
        }
        totalIntervals
        intervalMinutes
      }
      powerHistogram {
        maxPowerKw
        count
        percentage
      }
    }
  }
`;

interface RunSimulationMutationVariables {
  input: SimulationParameters;
}

interface RunSimulationMutationData {
  runSimulation: GraphQLSimulationResult;
}

/**
 * Hook for running a simulation via GraphQL mutation
 */
export function useRunSimulation() {
  const [mutate, { loading, error }] = useMutation<
    RunSimulationMutationData,
    RunSimulationMutationVariables
  >(RUN_SIMULATION_MUTATION);

  const runSimulation = async (
    parameters: SimulationParameters
  ): Promise<SimulationResults> => {
    const result = await mutate({
      variables: {
        input: parameters,
      },
    });

    if (!result.data?.runSimulation) {
      throw new Error("No simulation result returned from GraphQL");
    }

    return result.data.runSimulation;
  };

  return { runSimulation, loading, error };
}
