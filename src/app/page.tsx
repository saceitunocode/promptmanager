'use client';

import { useState, useCallback } from 'react';
import { Inbox, FolderOpen } from 'lucide-react';
import { AppProvider, useApp } from '@/store/AppContext';
import { Sidebar, Header, PromptCard, EditModal, ConfirmModal, Toast } from '@/components';
import { Prompt } from '@/types';

function PromptManager() {
  const { state, addPrompt, deletePrompt, updatePrompt, getPromptsForFolder, getFolderById, getPromptById, reorderPrompts } = useApp();
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingPromptId, setEditingPromptId] = useState<string | null>(null);
  const [isNewPrompt, setIsNewPrompt] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{ title: string; message: string; onConfirm: () => void } | null>(null);
  const [toast, setToast] = useState<{ message: string; isError: boolean } | null>(null);
  const [draggedPromptId, setDraggedPromptId] = useState<string | null>(null);

  const showToast = useCallback((message: string, isError = false) => {
    setToast({ message, isError });
  }, []);

  const handleAddPrompt = () => {
    if (!state.selectedFolderId) {
      showToast('Selecciona una carpeta.', true);
      return;
    }
    const newId = addPrompt();
    if (newId) {
      setEditingPromptId(newId);
      setIsNewPrompt(true);
    }
  };

  const handleCopyPrompt = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      showToast('¡Copiado al portapapeles!');
    });
  };

  const handleDeletePrompt = (prompt: Prompt) => {
    setConfirmModal({
      title: 'Eliminar Prompt',
      message: `¿Seguro que quieres eliminar "${prompt.title || 'Sin título'}"?`,
      onConfirm: () => {
        deletePrompt(prompt.id);
        setConfirmModal(null);
      },
    });
  };

  const handleEditPrompt = (promptId: string) => {
    setEditingPromptId(promptId);
    setIsNewPrompt(false);
  };

  const handleSavePrompt = (updates: Partial<Prompt>) => {
    if (editingPromptId) {
      updatePrompt(editingPromptId, updates);
      setEditingPromptId(null);
      setIsNewPrompt(false);
      showToast('Prompt guardado');
    }
  };

  const handleCancelEdit = () => {
    setEditingPromptId(null);
    setIsNewPrompt(false);
  };

  const handleDeleteNewPrompt = () => {
    if (editingPromptId) {
      deletePrompt(editingPromptId);
    }
  };

  const handleViewFile = (fileData: string) => {
    const newTab = window.open();
    if (newTab) {
      newTab.document.title = 'Vista Previa';
      newTab.document.body.style.margin = '0';
      newTab.document.body.style.overflow = 'hidden';
      newTab.document.body.innerHTML = `<iframe src="${fileData}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100vw; height:100vh;" allowfullscreen></iframe>`;
    } else {
      showToast('Por favor, permite las ventanas emergentes.', true);
    }
  };

  // Drag and drop for prompts
  const handlePromptDragStart = (e: React.DragEvent, promptId: string) => {
    setDraggedPromptId(promptId);
    e.dataTransfer.setData('promptId', promptId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handlePromptDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handlePromptDrop = (e: React.DragEvent, targetPromptId: string) => {
    e.preventDefault();
    if (!draggedPromptId || draggedPromptId === targetPromptId) {
      setDraggedPromptId(null);
      return;
    }

    const prompts = getPromptsForFolder(state.selectedFolderId!);
    const newOrder = prompts.map(p => p.id);
    const draggedIndex = newOrder.indexOf(draggedPromptId);
    const targetIndex = newOrder.indexOf(targetPromptId);
    
    newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedPromptId);
    
    reorderPrompts(newOrder);
    setDraggedPromptId(null);
  };

  const selectedFolder = state.selectedFolderId ? getFolderById(state.selectedFolderId) : null;
  const prompts = state.selectedFolderId ? getPromptsForFolder(state.selectedFolderId) : [];
  const filteredPrompts = prompts.filter(p => 
    !searchQuery || 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const editingPrompt = editingPromptId ? getPromptById(editingPromptId) : null;

  return (
    <div className="flex h-screen">
      <div className={sidebarCollapsed ? 'sidebar-collapsed' : ''}>
        <Sidebar />
      </div>
      
      <main className="flex-1 flex flex-col bg-[#1a1a1a]">
        <Header 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          onAddPrompt={handleAddPrompt}
        />
        
        <div className="flex-1 p-6 overflow-y-auto">
          {state.selectedFolderId ? (
            <>
              <h2 className="text-2xl font-bold mb-6 text-white">
                {selectedFolder?.name || ''}
              </h2>
              
              {filteredPrompts.length > 0 ? (
                <div className={
                  state.viewMode === 'list' 
                    ? 'prompts-list-view' 
                    : 'prompts-grid-view grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                }>
                  {filteredPrompts.map(prompt => (
                    <PromptCard
                      key={prompt.id}
                      prompt={prompt}
                      viewMode={state.viewMode}
                      onCopy={() => handleCopyPrompt(prompt.text)}
                      onDelete={() => handleDeletePrompt(prompt)}
                      onEdit={() => handleEditPrompt(prompt.id)}
                      onViewFile={() => prompt.fileData && handleViewFile(prompt.fileData)}
                      onDragStart={(e) => handlePromptDragStart(e, prompt.id)}
                      onDragOver={handlePromptDragOver}
                      onDrop={(e) => handlePromptDrop(e, prompt.id)}
                    />
                  ))}
                </div>
              ) : !searchQuery ? (
                <div className="text-center text-gray-500 mt-16">
                  <Inbox className="w-16 h-16 mx-auto mb-4" />
                  <p className="text-lg">Esta carpeta está vacía.</p>
                  <p>Crea un nuevo prompt para empezar.</p>
                </div>
              ) : null}
            </>
          ) : (
            <div className="text-center text-gray-500 mt-16">
              <FolderOpen className="w-16 h-16 mx-auto mb-4" />
              <p className="text-lg">Selecciona o crea una carpeta</p>
              <p>Tus prompts se organizan en carpetas.</p>
            </div>
          )}
        </div>
      </main>

      {editingPrompt && (
        <EditModal
          key={editingPrompt.id}
          prompt={editingPrompt}
          isNew={isNewPrompt}
          onSave={handleSavePrompt}
          onCancel={handleCancelEdit}
          onDelete={handleDeleteNewPrompt}
        />
      )}

      {confirmModal && (
        <ConfirmModal
          title={confirmModal.title}
          message={confirmModal.message}
          onConfirm={confirmModal.onConfirm}
          onCancel={() => setConfirmModal(null)}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          isError={toast.isError}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <PromptManager />
    </AppProvider>
  );
}
