import { useGoalStore } from "~/store/useGoalStore";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import { Goal } from "~/models/goal";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ChartComponent() {
  const goals = useGoalStore((state) => state.goals);

  const data = {
    labels: goals.map((g: Goal) => g.title),
    datasets: [
      {
        label: "Progress",
        data: goals.map((g: Goal) => g.progress()),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Goal Progress" },
    },
  };

  return <Bar data={data} options={options} />;
}