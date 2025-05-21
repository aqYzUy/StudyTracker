import { useState } from "react";
import { useGoalStore } from "~/store/useGoalStore";

export default function GoalForm() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("General");
  const [repeatInterval, setRepeatInterval] = useState("");
  const [deadline, setDeadline] = useState("");
  const addGoal = useGoalStore((state) => state.addGoal);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      addGoal(
        title,
        category,
        repeatInterval ? parseInt(repeatInterval, 10) : undefined,
        deadline || undefined
      );
      setTitle("");
      setRepeatInterval("");
      setDeadline("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Goal Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option>General</option>
          <option>Math</option>
          <option>Biology</option>
          <option>English</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Repeat Every (days, optional)</label>
        <input
          type="number"
          value={repeatInterval}
          onChange={(e) => setRepeatInterval(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          min="1"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Deadline (YYYY-MM-DD, optional)</label>
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-indigo-600 text-white p-2 rounded-md shadow-md hover:bg-indigo-700 transition-transform transform hover:scale-105"
      >
        Add Goal
      </button>
    </form>
  );
}