export interface GoalData {
  id: string;
  title: string;
  category: string;
  completed: boolean;
  repeatInterval?: number;
  lastCompleted?: string;
  deadline?: string; // Neuer: Deadline im ISO-Format
}

export class Goal {
  id: string;
  title: string;
  category: string;
  completed: boolean;
  repeatInterval?: number;
  lastCompleted?: Date;
  deadline?: Date;

  constructor(data: GoalData) {
    this.id = data.id;
    this.title = data.title;
    this.category = data.category;
    this.completed = data.completed;
    this.repeatInterval = data.repeatInterval;
    this.lastCompleted = data.lastCompleted ? new Date(data.lastCompleted) : undefined;
    this.deadline = data.deadline ? new Date(data.deadline) : undefined;
  }

  toggleCompleted() {
    this.completed = !this.completed;
    if (this.completed) {
      this.lastCompleted = new Date();
    }
  }

  shouldReset(): boolean {
    if (!this.repeatInterval || !this.lastCompleted) return false;
    const now = new Date();
    const diffDays = (now.getTime() - this.lastCompleted.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays >= this.repeatInterval;
  }

  isOverdue(): boolean {
    return !!this.deadline && new Date() > this.deadline && !this.completed;
  }

  progress(): number {
    return this.completed ? 1 : 0;
  }

  toJSON(): GoalData {
    return {
      id: this.id,
      title: this.title,
      category: this.category,
      completed: this.completed,
      repeatInterval: this.repeatInterval,
      lastCompleted: this.lastCompleted?.toISOString(),
      deadline: this.deadline?.toISOString(),
    };
  }
}