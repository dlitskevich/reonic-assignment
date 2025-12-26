import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null | undefined;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type AggregatedDailyData = {
  __typename?: 'AggregatedDailyData';
  dailyStats?: Maybe<DailyStats>;
  intervalDataPoints: Array<IntervalDataPoint>;
  intervalMinutes: Scalars['Int']['output'];
  totalIntervals: Scalars['Int']['output'];
};

export type AggregatedDailyDataInput = {
  __typename?: 'AggregatedDailyDataInput';
  dailyStats: DailyStats;
  intervalDataPoints: Array<IntervalDataPoint>;
  intervalMinutes: Scalars['Int']['output'];
  totalIntervals: Scalars['Int']['output'];
};

export type ChargepointConfig = {
  __typename?: 'ChargepointConfig';
  count: Scalars['Int']['output'];
  powerKw: Scalars['Float']['output'];
};

export type ChargepointConfigInput = {
  count: Scalars['Int']['input'];
  powerKw: Scalars['Float']['input'];
};

export type ChargepointUtilization = {
  __typename?: 'ChargepointUtilization';
  avgDailyEnergyKwh: Scalars['Float']['output'];
  avgDailyEvents: Scalars['Float']['output'];
  avgMonthlyEnergyKwh: Scalars['Float']['output'];
  avgMonthlyEvents: Scalars['Float']['output'];
  powerKw: Scalars['Float']['output'];
  utilization: Scalars['Float']['output'];
};

export type DailyStats = {
  __typename?: 'DailyStats';
  avg: Scalars['Float']['output'];
  max: Scalars['Float']['output'];
  min: Scalars['Float']['output'];
};

export type IntervalDataPoint = {
  __typename?: 'IntervalDataPoint';
  avg: Scalars['Float']['output'];
  interval: Scalars['Int']['output'];
  max: Scalars['Float']['output'];
  min: Scalars['Float']['output'];
  time: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createSimulationParameter: SimulationParameter;
  deleteSimulationParameter: Scalars['Boolean']['output'];
  runSimulation: SimulationResult;
  updateSimulationParameter: SimulationParameter;
};


export type MutationcreateSimulationParameterArgs = {
  input: SimulationParameterInput;
};


export type MutationdeleteSimulationParameterArgs = {
  id: Scalars['Int']['input'];
};


export type MutationrunSimulationArgs = {
  input: SimulationParameterInput;
};


export type MutationupdateSimulationParameterArgs = {
  id: Scalars['Int']['input'];
  input: SimulationParameterInput;
};

export type PowerHistogramDataPoint = {
  __typename?: 'PowerHistogramDataPoint';
  count: Scalars['Int']['output'];
  maxPowerKw: Scalars['Float']['output'];
  percentage: Scalars['Float']['output'];
};

export type Query = {
  __typename?: 'Query';
  hello?: Maybe<Scalars['String']['output']>;
  simulationParameter?: Maybe<SimulationParameter>;
  simulationParameters: Array<SimulationParameter>;
};


export type QuerysimulationParameterArgs = {
  id: Scalars['Int']['input'];
};

export type SimulationParameter = {
  __typename?: 'SimulationParameter';
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
  __typename?: 'SimulationResult';
  aggregatedDailyData?: Maybe<AggregatedDailyData>;
  chargepointUtilizations: Array<ChargepointUtilization>;
  concurrencyFactor: Scalars['Float']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  maxPowerKw: Scalars['Float']['output'];
  maxTheoreticalPowerKw: Scalars['Float']['output'];
  powerHistogram: Array<PowerHistogramDataPoint>;
  simulationParameterId?: Maybe<Scalars['Int']['output']>;
  totalEnergyKwh: Scalars['Float']['output'];
  updatedAt: Scalars['String']['output'];
};

export type SimulationResultInput = {
  __typename?: 'SimulationResultInput';
  aggregatedDailyData: AggregatedDailyDataInput;
  chargepointUtilizations: Array<ChargepointUtilization>;
  concurrencyFactor: Scalars['Float']['output'];
  maxPowerKw: Scalars['Float']['output'];
  maxTheoreticalPowerKw: Scalars['Float']['output'];
  powerHistogram: Array<PowerHistogramDataPoint>;
  simulationParameterId?: Maybe<Scalars['Int']['output']>;
  totalEnergyKwh: Scalars['Float']['output'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = Record<PropertyKey, never>, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;





/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AggregatedDailyData: ResolverTypeWrapper<AggregatedDailyData>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  AggregatedDailyDataInput: ResolverTypeWrapper<AggregatedDailyDataInput>;
  ChargepointConfig: ResolverTypeWrapper<ChargepointConfig>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  ChargepointConfigInput: ChargepointConfigInput;
  ChargepointUtilization: ResolverTypeWrapper<ChargepointUtilization>;
  DailyStats: ResolverTypeWrapper<DailyStats>;
  IntervalDataPoint: ResolverTypeWrapper<IntervalDataPoint>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  PowerHistogramDataPoint: ResolverTypeWrapper<PowerHistogramDataPoint>;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  SimulationParameter: ResolverTypeWrapper<SimulationParameter>;
  SimulationParameterInput: SimulationParameterInput;
  SimulationResult: ResolverTypeWrapper<SimulationResult>;
  SimulationResultInput: ResolverTypeWrapper<SimulationResultInput>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AggregatedDailyData: AggregatedDailyData;
  Int: Scalars['Int']['output'];
  AggregatedDailyDataInput: AggregatedDailyDataInput;
  ChargepointConfig: ChargepointConfig;
  Float: Scalars['Float']['output'];
  ChargepointConfigInput: ChargepointConfigInput;
  ChargepointUtilization: ChargepointUtilization;
  DailyStats: DailyStats;
  IntervalDataPoint: IntervalDataPoint;
  String: Scalars['String']['output'];
  Mutation: Record<PropertyKey, never>;
  Boolean: Scalars['Boolean']['output'];
  PowerHistogramDataPoint: PowerHistogramDataPoint;
  Query: Record<PropertyKey, never>;
  SimulationParameter: SimulationParameter;
  SimulationParameterInput: SimulationParameterInput;
  SimulationResult: SimulationResult;
  SimulationResultInput: SimulationResultInput;
};

export type AggregatedDailyDataResolvers<ContextType = any, ParentType extends ResolversParentTypes['AggregatedDailyData'] = ResolversParentTypes['AggregatedDailyData']> = {
  dailyStats?: Resolver<Maybe<ResolversTypes['DailyStats']>, ParentType, ContextType>;
  intervalDataPoints?: Resolver<Array<ResolversTypes['IntervalDataPoint']>, ParentType, ContextType>;
  intervalMinutes?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalIntervals?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type AggregatedDailyDataInputResolvers<ContextType = any, ParentType extends ResolversParentTypes['AggregatedDailyDataInput'] = ResolversParentTypes['AggregatedDailyDataInput']> = {
  dailyStats?: Resolver<ResolversTypes['DailyStats'], ParentType, ContextType>;
  intervalDataPoints?: Resolver<Array<ResolversTypes['IntervalDataPoint']>, ParentType, ContextType>;
  intervalMinutes?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalIntervals?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type ChargepointConfigResolvers<ContextType = any, ParentType extends ResolversParentTypes['ChargepointConfig'] = ResolversParentTypes['ChargepointConfig']> = {
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  powerKw?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
};

export type ChargepointUtilizationResolvers<ContextType = any, ParentType extends ResolversParentTypes['ChargepointUtilization'] = ResolversParentTypes['ChargepointUtilization']> = {
  avgDailyEnergyKwh?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  avgDailyEvents?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  avgMonthlyEnergyKwh?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  avgMonthlyEvents?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  powerKw?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  utilization?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
};

export type DailyStatsResolvers<ContextType = any, ParentType extends ResolversParentTypes['DailyStats'] = ResolversParentTypes['DailyStats']> = {
  avg?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  max?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  min?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
};

export type IntervalDataPointResolvers<ContextType = any, ParentType extends ResolversParentTypes['IntervalDataPoint'] = ResolversParentTypes['IntervalDataPoint']> = {
  avg?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  interval?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  max?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  min?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  time?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createSimulationParameter?: Resolver<ResolversTypes['SimulationParameter'], ParentType, ContextType, RequireFields<MutationcreateSimulationParameterArgs, 'input'>>;
  deleteSimulationParameter?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationdeleteSimulationParameterArgs, 'id'>>;
  runSimulation?: Resolver<ResolversTypes['SimulationResult'], ParentType, ContextType, RequireFields<MutationrunSimulationArgs, 'input'>>;
  updateSimulationParameter?: Resolver<ResolversTypes['SimulationParameter'], ParentType, ContextType, RequireFields<MutationupdateSimulationParameterArgs, 'id' | 'input'>>;
};

export type PowerHistogramDataPointResolvers<ContextType = any, ParentType extends ResolversParentTypes['PowerHistogramDataPoint'] = ResolversParentTypes['PowerHistogramDataPoint']> = {
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  maxPowerKw?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  percentage?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  hello?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  simulationParameter?: Resolver<Maybe<ResolversTypes['SimulationParameter']>, ParentType, ContextType, RequireFields<QuerysimulationParameterArgs, 'id'>>;
  simulationParameters?: Resolver<Array<ResolversTypes['SimulationParameter']>, ParentType, ContextType>;
};

export type SimulationParameterResolvers<ContextType = any, ParentType extends ResolversParentTypes['SimulationParameter'] = ResolversParentTypes['SimulationParameter']> = {
  arrivalProbabilityMultiplier?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  chargepoints?: Resolver<Array<ResolversTypes['ChargepointConfig']>, ParentType, ContextType>;
  consumptionKwhPer100km?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  days?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  intervalMinutes?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type SimulationResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['SimulationResult'] = ResolversParentTypes['SimulationResult']> = {
  aggregatedDailyData?: Resolver<Maybe<ResolversTypes['AggregatedDailyData']>, ParentType, ContextType>;
  chargepointUtilizations?: Resolver<Array<ResolversTypes['ChargepointUtilization']>, ParentType, ContextType>;
  concurrencyFactor?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  maxPowerKw?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  maxTheoreticalPowerKw?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  powerHistogram?: Resolver<Array<ResolversTypes['PowerHistogramDataPoint']>, ParentType, ContextType>;
  simulationParameterId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  totalEnergyKwh?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type SimulationResultInputResolvers<ContextType = any, ParentType extends ResolversParentTypes['SimulationResultInput'] = ResolversParentTypes['SimulationResultInput']> = {
  aggregatedDailyData?: Resolver<ResolversTypes['AggregatedDailyDataInput'], ParentType, ContextType>;
  chargepointUtilizations?: Resolver<Array<ResolversTypes['ChargepointUtilization']>, ParentType, ContextType>;
  concurrencyFactor?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  maxPowerKw?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  maxTheoreticalPowerKw?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  powerHistogram?: Resolver<Array<ResolversTypes['PowerHistogramDataPoint']>, ParentType, ContextType>;
  simulationParameterId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  totalEnergyKwh?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  AggregatedDailyData?: AggregatedDailyDataResolvers<ContextType>;
  AggregatedDailyDataInput?: AggregatedDailyDataInputResolvers<ContextType>;
  ChargepointConfig?: ChargepointConfigResolvers<ContextType>;
  ChargepointUtilization?: ChargepointUtilizationResolvers<ContextType>;
  DailyStats?: DailyStatsResolvers<ContextType>;
  IntervalDataPoint?: IntervalDataPointResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  PowerHistogramDataPoint?: PowerHistogramDataPointResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  SimulationParameter?: SimulationParameterResolvers<ContextType>;
  SimulationResult?: SimulationResultResolvers<ContextType>;
  SimulationResultInput?: SimulationResultInputResolvers<ContextType>;
};

