var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: !0 });
}, __copyProps = (to, from, except, desc) => {
  if (from && typeof from == "object" || typeof from == "function")
    for (let key of __getOwnPropNames(from))
      !__hasOwnProp.call(to, key) && key !== except && __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: !0 }), mod);

// <stdin>
var stdin_exports = {};
__export(stdin_exports, {
  assets: () => assets_manifest_default,
  assetsBuildDirectory: () => assetsBuildDirectory,
  entry: () => entry,
  future: () => future,
  mode: () => mode,
  publicPath: () => publicPath,
  routes: () => routes
});
module.exports = __toCommonJS(stdin_exports);

// app/entry.server.tsx
var entry_server_exports = {};
__export(entry_server_exports, {
  default: () => handleRequest
});
var import_react = require("@remix-run/react"), import_server = require("react-dom/server"), import_jsx_runtime = require("react/jsx-runtime");
function handleRequest(request, responseStatusCode, responseHeaders, remixContext) {
  let markup = (0, import_server.renderToString)(
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.RemixServer, { context: remixContext, url: request.url })
  );
  return responseHeaders.set("Content-Type", "text/html"), new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: responseHeaders
  });
}

// app/root.tsx
var root_exports = {};
__export(root_exports, {
  default: () => App,
  links: () => links,
  meta: () => meta
});
var import_react2 = require("@remix-run/react");

// app/tailwind.css?url
var tailwind_default = "/build/_assets/tailwind-4RULEROO.css?url";

// app/root.tsx
var import_jsx_runtime2 = require("react/jsx-runtime"), links = () => [
  { rel: "stylesheet", href: tailwind_default }
], meta = () => [
  { charset: "utf-8" },
  { title: "StudyTracker - Dein Lernbegleiter" },
  { name: "viewport", content: "width=device-width, initial-scale=1" }
];
function App() {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("html", { lang: "en", children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("head", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_react2.Meta, {}),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_react2.Links, {})
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("body", { className: "bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 min-h-screen font-sans transition-colors duration-300", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_react2.Outlet, {}),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_react2.ScrollRestoration, {}),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_react2.Scripts, {}),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_react2.LiveReload, {})
    ] })
  ] });
}

// app/routes/_index.tsx
var index_exports = {};
__export(index_exports, {
  default: () => Index
});
var import_react6 = require("react");

// app/components/GoalForm.tsx
var import_react3 = require("react");

// app/store/useGoalStore.ts
var import_zustand = require("zustand");

// app/models/goal.ts
var Goal = class {
  constructor(data) {
    this.id = data.id, this.title = data.title, this.category = data.category, this.completed = data.completed, this.repeatInterval = data.repeatInterval, this.lastCompleted = data.lastCompleted ? new Date(data.lastCompleted) : void 0, this.deadline = data.deadline ? new Date(data.deadline) : void 0;
  }
  toggleCompleted() {
    this.completed = !this.completed, this.completed && (this.lastCompleted = /* @__PURE__ */ new Date());
  }
  shouldReset() {
    return !this.repeatInterval || !this.lastCompleted ? !1 : ((/* @__PURE__ */ new Date()).getTime() - this.lastCompleted.getTime()) / (1e3 * 60 * 60 * 24) >= this.repeatInterval;
  }
  isOverdue() {
    return !!this.deadline && /* @__PURE__ */ new Date() > this.deadline && !this.completed;
  }
  progress() {
    return this.completed ? 1 : 0;
  }
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      category: this.category,
      completed: this.completed,
      repeatInterval: this.repeatInterval,
      lastCompleted: this.lastCompleted?.toISOString(),
      deadline: this.deadline?.toISOString()
    };
  }
};

// app/store/useGoalStore.ts
var import_uuid = require("uuid"), import_middleware = require("zustand/middleware"), useGoalStore = (0, import_zustand.create)(
  (0, import_middleware.persist)(
    (set) => ({
      goals: [],
      addGoal: (title, category, repeatInterval, deadline) => set((state) => ({
        goals: [
          ...state.goals,
          new Goal({
            id: (0, import_uuid.v4)(),
            title,
            category,
            completed: !1,
            repeatInterval,
            deadline
          })
        ]
      })),
      toggleGoal: (id) => set((state) => ({
        goals: state.goals.map((goal) => {
          if (goal.id === id) {
            let newGoal = new Goal(goal.toJSON());
            return newGoal.toggleCompleted(), newGoal;
          }
          return goal;
        })
      })),
      deleteGoal: (id) => set((state) => ({
        goals: state.goals.filter((goal) => goal.id !== id)
      })),
      resetRepeatingGoals: () => set((state) => ({
        goals: state.goals.map((goal) => goal.shouldReset() ? new Goal({ ...goal.toJSON(), completed: !1 }) : goal)
      })),
      importGoals: (goals) => set(() => ({
        goals: goals.map((data) => new Goal(data))
      })),
      updateDeadline: (id, deadline) => set((state) => ({
        goals: state.goals.map(
          (goal) => goal.id === id ? new Goal({ ...goal.toJSON(), deadline }) : goal
        )
      }))
    }),
    {
      name: "goals-storage",
      // Name für localStorage
      storage: typeof window < "u" ? (0, import_middleware.createJSONStorage)(() => localStorage) : void 0
    }
  )
);

// app/components/GoalForm.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
function GoalForm() {
  let [title, setTitle] = (0, import_react3.useState)(""), [category, setCategory] = (0, import_react3.useState)("General"), [repeatInterval, setRepeatInterval] = (0, import_react3.useState)(""), [deadline, setDeadline] = (0, import_react3.useState)(""), addGoal = useGoalStore((state) => state.addGoal);
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("form", { onSubmit: (e) => {
    e.preventDefault(), title.trim() && (addGoal(
      title,
      category,
      repeatInterval ? parseInt(repeatInterval, 10) : void 0,
      deadline || void 0
    ), setTitle(""), setRepeatInterval(""), setDeadline(""));
  }, className: "bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg space-y-4", children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300", children: "Goal Title" }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        "input",
        {
          type: "text",
          value: title,
          onChange: (e) => setTitle(e.target.value),
          className: "mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
          required: !0
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300", children: "Category" }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
        "select",
        {
          value: category,
          onChange: (e) => setCategory(e.target.value),
          className: "mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("option", { children: "General" }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("option", { children: "Math" }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("option", { children: "Biology" }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("option", { children: "English" })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300", children: "Repeat Every (days, optional)" }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        "input",
        {
          type: "number",
          value: repeatInterval,
          onChange: (e) => setRepeatInterval(e.target.value),
          className: "mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
          min: "1"
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300", children: "Deadline (YYYY-MM-DD, optional)" }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        "input",
        {
          type: "date",
          value: deadline,
          onChange: (e) => setDeadline(e.target.value),
          className: "mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
      "button",
      {
        type: "submit",
        className: "w-full bg-indigo-600 text-white p-2 rounded-md shadow-md hover:bg-indigo-700 transition-transform transform hover:scale-105",
        children: "Add Goal"
      }
    )
  ] });
}

// app/components/ProgressBar.tsx
var import_jsx_runtime4 = require("react/jsx-runtime");
function ProgressBar({ goals }) {
  let progress = goals.length > 0 ? goals.reduce((sum, goal) => sum + goal.progress(), 0) / goals.length * 100 : 0, colorClass = progress >= 75 ? "bg-green-500" : progress >= 25 ? "bg-yellow-500" : "bg-red-500";
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "mt-4", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "w-full bg-gray-200 dark:bg-gray-600 rounded-full h-6 overflow-hidden", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
      "div",
      {
        className: `h-full ${colorClass} rounded-full transition-all duration-300`,
        style: { width: `${progress}%` }
      }
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("p", { className: "text-sm font-medium text-gray-700 dark:text-gray-300 mt-2", children: [
      progress.toFixed(0),
      "% Complete"
    ] })
  ] });
}

// app/components/GoalList.tsx
var import_fa = require("react-icons/fa"), import_jsx_runtime5 = require("react/jsx-runtime");
function GoalList() {
  let goals = useGoalStore((state) => state.goals), toggleGoal = useGoalStore((state) => state.toggleGoal), deleteGoal = useGoalStore((state) => state.deleteGoal), updateDeadline = useGoalStore((state) => state.updateDeadline), groupedGoals = Array.from(new Set(goals.map((goal) => goal.category))).map((category) => ({
    category,
    goals: goals.filter((goal) => goal.category === category)
  }));
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "space-y-6 mt-6", children: groupedGoals.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("p", { className: "text-center text-gray-500 dark:text-gray-400 italic", children: "No goals added yet. Add a goal to get started!" }) : groupedGoals.map(({ category, goals: goals2 }) => /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
    "div",
    {
      className: "bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 transition-all duration-300 hover:shadow-xl",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("h2", { className: "text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 border-b-2 border-indigo-200 dark:border-indigo-800 pb-2", children: category }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(ProgressBar, { goals: goals2 }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("ul", { className: "space-y-3 mt-4", children: goals2.map((goal) => /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
          "li",
          {
            className: `flex items-center justify-between p-3 rounded-lg transition-colors duration-200 ${goal.isOverdue() ? "bg-red-100 dark:bg-red-900" : "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"}`,
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "flex items-center space-x-3", children: [
                /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                  "input",
                  {
                    type: "checkbox",
                    checked: goal.completed || !1,
                    onChange: () => toggleGoal(goal.id),
                    className: "h-5 w-5 text-indigo-600 focus:ring-indigo-500 rounded cursor-pointer",
                    "aria-label": `Mark ${goal.title} as completed`
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
                  "span",
                  {
                    className: goal.completed ? "line-through text-gray-500 dark:text-gray-400" : "text-gray-800 dark:text-gray-200",
                    children: [
                      goal.title,
                      goal.repeatInterval && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { className: "ml-2 text-sm text-gray-500 dark:text-gray-400", children: [
                        "(Every ",
                        goal.repeatInterval,
                        " day",
                        goal.repeatInterval > 1 ? "s" : "",
                        ")"
                      ] }),
                      goal.deadline && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { className: "ml-2 text-sm text-gray-500 dark:text-gray-400", children: [
                        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_fa.FaClock, { className: goal.isOverdue() ? "text-red-500" : "" }),
                        " ",
                        goal.deadline.toLocaleDateString()
                      ] })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { children: [
                /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                  "button",
                  {
                    onClick: () => deleteGoal(goal.id),
                    className: "text-red-500 hover:text-red-700 transition-colors duration-200 mr-2",
                    "aria-label": `Delete goal: ${goal.title}`,
                    children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_fa.FaTrash, { size: 16 })
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                  "input",
                  {
                    type: "date",
                    defaultValue: goal.deadline?.toISOString().split("T")[0],
                    onChange: (e) => updateDeadline(goal.id, e.target.value),
                    className: "p-1 rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  }
                )
              ] })
            ]
          },
          goal.id
        )) })
      ]
    },
    category
  )) });
}

// app/components/ThemeToggle.tsx
var import_react4 = require("react"), import_fa2 = require("react-icons/fa"), import_jsx_runtime6 = require("react/jsx-runtime");
function ThemeToggle() {
  let [isDark, setIsDark] = (0, import_react4.useState)(() => typeof window < "u" && localStorage.getItem("theme") ? localStorage.getItem("theme") === "dark" : !0);
  return (0, import_react4.useEffect)(() => {
    typeof window < "u" && (isDark ? (document.documentElement.classList.add("dark"), localStorage.setItem("theme", "dark")) : (document.documentElement.classList.remove("dark"), localStorage.setItem("theme", "light")));
  }, [isDark]), /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
    "button",
    {
      onClick: () => setIsDark(!isDark),
      className: "p-2 bg-gray-200 dark:bg-gray-700 rounded-full shadow-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 transform hover:scale-110",
      children: isDark ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_fa2.FaSun, { className: "text-yellow-400", size: 20 }) : /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_fa2.FaMoon, { className: "text-blue-400", size: 20 })
    }
  );
}

// app/components/Dashboard.tsx
var import_jsx_runtime7 = require("react/jsx-runtime");
function Dashboard() {
  let goals = useGoalStore((state) => state.goals), completedGoals = goals.filter((g) => g.completed).length, overdueGoals = goals.filter((g) => g.isOverdue()).length, totalGoals = goals.length;
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mt-6", children: [
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("h2", { className: "text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4", children: "Dashboard" }),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "p-4 bg-green-100 dark:bg-green-900 rounded-lg", children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("h3", { className: "text-lg font-semibold", children: "Completed" }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("p", { className: "text-2xl", children: completedGoals })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "p-4 bg-red-100 dark:bg-red-900 rounded-lg", children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("h3", { className: "text-lg font-semibold", children: "Overdue" }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("p", { className: "text-2xl", children: overdueGoals })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "p-4 bg-blue-100 dark:bg-blue-900 rounded-lg", children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("h3", { className: "text-lg font-semibold", children: "Total" }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("p", { className: "text-2xl", children: totalGoals })
      ] })
    ] })
  ] });
}

// app/components/ChartComponent.tsx
var import_chart = require("chart.js"), import_react_chartjs_2 = require("react-chartjs-2"), import_jsx_runtime8 = require("react/jsx-runtime");
import_chart.Chart.register(import_chart.CategoryScale, import_chart.LinearScale, import_chart.BarElement, import_chart.Title, import_chart.Tooltip, import_chart.Legend);
function ChartComponent() {
  let goals = useGoalStore((state) => state.goals), data = {
    labels: goals.map((g) => g.title),
    datasets: [
      {
        label: "Progress",
        data: goals.map((g) => g.progress()),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1
      }
    ]
  };
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(import_react_chartjs_2.Bar, { data, options: {
    responsive: !0,
    plugins: {
      legend: { position: "top" },
      title: { display: !0, text: "Goal Progress" }
    }
  } });
}

// app/components/Notification.tsx
var import_react5 = require("react");
function Notification() {
  let goals = useGoalStore((state) => state.goals);
  return (0, import_react5.useEffect)(() => {
    goals.forEach((goal) => {
      goal.isOverdue() && !goal.completed && alert(`Deadline for "${goal.title}" is overdue!`);
    });
  }, [goals]), null;
}

// app/routes/_index.tsx
var import_jsx_runtime9 = require("react/jsx-runtime");
function Index() {
  let resetRepeatingGoals = useGoalStore((state) => state.resetRepeatingGoals), goals = useGoalStore((state) => state.goals), importGoals = useGoalStore((state) => state.importGoals);
  return (0, import_react6.useEffect)(() => {
    let interval = setInterval(() => {
      resetRepeatingGoals();
    }, 864e5);
    return () => clearInterval(interval);
  }, [resetRepeatingGoals]), /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "min-h-screen p-6", children: /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "max-w-4xl mx-auto space-y-8", children: [
    /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("header", { className: "flex justify-between items-center py-4 border-b-2 border-indigo-200 dark:border-indigo-800", children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("h1", { className: "text-4xl font-extrabold text-indigo-800 dark:text-indigo-200 tracking-wide", children: "StudyTracker" }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(ThemeToggle, {})
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("main", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(GoalForm, {}),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "flex gap-4 mt-6", children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
          "button",
          {
            onClick: () => {
              let data = JSON.stringify(goals.map((goal) => goal.toJSON())), blob = new Blob([data], { type: "application/json" }), url = URL.createObjectURL(blob), a = document.createElement("a");
              a.href = url, a.download = "goals.json", a.click(), URL.revokeObjectURL(url);
            },
            className: "bg-green-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-green-700 transition-transform transform hover:scale-105",
            children: "Export Goals"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("label", { className: "bg-purple-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-purple-700 transition-transform transform hover:scale-105 cursor-pointer", children: [
          "Import Goals",
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
            "input",
            {
              type: "file",
              accept: ".json",
              onChange: (e) => {
                let file = e.target.files?.[0];
                if (file) {
                  let reader = new FileReader();
                  reader.onload = (event) => {
                    try {
                      let importedGoals = JSON.parse(event.target?.result);
                      importGoals(importedGoals), e.target.value = "";
                    } catch {
                      alert("Ung\xFCltiges Dateiformat");
                    }
                  }, reader.readAsText(file);
                }
              },
              className: "hidden"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Dashboard, {}),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(ChartComponent, {}),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(GoalList, {}),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Notification, {})
    ] })
  ] }) });
}

// server-assets-manifest:@remix-run/dev/assets-manifest
var assets_manifest_default = { entry: { module: "/build/entry.client-UVICCZDI.js", imports: ["/build/_shared/chunk-MXEWH5ZL.js", "/build/_shared/chunk-7AYXIRAC.js"] }, routes: { root: { id: "root", parentId: void 0, path: "", index: void 0, caseSensitive: void 0, module: "/build/root-6EEZ2LU4.js", imports: void 0, hasAction: !1, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/_index": { id: "routes/_index", parentId: "root", path: void 0, index: !0, caseSensitive: void 0, module: "/build/routes/_index-OHOI3RDJ.js", imports: void 0, hasAction: !1, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 } }, version: "cfb0a074", hmr: void 0, url: "/build/manifest-CFB0A074.js" };

// server-entry-module:@remix-run/dev/server-build
var mode = "production", assetsBuildDirectory = "public\\build", future = { v3_fetcherPersist: !1, v3_relativeSplatPath: !1, v3_throwAbortReason: !1, v3_routeConfig: !1, v3_singleFetch: !1, v3_lazyRouteDiscovery: !1, unstable_optimizeDeps: !1 }, publicPath = "/build/", entry = { module: entry_server_exports }, routes = {
  root: {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: root_exports
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: !0,
    caseSensitive: void 0,
    module: index_exports
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  assets,
  assetsBuildDirectory,
  entry,
  future,
  mode,
  publicPath,
  routes
});
