import React, { useMemo, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { BodyPartKey } from "@/components/BodyModel";

type BodyPartSelectorModalProps = {
  open: boolean;
  onClose: () => void;
  onSelect: (part: BodyPartKey) => void;
  selected?: BodyPartKey | null;
};

const parts: { key: BodyPartKey; label: string }[] = [
  { key: "chest", label: "Chest" },
  { key: "leftHip", label: "Hip (Left)" },
  { key: "rightHip", label: "Hip (Right)" },
  { key: "leftThigh", label: "Thigh (Left)" },
  { key: "rightThigh", label: "Thigh (Right)" },
  { key: "leftHamstring", label: "Hamstring (Left)" },
  { key: "rightHamstring", label: "Hamstring (Right)" },
  { key: "leftGlute", label: "Glute (Left)" },
  { key: "rightGlute", label: "Glute (Right)" },
  { key: "leftKnee", label: "Knee (Left)" },
  { key: "rightKnee", label: "Knee (Right)" },
  { key: "leftArm", label: "Arm (Left)" },
  { key: "rightArm", label: "Arm (Right)" },
  { key: "leftFoot", label: "Foot (Left)" },
  { key: "rightFoot", label: "Foot (Right)" },
];

export function BodyPartSelectorModal({ open, onClose, onSelect, selected }: BodyPartSelectorModalProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return parts;
    return parts.filter((p) => p.label.toLowerCase().includes(q) || p.key.toLowerCase().includes(q));
  }, [query]);

  return (
    <Modal open={open} onClose={onClose}>
      <div className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="bp-search">Search body part</Label>
          <Input
            id="bp-search"
            placeholder="Type to filter (e.g., Knee, Left)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {filtered.map((p) => {
            const isSelected = selected === p.key;
            return (
              <Button
                key={p.key}
                type="button"
                variant={isSelected ? "default" : "outline"}
                className={isSelected ? "border-primary" : ""}
                onClick={() => {
                  onSelect(p.key);
                  onClose();
                }}
              >
                {p.label}
              </Button>
            );
          })}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default BodyPartSelectorModal;

