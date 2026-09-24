import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Music, Clock, ChevronRight, Play, MoreVertical, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useIsai } from '../context/IsaiContext';
import { useAuth } from '../context/AuthContext';
import { GlassCard } from '../components/ui/GlassCard';

export const DashboardPage = () => {
  const { user } = useAuth();
  const { projects, resetProject } = useIsai();
  const navigate = useNavigate();

  const handleNewProject = () => {
    resetProject();
    navigate('/studio');
  };

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl lg:text-6xl font-black outfit tracking-tighter leading-none">
            WELCOME BACK, <span className="text-primary uppercase">{user?.displayName?.split(' ')[0]}</span>
          </h1>
          <p className="text-slate-400 font-medium outfit tracking-wide uppercase text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" /> Your neural studio is primed for session #{projects.length + 104}
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(249, 115, 22, 0.4)' }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNewProject}
          className="btn-primary flex items-center gap-3 px-8 py-5"
        >
          <Plus className="w-6 h-6" />
          <span className="text-lg">NEW PROJECT</span>
        </motion.button>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Total Tracks" value={projects.length} icon={Music} color="text-primary" />
        <StatCard label="Studio Hours" value="12.4" icon={Clock} color="text-secondary" />
        <StatCard label="AI Accuracy" value="98.2%" icon={Sparkles} color="text-emerald-400" />
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold outfit uppercase tracking-widest text-slate-300">Recent Sessions</h3>
          <button className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
            VIEW ALL <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          {projects.length > 0 ? (
            projects.map((project, idx) => (
              <ProjectRow key={project.id || idx} project={project} />
            ))
          ) : (
            <div className="text-center py-20 bg-white/2 border border-dashed border-white/10 rounded-3xl">
               <Music className="w-12 h-12 text-slate-700 mx-auto mb-4" />
               <p className="text-slate-500 font-medium">No sessions recorded yet. Start your first AI production.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon, color }) => (
  <GlassCard className="flex items-center gap-6 p-8 border-white/5" hover={true}>
    <div className={`p-4 rounded-xl bg-slate-900 border border-white/10 ${color}`}>
      <Icon className="w-8 h-8" />
    </div>
    <div>
      <p className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-3xl font-black outfit">{value}</p>
    </div>
  </GlassCard>
);

const ProjectRow = ({ project }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    className="glass-card p-5 group hover:bg-white/5 transition-all flex items-center justify-between border-white/5"
  >
    <div className="flex items-center gap-6">
      <div className="w-14 h-14 rounded-xl bg-slate-900 flex items-center justify-center border border-white/10 group-hover:border-primary/50 transition-colors">
        <Play className="w-6 h-6 text-primary" />
      </div>
      <div>
        <h4 className="text-lg font-bold outfit">{project.name || 'Untitled Session'}</h4>
        <p className="text-xs text-slate-500 font-mono flex items-center gap-3">
          <span>{project.mood} • {project.genre}</span>
          <span className="w-1 h-1 rounded-full bg-slate-700" />
          <span>{new Date(project.createdAt).toLocaleDateString()}</span>
        </p>
      </div>
    </div>
    
    <div className="flex items-center gap-8">
      <div className="hidden md:block text-right">
        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">Status</p>
        <div className="flex items-center gap-2">
           <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
           <span className="text-xs font-bold outfit uppercase tracking-wider text-emerald-400">Mastered</span>
        </div>
      </div>
      <button className="p-3 rounded-lg hover:bg-white/10 transition-colors">
        <MoreVertical className="w-5 h-5 text-slate-500" />
      </button>
    </div>
  </motion.div>
);
