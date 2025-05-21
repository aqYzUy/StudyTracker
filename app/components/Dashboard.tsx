import { useGoalStore } from "~/store/useGoalStore";
import { Goal } from "~/models/goal";

export default function Dashboard() {
  const goals = useGoalStore((state) => state.goals);

  const completedGoals = goals.filter((g: Goal) => g.completed).length;
  const overdueGoals = goals.filter((g: Goal) => g.isOverdue()).length;
  const totalGoals = goals.length;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mt-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-green-100 dark:bg-green-900 rounded-lg">
          <h3 className="text-lg font-semibold">Completed</h3>
          <p className="text-2xl">{completedGoals}</p>
        </div>
        <div className="p-4 bg-red-100 dark:bg-red-900 rounded-lg">
          <h3 className="text-lg font-semibold">Overdue</h3>
          <p className="text-2xl">{overdueGoals}</p>
        </div>
        <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-lg">
          <h3 className="text-lg font-semibold">Total</h3>
          <p className="text-2xl">{totalGoals}</p>
        </div>
      </div>
    </div>
  );
}