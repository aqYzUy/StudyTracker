// app/components/ChartComponent.tsx
import { useMemo } from "react";
import { useGoalStore } from "~/store/useGoalStore";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Goal } from "~/models/goal";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ChartComponent() {
  const goals = useGoalStore((state) => state.goals);

  // Jetzt mit "Biology" statt "Biologie":
  const fixedCategories = ["English", "Math", "General", "Biology"];

  const { labels, dataValues } = useMemo(() => {
    const progressByCategory: Record<string, number[]> = {
      English: [],
      Math: [],
      General: [],
      Biology: [], // geändert
    };

    goals.forEach((g: Goal) => {
      if (fixedCategories.includes(g.category)) {
        progressByCategory[g.category].push(g.progress());
      }
    });

    const values = fixedCategories.map((cat) => {
      const arr = progressByCategory[cat];
      if (!arr || arr.length === 0) {
        return 0;
      }
      const sum = arr.reduce((a, b) => a + b, 0);
      return sum / arr.length;
    });

    return {
      labels: fixedCategories,
      dataValues: values,
    };
  }, [goals]);

  const data = {
    labels, // ["English", "Math", "General", "Biology"]
    datasets: [
      {
        label: "Progress",
        data: dataValues,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 1,
        ticks: {
          stepSize: 0.1,
          callback: (value: number) => value.toString(),
        },
      },
    },
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Goal Progress" },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const val = context.parsed.y;
            return `Progress: ${val}`;
          },
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
}
