import { gql } from "graphql-tag";

export const typeDefs = gql`
  type Query {
    hello: String
    simulationParameters: [SimulationParameter!]!
    simulationParameter(id: Int!): SimulationParameter
  }

  type Mutation {
    createSimulationParameter(
      input: SimulationParameterInput!
    ): SimulationParameter!
    updateSimulationParameter(
      id: Int!
      input: SimulationParameterInput!
    ): SimulationParameter!
    deleteSimulationParameter(id: Int!): Boolean!
    runSimulation(input: SimulationParameterInput!): SimulationResult!
  }

  type ChargepointConfig {
    count: Int!
    powerKw: Float!
  }

  type SimulationParameter {
    id: Int!
    chargepoints: [ChargepointConfig!]!
    consumptionKwhPer100km: Float!
    days: Int!
    intervalMinutes: Int!
    arrivalProbabilityMultiplier: Int!
    createdAt: String!
    updatedAt: String!
  }

  input ChargepointConfigInput {
    count: Int!
    powerKw: Float!
  }

  input SimulationParameterInput {
    chargepoints: [ChargepointConfigInput!]!
    consumptionKwhPer100km: Float!
    days: Int!
    intervalMinutes: Int!
    arrivalProbabilityMultiplier: Int!
  }

  type SimulationResult {
    id: Int!
    totalEnergyKwh: Float!
    maxPowerKw: Float!
    maxTheoreticalPowerKw: Float!
    concurrencyFactor: Float!
    aggregatedDailyData: AggregatedDailyData!
    powerHistogram: [PowerHistogramDataPoint!]!
    simulationParameterId: Int
    createdAt: String!
    updatedAt: String!
  }

  type AggregatedDailyData {
    dailyStats: DailyStats!
    intervalDataPoints: [IntervalDataPoint!]!
    totalIntervals: Int!
    intervalMinutes: Int!
  }

  type DailyStats {
    avg: Float!
    max: Float!
    min: Float!
  }

  type IntervalDataPoint {
    interval: Int!
    time: String!
    avg: Float!
    max: Float!
    min: Float!
  }

  type PowerHistogramDataPoint {
    maxPowerKw: Float!
    count: Int!
    percentage: Float!
  }
`;
