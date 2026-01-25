'use client';

import { Search, PanelLeft, LayoutGrid, List, ArrowDownAZ, Plus } from 'lucide-react';
import { useApp } from '@/store/AppContext';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onToggleSidebar: () => void;
  onAddPrompt: () => void;
}

export default function Header({ searchQuery, onSearchChange, onToggleSidebar, onAddPrompt }: HeaderProps) {
  const { state, setViewMode, sortPromptsAlphabetically } = useApp();

  return (
    <header className="flex items-center p-4 border-b border-[#2a2a2a] bg-[#161616]">
      <button 
        onClick={onToggleSidebar}
        className="p-2 mr-4 text-gray-400 hover:text-white"
      >
        <PanelLeft className="w-5 h-5" />
      </button>
      
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input 
          type="text" 
          placeholder="Buscar en esta carpeta..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="flex items-center ml-4">
        <button 
          onClick={() => setViewMode('grid')}
          className={`view-mode-btn p-2 text-gray-400 hover:text-white transition-colors rounded-md ${state.viewMode === 'grid' ? 'active' : ''}`}
        >
          <LayoutGrid className="w-5 h-5" />
        </button>
        <button 
          onClick={() => setViewMode('list')}
          className={`view-mode-btn p-2 text-gray-400 hover:text-white transition-colors rounded-md ${state.viewMode === 'list' ? 'active' : ''}`}
        >
          <List className="w-5 h-5" />
        </button>
        
        <div className="h-6 w-px bg-gray-700 mx-2" />
        
        <button 
          onClick={sortPromptsAlphabetically}
          className="flex items-center gap-2 p-2 mr-2 text-gray-400 hover:text-white transition-colors rounded-md"
        >
          <ArrowDownAZ className="w-5 h-5" />
          <span className="hidden sm:inline">Ordenar</span>
        </button>
        
        <button 
          onClick={onAddPrompt}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Nuevo Prompt</span>
        </button>
      </div>
    </header>
  );
}
