import { Goal, Task, UserIdentity } from "./types";

export const INITIAL_GOALS: Goal[] = [
  {
    id: "g1",
    title: "Master TypeScript & React",
    description: "Go from intermediate to expert in building scalable frontend apps.",
    milestones: [
      { id: "m1", title: "Complete Advanced Design Patterns curso", isCompleted: true },
      { id: "m2", title: "Build 3 production-ready ports", isCompleted: false },
      { id: "m3", title: "Contribute to major OSS", isCompleted: false },
    ],
    progress: 35,
    category: "Career",
  },
  {
    id: "g2",
    title: "Run a Half Marathon",
    description: "Improve physical endurance and mental clarity through running.",
    milestones: [
      { id: "m4", title: "Run 5k consistently", isCompleted: true },
      { id: "m5", title: "Reach 10k milestone", isCompleted: true },
      { id: "m6", title: "15k long run", isCompleted: false },
    ],
    progress: 60,
    category: "Health",
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: "t1",
    title: "Refactor Structly Navigation",
    energyLevel: "high",
    status: "pending",
    skipCount: 0,
    dueDate: new Date().toISOString(),
    startTime: "09:00",
    endTime: "10:30",
    timeWindow: "Morning",
    description: "Switch to a cleaner, more fluid sidebar navigation using motion.",
  },
  {
    id: "t2",
    title: "Schedule Dentist Appointment",
    energyLevel: "low",
    status: "pending",
    skipCount: 2,
    dueDate: new Date().toISOString(),
    startTime: "14:00",
    endTime: "14:15",
    timeWindow: "Afternoon",
    isAutomated: true,
  },
  {
    id: "t3",
    title: "Deep Work: Project Proposal",
    energyLevel: "high",
    status: "pending",
    skipCount: 0,
    dueDate: new Date().toISOString(),
    startTime: "11:00",
    endTime: "13:00",
    timeWindow: "Morning",
  }
];

export const INITIAL_IDENTITY: UserIdentity = {
  mode: "Founder",
  description: "Optimizing for growth, deep work, and high-impact decisions."
};
