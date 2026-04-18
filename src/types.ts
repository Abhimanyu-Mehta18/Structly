
export type EnergyLevel = 'high' | 'medium' | 'low' | 'neutral';

export type TaskStatus = 'pending' | 'completed' | 'skipped' | 'delegated';

export interface StartingBlock {
  type: 'outline' | 'links' | 'draft' | 'research';
  content: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  energyLevel: EnergyLevel;
  status: TaskStatus;
  skipCount: number;
  startingBlock?: StartingBlock;
  dueDate: string;
  startTime: string;
  endTime: string;
  timeWindow?: 'Morning' | 'Afternoon' | 'Evening';
  isAutomated?: boolean;
}

export interface Milestone {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  milestones: Milestone[];
  progress: number; // 0-100
  category: string;
}

export interface UserIdentity {
  mode: 'Student' | 'Founder' | 'Recovery' | 'Maintenance';
  description: string;
}

export interface AgenticTask {
  id: string;
  agentName: string;
  status: string;
  description: string;
  subtext: string;
  iconType: 'zap' | 'calendar' | 'search' | 'activity' | 'shopping';
  colorClass: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  content: string;
  type: 'voice' | 'text';
  summary?: string;
  nextActions: string[];
}
