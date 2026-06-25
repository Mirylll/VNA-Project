"use client";

import { Eye, Trash2, Upload } from 'lucide-react';
import { ChangeEvent, useRef, useState } from 'react';

export type AttachmentFile = {
  id: string;
  name: string;
  info: string;
  url: string;
};

export const initialAttachmentFiles: AttachmentFile[] = [
  {
    id: 'business-license',
    name: 'Giấy phép kinh doanh',
    info: 'GPKD.pdf',
    url: '',
  },
  {
    id: 'other-paper',
    name: 'Giấy tờ khác',
    info: 'GTK1.pdf',
    url: '',
  },
];

type AttachmentTableProps = {
  files: AttachmentFile[];
  onFilesChange: (files: AttachmentFile[]) => void;
  onViewFile: (file: AttachmentFile) => void;
  onRevokeFileUrl: (url: string) => void;
};

export default function AttachmentTable({
  files,
  onFilesChange,
  onViewFile,
  onRevokeFileUrl,
}: AttachmentTableProps) {
  const [message, setMessage] = useState('');
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  function handleUpload(rowId: string, selectedFile?: File) {
    if (!selectedFile) return;

    const isPdf =
      selectedFile.type === 'application/pdf' ||
      selectedFile.name.toLowerCase().endsWith('.pdf');

    if (!isPdf) {
      setMessage('Chỉ chấp nhận file PDF.');
      return;
    }

    setMessage('');
    const fileUrl = URL.createObjectURL(selectedFile);

    onFilesChange(
      files.map((file) => {
        if (file.id !== rowId) return file;
        if (file.url) onRevokeFileUrl(file.url);
        return { ...file, info: selectedFile.name, url: fileUrl };
      }),
    );
  }

  function handleFileChange(rowId: string, event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.currentTarget.files?.[0];
    handleUpload(rowId, selectedFile);
    event.currentTarget.value = '';
  }

  function handleView(file: AttachmentFile) {
    if (!file.url) {
      setMessage('Bạn cần tải lên file PDF trước khi xem.');
      return;
    }

    setMessage('');
    onViewFile(file);
  }

  function handleDelete(rowId: string) {
    onFilesChange(
      files.map((file) => {
        if (file.id !== rowId) return file;
        if (file.url) onRevokeFileUrl(file.url);
        return { ...file, info: '', url: '' };
      }),
    );
  }

  return (
    <div>
      {message && (
        <div className="mb-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700">
          {message}
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-slate-200">
        <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-2.5 text-gray-600 font-medium">Tên file</th>
              <th className="text-left px-4 py-2.5 text-gray-600 font-medium">Thông tin file</th>
              <th className="text-right px-4 py-2.5 text-gray-600 font-medium">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr key={file.id} className="border-t border-gray-200 bg-white">
                <td className="px-4 py-3 text-gray-700">{file.name}</td>
                <td className="px-4 py-3 text-gray-500">{file.info || <span className="italic text-gray-300">Chưa có file</span>}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleView(file)}
                      disabled={!file.url}
                      title="Xem file"
                      className={`p-1.5 rounded transition ${
                        file.url
                          ? 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'
                          : 'text-gray-200 cursor-not-allowed'
                      }`}
                    >
                      <Eye size={17} />
                    </button>
                    <button
                      type="button"
                      title="Tải lên"
                      onClick={() => inputRefs.current[file.id]?.click()}
                      className="p-1.5 rounded text-gray-500 hover:text-green-600 hover:bg-green-50 transition"
                    >
                      <Upload size={17} />
                    </button>
                    <input
                      ref={(element) => {
                        inputRefs.current[file.id] = element;
                      }}
                      type="file"
                      accept="application/pdf,.pdf"
                      className="hidden"
                      onChange={(event) => handleFileChange(file.id, event)}
                    />
                    <button
                      type="button"
                      onClick={() => handleDelete(file.id)}
                      disabled={!file.url}
                      title="Xóa file"
                      className={`p-1.5 rounded transition ${
                        file.url
                          ? 'text-gray-500 hover:text-red-600 hover:bg-red-50'
                          : 'text-gray-200 cursor-not-allowed'
                      }`}
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
