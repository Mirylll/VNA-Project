"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Plus, Eye, Pencil, KeyRound, RefreshCw, ChevronDown, Download } from 'lucide-react';
import { getAuthToken } from '@/libs/core/utils/auth-token';
import SelectionBar from '@/libs/tts/components/SelectionBar';
import Pagination from './Pagination';
import AccountInfoModal from '@/libs/tts/components/AccountInfoModal';
import EnterpriseResetPasswordModal from '@/libs/tts/components/EnterpriseResetPasswordModal';
import ConfirmDeleteDialog from '@/libs/tts/components/ConfirmDeleteDialog';

const baseUrl =
  typeof window !== 'undefined'
    ? process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
    : '';

function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 ${
        checked ? 'bg-blue-600' : 'bg-gray-400'
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-200 ${
          checked ? 'translate-x-[18px]' : 'translate-x-[2px]'
        }`}
      />
    </button>
  );
}

function parseCSV(text: string): string[][] {
  const lines: string[][] = [];
  let row: string[] = [];
  let inQuotes = false;
  let currentVal = '';

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentVal += '"';
        i++; // skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(currentVal.trim());
      currentVal = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      row.push(currentVal.trim());
      currentVal = '';
      if (row.some(val => val.length > 0)) {
        lines.push(row);
      }
      row = [];
      if (char === '\r' && nextChar === '\n') {
        i++; // skip \n
      }
    } else {
      currentVal += char;
    }
  }
  if (currentVal || row.length > 0) {
    row.push(currentVal.trim());
    if (row.some(val => val.length > 0)) {
      lines.push(row);
    }
  }
  return lines;
}

export default function EnterpriseListPage() {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterName, setFilterName] = useState('');
  const [filterTaxCode, setFilterTaxCode] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterIndustry, setFilterIndustry] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [acctModal, setAcctModal] = useState<{ open: boolean; item: any }>({ open: false, item: null });
  const [resetPwModal, setResetPwModal] = useState<{ open: boolean; enterprise: any }>({ open: false, enterprise: null });
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  function fetchItems() {
    setLoading(true);
    setError('');

    const token = getAuthToken();
    if (!token) {
      setError('Bạn cần đăng nhập');
      setLoading(false);
      return;
    }

    fetch(`${baseUrl}/enterprises`, {
      headers: { authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Không thể tải danh sách');
        return res.json();
      })
      .then((data) => setItems(data))
      .catch((err) => setError(err.message || 'Lỗi kết nối backend'))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterName, filterTaxCode, filterType, filterIndustry, filterStatus, itemsPerPage]);

  const filteredItems = items.filter((item: any) => {
    const n = filterName.toLowerCase().trim();
    const tc = filterTaxCode.toLowerCase().trim();
    const et = filterType.toLowerCase().trim();
    const ind = filterIndustry.toLowerCase().trim();

    if (n && !item.name.toLowerCase().includes(n)) return false;
    if (tc && !(item.taxCode || '').toLowerCase().includes(tc)) return false;
    if (et && !(item.enterpriseType?.name || '').toLowerCase().includes(et)) return false;
    if (ind && !(item.industry?.name || '').toLowerCase().includes(ind)) return false;
    if (filterStatus === 'active' && !item.isActive) return false;
    if (filterStatus === 'inactive' && item.isActive) return false;
    return true;
  });
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  function handleAddNew() {
    router.push('/admin/enterprises/create');
  }

  function handleEdit(item: any) {
    router.push(`/admin/enterprises/create?id=${item.id}`);
  }

  function handleViewAcct(item: any) {
    setAcctModal({ open: true, item });
  }

  function handleResetPw(item: any) {
    setResetPwModal({ open: true, enterprise: item });
  }

  async function handleToggleStatus(item: any) {
    const token = getAuthToken();
    if (!token) return;

    // Optimistic update: cập nhật ngay trong state local, không re-fetch
    const newIsActive = !item.isActive;
    setItems((prev: any[]) =>
      prev.map((i: any) =>
        i.id === item.id ? { ...i, isActive: newIsActive } : i,
      ),
    );

    try {
      await fetch(`${baseUrl}/enterprises/${item.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: newIsActive }),
      });
    } catch {
      // Rollback nếu API lỗi
      setItems((prev: any[]) =>
        prev.map((i: any) =>
          i.id === item.id ? { ...i, isActive: item.isActive } : i,
        ),
      );
      setError('Lỗi cập nhật trạng thái');
    }
  }

  async function handleDeleteSelected() {
    setDeleteConfirm(false);
    const token = getAuthToken();
    if (!token) return;

    const results = await Promise.allSettled(
      selectedIds.map((id) =>
        fetch(`${baseUrl}/enterprises/${id}`, {
          method: 'DELETE',
          headers: { authorization: `Bearer ${token}` },
        }),
      ),
    );

    const succeeded = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;
    const count = selectedIds.length;

    setSelectedIds([]);
    fetchItems();

    if (failed > 0) {
      setError(`Đã xoá ${succeeded}/${count} doanh nghiệp. ${failed} doanh nghiệp không thể xoá.`);
    }
  }

  function handleExportCSV() {
    let csvContent = "\uFEFF"; // UTF-8 BOM
    csvContent += "Tên doanh nghiệp,Mã số thuế,Loại hình kinh doanh,Ngành nghề kinh doanh,Trạng thái\n";
    filteredItems.forEach((item: any) => {
      const name = (item.name || '').replace(/"/g, '""');
      const taxCode = (item.taxCode || '').replace(/"/g, '""');
      const typeName = (item.enterpriseType?.name || '').replace(/"/g, '""');
      const indName = (item.industry?.name || '').replace(/"/g, '""');
      const status = item.isActive ? 'Hoạt động' : 'Ngừng';
      csvContent += `"${name}","${taxCode}","${typeName}","${indName}","${status}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "Danh_sach_doanh_nghiep.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  async function handleImportCSV(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size < 10 || file.size > 2097152) {
      alert(`Dung lượng file phải từ 10 bytes đến 2 MB (Dung lượng file của bạn: ${file.size} bytes).`);
      e.target.value = '';
      return;
    }

    const token = getAuthToken();
    if (!token) {
      setError('Bạn cần đăng nhập');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const text = evt.target?.result as string;
        const rows = parseCSV(text);
        if (rows.length <= 1) {
          alert('File CSV không có dữ liệu hoặc rỗng.');
          return;
        }

        // Fetch enterprise types, industries, and wards to map names to IDs
        const [typesRes, indRes, wardRes] = await Promise.all([
          fetch(`${baseUrl}/enterprise-types`, { headers: { authorization: `Bearer ${token}` } }),
          fetch(`${baseUrl}/industries`, { headers: { authorization: `Bearer ${token}` } }),
          fetch(`${baseUrl}/districts?provinceId=1`, { headers: { authorization: `Bearer ${token}` } }),
        ]);

        const typesList = typesRes.ok ? await typesRes.json() : [];
        const indList = indRes.ok ? await indRes.json() : [];
        const wardList = wardRes.ok ? await wardRes.json() : [];

        const typeMap: Record<string, number> = {};
        if (Array.isArray(typesList)) {
          typesList.forEach((t: any) => {
            typeMap[t.name.toLowerCase().trim()] = t.id;
          });
        }

        const indMap: Record<string, number> = {};
        if (Array.isArray(indList)) {
          indList.forEach((i: any) => {
            indMap[i.name.toLowerCase().trim()] = i.id;
          });
        }

        const wardMap: Record<string, number> = {};
        if (Array.isArray(wardList)) {
          wardList.forEach((w: any) => {
            const nameClean = w.name.toLowerCase().replace(/^(phường|xã|thị trấn)\s+/i, '').trim();
            wardMap[nameClean] = w.id;
            wardMap[w.name.toLowerCase().trim()] = w.id;
          });
        }

        const headers = rows[0].map(h => h.toLowerCase().trim());

        const nameIdx = headers.findIndex(h => h.includes('tên doanh nghiệp') || h.includes('name'));
        const taxIdx = headers.findIndex(h => h.includes('mã số thuế') || h.includes('taxcode') || h.includes('mst'));
        const typeIdx = headers.findIndex(h => h.includes('loại hình') || h.includes('type'));
        const indIdx = headers.findIndex(h => h.includes('ngành nghề') || h.includes('industry'));
        const addressIdx = headers.findIndex(h => h.includes('địa chỉ') || h.includes('address'));
        const wardIdx = headers.findIndex(h => h.includes('phường') || h.includes('xã') || h.includes('ward'));
        const phoneIdx = headers.findIndex(h => h.includes('điện thoại') || h.includes('phone') || h.includes('sdt'));
        const emailIdx = headers.findIndex(h => h.includes('email'));
        const foreignNameIdx = headers.findIndex(h => h.includes('tên nước ngoài') || h.includes('foreign name'));
        const leaderNameIdx = headers.findIndex(h => h.includes('người đứng đầu') || h.includes('leader'));
        const leaderPhoneIdx = headers.findIndex(h => h.includes('sđt người đứng đầu') || h.includes('leader phone'));
        const passwordIdx = headers.findIndex(h => h.includes('mật khẩu') || h.includes('password'));

        if (nameIdx === -1) {
          alert('File CSV phải chứa cột "Tên doanh nghiệp" hoặc "name".');
          return;
        }

        let successCount = 0;
        let failCount = 0;
        const errorsList: string[] = [];

        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          if (row.length === 0 || !row[nameIdx]) continue;

          const name = row[nameIdx];
          const taxCode = taxIdx !== -1 ? row[taxIdx] : '';
          const typeName = typeIdx !== -1 ? row[typeIdx] : '';
          const indName = indIdx !== -1 ? row[indIdx] : '';
          const address = addressIdx !== -1 ? row[addressIdx] : '';
          const wardName = wardIdx !== -1 ? row[wardIdx] : '';
          const phone = phoneIdx !== -1 ? row[phoneIdx] : '';
          const email = emailIdx !== -1 ? row[emailIdx] : '';
          const foreignName = foreignNameIdx !== -1 ? row[foreignNameIdx] : '';
          const leaderName = leaderNameIdx !== -1 ? row[leaderNameIdx] : '';
          const leaderPhone = leaderPhoneIdx !== -1 ? row[leaderPhoneIdx] : '';
          const password = (passwordIdx !== -1 && row[passwordIdx]) ? row[passwordIdx] : 'Default@123';

          const enterpriseTypeId = typeName ? typeMap[typeName.toLowerCase().trim()] : undefined;
          const industryId = indName ? indMap[indName.toLowerCase().trim()] : undefined;

          let wardId = undefined;
          if (wardName) {
            const cleanName = wardName.toLowerCase().replace(/^(phường|xã|thị trấn)\s+/i, '').trim();
            wardId = wardMap[cleanName] || wardMap[wardName.toLowerCase().trim()];
          }

          try {
            const res = await fetch(`${baseUrl}/enterprises`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                name,
                taxCode: taxCode || undefined,
                enterpriseTypeId,
                industryId,
                provinceId: 1, // Default HCMC
                wardId,
                address: address || undefined,
                foreignName: foreignName || undefined,
                email: email || undefined,
                phone: phone || undefined,
                leaderName: leaderName || undefined,
                leaderPhone: leaderPhone || undefined,
                username: taxCode || undefined,
                password,
                isActive: true,
              }),
            });

            if (res.ok) {
              successCount++;
            } else {
              const errData = await res.json().catch(() => ({}));
              failCount++;
              errorsList.push(`Dòng ${i + 1} (${name}): ${errData.message || 'Lỗi thêm mới.'}`);
            }
          } catch {
            failCount++;
            errorsList.push(`Dòng ${i + 1} (${name}): Lỗi kết nối mạng.`);
          }
        }

        fetchItems();

        let msg = `Đã thêm thành công ${successCount} doanh nghiệp.`;
        if (failCount > 0) {
          msg += ` ${failCount} doanh nghiệp bị lỗi.\nChi tiết lỗi:\n` + errorsList.slice(0, 5).join('\n');
          if (errorsList.length > 5) msg += '\n... và các lỗi khác';
          alert(msg);
        } else {
          alert(msg);
        }
      } catch (err: any) {
        alert('Đã xảy ra lỗi khi đọc file: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold text-gray-900">
          Danh sách doanh nghiệp
        </h1>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-blue-500 text-blue-500 text-sm hover:bg-blue-50 transition-colors"
          >
            <Download size={16} />
            Xuất danh sách
          </button>
          <label className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-blue-500 text-blue-500 text-sm hover:bg-blue-50 transition-colors cursor-pointer">
            <Upload size={16} />
            Thêm từ file
            <input type="file" accept=".csv" onChange={handleImportCSV} className="hidden" />
          </label>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            Thêm mới
          </button>
        </div>
      </div>

      <div className="w-full overflow-hidden border border-slate-200 rounded-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-slate-200">
              <th className="w-10 px-2 py-3 text-left">
                <input
                  type="checkbox"
                  checked={
                    paginatedItems.length > 0 &&
                    selectedIds.length === paginatedItems.length
                  }
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedIds(paginatedItems.map((r: any) => r.id));
                    } else {
                      setSelectedIds([]);
                    }
                  }}
                  className="accent-blue-600"
                />
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Tên doanh nghiệp
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Mã số thuế
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Loại hình kinh doanh
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Ngành nghề kinh doanh
              </th>
              <th className="min-w-[200px] px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
            </tr>

            <tr className="border-b border-slate-200">
              <td className="px-2 py-2" />
              <td className="px-2 py-2" />
              <td className="px-3 py-2">
                <input
                  placeholder="Tìm theo tên doanh nghiệp..."
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </td>
              <td className="px-3 py-2">
                <input
                  placeholder="Tìm theo mã số thuế..."
                  value={filterTaxCode}
                  onChange={(e) => setFilterTaxCode(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </td>
              <td className="px-3 py-2">
                <input
                  placeholder="Tìm theo loại hình..."
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </td>
              <td className="px-3 py-2">
                <input
                  placeholder="Tìm theo ngành nghề..."
                  value={filterIndustry}
                  onChange={(e) => setFilterIndustry(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </td>
              <td className="px-3 py-2">
                <div className="relative">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full appearance-none border border-slate-200 rounded-lg px-3 py-1.5 pr-8 text-sm outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="">Lọc theo trạng thái</option>
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Ngừng</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                </div>
              </td>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-gray-400">
                  Đang tải...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-red-400">
                  <span>{error}</span>
                  <button
                    onClick={fetchItems}
                    className="ml-2 inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <RefreshCw size={14} /> Thử lại
                  </button>
                </td>
              </tr>
            ) : paginatedItems.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-gray-400">
                  Không tìm thấy doanh nghiệp
                </td>
              </tr>
            ) : (
              paginatedItems.map((item: any) => (
                <tr
                  key={item.id}
                  className="border-b border-slate-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-2 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item.id)}
                      onChange={() => {
                        setSelectedIds((prev) =>
                          prev.includes(item.id)
                            ? prev.filter((id) => id !== item.id)
                            : [...prev, item.id],
                        );
                      }}
                      className="accent-blue-600"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewAcct(item)}
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleResetPw(item)}
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <KeyRound size={15} />
                      </button>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-700">{item.name}</td>
                  <td className="px-3 py-3 text-sm text-gray-700 font-mono">
                    {item.taxCode}
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-700">
                    {item.enterpriseType?.name || '-'}
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-700">
                    {item.industry?.name || '-'}
                  </td>
                  <td className="px-3 py-3">
                    <ToggleSwitch
                      checked={item.isActive}
                      onChange={() => handleToggleStatus(item)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredItems.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={(size) => { setItemsPerPage(size); setCurrentPage(1); }}
      />

      <SelectionBar
        selectedCount={selectedIds.length}
        onClear={() => setSelectedIds([])}
        onDelete={() => setDeleteConfirm(true)}
      />

      <AccountInfoModal
        open={acctModal.open}
        currentAccount={acctModal.item}
        onClose={() => setAcctModal({ open: false, item: null })}
      />

      <EnterpriseResetPasswordModal
        open={resetPwModal.open}
        enterprise={resetPwModal.enterprise}
        onClose={() => setResetPwModal({ open: false, enterprise: null })}
        onSaved={() => fetchItems()}
      />

      <ConfirmDeleteDialog
        open={deleteConfirm}
        message={`Xoá ${selectedIds.length} doanh nghiệp đã chọn?`}
        onConfirm={handleDeleteSelected}
        onCancel={() => setDeleteConfirm(false)}
      />
    </div>
  );
}
