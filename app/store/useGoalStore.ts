import { create } from 'zustand';
import { Goal, GoalData } from '~/models/goal';
import { v4 as uuidv4 } from 'uuid';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';

// Benutzerdefinierter Storage-Adapter, der Goal-Instanzen rekonstruiert
const goalStorage: StateStorage = {
  getItem: (name) => {
    const value = localStorage.getItem(name);
    if (!value) return null;
    try {
      const parsed = JSON.parse(value);
      if (parsed.state && Array.isArray(parsed.state.goals)) {
        parsed.state.goals = parsed.state.goals.map((data: any) => {
          // Sicherstellen, dass die Daten die erforderlichen Felder haben
          const validData: GoalData = {
            id: data.id || uuidv4(),
            title: data.title || 'Untitled',
            category: data.category || 'Uncategorized',
            completed: data.completed ?? false,
            repeatInterval: data.repeatInterval,
            lastCompleted: data.lastCompleted,
            deadline: data.deadline,
          };
          return new Goal(validData);
        });
      }
      return parsed;
    } catch (err) {
      console.error('Fehler beim Parsen von localStorage:', err);
      return null; // Fallback: leeren Zustand zurückgeben
    }
  },
  setItem: (name, value) => {
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name) => {
    localStorage.removeItem(name);
  },
};

interface GoalStore {
  goals: Goal[];
  addGoal: (title: string, category: string, repeatInterval?: number, deadline?: string) => void;
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
              deadline,
            }),
          ],
        })),
      toggleGoal: (id) =>
        set((state) => ({
          goals: state.goals.map((goal) => {
            if (goal.id === id) {
              const newGoal = new Goal(goal.toJSON());
              newGoal.toggleCompleted();
              return newGoal;
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
          goals: goals.map((data) => new Goal(data)),
        })),
      updateDeadline: (id, deadline) =>
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === id ? new Goal({ ...goal.toJSON(), deadline }) : goal
          ),
        })),
    }),
    {
      name: 'goals-storage',
      storage: createJSONStorage(() => goalStorage),
    }
  )
);
