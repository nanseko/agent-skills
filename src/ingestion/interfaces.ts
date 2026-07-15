/**
 * Source-specific ingestion contracts for economic data collectors.
 *
 * These interfaces are intentionally dependency-free. Implementations may use any
 * HTTP, storage, or orchestration library, but they must preserve raw snapshots,
 * collection timestamps, source metadata, and environment-variable-only secrets.
 */

export type SourceName =
  | "bls_cpi"
  | "fred_inflation"
  | "fred_house_price"
  | "fhfa_hpi"
  | "case_shiller"
  | "eia_petroleum"
  | "frbny_household_debt";

export type DataFrequency = "daily" | "weekly" | "monthly" | "quarterly" | "annual";

export type ResponseFormat = "json" | "csv" | "xlsx" | "pdf" | "html" | "zip";

export interface EnvironmentSecretRef {
  /** Environment variable name, for example FRED_API_KEY or EIA_API_KEY. */
  envVar: string;
  /** Where the value is applied at runtime. Never store the resolved secret. */
  injectAs: "query_param" | "header";
  /** Query parameter or header name that receives the secret value. */
  parameterName: string;
}

export interface SourceMetadata {
  sourceName: SourceName;
  displayName: string;
  endpoint: string;
  frequency: DataFrequency;
  unit: string;
  updateCadence: string;
  historicalCoverage: string;
  licenseTermsUrl: string;
  targetTableOrPath: string;
  responseFormat: ResponseFormat;
  requiredSecret?: EnvironmentSecretRef;
}

export interface CollectionRequest {
  sourceName: SourceName;
  collectionTimestampUtc: string;
  parameters: Record<string, string | number | boolean | readonly string[]>;
  /** Request URL with secrets redacted. */
  redactedUrl: string;
}

export interface RawSnapshot {
  sourceMetadata: SourceMetadata;
  collectionRequest: CollectionRequest;
  rawSnapshotPath: string;
  checksumSha256: string;
  contentLengthBytes?: number;
  upstreamLastModifiedUtc?: string;
  upstreamReleaseTimestampUtc?: string;
}

export interface CollectionResult<NormalizedRecord> {
  snapshot: RawSnapshot;
  records: readonly NormalizedRecord[];
}

export interface SourceCollector<NormalizedRecord> {
  readonly metadata: SourceMetadata;
  collect(requestedAtUtc: string): Promise<CollectionResult<NormalizedRecord>>;
}

export interface TimeSeriesObservation {
  seriesId: string;
  period: string;
  value: number | null;
  unit: string;
  frequency: DataFrequency;
  sourceSnapshotPath: string;
}

export interface BlsCpiCollector extends SourceCollector<TimeSeriesObservation> {
  readonly metadata: SourceMetadata & { sourceName: "bls_cpi" };
}

export interface FredSeriesCollector extends SourceCollector<TimeSeriesObservation> {
  readonly metadata: SourceMetadata & {
    sourceName: "fred_inflation" | "fred_house_price" | "case_shiller";
    requiredSecret: EnvironmentSecretRef;
  };
  readonly seriesIds: readonly string[];
}

export interface FhfaHpiCollector extends SourceCollector<TimeSeriesObservation> {
  readonly metadata: SourceMetadata & { sourceName: "fhfa_hpi" };
}

export interface EiaPetroleumCollector extends SourceCollector<TimeSeriesObservation> {
  readonly metadata: SourceMetadata & {
    sourceName: "eia_petroleum";
    requiredSecret: EnvironmentSecretRef;
  };
  readonly routes: readonly string[];
}

export interface HouseholdDebtRecord {
  measure: string;
  period: string;
  value: number | null;
  unit: string;
  geography?: string;
  sourceSnapshotPath: string;
}

export interface FrbnyHouseholdDebtCollector extends SourceCollector<HouseholdDebtRecord> {
  readonly metadata: SourceMetadata & { sourceName: "frbny_household_debt" };
}
