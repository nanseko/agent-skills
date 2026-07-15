# Tasks: Economic Data Ingestion Catalog and Interfaces

## Task 1: Data source catalog
**Acceptance criteria:** Required datasets are listed with source name, URL/API endpoint, frequency, unit, update cadence, historical coverage, license/terms, and target table/path.
**Verification:** Review `docs/data-source-catalog.md`.
**Files:** `docs/data-source-catalog.md`

## Task 2: Collector interfaces
**Acceptance criteria:** Common and source-specific interfaces require raw snapshots, collected timestamps, source metadata, and environment-variable-only secret references.
**Verification:** Review `src/ingestion/interfaces.ts`.
**Files:** `src/ingestion/interfaces.ts`

## Task 3: Interface usage documentation
**Acceptance criteria:** README describes collector guarantees, snapshot layout, metadata, and secret policy.
**Verification:** Review `src/ingestion/README.md`.
**Files:** `src/ingestion/README.md`
