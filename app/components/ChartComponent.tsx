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

  // Definiere hier die drei festen Kategorien in der gewünschten Reihenfolge:
  const fixedCategories = ["English", "Math", "General"];

  // Berechne mit useMemo einmal den Durchschnitts-Progress pro dieser festen Kategorie:
  const { labels, dataValues } = useMemo(() => {
    // Erstelle ein Mapping von Kategorie → Array aller Progress-Werte (0 oder 1) in dieser Kategorie
    const progressByCategory: Record<string, number[]> = {
      English: [],
      Math: [],
      General: [],
    };

    // Fülle das Mapping: für jedes Goal den progress()-Wert in das jeweilige Array pushen
    goals.forEach((g: Goal) => {
      // Falls eine Aufgabe einer dieser drei Kategorien entspricht, nimm sie auf
      if (fixedCategories.includes(g.category)) {
        // progress() liefert 0 oder 1
        progressByCategory[g.category].push(g.progress());
      }
      // Falls du irgendwann noch andere Kategorien anlegst, ignorieren wir sie hier bewusst
    });

    // Für jede fixe Kategorie: Durchschnitt berechnen oder 0, falls keine Goals
    const values = fixedCategories.map((cat) => {
      const arr = progressByCategory[cat];
      if (!arr || arr.length === 0) {
        return 0;
      }
      // Summe aller Werte / Anzahl → liefert z.B. 1/2 = 0.5
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
    labels, // ["English", "Math", "General"]
    datasets: [
      {
        label: "Progress",
        data: dataValues, // z.B. [1, 0.5, 0]
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
        max: 1, // Da Progress zwischen 0 und 1 liegt
        ticks: {
          // Y-Achse in Schritten von 0.1 anzeigen (optional)
          stepSize: 0.1,
          callback: (value: number) => {
            // Formatiere als Dezimalzahl (z. B. 0.5)
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
            // Zeige im Tooltip z.B. "Progress: 0.5"
            const val = context.parsed.y;
            return `Progress: ${val}`;
          },
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
}
