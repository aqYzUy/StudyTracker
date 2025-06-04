// app/store/useGoalStore.ts

import { create } from "zustand";
import { Goal, GoalData } from "~/models/goal";
import { v4 as uuidv4 } from "uuid";
import { persist, createJSONStorage, StateStorage } from "zustand/middleware";

// Einfacher Storage-Adapter, der lokal nur Strings ablegt
const goalStorage: StateStorage = {
  getItem: (name) => {
    return localStorage.getItem(name);
  },
  setItem: (name, value) => {
    localStorage.setItem(name, value);
  },
  removeItem: (name) => {
    localStorage.removeItem(name);
  },
};

interface GoalStore {
  goals: Goal[];
  addGoal: (
    title: string,
    category: string,
    repeatInterval?: number,
    deadline?: string
  ) => void;
  toggleGoal: (id: string) => void;
  deleteGoal: (id: string) => void;
  resetRepeatingGoals: () => void;
  importGoals: (goals: GoalData[]) => void;
  updateDeadline: (id: string, deadline: string) => void;
}

export const useGoalStore = create(
  persist<GoalStore>(
    (set) => ({
      goals: [],

      addGoal: (title, category, repeatInterval, deadline) =>
        set((state) => ({
          goals: [
            ...state.goals,
            new Goal({
              id: uuidv4(),
              title,
              category,
              completed: false,
              repeatInterval,
              deadline: deadline || undefined,
            }),
          ],
        })),

      toggleGoal: (id) =>
        set((state) => ({
          goals: state.goals.map((goal) => {
            if (goal.id === id) {
              const copy = new Goal(goal.toJSON());
              copy.toggleCompleted();
              return copy;
            }
            return goal;
          }),
        })),

      deleteGoal: (id) =>
        set((state) => ({
          goals: state.goals.filter((goal) => goal.id !== id),
        })),

      resetRepeatingGoals: () =>
        set((state) => ({
          goals: state.goals.map((goal) => {
            if (goal.shouldReset()) {
              return new Goal({ ...goal.toJSON(), completed: false });
            }
            return goal;
          }),
        })),

      importGoals: (goals) =>
        set(() => ({
          goals: goals.map((data) => {
            const validData: GoalData = {
              id: data.id || uuidv4(),
              title: data.title || "Untitled",
              category: data.category || "Uncategorized",
              completed: data.completed ?? false,
              repeatInterval: data.repeatInterval,
              lastCompleted: data.lastCompleted,
              deadline: data.deadline || undefined,
            };
            return new Goal(validData);
          }),
        })),

      updateDeadline: (id, deadline) =>
        set((state) => ({
          goals: state.goals.map((goal) => {
            if (goal.id === id) {
              return new Goal({ ...goal.toJSON(), deadline: deadline || undefined });
            }
            return goal;
          }),
        })),
    }),
    {
      name: "goals-storage",
      storage: createJSONStorage(() => goalStorage),
      onRehydrateStorage: () => (state) => {
        // Nach dem Einlesen aus localStorage sind alle Einträge Plain-Objekte.
        // Hier wandeln wir sie in echte Goal-Instanzen um.
        if (state) {
          state.goals = (state.goals as any[]).map((data: any) => new Goal(data));
        }
      },
    }
  )
);
