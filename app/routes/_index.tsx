import { useEffect } from "react";
import GoalForm from "~/components/GoalForm";
import GoalList from "~/components/GoalList";
import ThemeToggle from "~/components/ThemeToggle";
import Dashboard from "~/components/Dashboard";
import ChartComponent from "~/components/ChartComponent";
import Notification from "~/components/Notification";
import { useGoalStore } from "~/store/useGoalStore";
import { GoalData, Goal } from "~/models/goal"; // Importiere Goal-Klasse

export default function Index() {
  const resetRepeatingGoals = useGoalStore((state) => state.resetRepeatingGoals);
  const goals = useGoalStore((state) => state.goals);
  const importGoals = useGoalStore((state) => state.importGoals);

  useEffect(() => {
    const interval = setInterval(() => {
      resetRepeatingGoals();
    }, 24 * 60 * 60 * 1000); // Alle 24 Stunden
    return () => clearInterval(interval);
  }, [resetRepeatingGoals]);

  const handleExport = () => {
    const data = JSON.stringify(goals.map((goal) => goal.toJSON()));
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "goals.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedGoals = JSON.parse(event.target?.result as string) as GoalData[];
          importGoals(importedGoals);
          e.target.value = ""; // Zurücksetzen des File-Inputs
        } catch (err) {
          console.error("Fehler beim Import:", err);
          alert("Ungültiges Dateiformat");
        }
      };
      reader.readAsText(file);
    }
  };

  // Debugging: Überprüfe die Struktur der goals
  useEffect(() => {
    goals.forEach((goal) => {
      if (!(goal instanceof Goal) || typeof goal.isOverdue !== "function") {
        console.warn("Ungültiges Goal-Objekt gefunden:", goal);
      }
    });
  }, [goals]);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex justify-between items-center py-4 border-b-2 border-indigo-200 dark:border-indigo-800">
          <h1 className="text-4xl font-extrabold text-indigo-800 dark:text-indigo-200 tracking-wide">
            StudyTracker
          </h1>
          <ThemeToggle />
        </header>
        <main>
          <GoalForm />
          <div className="flex gap-4 mt-6">
            <button
              onClick={handleExport}
              className="bg-green-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-green-700 transition-transform transform hover:scale-105"
            >
              Export Goals
            </button>
            <label className="bg-purple-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-purple-700 transition-transform transform hover:scale-105 cursor-pointer">
              Import Goals
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </div>
          <Dashboard />
          <ChartComponent />
          <GoalList />
          <Notification />
        </main>
      </div>
    </div>
  );
}
