# Physio Reports Schema (Per-Athlete)

This document describes the redesigned Physio Reports schema optimized for scalability and simple insertion, modeled as one document per athlete with a nested `physioMetrics` array of report entries.

## Schema Versioning

- Current schema version: `1`
- Each report entry carries a `version` field. Increment this value when the structure of report entries evolves.
- Backward compatibility is intentionally disregarded for this design; migrate existing data by transforming individual reports into array entries under each athlete document.

## Document Structure

- `athleteId` (ObjectId, required, unique): Athlete this document belongs to.
- `physioMetrics` (Array<ReportEntry>, required): List of physiotherapist reports for the athlete.
- `createdAt` (Date): Auto-populated by Mongoose timestamps.
- `updatedAt` (Date): Auto-updated by Mongoose timestamps.

### ReportEntry

- `physioId` (ObjectId, required): Physiotherapist who created the report.
- `reportDate` (Date, required): Assessment date.
- `version` (Number, default: `1`): Schema version for the report entry.
- `metrics` (Object, required): Physiological metrics.
  - `hqRatio` (Number, 0–200)
  - `peakDynamicKneeValgusDeg` (Number, 0–90)
  - `trunkLeanLandingDeg` (Number, 0–45)
  - `cmjPeakPowerWkg` (Number, 0–100)
  - `beightonScore` (Number, 0–9)
  - `anatomicalRisk` (String)
  - `mvicLsi` (Number, 0–150)
  - `emgOnsetDelayMs` (Number, 0–200)
- `assessment` (Object, optional):
  - `findings` (String[])
  - `summary` (String)
  - `riskLevel` (Enum: `Low`, `Moderate`, `High`)
- `treatment` (Object, optional):
  - `plan` (String)
  - `exercises` (Array<{ name: String, frequencyPerWeek: Number, notes: String }>)
  - `modalities` (String[])
  - `nextVisitDate` (Date)
- `notes` (String, optional)

## Indexing Strategy

- Primary: unique per `athleteId` via field-level `unique: true`.
- Secondary:
  - `physioMetrics.reportDate` (descending) for date range queries.
  - `physioMetrics.physioId` for filtering by physiotherapist.
- Compound:
  - `{ athleteId: 1, 'physioMetrics.reportDate': -1 }` for athlete + date queries.
  - `{ athleteId: 1, 'physioMetrics.version': 1 }` to filter by schema version.

## Array Size Management

- Maximum entries per athlete: `MAX_REPORTS_PER_ATHLETE = 1000`.
- On save, older entries are trimmed, keeping only the most recent `1000` entries.
- Validation prevents insertion beyond the cap.

## Example Document

```json
{
  "athleteId": "663e2edb7b9c37581c1fd3be",
  "physioMetrics": [
    {
      "_id": "6650e97f4c71b6169e6d8912",
      "physioId": "663e2edb7b9c37581c1fd3aa",
      "reportDate": "2025-05-10T00:00:00.000Z",
      "version": 1,
      "metrics": {
        "hqRatio": 85.2,
        "peakDynamicKneeValgusDeg": 18,
        "trunkLeanLandingDeg": 12,
        "cmjPeakPowerWkg": 54.3,
        "beightonScore": 3,
        "anatomicalRisk": "valgus-knee",
        "mvicLsi": 92,
        "emgOnsetDelayMs": 35
      },
      "assessment": {
        "findings": ["Dominant valgus during landing"],
        "summary": "Moderate risk due to dynamic valgus",
        "riskLevel": "Moderate"
      },
      "treatment": {
        "plan": "Glute strengthening + landing drills",
        "exercises": [
          { "name": "Hip abduction", "frequencyPerWeek": 3, "notes": "RPE 6" }
        ],
        "modalities": ["Neuromuscular training"],
        "nextVisitDate": "2025-05-24T00:00:00.000Z"
      },
      "notes": "Monitor valgus improvements bi-weekly"
    }
  ],
  "createdAt": "2025-05-10T12:41:00.000Z",
  "updatedAt": "2025-05-10T12:41:21.000Z"
}
```

## Common Query Patterns

- List reports for a physiotherapist over a date range:
```ts
const docs = await PhysioReports.find({ athleteId: { $in: athleteIds } }).lean();
const reports = docs.flatMap(doc => doc.physioMetrics.filter(entry => {
  return String(entry.physioId) === physioId &&
         entry.reportDate >= from && entry.reportDate <= to;
}));
```

- Push a new report entry for an athlete:
```ts
let doc = await PhysioReports.findOne({ athleteId });
const entry = { physioId, reportDate, version: 1, metrics, assessment, treatment, notes };
if (!doc) {
  doc = await PhysioReports.create({ athleteId, physioMetrics: [entry] });
} else {
  doc.physioMetrics.push(entry);
  await doc.save();
}
```

---

This schema design prioritizes scalable per-athlete storage, fast queries, and simple insertion, while intentionally dropping backward compatibility with the previous one-report-per-document model.

