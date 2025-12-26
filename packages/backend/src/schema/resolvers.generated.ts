/* This file was automatically generated. DO NOT UPDATE MANUALLY. */
    import type   { Resolvers } from './types.generated';
    import    { hello as Query_hello } from './base/resolvers/Query/hello';
import    { simulationParameter as Query_simulationParameter } from './simulation_parameter/resolvers/Query/simulationParameter';
import    { simulationParameters as Query_simulationParameters } from './simulation_parameter/resolvers/Query/simulationParameters';
import    { createSimulationParameter as Mutation_createSimulationParameter } from './simulation_parameter/resolvers/Mutation/createSimulationParameter';
import    { deleteSimulationParameter as Mutation_deleteSimulationParameter } from './simulation_parameter/resolvers/Mutation/deleteSimulationParameter';
import    { runSimulation as Mutation_runSimulation } from './simulation_result/resolvers/Mutation/runSimulation';
import    { updateSimulationParameter as Mutation_updateSimulationParameter } from './simulation_parameter/resolvers/Mutation/updateSimulationParameter';
import    { AggregatedDailyData } from './simulation_result/resolvers/AggregatedDailyData';
import    { AggregatedDailyDataInput } from './simulation_result/resolvers/AggregatedDailyDataInput';
import    { ChargepointConfig } from './simulation_parameter/resolvers/ChargepointConfig';
import    { ChargepointUtilization } from './simulation_result/resolvers/ChargepointUtilization';
import    { DailyStats } from './simulation_result/resolvers/DailyStats';
import    { IntervalDataPoint } from './simulation_result/resolvers/IntervalDataPoint';
import    { PowerHistogramDataPoint } from './simulation_result/resolvers/PowerHistogramDataPoint';
import    { SimulationParameter } from './simulation_parameter/resolvers/SimulationParameter';
import    { SimulationResult } from './simulation_result/resolvers/SimulationResult';
import    { SimulationResultInput } from './simulation_result/resolvers/SimulationResultInput';
    export const resolvers: Resolvers = {
      Query: { hello: Query_hello,simulationParameter: Query_simulationParameter,simulationParameters: Query_simulationParameters },
      Mutation: { createSimulationParameter: Mutation_createSimulationParameter,deleteSimulationParameter: Mutation_deleteSimulationParameter,runSimulation: Mutation_runSimulation,updateSimulationParameter: Mutation_updateSimulationParameter },
      
      AggregatedDailyData: AggregatedDailyData,
AggregatedDailyDataInput: AggregatedDailyDataInput,
ChargepointConfig: ChargepointConfig,
ChargepointUtilization: ChargepointUtilization,
DailyStats: DailyStats,
IntervalDataPoint: IntervalDataPoint,
PowerHistogramDataPoint: PowerHistogramDataPoint,
SimulationParameter: SimulationParameter,
SimulationResult: SimulationResult,
SimulationResultInput: SimulationResultInput
    }