import { UserCog, Code2, Bug } from "lucide-react";

// Single source of truth for account type options.
// Add a new role here and both AccountTypePage and Signup pick it up — no JSX edits needed.
export const ACCOUNT_TYPES = [
  {
    value: "manager",
    label: "Manager",
    description: "Signup as a manager to manage the tasks and bugs",
    icon: UserCog,
  },
  {
    value: "developer",
    label: "Developer",
    description: "Signup as a Developer to assign the relevant task to QA",
    icon: Code2,
  },
  {
    value: "qa",
    label: "QA",
    description: "Signup as a QA to create the bugs and report in tasks",
    icon: Bug,
  },
];