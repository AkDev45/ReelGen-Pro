import React, { useState } from 'react';
import { ProjectItem } from '../types';

interface SidebarProps {
  currentView: string;
  onChangeView: (view: any) => void;
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, isCollapsed, toggleCollapse }) => {
  // Mock Data for "Persistent" Feel
  const recentProjects: ProjectItem[] = [
    { id: '1', title: 'Viral Hook Test #1', date: '2 hrs ago', type: 'video', score: 85 },
    { id: '2', title: 'Monday Motivation', date: 'Yesterday', type: 'script', score: 92 },
    { id: '3', title: 'Product Launch V2', date: '3 days ago', type: 'video', score: 64 },
    { id: '4', title: 'GRWM Story', date: 'Last week', type: 'video', score: 78 },
  ];

  return (
    <aside 
      className={`fixed left-0 top-0 h-full bg-[#080808] border-r border-white/5 transition-all duration-300 z-50 flex flex-col ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Logo Area */}
      <div className="h-20 flex items-center justify-between px-6 border-b border-white/5">
        <div 
          className={`flex items-center gap-3 cursor-pointer ${isCollapsed ? 'justify-center w-full' : ''}`}
          onClick={() => onChangeView('landing')}
        >
           <div className="w-8 h-8 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
              <span className="text-white font-bold">R</span>
           </div>
           {!isCollapsed && (
             <span className="font-bold text-lg tracking-tight text-white animate-in fade-in duration-300">
               ReelGen
             </span>
           )}
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 py-6 overflow-y-auto custom-scrollbar">
        <div className="px-4 mb-8">
           {!isCollapsed && <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 px-2">Workspace</h3>}
           <nav className="space-y-1">
              <NavItem 
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>}
                label="New Project"
                active={currentView === 'app'}
                collapsed={isCollapsed}
                onClick={() => onChangeView('app')}
              />
              <NavItem 
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>}
                label="Templates"
                collapsed={isCollapsed}
                onClick={() => {}}
              />
              <NavItem 
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
                label="Trends"
                collapsed={isCollapsed}
                onClick={() => {}}
                badge="HOT"
              />
           </nav>
        </div>

        <div className="px-4">
           {!isCollapsed && <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 px-2">Recent Projects</h3>}
           <div className="space-y-1">
              {recentProjects.map((project) => (
                <button
                  key={project.id}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${isCollapsed ? 'justify-center' : 'justify-start hover:bg-white/5'}`}
                >
                  <div className={`w-2 h-2 rounded-full shrink-0 ${
                    project.score && project.score > 80 ? 'bg-emerald-500' : project.score && project.score > 60 ? 'bg-amber-500' : 'bg-slate-600'
                  }`}></div>
                  
                  {!isCollapsed && (
                    <div className="text-left overflow-hidden">
                      <p className="text-sm text-slate-300 truncate group-hover:text-white transition-colors">{project.title}</p>
                      <p className="text-[10px] text-slate-600 truncate">{project.date} • {project.type}</p>
                    </div>
                  )}
                </button>
              ))}
           </div>
        </div>
      </div>

      {/* Footer / User */}
      <div className="p-4 border-t border-white/5">
         <button 
           onClick={toggleCollapse}
           className="w-full flex items-center justify-center p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg transition-all mb-4"
           title={isCollapsed ? "Expand" : "Collapse"}
         >
            {isCollapsed ? (
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
            ) : (
               <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
                  Collapse Sidebar
               </div>
            )}
         </button>
         
         <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border border-white/10 flex items-center justify-center text-xs font-bold text-white shrink-0">
               JD
            </div>
            {!isCollapsed && (
               <div className="overflow-hidden">
                  <p className="text-sm font-bold text-white truncate">Jane Doe</p>
                  <p className="text-xs text-slate-500 truncate">Pro Plan</p>
               </div>
            )}
         </div>
      </div>
    </aside>
  );
};

const NavItem = ({ icon, label, active = false, collapsed, onClick, badge }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative ${
      active 
        ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' 
        : 'text-slate-400 hover:text-white hover:bg-white/5'
    } ${collapsed ? 'justify-center' : ''}`}
  >
    <div className={`shrink-0 ${active ? 'text-indigo-400' : 'text-slate-500 group-hover:text-white'}`}>
      {icon}
    </div>
    {!collapsed && (
      <>
        <span className="text-sm font-medium">{label}</span>
        {badge && (
           <span className="absolute right-2 text-[9px] font-bold bg-rose-500 text-white px-1.5 py-0.5 rounded ml-auto">
             {badge}
           </span>
        )}
      </>
    )}
    {collapsed && active && (
       <div className="absolute left-0 w-1 h-6 bg-indigo-500 rounded-r-full"></div>
    )}
  </button>
);

export default Sidebar;
