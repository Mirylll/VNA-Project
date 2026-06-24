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

      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500">
              <th className="px-4 py-3">Tên file</th>
              <th className="px-4 py-3">Thông tin file</th>
              <th className="px-4 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {files.map((file) => (
              <tr key={file.id} className="text-gray-700">
                <td className="px-4 py-3">{file.name}</td>
                <td className="px-4 py-3">{file.info || 'Chưa có file'}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-3 text-gray-400">
                    <button
                      type="button"
                      className={`transition ${
                        file.url ? 'hover:text-blue-600' : 'cursor-not-allowed opacity-50'
                      }`}
                      aria-label={`Xem ${file.name}`}
                      onClick={() => handleView(file)}
                    >
                      <Eye size={17} />
                    </button>
                    <button
                      type="button"
                      className="transition hover:text-blue-600"
                      aria-label={`Tải lên ${file.name}`}
                      onClick={() => inputRefs.current[file.id]?.click()}
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
                      className="transition hover:text-red-600"
                      aria-label={`Xóa ${file.name}`}
                      onClick={() => handleDelete(file.id)}
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
