'use client';

import { useState, useRef } from 'react';
import { ChevronRight, PlusCircle, Trash2, RefreshCw, Download, Upload } from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { ConfirmModal } from '@/components';
import { Folder } from '@/types';

export default function Sidebar() {
  const { 
    state, 
    addFolder, 
    deleteFolder, 
    updateFolder, 
    selectFolder, 
    toggleFolderExpansion,
    exportData,
    importData,
    syncWithFile,
    getPromptsForFolder,
    reorderFolders,
    movePromptToFolder,
  } = useApp();

  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [draggedFolderId, setDraggedFolderId] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ title: string; message: string; onConfirm: () => void } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sortedFolders = [...state.data.folders].sort((a, b) => a.order - b.order);

  const handleFolderClick = (folder: Folder, e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.color-picker')) return;
    if ((e.target as HTMLElement).closest('.folder-chevron')) {
      toggleFolderExpansion(folder.id);
    } else {
      selectFolder(folder.id);
    }
  };

  const handleFolderDoubleClick = (folder: Folder, e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.color-picker')) return;
    if ((e.target as HTMLElement).closest('.folder-chevron')) return;
    setEditingFolderId(folder.id);
    setEditingName(folder.name);
  };

  const handleNameSave = () => {
    if (editingFolderId && editingName.trim()) {
      updateFolder(editingFolderId, { name: editingName.trim() });
    }
    setEditingFolderId(null);
    setEditingName('');
  };

  const handleDeleteFolder = () => {
    if (state.selectedFolderId) {
      const folder = state.data.folders.find(f => f.id === state.selectedFolderId);
      if (folder) {
        setConfirmModal({
          title: 'Eliminar Carpeta',
          message: `¿Seguro que quieres eliminar la carpeta "${folder.name}" y todos sus prompts?`,
          onConfirm: () => {
            deleteFolder(folder.id);
            setConfirmModal(null);
          }
        });
      }
    }
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await importData(file);
      } catch {
        alert('Error al importar: archivo no válido');
      }
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSync = async () => {
    try {
      await syncWithFile();
    } catch {
      alert('Tu navegador no soporta esta función o hubo un error.');
    }
  };

  // Drag and drop for folders
  const handleDragStart = (e: React.DragEvent, folderId: string) => {
    setDraggedFolderId(folderId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetFolderId: string) => {
    e.preventDefault();
    
    // Check if dropping a prompt onto a folder
    const promptId = e.dataTransfer.getData('promptId');
    if (promptId) {
      movePromptToFolder(promptId, targetFolderId);
      return;
    }
    
    if (!draggedFolderId || draggedFolderId === targetFolderId) {
      setDraggedFolderId(null);
      return;
    }

    const newOrder = sortedFolders.map(f => f.id);
    const draggedIndex = newOrder.indexOf(draggedFolderId);
    const targetIndex = newOrder.indexOf(targetFolderId);
    
    newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedFolderId);
    
    reorderFolders(newOrder);
    setDraggedFolderId(null);
  };

  const handlePromptInFolderClick = (promptId: string, folderId: string) => {
    selectFolder(folderId);
    // Scroll to prompt after render
    setTimeout(() => {
      const card = document.querySelector(`[data-prompt-id="${promptId}"]`);
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        card.classList.add('ring-2', 'ring-blue-500', 'scale-105');
        setTimeout(() => {
          card.classList.remove('ring-2', 'ring-blue-500', 'scale-105');
        }, 1500);
      }
    }, 100);
  };

  return (
    <aside 
      id="sidebar" 
      className={`sidebar bg-[#161616] w-72 h-full flex flex-col p-4 border-r border-[#2a2a2a] ${state.selectedFolderId === null ? '' : ''}`}
    >
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white">Carpetas</h1>
        <div className="flex items-center">
          <button 
            onClick={addFolder}
            className="p-1 text-gray-400 hover:text-white transition-colors" 
            title="Nueva Carpeta"
          >
            <PlusCircle className="w-5 h-5" />
          </button>
          <button 
            onClick={handleDeleteFolder}
            className="p-1 text-gray-400 hover:text-red-400 transition-colors ml-2" 
            title="Eliminar Carpeta"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div id="folder-list" className="grow overflow-y-auto pr-2">
        {sortedFolders.map(folder => {
          const isExpanded = state.expandedFolderIds.includes(folder.id);
          const isSelected = state.selectedFolderId === folder.id;
          const promptsInFolder = getPromptsForFolder(folder.id);

          return (
            <div 
              key={folder.id}
              className={`folder-wrapper mb-1 ${isExpanded ? 'is-expanded' : ''}`}
              data-folder-id={folder.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, folder.id)}
            >
              <div 
                className={`folder-item-header flex items-center p-2 rounded-lg cursor-pointer ${isSelected ? 'bg-blue-600/30 border-blue-500' : ''}`}
                draggable
                onDragStart={(e) => handleDragStart(e, folder.id)}
                onClick={(e) => handleFolderClick(folder, e)}
                onDoubleClick={(e) => handleFolderDoubleClick(folder, e)}
              >
                <ChevronRight className="folder-chevron w-4 h-4 mr-2 shrink-0" />
                <span 
                  className="w-2 h-2 rounded-full mr-2 shrink-0" 
                  style={{ backgroundColor: folder.color }}
                />
                {editingFolderId === folder.id ? (
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onBlur={handleNameSave}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleNameSave();
                      if (e.key === 'Escape') {
                        setEditingFolderId(null);
                        setEditingName('');
                      }
                    }}
                    className="editable-input grow"
                    autoFocus
                  />
                ) : (
                  <span className="folder-name font-medium text-sm truncate grow">
                    {folder.name}
                  </span>
                )}
                <div className="color-picker ml-2" onClick={(e) => e.stopPropagation()}>
                  <input 
                    type="color" 
                    value={folder.color}
                    onChange={(e) => updateFolder(folder.id, { color: e.target.value })}
                    className="folder-color-input"
                  />
                </div>
              </div>

              <div className="folder-prompts-list">
                {promptsInFolder.map(prompt => (
                  <div 
                    key={prompt.id}
                    className="prompt-title-in-folder"
                    onClick={() => handlePromptInFolderClick(prompt.id, folder.id)}
                  >
                    {prompt.title || 'Sin título'}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-auto border-t border-[#2a2a2a] pt-4 flex flex-col gap-1">
        <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1 px-2">
          Almacenamiento
        </p>
        <button 
          onClick={handleSync}
          className={`flex items-center gap-2 p-2 transition-colors rounded-md text-sm ${
            state.fileHandle ? 'text-green-400' : 'text-blue-400 hover:bg-blue-500/10'
          }`}
          title="Sincronizar con un archivo .json en tu PC"
        >
          <RefreshCw className="w-4 h-4" />
          <span>{state.fileHandle ? 'Archivo vinculado' : 'Vincular archivo'}</span>
        </button>
        <button 
          onClick={exportData}
          className="flex items-center gap-2 p-2 text-gray-400 hover:text-white hover:bg-white/5 transition-colors rounded-md text-sm"
        >
          <Download className="w-4 h-4" />
          Exportar JSON
        </button>
        <button 
          onClick={handleImport}
          className="flex items-center gap-2 p-2 text-gray-400 hover:text-white hover:bg-white/5 transition-colors rounded-md text-sm"
        >
          <Upload className="w-4 h-4" />
          Importar JSON
        </button>
        <input 
          ref={fileInputRef}
          type="file" 
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
        />
        {state.fileHandle && (
          <div className="text-[10px] text-gray-500 mt-1 px-2 italic truncate">
            Sync: <span className="text-blue-400">{state.fileHandle.name}</span>
          </div>
        )}
      </div>
      
      {confirmModal && (
        <ConfirmModal
          title={confirmModal.title}
          message={confirmModal.message}
          onConfirm={confirmModal.onConfirm}
          onCancel={() => setConfirmModal(null)}
        />
      )}
    </aside>
  );
}
