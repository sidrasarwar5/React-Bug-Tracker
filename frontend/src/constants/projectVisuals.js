import { Smartphone, Video, Circle, Cat, Box, Headphones } from "lucide-react";
import { hashStringToIndex } from "../utils/hash";

// Pool of icon+background pairs. A project's icon is derived from its name
// via hashStringToIndex, so it never needs to be stored in the backend and
// stays the same every time the same project renders.
const PROJECT_VISUALS = [
  { icon: Smartphone, bg: "bg-teal-100", color: "text-teal-600" },
  { icon: Video, bg: "bg-lime-100", color: "text-lime-600" },
  { icon: Circle, bg: "bg-pink-100", color: "text-pink-600" },
  { icon: Cat, bg: "bg-purple-100", color: "text-purple-600" },
  { icon: Box, bg: "bg-orange-100", color: "text-orange-600" },
  { icon: Headphones, bg: "bg-blue-100", color: "text-blue-600" },
];

export function getProjectVisual(projectName) {
  const index = hashStringToIndex(projectName || "", PROJECT_VISUALS.length);
  return PROJECT_VISUALS[index];
}

// Single source of truth for project status → label/color.
// Add a new status here and ProjectCard/StatusBadge pick it up automatically.
export const PROJECT_STATUSES = {
  active: { label: "Active", color: "text-status-progress", dot: "bg-status-progress" },
  completed: { label: "Completed", color: "text-status-closed", dot: "bg-status-closed" },
  on_hold: { label: "On Hold", color: "text-status-pending", dot: "bg-status-pending" },
};
