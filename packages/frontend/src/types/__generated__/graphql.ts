export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type AggregatedDailyData = {
  __typename: 'AggregatedDailyData';
  dailyStats: DailyStats;
  intervalDataPoints: Array<IntervalDataPoint>;
  intervalMinutes: Scalars['Int']['output'];
  totalIntervals: Scalars['Int']['output'];
};

export type ChargepointConfig = {
  __typename: 'ChargepointConfig';
  count: Scalars['Int']['output'];
  powerKw: Scalars['Float']['output'];
};

export type ChargepointConfigInput = {
  count: Scalars['Int']['input'];
  powerKw: Scalars['Float']['input'];
};

export type ChargepointUtilization = {
  __typename: 'ChargepointUtilization';
  avgDailyEnergyKwh: Scalars['Float']['output'];
  avgDailyEvents: Scalars['Float']['output'];
  avgMonthlyEnergyKwh: Scalars['Float']['output'];
  avgMonthlyEvents: Scalars['Float']['output'];
  powerKw: Scalars['Float']['output'];
  utilization: Scalars['Float']['output'];
};

export type DailyStats = {
  __typename: 'DailyStats';
  avg: Scalars['Float']['output'];
  max: Scalars['Float']['output'];
  min: Scalars['Float']['output'];
};

export type IntervalDataPoint = {
  __typename: 'IntervalDataPoint';
  avg: Scalars['Float']['output'];
  interval: Scalars['Int']['output'];
  max: Scalars['Float']['output'];
  min: Scalars['Float']['output'];
  time: Scalars['String']['output'];
};

export type Mutation = {
  __typename: 'Mutation';
  createSimulationParameter: SimulationParameter;
  deleteSimulationParameter: Scalars['Boolean']['output'];
  runSimulation: SimulationResult;
  updateSimulationParameter: SimulationParameter;
};


export type MutationCreateSimulationParameterArgs = {
  input: SimulationParameterInput;
};


export type MutationDeleteSimulationParameterArgs = {
  id: Scalars['Int']['input'];
};


export type MutationRunSimulationArgs = {
  input: SimulationParameterInput;
};


export type MutationUpdateSimulationParameterArgs = {
  id: Scalars['Int']['input'];
  input: SimulationParameterInput;
};

export type PowerHistogramDataPoint = {
  __typename: 'PowerHistogramDataPoint';
  count: Scalars['Int']['output'];
  maxPowerKw: Scalars['Float']['output'];
  percentage: Scalars['Float']['output'];
};

export type Query = {
  __typename: 'Query';
  hello: Maybe<Scalars['String']['output']>;
  simulationParameter: Maybe<SimulationParameter>;
  simulationParameters: Array<SimulationParameter>;
};


export type QuerySimulationParameterArgs = {
  id: Scalars['Int']['input'];
};

export type SimulationParameter = {
  __typename: 'SimulationParameter';
  arrivalProbabilityMultiplier: Scalars['Int']['output'];
  chargepoints: Array<ChargepointConfig>;
  consumptionKwhPer100km: Scalars['Float']['output'];
  createdAt: Scalars['String']['output'];
  days: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  intervalMinutes: Scalars['Int']['output'];
  updatedAt: Scalars['String']['output'];
};

export type SimulationParameterInput = {
  arrivalProbabilityMultiplier: Scalars['Int']['input'];
  chargepoints: Array<ChargepointConfigInput>;
  consumptionKwhPer100km: Scalars['Float']['input'];
  days: Scalars['Int']['input'];
  intervalMinutes: Scalars['Int']['input'];
};

export type SimulationResult = {
  __typename: 'SimulationResult';
  aggregatedDailyData: AggregatedDailyData;
  chargepointUtilizations: Array<ChargepointUtilization>;
  concurrencyFactor: Scalars['Float']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  maxPowerKw: Scalars['Float']['output'];
  maxTheoreticalPowerKw: Scalars['Float']['output'];
  powerHistogram: Array<PowerHistogramDataPoint>;
  simulationParameterId: Maybe<Scalars['Int']['output']>;
  totalEnergyKwh: Scalars['Float']['output'];
  updatedAt: Scalars['String']['output'];
};

export type RunSimulationMutationVariables = Exact<{
  input: SimulationParameterInput;
}>;


export type RunSimulationMutation = { runSimulation: { __typename: 'SimulationResult', totalEnergyKwh: number, maxPowerKw: number, maxTheoreticalPowerKw: number, concurrencyFactor: number, aggregatedDailyData: { __typename: 'AggregatedDailyData', totalIntervals: number, intervalMinutes: number, dailyStats: { __typename: 'DailyStats', avg: number, max: number, min: number }, intervalDataPoints: Array<{ __typename: 'IntervalDataPoint', interval: number, time: string, avg: number, max: number, min: number }> }, powerHistogram: Array<{ __typename: 'PowerHistogramDataPoint', maxPowerKw: number, count: number, percentage: number }>, chargepointUtilizations: Array<{ __typename: 'ChargepointUtilization', powerKw: number, utilization: number, avgDailyEvents: number, avgDailyEnergyKwh: number, avgMonthlyEvents: number, avgMonthlyEnergyKwh: number }> } };
