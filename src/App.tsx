/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  LayoutDashboard, 
  Target, 
  Zap, 
  Mic, 
  Settings, 
  ChevronRight, 
  Plus, 
  Activity,
  History,
  BrainCircuit,
  PanelLeftClose,
  PanelLeftOpen,
  Calendar,
  SkipForward,
  ShoppingBag,
  Clock,
  Ticket,
  Flame,
  AlertCircle,
  TrendingDown,
  Wind,
  Coffee,
  ExternalLink,
  Sun,
  Moon,
  Timer,
  Edit2
} from "lucide-react";
import { Goal, Task, UserIdentity, EnergyLevel, AgenticTask } from "./types";
import { INITIAL_GOALS, INITIAL_TASKS, INITIAL_IDENTITY } from "./constants";
import { geminiService } from "./services/geminiService";

// --- Components ---

const NewActionModal = ({ 
  isOpen, 
  onClose, 
  onAdd, 
  editingTask 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  onAdd: (title: string, energy: EnergyLevel, start: string, end: string) => void,
  editingTask?: Task | null
}) => {
  const [title, setTitle] = useState('');
  const [energy, setEnergy] = useState<EnergyLevel>('medium');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');

  useEffect(() => {
    if (isOpen) {
      if (editingTask) {
        setTitle(editingTask.title);
        setEnergy(editingTask.energyLevel);
        setStartTime(editingTask.startTime);
        setEndTime(editingTask.endTime);
      } else {
        setTitle('');
        const hour = new Date().getHours();
        setStartTime(`${hour.toString().padStart(2, '0')}:00`);
        setEndTime(`${(hour + 1).toString().padStart(2, '0')}:00`);
        
        // Smart Suggestion: Day = High Energy, Night = Low Energy
        if (hour >= 8 && hour < 17) {
          setEnergy('high');
        } else {
          setEnergy('low');
        }
      }
    }
  }, [editingTask, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 text-text-primary">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-bg/80 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-md bg-surface border border-border-dim rounded-[2.5rem] p-10 shadow-2xl"
      >
        <h2 className="text-2xl font-serif mb-8 italic">{editingTask ? "Refine Action" : "New Action Loop"}</h2>
        <div className="space-y-6">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-text-muted mb-2 block font-semibold">Strategic Title</label>
            <input 
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Drafting the project brief"
              className="w-full bg-surface-light border border-border-dim rounded-xl px-4 py-3 text-sm text-text-primary focus:ring-1 focus:ring-accent outline-none placeholder:text-text-muted/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-text-muted mb-2 block font-semibold">Start Time</label>
              <input 
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-surface-light border border-border-dim rounded-xl px-4 py-3 text-sm text-text-primary focus:ring-1 focus:ring-accent outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-text-muted mb-2 block font-semibold">End Time</label>
              <input 
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-surface-light border border-border-dim rounded-xl px-4 py-3 text-sm text-text-primary focus:ring-1 focus:ring-accent outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-widest text-text-muted mb-4 block font-semibold">
              Energy Threshold <span className="text-[8px] opacity-60 ml-2">Suggested: {energy === 'high' ? 'High Focus (Peak Hours)' : 'Low Focus (Recovery)'}</span>
            </label>
            <div className="flex gap-2">
              {(['high', 'medium', 'low'] as EnergyLevel[]).map((level) => (
                <button
                  key={level}
                  onClick={() => setEnergy(level)}
                  className={`flex-1 py-2 rounded-lg text-[10px] uppercase tracking-tighter border transition-all ${
                    energy === level 
                      ? 'bg-accent border-accent text-white font-bold' 
                      : 'border-border-dim text-text-muted hover:border-text-secondary'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
          <div className="pt-6 flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 py-3 rounded-xl text-text-muted text-xs font-semibold hover:bg-surface-light transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={() => {
                if (title.trim()) {
                  onAdd(title, energy, startTime, endTime);
                  onClose();
                }
              }}
              className="flex-1 bg-accent text-white py-3 rounded-xl text-xs font-bold shadow-lg shadow-accent/20 hover:opacity-90 active:scale-95 transition-all"
            >
              {editingTask ? "Update Protocol" : "Initialize Action"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const NewGoalModal = ({ isOpen, onClose, onAdd }: { isOpen: boolean, onClose: () => void, onAdd: (title: string, desc: string, cat: string) => void }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Career');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 text-text-primary">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-bg/80 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-surface border border-border-dim rounded-[2.5rem] p-10 shadow-2xl"
          >
            <h2 className="text-2xl font-serif mb-8 italic">New Strategic Vision</h2>
            <div className="space-y-6">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-text-muted mb-2 block font-semibold">Goal Description</label>
                <input 
                  autoFocus
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Master Advanced AI Architecture"
                  className="w-full bg-surface-light border border-border-dim rounded-xl px-4 py-3 text-sm text-text-primary focus:ring-1 focus:ring-accent outline-none placeholder:text-text-muted/50 mb-4"
                />
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="The deeper mission behind this goal..."
                  className="w-full bg-surface-light border border-border-dim rounded-xl px-4 py-3 text-sm text-text-primary focus:ring-1 focus:ring-accent outline-none placeholder:text-text-muted/50 min-h-[100px] resize-none"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-text-muted mb-4 block font-semibold">Classification</label>
                <div className="flex flex-wrap gap-2">
                  {['Career', 'Health', 'Finance', 'Growth', 'Focus'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`px-4 py-2 rounded-lg text-[10px] uppercase tracking-tighter border transition-all ${
                        category === cat 
                          ? 'bg-accent border-accent text-white font-bold' 
                          : 'border-border-dim text-text-muted hover:border-text-secondary'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div className="pt-6 flex gap-3">
                <button 
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl text-text-muted text-xs font-semibold hover:bg-surface-light transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    if (title.trim() && description.trim()) {
                      onAdd(title, description, category);
                      setTitle('');
                      setDescription('');
                      onClose();
                    }
                  }}
                  className="flex-1 bg-accent text-white py-3 rounded-xl text-xs font-bold shadow-lg shadow-accent/20 hover:opacity-90 active:scale-95 transition-all"
                >
                  Decompose & Save
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      );
};

const SimulationModal = ({ isOpen, onClose, simulation }: { isOpen: boolean, onClose: () => void, simulation: any }) => {
  if (!isOpen || !simulation) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 text-text-primary">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-bg/90 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        className="relative w-full max-w-2xl bg-surface border border-border-dim rounded-[3rem] p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8">
            <button onClick={onClose} className="text-text-muted hover:text-white transition-colors">
                <Plus className="rotate-45" size={24} />
            </button>
        </div>

        <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                <BrainCircuit size={20} className="text-accent" />
            </div>
            <span className="text-[10px] font-bold text-accent uppercase tracking-[0.3em]">Neural Simulation Engine</span>
        </div>

        <div className="space-y-10">
            <section>
                <h3 className="text-[10px] uppercase tracking-widest text-text-muted mb-4 font-bold border-b border-border-dim pb-2 w-fit">Strategic Overview</h3>
                <p className="text-3xl font-serif text-white tracking-tight leading-tight italic">
                    "{simulation.overview}"
                </p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <section>
                    <h3 className="text-[10px] uppercase tracking-widest text-text-muted mb-4 font-bold">Resource Impact</h3>
                    <div className="bg-surface-light p-6 rounded-2xl border border-border-dim">
                        <p className="text-sm font-light text-text-secondary leading-relaxed">{simulation.impact}</p>
                    </div>
                </section>
                <section>
                    <h3 className="text-[10px] uppercase tracking-widest text-text-muted mb-4 font-bold">Recommended Pivot</h3>
                    <div className="bg-accent/5 p-6 rounded-2xl border border-accent/20">
                        <p className="text-sm font-medium text-accent leading-relaxed">{simulation.recommendation}</p>
                    </div>
                </section>
            </div>
        </div>

        <div className="mt-12 flex justify-end">
            <button 
                onClick={onClose}
                className="bg-white text-bg px-10 py-4 rounded-2xl font-bold text-xs hover:opacity-90 active:scale-95 transition-all shadow-xl"
            >
                Acknowledge Strategy
            </button>
        </div>
      </motion.div>
    </div>
  );
};

const NewAgenticTaskModal = ({ isOpen, onClose, onAdd }: { isOpen: boolean, onClose: () => void, onAdd: (agent: Partial<AgenticTask>) => void }) => {
    const [agentName, setAgentName] = useState('');
    const [status, setStatus] = useState('');
    const [template, setTemplate] = useState('custom');
    const [time, setTime] = useState('ASAP');

    const templates: Record<string, any> = {
        instamart: { name: 'Instamart.AI', status: 'Restocking Nutrition...', icon: 'shopping', color: 'bg-orange-500', sub: 'Synced via MCP Food Server.' },
        appointment: { name: 'Scheduler.AI', status: 'Coordinating Schedule...', icon: 'calendar', color: 'bg-emerald-500', sub: 'Optimizing based on focus windows.' },
        ticket: { name: 'Travel.AI', status: 'Securing Logistics...', icon: 'activity', color: 'bg-accent', sub: 'Booking optimal routes.' },
        custom: { name: '', status: '', icon: 'zap', color: 'bg-accent', sub: 'Manual tactical override.' }
    };

    if (!isOpen) return null;

    const handleApplyTemplate = (t: string) => {
        setTemplate(t);
        if (t !== 'custom') {
            setAgentName(templates[t].name);
            setStatus(templates[t].status);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 text-text-primary">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-bg/80 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-surface border border-border-dim rounded-[2.5rem] p-10 shadow-2xl"
          >
            <h2 className="text-2xl font-serif mb-8 italic">New Agentic Protocol</h2>
            <div className="space-y-6">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-text-muted mb-4 block font-semibold">Mission Template</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.keys(templates).map((t) => (
                    <button
                      key={t}
                      onClick={() => handleApplyTemplate(t)}
                      className={`py-2 px-3 rounded-lg text-[10px] uppercase tracking-tighter border transition-all ${
                        template === t 
                          ? 'bg-accent border-accent text-white font-bold' 
                          : 'border-border-dim text-text-muted hover:border-text-secondary'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Removed Agent Designation field as requested */}

              <div>
                <label className="text-[10px] uppercase tracking-widest text-text-muted mb-2 block font-semibold">Active Status/Mission</label>
                <input 
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  placeholder="e.g., Analyzing market trends..."
                  className="w-full bg-surface-light border border-border-dim rounded-xl px-4 py-3 text-sm text-text-primary focus:ring-1 focus:ring-accent outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-text-muted mb-2 block font-semibold">Execution Time</label>
                <div className="relative">
                    <Clock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input 
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="e.g., 2:00 PM or ASAP"
                    className="w-full bg-surface-light border border-border-dim rounded-xl pl-10 pr-4 py-3 text-sm text-text-primary focus:ring-1 focus:ring-accent outline-none"
                    />
                </div>
              </div>

              <div className="pt-6 flex gap-3">
                <button 
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl text-text-muted text-xs font-semibold hover:bg-surface-light transition-colors"
                >
                  Terminate
                </button>
                <button 
                  onClick={() => {
                    const selected = templates[template];
                    onAdd({
                        agentName: agentName || selected.name,
                        status: status || selected.status,
                        iconType: selected.icon,
                        colorClass: selected.color,
                        subtext: `${selected.sub} Scheduled: ${time}`
                    });
                    onClose();
                  }}
                  className="flex-1 bg-accent text-white py-3 rounded-xl text-xs font-bold shadow-lg shadow-accent/20 hover:opacity-90 active:scale-95 transition-all"
                >
                  Deploy Agent
                </button>
              </div>
            </div>
          </motion.div>
        </div>
    );
};

const Sidebar = ({ activeTab, setActiveTab, collapsed, setCollapsed, identity, cognitiveLoad, isOverwhelmed, setIsOverwhelmed, onVent, theme, setTheme }: any) => {
  const tabs = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Navigator' },
    { id: 'goals', icon: Target, label: 'Big Picture' },
    { id: 'chief', icon: Mic, label: 'AI Journal' },
    { id: 'vent', icon: Coffee, label: 'Vent Zone', special: true },
    { id: 'insights', icon: Activity, label: 'Insights' },
  ];

  return (
    <motion.aside 
      initial={false}
      animate={{ width: collapsed ? 80 : 260 }}
      className="h-screen bg-bg sidebar-border flex flex-col z-50 sticky top-0 px-6 py-6"
    >
      <div className="flex items-center justify-between mb-8">
        {!collapsed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-serif italic text-xl tracking-wider text-accent overflow-hidden whitespace-nowrap"
          >
            Structly.
          </motion.div>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 hover:bg-surface rounded-md text-text-muted shrink-0"
        >
          {collapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
        </button>
      </div>

      {!collapsed && (
        <div className="identity-tag-box mb-8">
          <div className="text-[10px] uppercase text-text-muted tracking-widest mb-1">Identity Mode</div>
          <div className="font-serif text-base text-text-primary">{identity.mode} Mode</div>
        </div>
      )}

      <nav className="flex-1 space-y-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => tab.special ? onVent() : setActiveTab(tab.id)}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
              activeTab === tab.id 
                ? 'bg-surface text-accent font-medium' 
                : tab.special 
                  ? 'text-orange-400 hover:bg-orange-500/10'
                  : 'text-text-muted hover:bg-surface/50'
            }`}
          >
            <tab.icon size={20} className="shrink-0" />
            {!collapsed && <span className="text-sm overflow-hidden whitespace-nowrap">{tab.label}</span>}
          </button>
        ))}

        <div className="pt-4 mt-4 border-t border-border-dim/30">
          <button
            onClick={() => setIsOverwhelmed(!isOverwhelmed)}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                isOverwhelmed 
                ? 'bg-red-500/10 text-red-500 font-medium border border-red-500/20' 
                : 'text-text-muted hover:bg-surface/50'
            }`}
          >
            <Wind size={20} className={`shrink-0 ${isOverwhelmed ? 'animate-pulse' : ''}`} />
            {!collapsed && (
                <div className="flex flex-col items-start leading-none">
                    <span className="text-sm">Vibe Check</span>
                    <span className="text-[9px] uppercase tracking-widest mt-1 opacity-60">
                        {isOverwhelmed ? 'Overwhelmed' : 'Optimal'}
                    </span>
                </div>
            )}
          </button>
        </div>
      </nav>

      <div className="mt-8 pt-6 border-t border-border-dim">
        {!collapsed && (
          <div className="mb-6 space-y-4">
            <div className="flex justify-between text-[11px] text-text-secondary">
              <span>Cognitive Load</span>
              <span>{cognitiveLoad}%</span>
            </div>
            <div className="h-1 w-full bg-surface-light rounded-full">
              <motion.div 
                animate={{ width: `${cognitiveLoad}%` }}
                className={`h-full rounded-full transition-colors ${cognitiveLoad > 80 ? 'bg-red-500' : 'bg-orange-500'}`}
              />
            </div>
          </div>
        )}
        <div className="flex items-center gap-1">
          <button className="flex-1 flex items-center gap-3 px-3 py-3 rounded-xl text-text-muted hover:bg-surface/50" onClick={() => alert("Settings under AI maintenance.")}>
            <Settings size={20} className="shrink-0" />
            {!collapsed && <span className="text-sm font-medium">Settings</span>}
          </button>
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-3 text-text-muted hover:bg-surface/50 rounded-xl transition-all"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </motion.aside>
  );
};

// --- View Internal Components ---

const Header = ({ title, onAddAction, focusMode, setFocusMode }: { title: string, identity: UserIdentity, onAddAction?: () => void, focusMode?: string, setFocusMode?: (mode: string) => void }) => (
  <header className="flex items-center justify-between mb-10">
    <h1 className="text-4xl font-serif">{title}</h1>
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 bg-surface p-1 rounded-full">
        {['High Focus', 'Admin', 'Recovery'].map((mode) => (
          <button
            key={mode}
            onClick={() => setFocusMode?.(mode)}
            className={`px-4 py-1.5 rounded-full text-[11px] transition-all font-medium ${
              focusMode === mode
                ? 'bg-accent text-white'
                : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            {mode}
          </button>
        ))}
      </div>
      {onAddAction && (
        <button 
          onClick={onAddAction}
          className="bg-accent text-white p-2 px-4 rounded-xl flex items-center gap-2 font-medium shadow-lg hover:opacity-90 active:scale-95 transition-all text-xs"
        >
          <Plus size={16} />
          New Action
        </button>
      )}
    </div>
  </header>
);

interface TaskCardProps {
  key?: string | number;
  task: Task;
  onAction: (taskId: string, status: 'completed' | 'skipped') => void;
  onPrep: (taskId: string) => Promise<void>;
  onEdit: (task: Task) => void;
}

const TaskCard = ({ task, onAction, onPrep, onEdit }: TaskCardProps) => {
  const [prepping, setPrepping] = useState(false);

  const handlePrep = async () => {
    setPrepping(true);
    await onPrep(task.id);
    setPrepping(false);
  };

  const timelineStr = `${task.startTime} — ${task.endTime}`;

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="timeline-item-row group hover:bg-surface/30 px-2 transition-colors"
    >
      <div className="flex flex-col w-20 shrink-0">
        <span className="font-mono text-[10px] text-text-muted">{task.startTime}</span>
        <span className="font-mono text-[9px] text-text-muted/50 leading-none">{task.endTime}</span>
      </div>
      <div className="flex-1 flex items-center justify-between">
        <span className="text-sm font-light text-text-primary">{task.title}</span>
        <div className="flex items-center gap-4">
          <span className="text-[10px] px-2 py-0.5 border border-border-dim rounded-md text-text-muted uppercase tracking-tighter shrink-0">
            {task.energyLevel}
          </span>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
             <button onClick={() => onEdit(task)} className="p-1.5 hover:text-accent text-text-muted" title="Edit timeline">
                <Edit2 size={14} />
             </button>
             {!task.startingBlock && (
              <button onClick={handlePrep} disabled={prepping} className="p-1.5 hover:text-accent text-text-muted" title="Prep task">
                <Zap size={14} />
              </button>
            )}
             <button onClick={() => onAction(task.id, 'skipped')} className="p-1.5 hover:text-red-500 text-text-muted" title="Skip task">
                <SkipForward size={14} />
             </button>
             <button onClick={() => onAction(task.id, 'completed')} className="p-1.5 hover:text-accent text-text-muted" title="Complete task">
                <ChevronRight size={16} />
             </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const DashboardView = ({ tasks, onTaskAction, onPrepTask, onEditTask, identity, onAddAction, onGoToJournal, focusMode, setFocusMode, isOverwhelmed }: any) => {
  const [energyFilter, setEnergyFilter] = useState<EnergyLevel | 'all'>('all');
  
  const pendingTasks = tasks.filter((t: any) => t.status === 'pending');
  // Filter out high energy tasks if overwhelmed
  const capableTasks = isOverwhelmed 
    ? pendingTasks.filter((t: any) => t.energyLevel !== 'high')
    : pendingTasks;

  const filteredTasks = energyFilter === 'all' 
    ? capableTasks 
    : capableTasks.filter((t: any) => t.energyLevel === energyFilter);
  
  const activeTask = filteredTasks[0];
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] h-screen bg-bg">
      <div className="p-10 main-border overflow-y-auto">
        <Header 
          title="Navigator" 
          identity={identity} 
          onAddAction={onAddAction} 
          focusMode={focusMode} 
          setFocusMode={setFocusMode} 
        />

        {activeTask && (
          <div className="starting-block-card">
            <div className="text-[12px] font-semibold text-accent uppercase tracking-widest mb-3">Active Starting Block — Core Focus — {activeTask.startTime} - {activeTask.endTime}</div>
            <h2 className="text-2xl font-serif mb-4 leading-snug">{activeTask.title}</h2>
            <div className="bg-accent/5 border-l-2 border-accent p-5 font-serif italic text-sm text-text-secondary leading-relaxed">
              AI Prep Complete: {activeTask.startingBlock?.content || "I am assembling context for this mission. Take action to maintain your current momentum."}
            </div>
          </div>
        )}

        <section className="mt-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
                <h2 className="text-xl font-serif">Daily Sequence</h2>
                <button 
                    onClick={onAddAction}
                    className="p-1.5 rounded-lg border border-border-dim text-text-muted hover:text-accent hover:border-accent transition-all flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest"
                >
                    <Plus size={14} /> Add
                </button>
            </div>
            <div className="flex items-center gap-2 bg-surface p-1 rounded-lg border border-border-dim">
                {['all', 'high', 'medium', 'low'].map((level) => (
                    <button
                        key={level}
                        onClick={() => setEnergyFilter(level as any)}
                        className={`px-3 py-1 rounded-md text-[10px] uppercase tracking-tighter transition-all ${
                            energyFilter === level 
                            ? 'bg-accent text-white' 
                            : 'text-text-muted hover:text-text-secondary'
                        }`}
                    >
                        {level}
                    </button>
                ))}
            </div>
          </div>
          
          <div className="space-y-0">
            <AnimatePresence mode="popLayout">
              {filteredTasks.map((task: Task) => (
                <TaskCard 
                  key={`timeline-${task.id}`} 
                  task={task} 
                  onAction={onTaskAction} 
                  onPrep={onPrepTask} 
                  onEdit={onEditTask}
                />
              ))}
            </AnimatePresence>
            {filteredTasks.length === 0 && (
                <div className="py-12 text-center text-text-muted italic text-sm">
                    {pendingTasks.length > 0 
                        ? `No ${energyFilter} energy tasks. Switch energy filter or recover.`
                        : "No urgent actions remaining. Ready for reflection?"}
                </div>
            )}
          </div>
        </section>
      </div>

      <aside className="p-8 space-y-12 overflow-y-auto">
        <div>
          <h3 className="text-[11px] uppercase tracking-[0.2em] text-text-muted mb-6">Agentic Actions</h3>
          <div className="space-y-4">
            <div className="bg-surface border border-border-dim rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] text-emerald-500 font-medium tracking-tight">Assistant Agent Active</span>
              </div>
              <p className="text-xs text-text-secondary leading-normal">Optimizing your schedule for {focusMode.toLowerCase()} output.</p>
            </div>
            
            <motion.div 
               animate={{ opacity: [1, 0.5, 1] }}
               transition={{ duration: 4, repeat: Infinity }}
               className="bg-surface border border-border-dim rounded-xl p-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-accent rounded-full animate-ping" />
                <span className="text-[10px] text-accent font-medium tracking-tight">Research AI Syncing...</span>
              </div>
              <p className="text-xs text-text-secondary leading-normal opacity-60">Scanning for friction points in the Project Pitch goal.</p>
            </motion.div>
          </div>
        </div>

        <div>
          <h3 className="text-[11px] uppercase tracking-[0.2em] text-text-muted mb-6 px-1">Active Reflexion</h3>
          <button 
            onClick={onGoToJournal}
            className="w-full text-left font-serif text-[15px] text-text-secondary leading-relaxed bg-surface-light p-6 rounded-xl relative italic hover:bg-surface-light/80 transition-all group"
          >
             <span className="absolute top-1 left-3 text-4xl text-text-muted opacity-20 serif">“</span>
             Focus on getting that one big task done today before you lose the high focus mode.
             <Mic size={16} className="absolute bottom-4 right-4 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>

        <div className="bg-red-500/5 border border-red-500/40 p-5 rounded-xl text-red-200 text-xs leading-relaxed">
          <strong className="block mb-1 text-red-300">Friction Signal:</strong> 
          Strategic task backlog is rising. Structly recommends switching to High Focus mode.
        </div>
      </aside>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [goals, setGoals] = useState<Goal[]>(INITIAL_GOALS);
  const [identity] = useState<UserIdentity>(INITIAL_IDENTITY);
  const [focusMode, setFocusMode] = useState('High Focus');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [isAddingAgent, setIsAddingAgent] = useState(false);
  const [activeSimulation, setActiveSimulation] = useState<any>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [agenticTasks, setAgenticTasks] = useState<AgenticTask[]>([
    {
      id: 'a1',
      agentName: 'Researcher.AI',
      status: 'Synced 3 benchmarks for Project Proposal.',
      description: 'Project Proposal',
      subtext: 'Integrated into task Starting Block.',
      iconType: 'search',
      colorClass: 'bg-accent'
    },
    {
      id: 'a2',
      agentName: 'Scheduler.AI',
      status: 'Dentist Appointment Optimized.',
      description: 'Dentist Appointment',
      subtext: 'Moved to Friday AM based on your trends.',
      iconType: 'calendar',
      colorClass: 'bg-emerald-500'
    },
    {
      id: 'a3',
      agentName: 'Swiggy.AI',
      status: 'Restocking Nutrition (Instamart).',
      description: 'Nutrition Fulfillment',
      subtext: 'Synced via MCP Food Server; ordering weekly staples.',
      iconType: 'shopping',
      colorClass: 'bg-orange-500'
    }
  ]);
  
  const [isProcessingJournal, setIsProcessingJournal] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [journalText, setJournalText] = useState("");
  const [journalSummary, setJournalSummary] = useState<any>(null);
  const [isOverwhelmed, setIsOverwhelmed] = useState(false);
  const [isVentZone, setIsVentZone] = useState(false);
  const [ventTimer, setVentTimer] = useState(1800); // 30 mins in seconds
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    let interval: any;
    if (isVentZone && ventTimer > 0) {
      interval = setInterval(() => {
        setVentTimer((prev) => prev - 1);
      }, 1000);
    } else if (ventTimer === 0) {
      setIsVentZone(false);
      setVentTimer(1800);
    }
    return () => clearInterval(interval);
  }, [isVentZone, ventTimer]);

  const cognitiveLoad = Math.min(Math.round((tasks.filter(t => t.status === 'pending').length / 10) * 100), 100);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = 'en-US';

        recognitionInstance.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }

          if (finalTranscript) {
            setJournalText(prev => (prev ? prev + ' ' : '') + finalTranscript);
          }
        };

        recognitionInstance.onend = () => {
          setIsRecording(false);
        };

        recognitionInstance.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsRecording(false);
        };

        setRecognition(recognitionInstance);
      }
    }
  }, []);

  const toggleRecording = () => {
      if (!recognition) {
          alert("Speech recognition is not supported in this browser.");
          return;
      }

      if (isRecording) {
          recognition.stop();
          setIsRecording(false);
      } else {
          try {
              recognition.start();
              setIsRecording(true);
          } catch (e) {
              console.error("Failed to start recognition", e);
          }
      }
  };

  const handleTaskAction = (taskId: string, status: 'completed' | 'skipped') => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        if (status === 'skipped') {
          return { ...t, skipCount: t.skipCount + 1, status: 'skipped' };
        }
        return { ...t, status: 'completed' };
      }
      return t;
    }));
  };

  const handleAddTask = (title: string, energy: EnergyLevel, start: string, end: string) => {
    if (editingTask) {
        setTasks(prev => prev.map(t => t.id === editingTask.id ? { 
            ...t, 
            title, 
            energyLevel: energy, 
            startTime: start, 
            endTime: end 
        } : t));
        setEditingTask(null);
        setIsAddingTask(false);
        return;
    }

    const newTask: Task = {
        id: `t-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title,
        energyLevel: energy,
        status: 'pending',
        skipCount: 0,
        dueDate: new Date().toISOString(),
        startTime: start,
        endTime: end,
        startingBlock: { type: 'outline', content: "AI Chief of Staff is initializing context. Your starting block will be ready in 5s." }
    };
    
    setTasks(prev => [newTask, ...prev]);
    
    // Auto-trigger prep after a small delay
    setTimeout(() => {
        handlePrepTask(newTask.id);
    }, 1000);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsAddingTask(true);
  };

  const handleAddGoal = async (title: string, description: string, category: string) => {
    const newGoal: Goal = {
        id: `g-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title,
        description,
        category,
        progress: 0,
        milestones: [{ id: 'm-loading', title: "Agentic AI is deconstructing...", isCompleted: false }]
    };

    setGoals(prev => [...prev, newGoal]);

    // Async decomposition
    try {
        const milestones = await geminiService.decomposeGoal(title, description);
        setGoals(prev => prev.map(g => g.id === newGoal.id ? { ...g, milestones } : g));

        // Suggested addition: Automatically add the first 2 milestones to the Navigator's Daily Tasks
        const newTasks: Task[] = milestones.slice(0, 2).map((m, index) => {
            const hour = new Date().getHours() + index + 1;
            return {
                id: `t-milestone-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
                title: m.title,
                energyLevel: index === 0 ? 'high' : 'medium', // First task usually high energy
                status: 'pending',
                skipCount: 0,
                dueDate: new Date(Date.now() + (index + 1) * 3600000).toISOString(), // Staggered by 1hr
                startTime: `${hour.toString().padStart(2, '0')}:00`,
                endTime: `${(hour + 1).toString().padStart(2, '0')}:00`,
                description: `Auto-generated from Goal: ${title}`
            };
        });

        setTasks(prev => [...newTasks, ...prev]);
        
        // Auto-prep the very first task
        if (newTasks.length > 0) {
            handlePrepTask(newTasks[0].id);
        }

    } catch (e) {
        setGoals(prev => prev.map(g => g.id === newGoal.id ? { ...g, milestones: [{ id: 'm-err', title: "Decomposition failed, try redefining.", isCompleted: false }] } : g));
    }
  };

  const handleAddAgenticTask = (agentData: Partial<AgenticTask>) => {
    const newAgent: AgenticTask = {
      id: `agent-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      agentName: agentData.agentName || "Tactical.AI",
      status: agentData.status || "Operational.",
      description: "Active Mission",
      subtext: agentData.subtext || "Background task initialization.",
      iconType: agentData.iconType || 'zap',
      colorClass: agentData.colorClass || 'bg-accent'
    };
    setAgenticTasks(prev => [...prev, newAgent]);
  };

  const handleSimulateGoal = async (goal: Goal) => {
    setIsSimulating(true);
    try {
        const simulation = await geminiService.simulateDecision(goal.title, tasks);
        setActiveSimulation(simulation);
    } catch (e) {
        alert("Simulation engine temporarily offline.");
    } finally {
        setIsSimulating(false);
    }
  };

  const handlePrepTask = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    try {
        const block = await geminiService.generateStartingBlock(task);
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, startingBlock: block } : t));
    } catch (e) {
        console.error("Prep failed", e);
    }
  };

  const handleProcessJournal = async () => {
    if (!journalText.trim()) return;
    setIsProcessingJournal(true);
    setIsRecording(false);
    try {
        const result = await geminiService.processJournal(journalText);
        setJournalSummary(result);
        
        // Add new tasks from journal
        if (result.nextActions && result.nextActions.length > 0) {
            const newTasks: Task[] = result.nextActions.map((action, idx) => {
                const hour = new Date().getHours() + idx + 1;
                return {
                    id: `t-journal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    title: action,
                    energyLevel: 'medium',
                    status: 'pending',
                    skipCount: 0,
                    dueDate: new Date().toISOString(),
                    startTime: `${hour.toString().padStart(2, '0')}:00`,
                    endTime: `${(hour + 1).toString().padStart(2, '0')}:00`,
                    isAutomated: true,
                    startingBlock: { type: 'outline', content: "Extracted from your daily reflection summary." }
                };
            });
            setTasks(prev => [...newTasks, ...prev]);
        }
    } catch (e) {
        console.error("Journal processing failed", e);
    } finally {
        setIsProcessingJournal(false);
    }
  };

  return (
    <div className="flex bg-bg min-h-screen text-text-primary selection:bg-accent selection:text-white">
      <AnimatePresence>
        {isVentZone && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center p-10 text-center"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="max-w-2xl"
                >
                    <Coffee size={48} className="text-orange-400 mx-auto mb-8 animate-pulse" />
                    <h2 className="text-4xl font-serif italic text-white mb-4">Vent Zone Active</h2>
                    <p className="text-gray-400 mb-12 font-light leading-relaxed">
                        The neural interface is powering down. This is your mandatory tactical reset. 
                        No tasks, no deadlines, just breath.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16 text-left">
                        {[
                            { title: "Box Breathing", sub: "4s In, 4s Hold, 4s Out, 4s Hold", link: "https://www.webmd.com/balance/what-is-box-breathing" },
                            { title: "Lo-fi Focus", sub: "Gentle frequencies for mental recalibration", link: "https://www.youtube.com/watch?v=jfKfPfyJRdk" },
                            { title: "Digital Minimalist", sub: "Article on intentional disconnection", link: "https://www.calm.com/blog/digital-minimalism" },
                            { title: "Stretching Routine", sub: "3-minute alignment sequence", link: "https://www.healthline.com/health/desk-stretches" }
                        ].map((activity, idx) => (
                            <a 
                                key={idx} 
                                href={activity.link} 
                                target="_blank" 
                                className="p-6 border border-white/10 rounded-2xl bg-white/5 hover:bg-white/10 transition-all group"
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="text-white font-medium">{activity.title}</h4>
                                    <ExternalLink size={14} className="text-gray-500 group-hover:text-white transition-colors" />
                                </div>
                                <p className="text-xs text-gray-500">{activity.sub}</p>
                            </a>
                        ))}
                    </div>

                    <div className="flex items-center justify-center gap-8 border-t border-white/10 pt-12">
                        <div className="text-center">
                            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2">Mental Cooling</p>
                            <p className="text-3xl font-mono text-white">
                                {Math.floor(ventTimer / 60)}:{(ventTimer % 60).toString().padStart(2, '0')}
                            </p>
                        </div>
                        <button 
                            onClick={() => { setIsVentZone(false); setVentTimer(1800); }}
                            className="px-8 py-3 rounded-full border border-white/20 text-xs font-bold text-gray-400 hover:bg-white/5 hover:text-white transition-all uppercase tracking-widest"
                        >
                            Exit Zone 
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        collapsed={collapsed} 
        setCollapsed={setCollapsed} 
        identity={identity}
        cognitiveLoad={cognitiveLoad}
        isOverwhelmed={isOverwhelmed}
        setIsOverwhelmed={setIsOverwhelmed}
        onVent={() => setIsVentZone(true)}
        theme={theme}
        setTheme={setTheme}
      />

      <main className="flex-1 overflow-x-hidden">
        <AnimatePresence>
          {isAddingTask && (
            <NewActionModal 
              isOpen={isAddingTask} 
              onClose={() => { setIsAddingTask(false); setEditingTask(null); }} 
              onAdd={handleAddTask} 
              editingTask={editingTask}
            />
          )}
          {isAddingGoal && (
            <NewGoalModal 
                isOpen={isAddingGoal}
                onClose={() => setIsAddingGoal(false)}
                onAdd={handleAddGoal}
            />
          )}
          <SimulationModal 
            isOpen={!!activeSimulation || isSimulating} 
            onClose={() => setActiveSimulation(null)}
            simulation={activeSimulation || (isSimulating ? { overview: "Simulating strategic outcomes...", impact: "Analyzing resource bottlenecks...", recommendation: "Awaiting neural sync..." } : null)}
          />
          {isAddingAgent && (
            <NewAgenticTaskModal 
                isOpen={isAddingAgent}
                onClose={() => setIsAddingAgent(false)}
                onAdd={handleAddAgenticTask}
            />
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <DashboardView 
                tasks={tasks} 
                onTaskAction={handleTaskAction} 
                onPrepTask={handlePrepTask}
                onEditTask={handleEditTask}
                identity={identity}
                onAddAction={() => setIsAddingTask(true)}
                onGoToJournal={() => setActiveTab('chief')}
                focusMode={focusMode}
                setFocusMode={setFocusMode}
                isOverwhelmed={isOverwhelmed}
              />
            </motion.div>
          )}

          {activeTab === 'goals' && (
            <motion.div
              key="goals"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-6xl mx-auto p-4 md:p-8"
            >
              <Header 
                title="Big Picture" 
                identity={identity} 
                onAddAction={() => setIsAddingGoal(true)} 
                focusMode={focusMode} 
                setFocusMode={setFocusMode} 
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {goals.map(goal => (
                  <div key={goal.id} className="bg-surface p-8 rounded-[2rem] border border-border-dim card-hover flex flex-col h-full shadow-lg">
                    <div className="flex justify-between items-start mb-6">
                      <span className="text-[10px] font-bold text-accent uppercase tracking-[0.2em] bg-accent/5 px-3 py-1 rounded-full">{goal.category}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-1 bg-surface-light rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${goal.progress}%` }}
                                className="h-full bg-accent"
                            />
                        </div>
                        <span className="font-mono text-[10px] text-text-muted">{goal.progress}%</span>
                      </div>
                    </div>
                    <h3 className="text-2xl font-serif mb-3 leading-tight">{goal.title}</h3>
                    <p className="text-text-secondary mb-8 leading-relaxed font-light text-sm">{goal.description}</p>
                    
                    <div className="space-y-4 flex-1">
                      {goal.milestones.map(m => (
                        <div key={m.id} className="flex items-center gap-4 group/item">
                          <button className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${m.isCompleted ? 'bg-accent border-accent text-white' : 'border-border-dim group-hover/item:border-accent'}`}>
                            {m.isCompleted && <ChevronRight size={14} />}
                          </button>
                          <span className={`text-sm tracking-tight ${m.isCompleted ? 'line-through text-text-muted opacity-60' : 'text-text-primary font-light'}`}>{m.title}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-10 pt-8 border-t border-border-dim flex items-center justify-between">
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-text-muted mb-2 font-semibold">Weekly Momentum</p>
                            <div className="flex gap-1.5">
                                {[1,2,3,4,5,6,7].map(day => (
                                    <div key={day} className={`w-2 h-2 rounded-full ${day < 5 ? 'bg-accent' : 'bg-surface-light'}`} />
                                ))}
                            </div>
                        </div>
                        <button 
                            onClick={() => handleSimulateGoal(goal)}
                            className="text-[11px] font-bold text-accent flex items-center gap-1 hover:underline underline-offset-4 decoration-accent/30"
                        >
                            Simulation <ChevronRight size={14} />
                        </button>
                    </div>
                  </div>
                ))}
                
                <button 
                  onClick={() => setIsAddingGoal(true)}
                  className="h-full min-h-[300px] border border-dashed border-border-dim rounded-[2rem] flex flex-col items-center justify-center gap-4 text-text-muted hover:border-accent hover:text-accent transition-all group bg-surface/20"
                >
                    <div className="w-12 h-12 rounded-full border border-border-dim flex items-center justify-center group-hover:border-accent transition-colors">
                        <Plus size={24} />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-widest">Define New Goal</span>
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'chief' && (
             <motion.div
              key="chief"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-4xl mx-auto p-4 md:p-8"
            >
              <Header 
                title="AI Journal" 
                identity={identity} 
                onAddAction={() => setIsAddingTask(true)} 
                focusMode={focusMode} 
                setFocusMode={setFocusMode} 
              />
              
              <div className="space-y-8">
                <div className="bg-surface rounded-[2rem] p-10 md:p-16 text-center text-text-primary border border-border-dim relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(129,140,248,0.1),transparent_70%)] pointer-events-none" />
                  <div className="relative z-10 flex flex-col items-center">
                    <motion.div 
                        animate={{ 
                            scale: isProcessingJournal || isRecording ? [1, 1.2, 1] : 1,
                            backgroundColor: isRecording ? "#EF4444" : "#1E1E22"
                        }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="w-20 h-20 bg-surface-light rounded-full flex items-center justify-center mb-8 shadow-inner border border-border-dim cursor-pointer"
                        onClick={toggleRecording}
                    >
                      <Mic size={32} className={isProcessingJournal || isRecording ? "text-white" : "text-accent"} />
                    </motion.div>
                    <h2 className="text-4xl md:text-5xl font-serif mb-6 tracking-tight">
                        {isProcessingJournal ? "Deconstructing..." : isRecording ? "Recording Reflection..." : "Active Mirror"}
                    </h2>
                    <textarea 
                        value={journalText}
                        onChange={(e) => setJournalText(e.target.value)}
                        placeholder="Speak or type your daily reflections..."
                        className="w-full max-w-lg bg-transparent border-none text-center text-lg text-text-secondary mb-10 font-serif italic font-light leading-relaxed focus:ring-0 outline-none resize-none min-h-[100px]"
                    />
                    <div className="flex gap-4">
                        <button 
                            onClick={handleProcessJournal}
                            disabled={isProcessingJournal}
                            className="bg-accent text-white px-8 py-4 rounded-xl font-bold shadow-xl hover:opacity-90 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                             {isProcessingJournal ? "Thinking..." : "Summarize & Plan"}
                        </button>
                        <button className="bg-surface-light text-text-primary px-8 py-4 rounded-xl font-bold transition-all border border-border-dim active:scale-95">
                             Keep Talking
                        </button>
                    </div>
                  </div>
                </div>

                {journalSummary && (
                   <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-surface border border-border-dim rounded-[2rem] overflow-hidden shadow-lg"
                   >
                     <div className="bg-accent/5 p-8 border-b border-border-dim">
                        <div className="flex items-center gap-2 mb-4">
                            <BrainCircuit size={20} className="text-accent" />
                            <span className="text-[10px] font-bold text-accent uppercase tracking-widest">AI Strategic Recap</span>
                        </div>
                        <p className="text-xl font-serif text-text-primary leading-snug">"{journalSummary.summary}"</p>
                     </div>
                     <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h4 className="text-[10px] uppercase tracking-widest text-text-muted font-bold">Planned Actions</h4>
                            <div className="space-y-2">
                                {journalSummary.nextActions.map((action: string, i: number) => (
                                <div key={i} className="flex items-center gap-3 p-3 bg-surface-light rounded-xl border border-border-dim hover:border-accent/30 transition-colors">
                                    <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                                    <span className="text-xs text-text-secondary">{action}</span>
                                </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-surface-light rounded-xl p-6 border border-border-dim flex flex-col justify-center">
                            <div className="flex items-center gap-3 mb-2">
                                <Activity size={18} className="text-emerald-500" />
                                <span className="text-xs font-bold uppercase tracking-tighter text-text-primary">Vibe Shift Detected</span>
                            </div>
                            <p className="text-xs text-text-secondary leading-relaxed">{journalSummary.strategicInsight}</p>
                        </div>
                     </div>

                     <div className="p-8 pt-0 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
                            <div className="flex items-center gap-2 mb-3 text-red-400">
                                <TrendingDown size={18} />
                                <h4 className="text-[10px] uppercase tracking-widest font-bold">Detected Friction</h4>
                            </div>
                            <p className="text-xs text-text-secondary leading-relaxed italic font-light">
                                {journalSummary.negativeFriction}
                            </p>
                        </div>
                        <div className="bg-accent/5 border border-accent/20 rounded-2xl p-6">
                            <div className="flex items-center gap-2 mb-3 text-accent">
                                <Flame size={18} />
                                <h4 className="text-[10px] uppercase tracking-widest font-bold">Improvement Protocol</h4>
                            </div>
                            <p className="text-xs text-text-secondary leading-relaxed font-medium">
                                {journalSummary.improvementPlan}
                            </p>
                        </div>
                     </div>
                   </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-surface p-8 rounded-[2rem] border border-border-dim shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-[13px] uppercase tracking-widest text-text-muted font-semibold flex items-center gap-2">
                            <BrainCircuit size={18} className="text-accent" />
                            Agentic Tasks
                        </h3>
                        <button 
                            onClick={() => setIsAddingAgent(true)}
                            className="p-1.5 rounded-lg border border-border-dim text-text-muted hover:text-accent hover:border-accent transition-all"
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                    <div className="space-y-4 flex-1">
                      {agenticTasks.map((agent) => (
                        <motion.div 
                            key={`agent-list-${agent.id}`}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-start gap-4 p-4 bg-surface-light rounded-2xl border border-border-dim"
                        >
                            <div className={`min-w-[40px] w-10 h-10 rounded-xl ${agent.colorClass} text-white flex items-center justify-center shadow-md`}>
                                {agent.iconType === 'search' && <Zap size={20} />}
                                {agent.iconType === 'calendar' && <Calendar size={20} />}
                                {agent.iconType === 'zap' && <Plus size={20} />}
                                {agent.iconType === 'shopping' && <ShoppingBag size={20} />}
                                {agent.iconType === 'activity' && <Ticket size={20} />}
                            </div>
                            <div>
                                <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${agent.colorClass.replace('bg-', 'text-')}`}>{agent.agentName}</p>
                                <p className="text-sm text-text-primary font-medium">{agent.status}</p>
                                <p className="text-[11px] text-text-muted mt-1 leading-relaxed">{agent.subtext}</p>
                            </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {!isOverwhelmed && (
                    <div className="bg-surface p-8 rounded-[2rem] border border-border-dim shadow-sm">
                      <h3 className="text-[13px] uppercase tracking-widest text-text-muted mb-6 font-semibold flex items-center gap-2">
                         <History size={18} className="text-red-500" />
                         Friction Alarm
                      </h3>
                      <div className="space-y-4">
                        {tasks.filter(t => t.skipCount > 0 || t.status === 'skipped').length > 0 ? (
                          tasks.filter(t => t.skipCount > 0 || t.status === 'skipped').slice(0, 2).map(task => (
                            <div key={`friction-${task.id}`} className="p-5 border border-red-500/20 bg-red-500/5 rounded-2xl">
                              <p className="text-sm font-bold text-red-200 mb-1">{task.title}</p>
                              <p className="text-xs text-text-secondary mb-4 font-light leading-relaxed">
                                  {task.skipCount >= 3 
                                      ? "Critical friction detected. This task is being avoided systematically."
                                      : `This task has been skipped ${task.skipCount} times. This indicates emotional friction or lack of clarity.`}
                              </p>
                              <div className="flex gap-2">
                                  <button className="flex-1 bg-surface border border-red-500/40 py-2 rounded-lg text-[11px] font-bold text-red-300 hover:bg-red-500/10 transition-all shadow-sm">Delegate to AI</button>
                                  <button className="flex-1 bg-red-500 text-white py-2 rounded-lg text-[11px] font-bold shadow-md">Redefine</button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="py-8 text-center border border-dashed border-border-dim rounded-2xl">
                              <p className="text-xs text-text-muted italic">Clear signal. No friction detected in current sequence.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'insights' && (
             <motion.div
              key="insights"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-6xl mx-auto p-4 md:p-8"
            >
              <Header 
                title="Insights" 
                identity={identity} 
                onAddAction={() => setIsAddingTask(true)} 
                focusMode={focusMode} 
                setFocusMode={setFocusMode} 
              />
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <div className="bg-surface p-10 rounded-[2.5rem] border border-border-dim shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-12">
                       <h3 className="text-xl font-serif">Vibe Consistency</h3>
                       <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">
                          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-accent" /> Energy</div>
                          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-accent/20" /> Flow</div>
                       </div>
                    </div>
                    <div className="h-64 flex items-end justify-between gap-6 px-4">
                      {[
                        { d: 'MON', e: 45, f: 30 },
                        { d: 'TUE', e: 75, f: 60 },
                        { d: 'WED', e: 55, f: 45 },
                        { d: 'THU', e: 95, f: 80 },
                        { d: 'FRI', e: 70, f: 55 },
                        { d: 'SAT', e: 40, f: 25 },
                        { d: 'SUN', e: 85, f: 70 }
                      ].map((item, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-3 relative group h-full justify-end">
                          <div className="flex items-end gap-1 w-full h-full">
                            <motion.div 
                              initial={{ height: 0 }}
                              animate={{ height: `${item.e}%` }}
                              whileHover={{ scaleX: 1.1 }}
                              className="flex-1 rounded-t-md bg-accent relative"
                            >
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-accent text-white text-[8px] py-0.5 px-1 rounded font-mono">E:{item.e}</div>
                            </motion.div>
                            <motion.div 
                              initial={{ height: 0 }}
                              animate={{ height: `${item.f}%` }}
                              whileHover={{ scaleX: 1.1 }}
                              className="flex-1 rounded-t-md bg-accent/20 relative"
                            >
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-accent/40 text-white text-[8px] py-0.5 px-1 rounded font-mono">F:{item.f}</div>
                            </motion.div>
                          </div>
                          <span className="text-[9px] font-bold text-text-muted tracking-[0.2em]">{item.d}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-auto pt-10 border-t border-border-dim/50 flex items-center justify-between">
                       <p className="text-[13px] font-light text-text-secondary">Structly has detected a 40% efficiency surge on Thursdays.</p>
                       <p className="text-[11px] font-bold text-accent uppercase tracking-widest border-b border-accent/30 pb-0.5">Applying Sprint Mode</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-surface p-8 rounded-[2rem] border border-border-dim shadow-sm">
                      <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted mb-6">Strategic Focus</h3>
                      <div className="space-y-6">
                        {goals.map(goal => (
                          <div key={`insight-progress-${goal.id}`} className="space-y-2">
                            <div className="flex justify-between text-xs tracking-tight">
                              <span className="text-text-primary">{goal.title}</span>
                              <span className="text-text-muted">{goal.progress}%</span>
                            </div>
                            <div className="h-1 w-full bg-surface-light rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${goal.progress}%` }}
                                className="h-full bg-accent"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-surface p-8 rounded-[2rem] border border-border-dim shadow-sm">
                      <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted mb-6">Cognitive Bandwidth</h3>
                      <div className="flex items-center justify-center p-4">
                        <div className="relative w-32 h-32">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-surface-light" />
                            <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" 
                                    strokeDasharray={351.8} 
                                    strokeDashoffset={351.8 * (1 - cognitiveLoad/100)} 
                                    className="text-accent transition-all duration-1000" />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-serif">{cognitiveLoad}%</span>
                            <span className="text-[9px] uppercase tracking-widest text-text-muted">Load</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-[11px] text-center text-text-secondary font-light mt-4">You have 22% mental capacity remaining for high-stakes decisions.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="bg-surface p-8 rounded-[2rem] border border-border-dim shadow-sm relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-8 opacity-5 -mr-4"><Zap size={48} className="text-accent" /></div>
                     <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted mb-8">Peak Optimization</h3>
                     <p className="text-4xl font-serif mb-2 leading-tight text-text-primary">10:15 AM</p>
                     <p className="text-sm text-accent font-medium mb-2 tracking-tight">Your Deep Work Window</p>
                     <p className="text-xs text-text-secondary leading-relaxed font-light">You tackle "High Energy" tasks 2x faster during this window than in the afternoon.</p>
                  </div>

                  <div className="bg-surface p-8 rounded-[2rem] border border-border-dim shadow-sm">
                     <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted mb-6">Agentic ROI</h3>
                     <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <div className="text-3xl font-serif">4.2h</div>
                            <div className="text-[10px] text-emerald-500 font-bold mb-1">↑ 15%</div>
                        </div>
                        <p className="text-[11px] text-text-secondary leading-relaxed">Weekly bandwidth recovered through autonomous scheduling and research prep.</p>
                        <div className="pt-4 space-y-3 border-t border-border-dim">
                           <div className="flex justify-between text-[10px] uppercase tracking-tighter">
                              <span className="text-text-muted">Drafting</span>
                              <span className="text-text-primary">1.8h</span>
                           </div>
                           <div className="flex justify-between text-[10px] uppercase tracking-tighter">
                              <span className="text-text-muted">Coordination</span>
                              <span className="text-text-primary">2.4h</span>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="bg-surface p-8 rounded-[2rem] border border-border-dim shadow-sm">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted mb-6">Friction Signals</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-text-primary font-medium">Internal Admin</span>
                        <div className="flex gap-1">
                          {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-red-500" />)}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-text-primary font-medium">Deep Research</span>
                        <div className="flex gap-1">
                          {[1].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-orange-500" />)}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-text-primary font-medium">Cold Outreach</span>
                        <div className="flex gap-1">
                          {[1, 2].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-red-500" />)}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-surface p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden text-text-primary border border-emerald-500/20">
                     <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                     <div className="relative z-10">
                        <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center mb-6">
                            <Target size={20} className="text-emerald-500" />
                        </div>
                        <h3 className="text-xl font-serif font-medium mb-3">Clean Slate Protocol</h3>
                        <p className="text-[13px] text-text-secondary font-light leading-relaxed mb-8">Weekly friction reset is active. High-clutter tasks will be archived Sunday evening.</p>
                        <button 
                            onClick={() => alert("Clean Slate Protocol: Archiving 4 low-value loops. Your focus score will improve by 12 points.")}
                            className="w-full bg-emerald-500/10 text-emerald-400 py-3.5 rounded-xl font-bold border border-emerald-500/30 hover:bg-emerald-500/20 transition-all text-sm"
                        >
                            Preview Reset (4 Tasks)
                        </button>
                     </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
