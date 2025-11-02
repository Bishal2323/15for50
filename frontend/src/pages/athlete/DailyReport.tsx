import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Save, Send, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "react-router-dom";
import RealHuman from "@/components/custom/RealHuman";
import BodyModel, {
  type BodyPartKey,
  type AttributesState,
  type BodyPartAttributes,
} from "@/components/custom/BodyModel";
import BodyPartSelectorModal from "@/components/custom/BodyPartSelectorModal";
// RiskFactorModal removed: manual risk submission no longer collected from users
import { useUserStore } from "@/store/userStore";
import { submitDailyReport, type DailyReportData } from "@/lib/api";
// useRiskFactors removed from DailyReport: no manual risk factor submission

const reportSchema = z.object({
  date: z.string().optional(), // Date field for missed days
  sleepHours: z.number().min(0).max(24),
  sleepQuality: z.number().min(1).max(10),
  fatigueLevel: z.number().min(0).max(100),
  stressLevel: z.number().min(0).max(100),
  jointStrain: z.number().min(1).max(10).optional(),
  mood: z.number().min(1).max(10),
  trainingIntensity: z.number().min(0).max(100).optional(),
  trainingDuration: z.number().min(0).optional(),
  readinessToTrain: z.number().min(1).max(10),
  trainingRPE: z.number().min(1).max(10).optional(),
  trainingLoadSRPE: z.number().min(0).optional(),
  nonSportStressors: z.number().min(0).max(100),
  nonSportStressorsNotes: z.string().optional(),
  menstrualStatus: z.enum(["None", "Menstruation", "Follicular", "Ovulation", "Luteal"]).optional(),
  notes: z.string().optional(),
});

type ReportForm = z.infer<typeof reportSchema>;

// Pain areas and symptoms removed per requirements

export function DailyReport() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  // Daily risk factor modal removed
  const user = useUserStore((s) => s.user);
  // Removed manual risk factor submission handler
  const gender: "male" | "female" = (user?.gender ?? "male");

  const makeInitialAttributes = (): AttributesState => ({
    chest: { soreness: null, redness: null, swelling: null },
    leftHip: { soreness: null, redness: null, swelling: null },
    rightHip: { soreness: null, redness: null, swelling: null },
    leftThigh: { soreness: null, redness: null, swelling: null },
    rightThigh: { soreness: null, redness: null, swelling: null },
    leftHamstring: { soreness: null, redness: null, swelling: null },
    rightHamstring: { soreness: null, redness: null, swelling: null },
    leftGlute: { soreness: null, redness: null, swelling: null },
    rightGlute: { soreness: null, redness: null, swelling: null },
    leftKnee: { soreness: null, redness: null, swelling: null },
    rightKnee: { soreness: null, redness: null, swelling: null },
    leftArm: { soreness: null, redness: null, swelling: null },
    rightArm: { soreness: null, redness: null, swelling: null },
    leftFoot: { soreness: null, redness: null, swelling: null },
    rightFoot: { soreness: null, redness: null, swelling: null },
  });
  const [selectedPart, setSelectedPart] = useState<BodyPartKey | null>(null);
  const [attributes, setAttributes] = useState<AttributesState>(makeInitialAttributes());
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [hasRealModel, setHasRealModel] = useState<boolean>(false);

  useEffect(() => {
    const path = `/models/${gender}.glb`;
    fetch(path, { method: "GET", cache: "no-store" })
      .then((res) => {
        const ct = res.headers.get("content-type") || "";
        const isHtml = ct.includes("text/html");
        setHasRealModel(res.ok && !isHtml);
      })
      .catch(() => setHasRealModel(false));
  }, [gender]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ReportForm>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0], // Default to today's date
      sleepHours: 8,
      sleepQuality: 7,
      fatigueLevel: 30,
      stressLevel: 25,
      jointStrain: 1,
      mood: 7,
      readinessToTrain: 7,
      trainingIntensity: 70,
      trainingDuration: 90,
      trainingRPE: 5,
      trainingLoadSRPE: 0,
      nonSportStressors: 20,
      nonSportStressorsNotes: "",
      menstrualStatus: "None",
    },
  });

  const watchedValues = watch();

  // Compute s-RPE training load automatically from RPE and duration
  useEffect(() => {
    const rpe = watchedValues.trainingRPE || 0;
    const dur = watchedValues.trainingDuration || 0;
    const load = Math.round(rpe * dur);
    setValue("trainingLoadSRPE", load as any);
  }, [watchedValues.trainingRPE, watchedValues.trainingDuration]);

  const onSubmit = async (data: ReportForm) => {
    setIsSubmitting(true);
    try {
      // Prepare the report data including body attributes
      const reportData: DailyReportData = {
        ...data,
        bodyAttributes: attributes,
      };

      console.log("Submitting report:", reportData);

      // Submit to backend
      const response = await submitDailyReport(reportData);

      console.log("Report submitted successfully:", response);
      // Directly show success since risk factor modal is removed
      setSubmitSuccess(true);
    } catch (error) {
      console.error("Failed to submit report:", error);
      // You might want to show an error message to the user here
      alert("Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Risk factor submission removed

  const handleSliderChange = (field: keyof ReportForm, value: number[]) => {
    setValue(field, value[0] as any);
  };
  // Checkbox handler removed (painAreas/symptoms no longer present)

  if (submitSuccess) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="h-12 w-12 rounded-full bg-safe/20 flex items-center justify-center mx-auto mb-4">
              <Send className="h-6 w-6 text-safe" />
            </div>
            <h2 className="text-2xl font-bold mb-2">
              Report Submitted Successfully!
            </h2>
            <p className="text-muted-foreground mb-6">
              Your daily report has been recorded and will be analyzed for risk
              assessment.
            </p>
            <div className="flex gap-3 justify-center">
              <Button asChild>
                <Link to="/athlete">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <Button variant="outline" onClick={() => setSubmitSuccess(false)}>
                Submit Another Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/athlete">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Daily Report</h1>
          <p className="text-muted-foreground">
            Complete your daily health and wellness assessment
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Date Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Report Date</CardTitle>
            <CardDescription>
              Select the date for this report (useful for missed days)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                {...register("date")}
                className="w-full md:w-auto"
              />
              {errors.date && (
                <p className="text-sm text-red-500">{errors.date.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Sleep & Recovery */}
        <Card>
          <CardHeader>
            <CardTitle>Sleep &amp; Recovery</CardTitle>
            <CardDescription>
              How well did you sleep and recover?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="sleepHours">Sleep Hours</Label>
                <Input
                  id="sleepHours"
                  type="number"
                  step="0.5"
                  min="0"
                  max="24"
                  {...register("sleepHours", { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-3">
                <Label>
                  Sleep Quality (1-10): {watchedValues.sleepQuality}
                </Label>
                <Slider
                  value={[watchedValues.sleepQuality]}
                  onValueChange={(value) =>
                    handleSliderChange("sleepQuality", value)
                  }
                  max={10}
                  min={1}
                  step={1}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Physical State */}
        <Card>
          <CardHeader>
            <CardTitle>Physical State</CardTitle>
            <CardDescription>How is your body feeling today?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label>Fatigue Level (%): {watchedValues.fatigueLevel}</Label>
                <Slider
                  value={[watchedValues.fatigueLevel]}
                  onValueChange={(value) =>
                    handleSliderChange("fatigueLevel", value)
                  }
                  max={100}
                  min={0}
                  step={5}
                />
              </div>
              <div className="space-y-3">
                <Label>Stress Level (%): {watchedValues.stressLevel}</Label>
                <Slider
                  value={[watchedValues.stressLevel]}
                  onValueChange={(value) =>
                    handleSliderChange("stressLevel", value)
                  }
                  max={100}
                  min={0}
                  step={5}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Body Map */}
        <Card>
          <CardHeader>
            <CardTitle>Body Map</CardTitle>
            <CardDescription>
              Click a body area to mark soreness, redness, and swelling
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-md border bg-muted/10">
                <div className="h-[420px]">
                  {hasRealModel ? (
                    <RealHuman
                      gender={gender}
                      selected={selectedPart}
                      attributes={attributes}
                      onSelect={setSelectedPart}
                    />
                  ) : (
                    <BodyModel
                      selected={selectedPart}
                      attributes={attributes}
                      onSelect={setSelectedPart}
                    />
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <Label>Selected Area</Label>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {selectedPart ? selectedPart : "None (click a hotspot)"}
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSelectorOpen(true)}
                  >
                    Search Body Part
                  </Button>
                </div>

                {selectedPart ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Soreness (0-10){attributes[selectedPart].soreness == null ? ' (not set)' : ''}</Label>
                      <Slider
                        value={[attributes[selectedPart].soreness ?? 0]}
                        onValueChange={(v) =>
                          setAttributes((prev) => ({
                            ...prev,
                            [selectedPart]: {
                              ...prev[selectedPart],
                              soreness: v[0],
                            },
                          }))
                        }
                        min={0}
                        max={10}
                        step={1}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Redness (0-10){attributes[selectedPart].redness == null ? ' (not set)' : ''}</Label>
                      <Slider
                        value={[attributes[selectedPart].redness ?? 0]}
                        onValueChange={(v) =>
                          setAttributes((prev) => ({
                            ...prev,
                            [selectedPart]: {
                              ...prev[selectedPart],
                              redness: v[0],
                            },
                          }))
                        }
                        min={0}
                        max={10}
                        step={1}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Swelling (0-10){attributes[selectedPart].swelling == null ? ' (not set)' : ''}</Label>
                      <Slider
                        value={[attributes[selectedPart].swelling ?? 0]}
                        onValueChange={(v) =>
                          setAttributes((prev) => ({
                            ...prev,
                            [selectedPart]: {
                              ...prev[selectedPart],
                              swelling: v[0],
                            },
                          }))
                        }
                        min={0}
                        max={10}
                        step={1}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Notes (optional)</Label>
                      <Textarea
                        rows={3}
                        placeholder="Describe the area or symptoms..."
                        value={attributes[selectedPart].notes || ""}
                        onChange={(e) =>
                          setAttributes((prev) => ({
                            ...prev,
                            [selectedPart]: {
                              ...prev[selectedPart],
                              notes: e.target.value,
                            },
                          }))
                        }
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          setAttributes((prev) => ({
                            ...prev,
                            [selectedPart]: {
                              soreness: null,
                              redness: null,
                              swelling: null,
                              notes: undefined,
                            } as BodyPartAttributes,
                          }))
                        }
                      >
                        Clear Selected Area
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setSelectedPart(null)}
                      >
                        Clear Selection
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Alert>
                    <AlertDescription>
                      No area selected. Click on the model to choose a body
                      part.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mental State */}
        <Card>
          <CardHeader>
            <CardTitle>Mental State</CardTitle>
            <CardDescription>
              How are you feeling mentally and emotionally?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>Mood (1-10): {watchedValues.mood}</Label>
              <Slider
                value={[watchedValues.mood]}
                onValueChange={(value) => handleSliderChange("mood", value)}
                max={10}
                min={1}
                step={1}
              />
            </div>
            <div className="space-y-3">
              <Label>
                Energy/Readiness to Train (1-10): {watchedValues.readinessToTrain}
              </Label>
              <Slider
                value={[watchedValues.readinessToTrain || 1]}
                onValueChange={(value) =>
                  handleSliderChange("readinessToTrain", value)
                }
                max={10}
                min={1}
                step={1}
              />
            </div>
          </CardContent>
        </Card>



        {/* Training */}
        <Card>
          <CardHeader>
            <CardTitle>Training (Optional)</CardTitle>
            <CardDescription>
              If you trained today, please provide details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label>
                  Training Intensity (%): {watchedValues.trainingIntensity}
                </Label>
                <Slider
                  value={[watchedValues.trainingIntensity || 0]}
                  onValueChange={(value) =>
                    handleSliderChange("trainingIntensity", value)
                  }
                  max={100}
                  min={0}
                  step={5}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="trainingDuration">Duration (minutes)</Label>
                <Input
                  id="trainingDuration"
                  type="number"
                  min="0"
                  {...register("trainingDuration", { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-3">
                <Label>Session RPE (1-10): {watchedValues.trainingRPE}</Label>
                <Slider
                  value={[watchedValues.trainingRPE || 0]}
                  onValueChange={(value) =>
                    handleSliderChange("trainingRPE", value)
                  }
                  max={10}
                  min={0}
                  step={1}
                />
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Training Load (s-RPE): {watchedValues.trainingLoadSRPE || 0}
            </div>
            <div className="space-y-3 mt-4">
              <Label>Joint Strain (1-10): {watchedValues.jointStrain}</Label>
              <Slider
                value={[watchedValues.jointStrain || 1]}
                onValueChange={(value) =>
                  handleSliderChange("jointStrain", value)
                }
                max={10}
                min={1}
                step={1}
              />
            </div>
          </CardContent>
        </Card>

        {/* Menstrual Status (female athletes) */}
        {gender === "female" && (
          <Card>
            <CardHeader>
              <CardTitle>Menstrual Status</CardTitle>
              <CardDescription>
                If applicable, select your current menstrual phase
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="menstrualStatus">Current status</Label>
                <select
                  id="menstrualStatus"
                  className="w-full h-9 rounded-md border bg-background px-3 text-sm"
                  {...register("menstrualStatus")}
                >
                  <option value="None">None/Not applicable</option>
                  <option value="Menstruation">Menstruation</option>
                  <option value="Follicular">Follicular</option>
                  <option value="Ovulation">Ovulation</option>
                  <option value="Luteal">Luteal</option>
                </select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Non-Sport Stressors */}
        <Card>
          <CardHeader>
            <CardTitle>Non-Sport Stressors</CardTitle>
            <CardDescription>
              Stress from academics, work, relationships, etc.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>
                Stressor Level (%): {watchedValues.nonSportStressors || 0}
              </Label>
              <Slider
                value={[watchedValues.nonSportStressors || 0]}
                onValueChange={(value) =>
                  handleSliderChange("nonSportStressors", value)
                }
                max={100}
                min={0}
                step={5}
              />
            </div>
            <div className="space-y-2">
              <Label>Notes (optional)</Label>
              <Textarea
                rows={3}
                placeholder="Describe major non-sport stressors..."
                {...register("nonSportStressorsNotes")}
              />
            </div>
          </CardContent>
        </Card>

        {/* Symptoms removed per requirement */}

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Notes</CardTitle>
            <CardDescription>
              Any other information you'd like to share?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Share any additional thoughts, concerns, or observations..."
              {...register("notes")}
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex gap-3 justify-end">
          <Button type="button" variant="outline">
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              "Submitting..."
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit Report
              </>
            )}
          </Button>
        </div>
      </form>

      <BodyPartSelectorModal
        open={selectorOpen}
        onClose={() => setSelectorOpen(false)}
        onSelect={(part) => setSelectedPart(part)}
        selected={selectedPart}
      />

      {/* Risk factor modal removed */}
    </div>
  );
}
