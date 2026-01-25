'use client';

import { useState, useRef } from 'react';
import { XCircle } from 'lucide-react';
import { Prompt } from '@/types';

interface EditModalProps {
  prompt: Prompt | null;
  isNew: boolean;
  onSave: (updates: Partial<Prompt>) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

export default function EditModal({ prompt, isNew, onSave, onCancel, onDelete }: EditModalProps) {
  const [title, setTitle] = useState(prompt?.title || '');
  const [text, setText] = useState(prompt?.text || '');
  const [fileName, setFileName] = useState<string | null>(prompt?.fileName || null);
  // fileData and fileType are stored in state implicitly if needed, or directly used
  // However, looking at handleSave, we use fileData/fileType from prompt if not changed
  // But we need to update them if file changes.
  // Actually, handleSave logic:
  // if removeFile -> nulls
  // else if pendingFile -> new file
  // else -> undefined in updates (so original prompt data stays)
  
  // So we don't need state for fileData/fileType unless we display previews which we don't see here except fileName.
  
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [removeFile, setRemoveFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!prompt) return null;

  if (!prompt) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPendingFile(file);
      setFileName(file.name);
      setRemoveFile(false);
    }
  };

  const handleRemoveFile = () => {
    setRemoveFile(true);
    setPendingFile(null);
    setFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSave = async () => {
    const updates: Partial<Prompt> = {
      title: title.trim(),
      text: text.trim(),
    };

    if (removeFile) {
      updates.fileData = null;
      updates.fileName = null;
      updates.fileType = null;
    } else if (pendingFile) {
      try {
        const base64 = await readFileAsBase64(pendingFile);
        updates.fileData = base64;
        updates.fileName = pendingFile.name;
        updates.fileType = pendingFile.type;
      } catch {
        alert('Error al leer el archivo.');
        return;
      }
    }

    onSave(updates);
  };

  const handleCancel = () => {
    if (isNew && onDelete) {
      onDelete();
    }
    onCancel();
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleCancel();
      }}
    >
      <div 
        className="bg-[#2a2a2a] rounded-lg p-6 shadow-xl flex flex-col resize overflow-auto"
        style={{ width: '60vw', height: '75vh', minWidth: '450px', minHeight: '400px' }}
      >
        <h3 className="text-xl font-bold mb-4 text-white">
          {isNew ? 'Nuevo Prompt' : 'Editar Prompt'}
        </h3>
        
        <div className="mb-4">
          <label htmlFor="edit-prompt-title" className="block text-sm font-medium text-gray-300 mb-1">
            Título
          </label>
          <input 
            type="text"
            id="edit-prompt-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-[#333] border border-[#555] rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        </div>
        
        <div className="grow mb-4 flex flex-col">
          <label htmlFor="edit-prompt-text" className="block text-sm font-medium text-gray-300 mb-1">
            Texto del Prompt
          </label>
          <textarea
            id="edit-prompt-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full grow bg-[#333] border border-[#555] rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>
        
        <div className="mt-4 border-t border-gray-600 pt-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Archivo adjunto (Opcional)
          </label>
          <div className="flex items-center gap-3">
            <label className="bg-gray-600 hover:bg-gray-700 text-white text-sm font-semibold py-2 px-3 rounded-lg cursor-pointer transition-colors">
              <span>Seleccionar...</span>
              <input 
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                accept=".txt,.jpg,.jpeg,.png,.gif,.webp,.pdf"
                className="hidden"
              />
            </label>
            <span className="text-gray-400 text-sm truncate max-w-xs">
              {fileName || 'Ningún archivo seleccionado.'}
            </span>
            {fileName && (
              <button 
                onClick={handleRemoveFile}
                className="p-1 text-gray-400 hover:text-red-400 ml-auto"
                title="Quitar archivo actual"
              >
                <XCircle className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
        
        <div className="flex justify-end gap-4 mt-6">
          <button 
            onClick={handleCancel}
            className="py-2 px-4 rounded-lg bg-gray-600 hover:bg-gray-700 text-white transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSave}
            className="py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}
