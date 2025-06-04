import { Goal } from '~/models/goal';

interface Props {
  goals: Goal[];
}

export default function ProgressBar({ goals }: Props) {
  const completedGoals = goals.filter((goal) => goal.completed).length;
  const overdueGoals = goals.filter((goal) => typeof goal.isOverdue === 'function' && goal.isOverdue()).length;
  const totalGoals = goals.length;
  const completionRate = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

  return (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 relative overflow-hidden">
      <div
        className="bg-indigo-600 h-full rounded-full transition-all duration-500"
        style={{ width: `${completionRate}%` }}
      ></div>
      {overdueGoals > 0 && (
        <div
          className="absolute top-0 left-0 h-full bg-red-500 opacity-30 rounded-full"
          style={{ width: `${(overdueGoals / totalGoals) * 100}%` }}
        ></div>
      )}
      <p className="text-center text-sm mt-2 text-gray-600 dark:text-gray-300">
        {completedGoals} of {totalGoals} goals completed (
        {completionRate.toFixed(1)}%)
        {overdueGoals > 0 && (
          <span className="text-red-500">, {overdueGoals} overdue</span>
        )}
      </p>
    </div>
  );
}
