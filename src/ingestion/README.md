# Ingestion Interfaces

`interfaces.ts` defines the contracts future source-specific collectors must satisfy for the economic data sources cataloged in `docs/data-source-catalog.md`.

## Required collector behavior

Every collector must:

1. Fetch from the official source endpoint or official downloadable file.
2. Persist the raw upstream payload before transformation.
3. Record `collectionTimestampUtc` and source metadata with the raw snapshot.
4. Store a SHA-256 checksum and raw snapshot path.
5. Return normalized records that retain `sourceSnapshotPath` for provenance.
6. Redact secret values from recorded URLs and logs.

## Secret handling

API keys are represented by `EnvironmentSecretRef`. Implementations may resolve only the named environment variable at runtime, for example `FRED_API_KEY` or `EIA_API_KEY`. Do not place actual secret values in code, config files, tests, committed examples, raw snapshots, or logs.

## Source-specific collector types

- `BlsCpiCollector` for BLS CPI series such as `CUUR0000SA0`.
- `FredSeriesCollector` for FRED inflation and house-price series such as `CPIAUCSL`, `USSTHPI`, and `CSUSHPINSA`.
- `FhfaHpiCollector` for direct FHFA House Price Index files or API responses.
- `EiaPetroleumCollector` for EIA oil and gasoline series.
- `FrbnyHouseholdDebtCollector` for Federal Reserve Bank of New York Household Debt and Credit data.

## Snapshot layout

Use the catalog target paths as the default namespace pattern:

```text
raw/{source}/{dataset-or-series}/{collection_date}/response.{json|csv|xlsx|zip}
```

Normalized tables should include both the source period and `sourceSnapshotPath` so downstream users can trace every record back to the exact raw payload used to produce it.
