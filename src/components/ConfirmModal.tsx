'use client';

interface ConfirmModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({ title, message, onConfirm, onCancel }: ConfirmModalProps) {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="bg-[#2a2a2a] rounded-lg p-6 w-full max-w-sm shadow-xl">
        <h3 className="text-lg font-bold mb-4 text-white">{title}</h3>
        <p className="mb-6 text-gray-300">{message}</p>
        <div className="flex justify-end gap-4">
          <button 
            onClick={onCancel}
            className="py-2 px-4 rounded-lg bg-gray-600 hover:bg-gray-700 text-white transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={onConfirm}
            className="py-2 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
