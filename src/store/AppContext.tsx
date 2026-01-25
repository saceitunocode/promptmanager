'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Folder, Prompt, AppData, ViewMode, StorageData } from '@/types';

const STORAGE_KEY = 'promptManagerData_v2';

interface AppState {
  data: AppData;
  selectedFolderId: string | null;
  viewMode: ViewMode;
  expandedFolderIds: string[];
  fileHandle: FileSystemFileHandle | null;
}

interface AppContextType {
  state: AppState;
  // Folder operations
  addFolder: () => void;
  deleteFolder: (id: string) => void;
  updateFolder: (id: string, updates: Partial<Folder>) => void;
  reorderFolders: (folderIds: string[]) => void;
  selectFolder: (id: string | null) => void;
  toggleFolderExpansion: (id: string) => void;
  // Prompt operations
  addPrompt: () => string | null;
  deletePrompt: (id: string) => void;
  updatePrompt: (id: string, updates: Partial<Prompt>) => void;
  reorderPrompts: (promptIds: string[]) => void;
  movePromptToFolder: (promptId: string, folderId: string) => void;
  sortPromptsAlphabetically: () => void;
  // View operations
  setViewMode: (mode: ViewMode) => void;
  // Data operations
  exportData: () => void;
  importData: (file: File) => Promise<void>;
  syncWithFile: () => Promise<void>;
  // Helpers
  getFolderById: (id: string) => Folder | undefined;
  getPromptsForFolder: (folderId: string) => Prompt[];
  getPromptById: (id: string) => Prompt | undefined;
}

const AppContext = createContext<AppContextType | null>(null);

function generateId(): string {
  return crypto.randomUUID();
}

function createDefaultData(): AppData {
  const initialFolderId = generateId();
  return {
    folders: [{ id: initialFolderId, name: 'General', color: '#888888', order: 0 }],
    prompts: [],
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    data: { folders: [], prompts: [] },
    selectedFolderId: null,
    viewMode: 'grid',
    expandedFolderIds: [],
    fileHandle: null,
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    // Defer state update to next tick to avoid "synchronous setState in effect" lint error
    setTimeout(() => {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        try {
          const parsed: StorageData = JSON.parse(savedData);
          const folders = parsed.data.folders.sort((a, b) => a.order - b.order);
          setState(prev => ({
            ...prev,
            data: parsed.data,
            viewMode: parsed.viewMode || 'grid',
            expandedFolderIds: parsed.expandedFolderIds || [],
            selectedFolderId: folders.length > 0 ? folders[0].id : null,
          }));
        } catch (e) {
          console.error('Error loading data:', e);
          const defaultData = createDefaultData();
          setState(prev => ({
            ...prev,
            data: defaultData,
            selectedFolderId: defaultData.folders[0].id,
            expandedFolderIds: [defaultData.folders[0].id],
          }));
        }
      } else {
        const defaultData = createDefaultData();
        setState(prev => ({
          ...prev,
          data: defaultData,
          selectedFolderId: defaultData.folders[0].id,
          expandedFolderIds: [defaultData.folders[0].id],
        }));
      }
      setIsLoaded(true);
    }, 0);
  }, []);

  async function saveToLinkedFile(handle: FileSystemFileHandle, data: StorageData) {
    try {
      const writable = await handle.createWritable();
      await writable.write(JSON.stringify(data, null, 2));
      await writable.close();
    } catch (err) {
      console.error('Error syncing to file:', err);
    }
  }

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (!isLoaded) return;
    
    const dataToSave: StorageData = {
      data: state.data,
      viewMode: state.viewMode,
      expandedFolderIds: state.expandedFolderIds,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));

    // Sync to file if connected
    if (state.fileHandle) {
      saveToLinkedFile(state.fileHandle, dataToSave);
    }
  }, [state.data, state.viewMode, state.expandedFolderIds, state.fileHandle, isLoaded]);

  // Folder operations
  const addFolder = useCallback(() => {
    const order = state.data.folders.length > 0 
      ? Math.max(...state.data.folders.map(f => f.order)) + 1 
      : 0;
    const newFolder: Folder = {
      id: generateId(),
      name: 'Nueva Carpeta',
      color: '#cccccc',
      order,
    };
    setState(prev => ({
      ...prev,
      data: { ...prev.data, folders: [...prev.data.folders, newFolder] },
      selectedFolderId: newFolder.id,
      expandedFolderIds: [...prev.expandedFolderIds, newFolder.id],
    }));
  }, [state.data.folders]);

  const deleteFolder = useCallback((id: string) => {
    setState(prev => {
      const newFolders = prev.data.folders.filter(f => f.id !== id);
      const newPrompts = prev.data.prompts.filter(p => p.folderId !== id);
      const sortedFolders = newFolders.sort((a, b) => a.order - b.order);
      return {
        ...prev,
        data: { folders: newFolders, prompts: newPrompts },
        selectedFolderId: prev.selectedFolderId === id 
          ? (sortedFolders.length > 0 ? sortedFolders[0].id : null)
          : prev.selectedFolderId,
      };
    });
  }, []);

  const updateFolder = useCallback((id: string, updates: Partial<Folder>) => {
    setState(prev => ({
      ...prev,
      data: {
        ...prev.data,
        folders: prev.data.folders.map(f => f.id === id ? { ...f, ...updates } : f),
      },
    }));
  }, []);

  const reorderFolders = useCallback((folderIds: string[]) => {
    setState(prev => ({
      ...prev,
      data: {
        ...prev.data,
        folders: prev.data.folders.map(f => ({
          ...f,
          order: folderIds.indexOf(f.id),
        })),
      },
    }));
  }, []);

  const selectFolder = useCallback((id: string | null) => {
    setState(prev => ({ ...prev, selectedFolderId: id }));
  }, []);

  const toggleFolderExpansion = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      expandedFolderIds: prev.expandedFolderIds.includes(id)
        ? prev.expandedFolderIds.filter(fid => fid !== id)
        : [...prev.expandedFolderIds, id],
    }));
  }, []);

  // Prompt operations
  const addPrompt = useCallback((): string | null => {
    if (!state.selectedFolderId) return null;
    
    const promptsInFolder = state.data.prompts.filter(p => p.folderId === state.selectedFolderId);
    const order = promptsInFolder.length > 0 
      ? Math.max(...promptsInFolder.map(p => p.order)) + 1 
      : 0;
    
    const newPrompt: Prompt = {
      id: generateId(),
      title: '',
      text: '',
      folderId: state.selectedFolderId,
      order,
      fileData: null,
      fileName: null,
      fileType: null,
    };
    
    setState(prev => ({
      ...prev,
      data: { ...prev.data, prompts: [...prev.data.prompts, newPrompt] },
    }));
    
    return newPrompt.id;
  }, [state.selectedFolderId, state.data.prompts]);

  const deletePrompt = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      data: { ...prev.data, prompts: prev.data.prompts.filter(p => p.id !== id) },
    }));
  }, []);

  const updatePrompt = useCallback((id: string, updates: Partial<Prompt>) => {
    setState(prev => ({
      ...prev,
      data: {
        ...prev.data,
        prompts: prev.data.prompts.map(p => p.id === id ? { ...p, ...updates } : p),
      },
    }));
  }, []);

  const reorderPrompts = useCallback((promptIds: string[]) => {
    setState(prev => ({
      ...prev,
      data: {
        ...prev.data,
        prompts: prev.data.prompts.map(p => ({
          ...p,
          order: promptIds.includes(p.id) ? promptIds.indexOf(p.id) : p.order,
        })),
      },
    }));
  }, []);

  const movePromptToFolder = useCallback((promptId: string, folderId: string) => {
    setState(prev => {
      const promptsInNewFolder = prev.data.prompts.filter(p => p.folderId === folderId && p.id !== promptId);
      const newOrder = promptsInNewFolder.length;
      return {
        ...prev,
        data: {
          ...prev.data,
          prompts: prev.data.prompts.map(p => 
            p.id === promptId ? { ...p, folderId, order: newOrder } : p
          ),
        },
      };
    });
  }, []);

  const sortPromptsAlphabetically = useCallback(() => {
    setState(prev => {
      const promptsInFolder = prev.data.prompts
        .filter(p => p.folderId === prev.selectedFolderId)
        .sort((a, b) => a.title.localeCompare(b.title));
      
      const updatedPrompts = prev.data.prompts.map(p => {
        if (p.folderId === prev.selectedFolderId) {
          const index = promptsInFolder.findIndex(pp => pp.id === p.id);
          return { ...p, order: index };
        }
        return p;
      });

      return {
        ...prev,
        data: { ...prev.data, prompts: updatedPrompts },
      };
    });
  }, []);

  // View operations
  const setViewMode = useCallback((mode: ViewMode) => {
    setState(prev => ({ ...prev, viewMode: mode }));
  }, []);

  // Data operations
  const exportData = useCallback(() => {
    const dataToSave: StorageData = {
      data: state.data,
      viewMode: state.viewMode,
      expandedFolderIds: state.expandedFolderIds,
    };
    const blob = new Blob([JSON.stringify(dataToSave, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompts_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [state.data, state.viewMode, state.expandedFolderIds]);

  const importData = useCallback(async (file: File) => {
    const text = await file.text();
    const imported: StorageData = JSON.parse(text);
    if (imported.data) {
      setState(prev => ({
        ...prev,
        data: imported.data,
        viewMode: imported.viewMode || 'grid',
        expandedFolderIds: imported.expandedFolderIds || [],
        selectedFolderId: imported.data.folders.length > 0 
          ? imported.data.folders.sort((a, b) => a.order - b.order)[0].id 
          : null,
      }));
    }
  }, []);

  const syncWithFile = useCallback(async () => {
    try {
      const [handle] = await window.showOpenFilePicker({
        types: [{ description: 'JSON Files', accept: { 'application/json': ['.json'] } }],
        multiple: false,
      });

      const file = await handle.getFile();
      const text = await file.text();

      if (text.trim()) {
        const imported: StorageData = JSON.parse(text);
        if (imported.data) {
          setState(prev => ({
            ...prev,
            data: imported.data,
            viewMode: imported.viewMode || 'grid',
            expandedFolderIds: imported.expandedFolderIds || [],
            fileHandle: handle,
            selectedFolderId: imported.data.folders.length > 0 
              ? imported.data.folders.sort((a, b) => a.order - b.order)[0].id 
              : null,
          }));
        }
      } else {
        setState(prev => ({ ...prev, fileHandle: handle }));
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('Error syncing with file:', err);
        throw err;
      }
    }
  }, []);

  // Helpers
  const getFolderById = useCallback((id: string) => {
    return state.data.folders.find(f => f.id === id);
  }, [state.data.folders]);

  const getPromptsForFolder = useCallback((folderId: string) => {
    return state.data.prompts
      .filter(p => p.folderId === folderId)
      .sort((a, b) => a.order - b.order);
  }, [state.data.prompts]);

  const getPromptById = useCallback((id: string) => {
    return state.data.prompts.find(p => p.id === id);
  }, [state.data.prompts]);

  if (!isLoaded) {
    return null;
  }

  return (
    <AppContext.Provider value={{
      state,
      addFolder,
      deleteFolder,
      updateFolder,
      reorderFolders,
      selectFolder,
      toggleFolderExpansion,
      addPrompt,
      deletePrompt,
      updatePrompt,
      reorderPrompts,
      movePromptToFolder,
      sortPromptsAlphabetically,
      setViewMode,
      exportData,
      importData,
      syncWithFile,
      getFolderById,
      getPromptsForFolder,
      getPromptById,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
