// app/components/GoalList.tsx

import { useGoalStore } from "~/store/useGoalStore";
import ProgressBar from "./ProgressBar";
import { FaTrash, FaClock } from "react-icons/fa";
import { Goal } from "~/models/goal";

export default function GoalList() {
  const goals = useGoalStore((state) => state.goals);
  const toggleGoal = useGoalStore((state) => state.toggleGoal);
  const deleteGoal = useGoalStore((state) => state.deleteGoal);
  const updateDeadline = useGoalStore((state) => state.updateDeadline);

  // Gruppiere nach Kategorie
  const categories = Array.from(
    new Set(goals.map((goal: Goal) => goal.category))
  );
  const groupedGoals = categories.map((category) => ({
    category,
    goals: goals.filter((goal: Goal) => goal.category === category),
  }));

  return (
    <div className="space-y-6 mt-6">
      {groupedGoals.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 italic">
          No goals added yet. Add a goal to get started!
        </p>
      ) : (
        groupedGoals.map(({ category, goals }) => (
          <div
            key={category}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 transition-all duration-300 hover:shadow-xl"
          >
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 border-b-2 border-indigo-200 dark:border-indigo-800 pb-2">
              {category}
            </h2>
            <ProgressBar goals={goals} />
            <ul className="space-y-3 mt-4">
              {goals.map((goal: Goal) => {
                const isOverdue =
                  typeof goal.isOverdue === "function" ? goal.isOverdue() : false;

                // WARNUNG, falls doch einmal kein Date vorliegt
                if (goal.deadline && !(goal.deadline instanceof Date)) {
                  console.warn(
                    `Ungültiges deadline-Objekt für Goal ${goal.id}:`,
                    goal.deadline
                  );
                }

                const displayDeadline =
                  goal.deadline instanceof Date &&
                  !isNaN(goal.deadline.getTime())
                    ? goal.deadline.toLocaleDateString()
                    : "Invalid Date";

                return (
                  <li
                    key={goal.id}
                    className={`flex items-center justify-between p-3 rounded-lg transition-colors duration-200 ${
                      isOverdue
                        ? "bg-red-100 dark:bg-red-900"
                        : "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={goal.completed || false}
                        onChange={() => toggleGoal(goal.id as string)}
                        className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 rounded cursor-pointer"
                        aria-label={`Mark ${goal.title} as completed`}
                      />
                      <span
                        className={
                          goal.completed
                            ? "line-through text-gray-500 dark:text-gray-400"
                            : "text-gray-800 dark:text-gray-200"
                        }
                      >
                        {goal.title}
                        {goal.repeatInterval && (
                          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                            (Every {goal.repeatInterval} day
                            {goal.repeatInterval > 1 ? "s" : ""})
                          </span>
                        )}
                        {goal.deadline && (
                          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                            <FaClock
                              className={isOverdue ? "text-red-500" : ""}
                            />{" "}
                            {displayDeadline}
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => deleteGoal(goal.id as string)}
                        className="text-red-500 hover:text-red-700 transition-colors duration-200"
                        aria-label={`Delete goal: ${goal.title}`}
                      >
                        <FaTrash size={16} />
                      </button>
                      <input
                        type="date"
                        defaultValue={
                          goal.deadline instanceof Date
                            ? goal.deadline.toISOString().split("T")[0]
                            : ""
                        }
                        onChange={(e) =>
                          updateDeadline(goal.id as string, e.target.value)
                        }
                        className="p-1 rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}
