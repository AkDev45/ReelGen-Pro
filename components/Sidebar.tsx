
import React from 'react';
import { User } from '../types';

interface SidebarProps {
  user: User | null;
  currentView: string;
  onChangeView: (view: any) => void;
  isCollapsed: boolean;
  toggleCollapse: () => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, currentView, onChangeView, isCollapsed, toggleCollapse, onLogout }) => {
  // Fake blur data
  const fakeProjects = [1, 2, 3, 4];

  // Helper to get initials
  const getInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase();
  };

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
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
                label="Learnings"
                active={currentView === 'learnings'}
                collapsed={isCollapsed}
                onClick={() => onChangeView('learnings')}
                badge="NEW"
              />
           </nav>
        </div>

        <div className="px-4 relative group">
           {!isCollapsed && <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 px-2">Recent Projects</h3>}
           
           {/* Coming Soon Overlay */}
           <div className={`absolute inset-0 z-10 flex items-center justify-center bg-[#080808]/10 backdrop-blur-[1px] transition-opacity ${isCollapsed ? 'opacity-0 hover:opacity-100' : ''}`}>
             {!isCollapsed && (
               <div className="bg-black/80 border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-xl backdrop-blur-md">
                 <svg className="w-3 h-3 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                 <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wide">Syncing History...</span>
               </div>
             )}
           </div>

           {/* Blurred Content */}
           <div className="space-y-1 opacity-20 select-none grayscale" aria-hidden="true">
              {fakeProjects.map((id) => (
                <div
                  key={id}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg ${isCollapsed ? 'justify-center' : 'justify-start'}`}
                >
                  <div className="w-2 h-2 rounded-full bg-slate-600 shrink-0"></div>
                  
                  {!isCollapsed && (
                    <div className="text-left w-full">
                      <div className="h-3 bg-slate-700 rounded w-3/4 mb-1.5"></div>
                      <div className="h-2 bg-slate-800 rounded w-1/2"></div>
                    </div>
                  )}
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Footer / User */}
      <div className="p-4 border-t border-white/5 bg-[#0a0a0a]">
         <div className="flex flex-col gap-3">
             <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 border border-white/10 flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-lg shadow-indigo-500/10">
                   {user ? getInitials(user.username) : 'G'}
                </div>
                {!isCollapsed && user && (
                   <div className="overflow-hidden">
                      <p className="text-sm font-bold text-white truncate">{user.username}</p>
                      <p className="text-[10px] text-indigo-400 truncate uppercase font-bold tracking-wider">{user.plan} Plan</p>
                   </div>
                )}
             </div>

             <button 
               onClick={onLogout}
               className={`w-full flex items-center gap-2 p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-900/10 rounded-lg transition-all ${isCollapsed ? 'justify-center' : ''}`}
               title="Sign Out"
             >
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                {!isCollapsed && <span className="text-xs font-bold uppercase tracking-wider">Sign Out</span>}
             </button>
             
             <button 
               onClick={toggleCollapse}
               className={`w-full flex items-center justify-center p-2 text-slate-700 hover:text-white rounded-lg transition-all mt-1`}
               title={isCollapsed ? "Expand" : "Collapse"}
             >
                {isCollapsed ? (
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
                ) : (
                   <div className="w-full h-1 bg-slate-800 rounded-full group-hover:bg-slate-700"></div>
                )}
             </button>
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
