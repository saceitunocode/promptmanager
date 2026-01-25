'use client';

import { Copy, Trash2, Paperclip } from 'lucide-react';
import { Prompt } from '@/types';

interface PromptCardProps {
  prompt: Prompt;
  viewMode: 'grid' | 'list';
  onCopy: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onViewFile: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

export default function PromptCard({ 
  prompt, 
  viewMode, 
  onCopy, 
  onDelete, 
  onEdit, 
  onViewFile,
  onDragStart,
  onDragOver,
  onDrop,
}: PromptCardProps) {
  return (
    <div 
      className="prompt-card bg-[#222] rounded-lg flex flex-col p-4 transition-all cursor-pointer"
      data-prompt-id={prompt.id}
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDoubleClick={onEdit}
    >
      <div className="prompt-card-content flex-grow overflow-hidden">
        <h3 className="prompt-title font-bold text-white truncate mb-2">
          {prompt.title || 'Sin título'}
        </h3>
        {viewMode === 'grid' && (
          <p 
            className="prompt-text text-sm text-gray-400"
            style={{ 
              display: '-webkit-box', 
              WebkitLineClamp: 3, 
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {prompt.text}
          </p>
        )}
      </div>
      
      <div className="prompt-actions flex items-center justify-end gap-2 mt-4">
        {prompt.fileData && (
          <button 
            onClick={(e) => { e.stopPropagation(); onViewFile(); }}
            className="details-prompt-btn flex items-center gap-1.5 py-1 px-2 text-xs text-gray-300 bg-gray-700/50 hover:bg-gray-600/50 rounded-md"
            title={`Ver archivo: ${prompt.fileName}`}
          >
            <Paperclip className="w-3 h-3" />
            Más detalles
          </button>
        )}
        <button 
          onClick={(e) => { e.stopPropagation(); onCopy(); }}
          className="copy-prompt-btn p-2 text-gray-400 hover:text-blue-400"
          title="Copiar"
        >
          <Copy className="w-4 h-4" />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="delete-prompt-btn p-2 text-gray-400 hover:text-red-400"
          title="Eliminar"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
