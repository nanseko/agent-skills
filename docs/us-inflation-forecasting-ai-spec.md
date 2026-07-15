# Spec: US Inflation Forecasting AI Tool

## Objective
Build a React/Next.js web application and local data platform that lets analysts and data scientists select macroeconomic and consumer price datasets, train high-performance forecasting models, and use the trained models to probabilistically forecast future US inflation.

The tool targets both headline CPI year-over-year inflation and core CPI year-over-year inflation. Success means users can ingest trusted historical data, construct reproducible training datasets, compare model runs, and generate recent-data forecasts with uncertainty intervals.

## Tech Stack
- Frontend: React with Next.js.
- Backend/API: Next.js API routes or a Python API service, depending on the final application scaffold.
- Data ingestion and modeling: Python-based pipelines are recommended for API collection, preprocessing, model training, and inference.
- Storage: Local filesystem.
- Data formats: Raw source snapshots as JSON/CSV/HTML where applicable; curated model-ready datasets as Parquet.
- Model registry: Local filesystem artifacts with metadata files for model version, feature set, training cutoff, validation metrics, and prediction interval method.

## Data Scope
The first production-quality dataset catalog should include:

- Historical US inflation rates.
- Headline CPI and core CPI.
- US housing prices and housing price growth.
- Household debt amount.
- Consumer price index components.
- At least 50 representative CPI product or product-category price series.
- Crude oil prices.
- US average gasoline prices.

Preferred source families include BLS CPI data, FRED/Federal Reserve data, FHFA or Case-Shiller housing indexes, EIA oil and gasoline data, and NY Fed or Federal Reserve household debt data.

## Commands
The exact commands depend on the final app scaffold. The implementation should converge on commands similar to:

```bash
npm install
npm run dev
npm run build
npm run lint
npm test
python -m pip install -r requirements.txt
python -m pytest
python -m src.ingestion.run --source all
python -m src.processing.build_features --target headline_cpi_yoy
python -m src.training.train --target headline_cpi_yoy --horizon 12
python -m src.inference.predict --model latest --horizon 12
```

## Project Structure
Recommended structure for the application project:

```text
app/ or src/app/              Next.js application routes and pages
components/                   Shared React components
src/ingestion/                API, download, and crawling collectors
src/processing/               Cleaning, alignment, feature engineering
src/training/                 Model training and backtesting
src/inference/                Forecast generation and model loading
src/lib/                      Shared utilities and schemas
data/raw/                     Unmodified source snapshots
data/bronze/                  Normalized source data
data/silver/                  Cleaned, aligned time series
data/gold/                    Model-ready feature matrices
models/registry/              Model artifacts, metrics, and metadata
tests/                        Unit and integration tests
docs/                         Product, data, and architecture documentation
tasks/                        Plan and implementation task lists
```

## Code Style
Prefer explicit, typed configuration objects and metadata-driven pipelines. A representative configuration style:

```ts
export type ForecastTarget = "headline_cpi_yoy" | "core_cpi_yoy";

export interface TrainingRunConfig {
  target: ForecastTarget;
  horizonMonths: 1 | 3 | 6 | 12;
  featureSetId: string;
  modelFamily: "xgboost" | "lightgbm" | "ensemble" | "baseline";
  trainingCutoff: string;
  intervalMethod: "quantile" | "conformal" | "ensemble";
}
```

Key conventions:

- Keep source-specific ingestion isolated from shared normalization logic.
- Persist metadata for every dataset, feature matrix, model, and prediction.
- Do not silently overwrite raw source snapshots.
- Avoid leaking future data into training features.
- Prefer composable pipeline steps over one-off scripts.

## Testing Strategy
Testing should cover data, modeling, and UI workflows:

- Unit tests for source parsers, schema validation, frequency conversion, lag generation, and target construction.
- Integration tests for ingestion-to-gold dataset builds using small fixtures.
- Time-series leakage tests to ensure no feature uses data after the training cutoff.
- Backtest tests for walk-forward validation and prediction interval coverage calculations.
- API tests for training job creation, model registry lookup, and inference responses.
- UI tests for dataset selection, training configuration, job status, and forecast result rendering.

## Boundaries
- Always: Store raw snapshots before transformation.
- Always: Record source metadata, collection timestamp, training cutoff, feature set version, and model version.
- Always: Report probabilistic forecasts with uncertainty intervals, not only point forecasts.
- Always: Support both headline CPI YoY and core CPI YoY targets.
- Ask first: Adding paid data providers, cloud object storage, or external hosted model services.
- Ask first: Replacing the local filesystem storage assumption with S3, GCS, Azure Blob, or a database-first design.
- Never: Commit API keys, credentials, or proprietary data.
- Never: Train with random train/test splits for time-series evaluation.
- Never: Use future values when constructing features for a historical training cutoff.

## Success Criteria
- Users can select headline CPI YoY or core CPI YoY as the forecast target.
- Users can select source datasets and feature families from a React/Next.js Web UI.
- The system can ingest and locally store historical CPI, housing, household debt, crude oil, gasoline, and at least 50 representative CPI product or category series.
- The system can build a reproducible model-ready dataset from local files.
- The system can train high-performing forecasting models and compare them against baselines.
- The system can produce probabilistic forecasts for selected horizons using the latest available data.
- Backtesting reports include point error metrics and interval calibration metrics.

## Open Questions
- Should the backend be implemented entirely in Next.js API routes, or should Python own ingestion/training/inference behind the Next.js UI?
- Which model families are required for the first release: gradient boosting only, or boosting plus deep learning/ensembles?
- Should users be able to upload custom local datasets in addition to built-in collectors?
- How should local scheduled jobs run: cron, a Node worker, a Python scheduler, or a task queue?
