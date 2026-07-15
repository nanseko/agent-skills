# Task List: US Inflation Forecasting AI Tool

## Task 1: Create the data source catalog
**Description:** Document authoritative data sources for inflation, housing, household debt, crude oil, gasoline, and at least 50 representative CPI product/category series.

**Acceptance criteria:**
- [ ] Catalog includes source name, endpoint or URL, frequency, unit, coverage, and update cadence.
- [ ] Catalog includes headline CPI and core CPI target series.
- [ ] Catalog includes at least 50 CPI product or category series.

**Verification:**
- [ ] Review the catalog for every required user-provided data category.

**Dependencies:** None

**Files likely touched:**
- `docs/us-inflation-forecasting-ai-spec.md`
- `docs/data-source-catalog.md`

**Estimated scope:** Medium

## Task 2: Define local storage conventions
**Description:** Define the local filesystem paths and metadata files for raw, bronze, silver, gold, and model registry assets.

**Acceptance criteria:**
- [ ] Local paths are documented.
- [ ] Metadata fields are specified for datasets, feature matrices, models, and predictions.
- [ ] Raw source snapshots are never overwritten silently.

**Verification:**
- [ ] Confirm the documented layout supports reproducible dataset and model builds.

**Dependencies:** Task 1

**Files likely touched:**
- `docs/us-inflation-forecasting-ai-spec.md`
- `docs/data-storage.md`

**Estimated scope:** Small

## Task 3: Implement ingestion foundation
**Description:** Build source-agnostic ingestion interfaces and the first official data collectors.

**Acceptance criteria:**
- [ ] Collectors can persist raw snapshots to local storage.
- [ ] Collector output includes source metadata and collection timestamp.
- [ ] API keys are read from environment variables only.

**Verification:**
- [ ] Run unit tests for parser and collector interfaces.
- [ ] Run one collector against a fixture or live source, depending on test environment.

**Dependencies:** Tasks 1-2

**Files likely touched:**
- `src/ingestion/`
- `tests/ingestion/`

**Estimated scope:** Medium

## Task 4: Build preprocessing and feature pipeline
**Description:** Normalize series, align to monthly frequency, create target variables, and generate lag/rolling/change features.

**Acceptance criteria:**
- [ ] Headline CPI YoY and core CPI YoY targets can both be generated.
- [ ] Feature matrices are written to the gold layer.
- [ ] Feature generation is cutoff-aware and avoids future leakage.

**Verification:**
- [ ] Run preprocessing tests.
- [ ] Run leakage-prevention tests.

**Dependencies:** Task 3

**Files likely touched:**
- `src/processing/`
- `tests/processing/`

**Estimated scope:** Medium

## Task 5: Implement model training and backtesting
**Description:** Train baseline and performance-oriented models, then evaluate with walk-forward validation.

**Acceptance criteria:**
- [ ] At least one baseline model and one high-performance model can be trained.
- [ ] Walk-forward backtests report point error and interval calibration metrics.
- [ ] Model artifacts and metadata are persisted in the local model registry.

**Verification:**
- [ ] Run training tests.
- [ ] Run backtest tests on fixture data.

**Dependencies:** Task 4

**Files likely touched:**
- `src/training/`
- `models/registry/`
- `tests/training/`

**Estimated scope:** Medium

## Task 6: Implement probabilistic inference
**Description:** Load the latest model and recent data to produce probabilistic forecasts for selected horizons.

**Acceptance criteria:**
- [ ] Inference response includes median, lower interval, upper interval, target, horizon, model version, and data cutoff.
- [ ] Forecasts support both headline CPI YoY and core CPI YoY.
- [ ] Inference logs are stored locally.

**Verification:**
- [ ] Run inference API or CLI tests.

**Dependencies:** Task 5

**Files likely touched:**
- `src/inference/`
- `tests/inference/`

**Estimated scope:** Small

## Task 7: Build React/Next.js analyst UI
**Description:** Create the UI for data selection, training configuration, model run comparison, and forecast review.

**Acceptance criteria:**
- [ ] Users can select target, feature families, model family, and horizon.
- [ ] Users can start a training run and inspect run status.
- [ ] Users can compare model metrics and view probabilistic forecast charts.
- [ ] UI displays data cutoff, model version, and source freshness.

**Verification:**
- [ ] Run frontend tests.
- [ ] Run build command.
- [ ] Manually verify the training and forecast flow in the browser.

**Dependencies:** Tasks 5-6

**Files likely touched:**
- `app/` or `src/app/`
- `components/`
- `src/lib/`
- `tests/`

**Estimated scope:** Medium

## Task 8: Add local refresh and quality gates
**Description:** Add scheduled refresh, data quality checks, and model promotion gates.

**Acceptance criteria:**
- [ ] Data refresh jobs can run locally on a documented schedule.
- [ ] Data quality checks detect missing values, schema drift, and outlier conditions.
- [ ] Model promotion requires passing backtest and calibration thresholds.

**Verification:**
- [ ] Run data quality tests.
- [ ] Run model promotion gate tests.

**Dependencies:** Tasks 3-7

**Files likely touched:**
- `src/ingestion/`
- `src/processing/`
- `src/training/`
- `docs/`

**Estimated scope:** Medium
