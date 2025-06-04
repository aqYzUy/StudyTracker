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

  // Füge hier "Biologie" als vierte feste Kategorie hinzu:
  const fixedCategories = ["English", "Math", "General", "Biologie"];

  // Berechne mittels useMemo den Durchschnitts-Progress pro dieser festen Kategorie:
  const { labels, dataValues } = useMemo(() => {
    // Mapping von Kategorie → Array aller Progress-Werte (0 oder 1)
    const progressByCategory: Record<string, number[]> = {
      English: [],
      Math: [],
      General: [],
      Biologie: [], // Neu hinzugefügt
    };

    // Fülle das Mapping: für jedes Goal den progress()-Wert in das jeweilige Array pushen
    goals.forEach((g: Goal) => {
      // Falls die Aufgabe zu einer der vier Kategorien gehört, pushen
      if (fixedCategories.includes(g.category)) {
        progressByCategory[g.category].push(g.progress());
      }
      // Alle anderen Kategorien ignorieren wir weiterhin
    });

    // Für jede fixe Kategorie: Durchschnitt berechnen oder 0, falls keine Goals
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

  // Konfiguration für das Chart
  const data = {
    labels, // ["English", "Math", "General", "Biologie"]
    datasets: [
      {
        label: "Progress",
        data: dataValues, // z.B. [1, 0.5, 0, 0.75]
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
        max: 1, // Progress liegt zwischen 0 und 1
        ticks: {
          stepSize: 0.1,
          callback: (value: number) => {
            return value.toString();
          },
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
