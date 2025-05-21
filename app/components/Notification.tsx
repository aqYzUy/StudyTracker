import { useEffect } from "react";
import { useGoalStore } from "~/store/useGoalStore";
import { Goal } from "~/models/goal";

export default function Notification() {
  const goals = useGoalStore((state) => state.goals);

  useEffect(() => {
    goals.forEach((goal: Goal) => {
      if (goal.isOverdue() && !goal.completed) {
        alert(`Deadline for "${goal.title}" is overdue!`);
      }
    });
  }, [goals]);

  return null; // Keine UI, nur Logik
}