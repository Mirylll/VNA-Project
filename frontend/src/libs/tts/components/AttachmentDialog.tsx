"use client";

import { useState, useRef } from 'react';
import { Upload, Save, FileText, X } from 'lucide-react';
import { useEnterpriseForm } from '@/libs/tts/contexts/EnterpriseFormContext';

export default function AttachmentDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { formData, updateAttachments } = useEnterpriseForm();
  const [items, setItems] = useState<any[]>(
    () => formData.attachments.map((a) => ({ ...a })),
  );
  const [editName, setEditName] = useState('');
  const [editFile, setEditFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  function handleAdd() {
    if (!editName.trim()) return;
    let url = '';
    let size = '';
    if (editFile) {
      url = URL.createObjectURL(editFile);
      size = editFile.size > 1024 * 1024
        ? `${(editFile.size / (1024 * 1024)).toFixed(1)} MB`
        : `${(editFile.size / 1024).toFixed(0)} KB`;
    }
    setItems((prev) => [
      ...prev,
      { name: editName.trim(), fileName: editFile ? editFile.name : editName.trim(), url, size, file: editFile || undefined },
    ]);
    setEditName('');
    setEditFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function handleSave() {
    updateAttachments(items.map(({ name, fileName, url, size, file }) => ({ name, fileName, url, size, file })));
    onClose();
  }

  function handleClose() {
    items.forEach((item) => {
      if (item.url && item.url.startsWith('blob:')) URL.revokeObjectURL(item.url);
    });
    setItems(formData.attachments.map((a) => ({ ...a })));
    setEditName('');
    setEditFile(null);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-blue-600 px-6 py-3 flex items-center justify-between">
          <h2 className="text-white font-semibold text-base">Quản lý file đính kèm</h2>
          <button onClick={handleClose} className="text-white/80 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="border border-slate-200 rounded-lg p-4 space-y-3">
            <div className="relative border border-slate-200 rounded-lg h-11 px-3 pt-3 pb-2">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-slate-500">
                Tên file <span className="text-red-500">*</span>
              </label>
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Giấy phép kinh doanh"
                className="w-full border-none outline-none text-sm py-0.5 placeholder:text-gray-300"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="shrink-0 flex items-center gap-1.5 border border-slate-200 text-slate-600 font-medium px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors text-sm"
              >
                <Upload size={15} />
                Chọn file
              </button>
              <input
                ref={fileInputRef}
                type="file"
                onChange={(e) => setEditFile(e.target.files?.[0] || null)}
                className="hidden"
              />
              <span className="text-sm text-slate-400 truncate flex-1">
                {editFile ? editFile.name : 'Chưa chọn file'}
              </span>
              <button
                onClick={handleAdd}
                disabled={!editName.trim()}
                className="shrink-0 flex items-center gap-1.5 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload size={15} />
                Thêm
              </button>
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto space-y-2">
            {items.length === 0 ? (
              <p className="text-center text-sm text-gray-400 py-4">Chưa có file đính kèm</p>
            ) : (
              items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 border border-slate-200 rounded-lg px-4 py-3"
                >
                  <FileText size={18} className="shrink-0 text-blue-500" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">{item.name}</p>
                    <p className="text-xs text-gray-400 truncate">
                      {item.fileName}{item.size ? ` — ${item.size}` : ''}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="px-6 py-4 flex items-center justify-end gap-3 border-t border-slate-200">
          <button
            onClick={handleClose}
            className="text-slate-500 font-medium hover:text-slate-700 transition-colors text-sm"
          >
            Huỷ bỏ
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition-colors text-sm"
          >
            <Save size={15} />
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}
