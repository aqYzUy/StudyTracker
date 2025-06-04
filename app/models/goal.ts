export interface GoalData {
  id: string;
  title: string;
  category: string;
  completed: boolean;
  repeatInterval?: number;
  lastCompleted?: string;
  deadline?: string; // Deadline im ISO-Format (z. B. "2025-06-04")
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
    this.lastCompleted = data.lastCompleted ? this.validateDate(data.lastCompleted) : undefined;
    this.deadline = data.deadline ? this.validateDate(data.deadline) : undefined;
  }

  private validateDate(dateStr: string): Date | undefined {
    const date = new Date(dateStr);
    // Prüfe, ob das Datum gültig ist und im ISO-Format entspricht (z. B. "YYYY-MM-DD")
    if (isNaN(date.getTime()) || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      console.warn(`Ungültiges Datum gefunden: ${dateStr}, wird als undefined behandelt`);
      return undefined;
    }
    return date;
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
    if (!this.deadline) return false;
    return new Date() > this.deadline && !this.completed;
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
