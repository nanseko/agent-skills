# Implementation Plan: Economic Data Ingestion Catalog and Interfaces

## Overview
Add a data source catalog for required U.S. macro/housing/energy/household-debt datasets and design collector interfaces under `src/ingestion/` so future implementations preserve raw snapshots, source metadata, collection timestamps, and environment-only API key configuration.

## Architecture Decisions
- Keep the data catalog in `docs/data-source-catalog.md` because it is durable reference material rather than executable code.
- Add language-agnostic TypeScript interface definitions in `src/ingestion/interfaces.ts` to document source-specific collector contracts without introducing dependencies.
- Include source-specific interface extensions for BLS, FRED, housing, EIA, and Federal Reserve household-debt collectors while sharing a common raw snapshot envelope.

## Task List

### Phase 1: Documentation foundation
- [x] Task 1: Add catalog with required source metadata fields and target paths.

### Phase 2: Collector contracts
- [x] Task 2: Add ingestion interface definitions that require raw snapshots, collected timestamps, and source metadata.
- [x] Task 3: Add ingestion README that explains environment-based secret handling and source collector expectations.

### Checkpoint: Complete
- [x] Documentation includes all required datasets.
- [x] Interfaces prevent hard-coded secrets by modeling API keys as environment variable references.

## Risks and Mitigations
| Risk | Impact | Mitigation |
| --- | --- | --- |
| Third-party license terms change | Medium | Catalog records source terms URL and requires review before production use. |
| API endpoint parameters drift | Medium | Interfaces preserve source metadata and raw snapshots for reproducible debugging. |
| Secrets accidentally committed | High | Interfaces allow only environment variable names, never secret values. |

## Open Questions
- Which warehouse/lake implementation will own the listed target tables/paths?
