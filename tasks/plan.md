# Implementation Plan: US Inflation Forecasting AI Tool

## Overview
Build a local-filesystem-backed forecasting platform with a React/Next.js Web UI for analysts and data scientists. The platform ingests official US macroeconomic and price data, creates reproducible feature matrices, trains high-performance inflation forecasting models, and serves probabilistic forecasts for headline CPI YoY and core CPI YoY.

## Architecture Decisions
- Use React/Next.js for the Web UI because the user selected React/Next.js.
- Use the local filesystem for raw data, curated datasets, and model artifacts because the user selected local storage.
- Treat headline CPI YoY and core CPI YoY as first-class targets rather than choosing one as a derived extension.
- Optimize for predictive performance while still preserving enough metadata for analyst review and reproducibility.
- Use time-series backtesting and probabilistic forecast intervals as production gates.

## Dependency Graph

```text
Data source catalog
  -> Ingestion interfaces and raw storage
    -> Normalized bronze datasets
      -> Silver aligned monthly time series
        -> Gold feature matrices
          -> Baseline and high-performance model training
            -> Backtesting and model registry
              -> Inference API
                -> React/Next.js training and forecast UI
```

## Task List

### Phase 1: Specification and Data Foundations
- [ ] Task 1: Create source catalog for CPI, housing, household debt, oil, gasoline, and representative CPI product series.
- [ ] Task 2: Define local data lake layout and metadata conventions.
- [ ] Task 3: Implement ingestion interfaces and source-specific collectors.
- [ ] Task 4: Add raw snapshot persistence and source metadata tracking.

### Checkpoint: Data Foundation
- [ ] Source catalog reviewed.
- [ ] Local folder layout documented.
- [ ] At least one source can be collected and saved as a raw snapshot.
- [ ] No credentials or generated large data files are committed.

### Phase 2: Preprocessing and Feature Engineering
- [ ] Task 5: Normalize collected series into bronze schemas.
- [ ] Task 6: Align series to a monthly calendar in silver datasets.
- [ ] Task 7: Define at least 50 representative CPI product/category series.
- [ ] Task 8: Build gold feature matrices for headline CPI YoY and core CPI YoY.
- [ ] Task 9: Add leakage-prevention checks for cutoff-based training.

### Checkpoint: Feature Pipeline
- [ ] Gold datasets are reproducible from local source files.
- [ ] Headline and core targets are both available.
- [ ] Feature matrices include lag, rolling, month-over-month, and year-over-year features.
- [ ] Leakage tests pass.

### Phase 3: Modeling and Backtesting
- [ ] Task 10: Implement naive and statistical baselines.
- [ ] Task 11: Implement high-performance model training with gradient boosting or ensembles.
- [ ] Task 12: Add probabilistic intervals using quantile, conformal, or ensemble methods.
- [ ] Task 13: Implement walk-forward backtesting and calibration metrics.
- [ ] Task 14: Persist model artifacts, run metadata, and evaluation reports.

### Checkpoint: Modeling
- [ ] Models are compared against baselines.
- [ ] Forecast results include median and uncertainty interval outputs.
- [ ] Backtests report point accuracy and interval calibration.
- [ ] Model registry records model version, feature set, target, horizon, and training cutoff.

### Phase 4: React/Next.js Web UI and APIs
- [ ] Task 15: Implement dataset and feature selection UI.
- [ ] Task 16: Implement training configuration and job submission API.
- [ ] Task 17: Implement run comparison and backtest result views.
- [ ] Task 18: Implement probabilistic forecast API and forecast result page.
- [ ] Task 19: Show latest data cutoff, source freshness, and model version metadata in the UI.

### Checkpoint: End-to-End Workflow
- [ ] Analyst can select target, features, model family, and horizon.
- [ ] Analyst can run training and inspect metrics.
- [ ] Analyst can generate recent-data forecasts with uncertainty intervals.
- [ ] UI clearly identifies source data cutoff and model version.

### Phase 5: Operations and Quality Gates
- [ ] Task 20: Add scheduled local data refresh workflow.
- [ ] Task 21: Add data quality checks for schema drift, missing values, and outliers.
- [ ] Task 22: Add model promotion gates based on backtest and calibration thresholds.
- [ ] Task 23: Add documentation for setup, data refresh, model training, and inference.

### Checkpoint: Production Readiness
- [ ] Fresh data can be collected on schedule.
- [ ] Failed jobs are visible and retryable.
- [ ] Model promotion requires passing evaluation gates.
- [ ] Documentation is sufficient for analysts and data scientists to operate the tool locally.

## Risks and Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| CPI product-level series selection is ambiguous | High | Create a reviewed basket definition with categories, series IDs, and fallback rules. |
| Data sources update at different frequencies | Medium | Align to monthly calendar and track source freshness per series. |
| Time leakage inflates performance | High | Add cutoff-aware feature generation and automated leakage tests. |
| Local filesystem grows large | Medium | Store raw snapshots carefully, use Parquet for curated data, and document cleanup policies. |
| Performance-focused models become hard to explain | Medium | Track feature importance, run metadata, and backtest reports even though prediction performance is the priority. |
| Long-running training blocks UI | Medium | Use background jobs or asynchronous execution with job status polling. |

## Open Questions
- Should Python own all ingestion, processing, training, and inference while Next.js owns only UI/API orchestration?
- Should model training run synchronously for MVP or through a background worker from the beginning?
- Should custom user-uploaded datasets be supported in the first release?
- Which probabilistic method should be the first production default: quantile regression, conformal prediction, or ensemble intervals?
