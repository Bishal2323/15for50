# Parameter → Database Field Mapping

This reference maps ACL risk parameters to database fields across models:
- Athlete daily reports (`AthleteReports.dailyReports.*`)
- Coach weekly reports (`CoachWeeklyReports.coachMetrics[*].metrics.*`)
- Physio reports (`PhysioReports.physioMetrics[*].metrics.*`)

Each item includes frequency/tier and classification.

## Workload Management
- Training Stress Balance (TSB) / Acute:Chronic Ratio
  - Frequency: Weekly / Tier 2
  - DB: `CoachWeeklyReports.coachMetrics[*].metrics.acwr`
  - Type: Number (0–3)
  - Notes: ACWR used as proxy for TSB.
- Session Internal Load (s-PEI)
  - Frequency: Daily / Tier 1
  - DB: `AthleteReports.dailyReports[*].trainingLoadSRPE`
  - Type: Number (≥0)
  - Notes: Derived from `trainingDuration * trainingRPE` where available.
- Body parts soreness
  - Frequency: Daily / Tier 1
  - DB: `AthleteReports.dailyReports[*].bodyAttributes[part].soreness`
  - Type: Number (0–10) or `null`
  - Notes: `bodyAttributes` is a Map keyed by body part; each entry stores `soreness`, `redness`, `swelling`, `notes`.

## Strength & Asymmetry
- Hamstring:Quadriceps (H:Q) Ratio
  - Frequency: Monthly/Bi-Monthly / Tier 3
  - DB: `PhysioReports.physioMetrics[*].metrics.hqRatio`
  - Type: Number (0–200)
- Quadriceps Strength LSI
  - Frequency: Weekly / Tier 2
  - DB: `CoachWeeklyReports.coachMetrics[*].metrics.quadricepsLsi`
  - Type: Number (0–150)
- Hamstring Strength LSI
  - Frequency: Weekly / Tier 2
  - DB: `CoachWeeklyReports.coachMetrics[*].metrics.hamstringsLsi`
  - Type: Number (0–150)
- Max Voluntary Isometric Contraction (MVIC) LSI
  - Frequency: Bi-Annual/Seasonal / Tier 3
  - DB: `PhysioReports.physioMetrics[*].metrics.mvicLsi`
  - Type: Number (0–150)
- Single-Leg Hop Distance LSI
  - Frequency: Weekly / Tier 2
  - DB: `CoachWeeklyReports.coachMetrics[*].metrics.singleLegHopLsi`
  - Type: Number (0–150)

## Neuromuscular Control
- Peak Dynamic Knee Valgus Angle
  - Frequency: Monthly/Bi-Monthly / Tier 3
  - DB: `PhysioReports.physioMetrics[*].metrics.peakDynamicKneeValgusDeg`
  - Type: Number (0–90°)
- Landing Error Scoring System (LESS)
  - Frequency: Weekly / Tier 2
  - DB: `CoachWeeklyReports.coachMetrics[*].metrics.lessScore`
  - Type: Number (0–20)
- Modified Y-Balance Test (Anterior Reach)
  - Frequency: Weekly / Tier 2
  - DB: `CoachWeeklyReports.coachMetrics[*].metrics.yBalanceAnteriorDiffCm`
  - Type: Number (0–50 cm)
- Trunk Control/Lean during Landing
  - Frequency: Monthly/Bi-Monthly / Tier 3
  - DB: `PhysioReports.physioMetrics[*].metrics.trunkLeanLandingDeg`
  - Type: Number (0–45°)
- Countermovement Jump (CMJ) Kinetics (Peak Power)
  - Frequency: Monthly/Bi-Monthly / Tier 3
  - DB: `PhysioReports.physioMetrics[*].metrics.cmjPeakPowerWkg`
  - Type: Number (0–100 W/kg)
- Single Leg Stance (SLS) Stability Time
  - Frequency: Weekly / Tier 2
  - DB: `CoachWeeklyReports.coachMetrics[*].metrics.slsStabilitySec`
  - Type: Number (0–300 sec)
- EMG Onset Timing
  - Frequency: Annual/Pre-Season / Tier 3
  - DB: `PhysioReports.physioMetrics[*].metrics.emgOnsetDelayMs`
  - Type: Number (0–200 ms)

## Mental & Recovery
- General Fatigue Level
  - Frequency: Daily / Tier 1
  - DB: `AthleteReports.dailyReports[*].fatigueLevel`
  - Type: Number (0–100)
- Stress/Mood Score
  - Frequency: Daily / Tier 1
  - DB: `AthleteReports.dailyReports[*].stressLevel`, `AthleteReports.dailyReports[*].mood`
  - Type: Number (0–100 for stress, 1–10 for mood)
- Non-Sport Stressors
  - Frequency: Daily / Tier 1
  - DB: `AthleteReports.dailyReports[*].nonSportStressors`
  - Type: Number (0–100)
- Specific Strain/Pain Check
  - Frequency: As needed
  - DB: `CoachWeeklyReports.coachMetrics[*].metrics.specificPainChecks[*].{ area, rating }`
  - Type: `[{ area: String, rating: Number (0–10) }]`
  - Notes: Daily pain fields also exist: `AthleteReports.dailyReports[*].painLevel`, `painAreas`.
- Menstrual Status
  - Frequency: Daily / Tier 1
  - DB: `AthleteReports.dailyReports[*].menstrualStatus`
  - Type: Enum (`None`, `Menstruation`, `Follicular`, `Ovulation`, `Luteal`)
- Perceived Sleep Quality
  - Frequency: Daily / Tier 1
  - DB: `AthleteReports.dailyReports[*].sleepQuality`
  - Type: Number (1–10)

## Anatomical & Fixed Risk
- Intercondylar Notch Width Index
  - Frequency: Once (Initial Screening) / Tier 3
  - DB: Not tracked
  - Notes: Consider adding to `PhysioReports.physioMetrics[*].metrics`.
- Tibial Slope Angle
  - Frequency: Once (Initial Screening) / Tier 3
  - DB: Not tracked
  - Notes: Consider adding to `PhysioReports.physioMetrics[*].metrics`.
- Anterior-Posterior Knee Laxity
  - Frequency: Once (Initial Screening) / Tier 3
  - DB: Not tracked
  - Notes: Consider adding to `PhysioReports.physioMetrics[*].metrics`.
- Beighton Score (Joint Laxity)
  - Frequency: Once (Initial Screening) / Tier 3
  - DB: `PhysioReports.physioMetrics[*].metrics.beightonScore`
  - Type: Number (0–9)
- Previous Injury History (Reported)
  - Frequency: Once (Initial Screening)
  - DB: Not tracked
  - Notes: Consider a dedicated collection (e.g., `InjuryHistory`) referenced from `User`.

## Field Paths Quick Reference
- Athlete daily: `AthleteReports.dailyReports[*].field`
- Coach weekly: `CoachWeeklyReports.coachMetrics[*].metrics.field`
- Physio: `PhysioReports.physioMetrics[*].metrics.field`

## Notes
- All arrays shown with `[*]` indicate subdocuments with their own `_id` and timestamps where applicable.
- Where multiple candidate fields exist (e.g., pain checks), the most semantically aligned field is listed first.
- “Not tracked” items are currently not implemented in the schema and would require schema updates to support.
