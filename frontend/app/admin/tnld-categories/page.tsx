"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Pencil, Plus, ChevronDown, X, Save, FileText, Upload } from 'lucide-react';

// Interfaces for our 3 category types
interface InjuryFactor {
  id: string; // e.g. "Ma_1", "Ma_2"
  name: string; // e.g. "Điện"
  isActive: boolean; // active/inactive toggle
}

interface InjuryType {
  code: string; // e.g. "1", "11", "110"
  name: string;
  level: number; // 1, 2, 3
  parentCode?: string;
}

interface Occupation {
  code: string; // e.g. "1", "11", "111", "1111"
  name: string;
  level: number; // 1, 2, 3, 4
  parentCode?: string;
}

// Initial seed data
const DEFAULT_INJURY_FACTORS: InjuryFactor[] = [
  { id: '1', name: 'Điện', isActive: true },
  { id: '2', name: 'Phóng xạ', isActive: true },
  { id: '3', name: 'Thiết bị áp lực', isActive: true },
  { id: '4', name: 'Thiết bị nâng', isActive: true },
  { id: '5', name: 'Bộ phận truyền động, chuyển động của máy, thiết bị gây cán, cuốn, đè, ép, kẹp, cắt, va đập,...', isActive: true },
  { id: '6', name: 'Vật văng bắn', isActive: true },
  { id: '7', name: 'Vật rơi, đổ, sập', isActive: true },
  { id: '8', name: 'Sập đổ công trình, giàn giáo', isActive: true },
  { id: '9', name: 'Sập lò, sập đất đá', isActive: true }
];

const DEFAULT_INJURY_TYPES: InjuryType[] = [
  { code: '1', name: 'Đầu, mặt, cổ', level: 1 },
  { code: '11', name: 'Các chấn thương sọ não hở hoặc kín', level: 2, parentCode: '1' },
  { code: '110', name: 'Bị thương vào cổ, tác hại đến thanh quản và thực quản', level: 3, parentCode: '11' },
  { code: '2', name: 'Chi trên (vai, cánh tay, bàn tay)', level: 1 },
  { code: '21', name: 'Gãy xương tay', level: 2, parentCode: '2' },
  { code: '211', name: 'Gãy xương cánh tay', level: 3, parentCode: '21' }
];

const DEFAULT_OCCUPATIONS: Occupation[] = [
  { code: '1', name: 'Nhà lãnh đạo trong các ngành, các cấp và các đơn vị', level: 1 },
  { code: '11', name: 'Nhà lãnh đạo cơ quan Đảng cộng sản Việt Nam cấp Trung ương và địa phương', level: 2, parentCode: '1' },
  { code: '111', name: 'Nhà lãnh đạo cơ quan Đảng cộng sản Việt Nam cấp Trung ương', level: 3, parentCode: '11' },
  { code: '1111', name: 'Trưởng ban, Phó Trưởng ban và tương đương trở lên thuộc cấp Trung ương', level: 4, parentCode: '111' },
  { code: '2', name: 'Chuyên môn kỹ thuật bậc cao', level: 1 },
  { code: '21', name: 'Chuyên gia trong lĩnh vực khoa học và kỹ thuật', level: 2, parentCode: '2' }
];

export default function TnldCategoriesPage() {
  // Category tab state: 'factor' | 'type' | 'occupation'
  const [activeCategory, setActiveCategory] = useState<'factor' | 'type' | 'occupation'>('factor');

  // List states
  const [factors, setFactors] = useState<InjuryFactor[]>([]);
  const [types, setTypes] = useState<InjuryType[]>([]);
  const [occupations, setOccupations] = useState<Occupation[]>([]);

  // Selection states (for bulk delete)
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Filters state
  const [filterCode, setFilterCode] = useState('');
  const [filterName, setFilterName] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  const [filterStatus, setFilterStatus] = useState(''); // Only for factors

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null); // holds the item being edited

  // Form Field states
  const [formCode, setFormCode] = useState('');
  const [formName, setFormName] = useState('');
  const [formParentCode, setFormParentCode] = useState('');
  const [formActive, setFormActive] = useState(true); // For factors

  // Form error state
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Reset filters when changing category tab
  useEffect(() => {
    setFilterCode('');
    setFilterName('');
    setFilterLevel('');
    setFilterStatus('');
    setSelectedIds([]);
  }, [activeCategory]);

  // Load / Save to LocalStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedFactors = localStorage.getItem('vna_tnld_factors');
      const storedTypes = localStorage.getItem('vna_tnld_types');
      const storedOccs = localStorage.getItem('vna_tnld_occs');

      if (storedFactors) setFactors(JSON.parse(storedFactors));
      else {
        setFactors(DEFAULT_INJURY_FACTORS);
        localStorage.setItem('vna_tnld_factors', JSON.stringify(DEFAULT_INJURY_FACTORS));
      }

      if (storedTypes) setTypes(JSON.parse(storedTypes));
      else {
        setTypes(DEFAULT_INJURY_TYPES);
        localStorage.setItem('vna_tnld_types', JSON.stringify(DEFAULT_INJURY_TYPES));
      }

      if (storedOccs) setOccupations(JSON.parse(storedOccs));
      else {
        setOccupations(DEFAULT_OCCUPATIONS);
        localStorage.setItem('vna_tnld_occs', JSON.stringify(DEFAULT_OCCUPATIONS));
      }
    }
  }, []);

  const saveFactors = (data: InjuryFactor[]) => {
    setFactors(data);
    localStorage.setItem('vna_tnld_factors', JSON.stringify(data));
  };

  const saveTypes = (data: InjuryType[]) => {
    setTypes(data);
    localStorage.setItem('vna_tnld_types', JSON.stringify(data));
  };

  const saveOccs = (data: Occupation[]) => {
    setOccupations(data);
    localStorage.setItem('vna_tnld_occs', JSON.stringify(data));
  };

  // Switch Active Status (Factors only)
  const handleToggleFactorActive = (id: string) => {
    const updated = factors.map((f) =>
      f.id === id ? { ...f, isActive: !f.isActive } : f
    );
    saveFactors(updated);
  };

  // Filtered lists
  const filteredFactors = useMemo(() => {
    return factors.filter((f) => {
      if (filterCode && !f.id.toLowerCase().includes(filterCode.toLowerCase())) return false;
      if (filterName && !f.name.toLowerCase().includes(filterName.toLowerCase())) return false;
      if (filterStatus) {
        const checkActive = filterStatus === 'active';
        if (f.isActive !== checkActive) return false;
      }
      return true;
    });
  }, [factors, filterCode, filterName, filterStatus]);

  const filteredTypes = useMemo(() => {
    return types.filter((t) => {
      if (filterCode && !t.code.toLowerCase().includes(filterCode.toLowerCase())) return false;
      if (filterName && !t.name.toLowerCase().includes(filterName.toLowerCase())) return false;
      if (filterLevel && !`cấp ${t.level}`.toLowerCase().includes(filterLevel.toLowerCase()) && !String(t.level).includes(filterLevel)) return false;
      return true;
    });
  }, [types, filterCode, filterName, filterLevel]);

  const filteredOccupations = useMemo(() => {
    return occupations.filter((o) => {
      if (filterCode && !o.code.toLowerCase().includes(filterCode.toLowerCase())) return false;
      if (filterName && !o.name.toLowerCase().includes(filterName.toLowerCase())) return false;
      if (filterLevel && !`cấp ${o.level}`.toLowerCase().includes(filterLevel.toLowerCase()) && !String(o.level).includes(filterLevel)) return false;
      return true;
    });
  }, [occupations, filterCode, filterName, filterLevel]);

  // Handle Add New open
  const handleAddNew = () => {
    setEditingItem(null);
    setFormCode('');
    setFormName('');
    setFormParentCode('');
    setFormActive(true);
    setFormErrors({});
    setShowModal(true);
  };

  // Handle Edit open
  const handleEdit = (item: any) => {
    setEditingItem(item);
    if (activeCategory === 'factor') {
      setFormCode(item.id);
      setFormName(item.name);
      setFormActive(item.isActive);
    } else {
      setFormCode(item.code);
      setFormName(item.name);
      setFormParentCode(item.parentCode || '');
    }
    setFormErrors({});
    setShowModal(true);
  };

  // Helper to get em-dashes for nesting display
  const renderDashes = (level: number) => {
    if (level <= 1) return '';
    return '—'.repeat(level - 1) + ' ';
  };

  // Parent options dropdown
  const parentOptions = useMemo(() => {
    if (activeCategory === 'type') {
      // For injury types, level limit is 3, so parents can be Level 1 or 2
      // Prevent selecting the editing item or its descendants
      return types.filter((t) => {
        if (t.level >= 3) return false;
        if (editingItem && t.code === editingItem.code) return false;
        if (editingItem && t.parentCode === editingItem.code) return false;
        return true;
      });
    } else if (activeCategory === 'occupation') {
      // For occupations, level limit is 4, so parents can be Level 1, 2, or 3
      return occupations.filter((o) => {
        if (o.level >= 4) return false;
        if (editingItem && o.code === editingItem.code) return false;
        if (editingItem && o.parentCode === editingItem.code) return false;
        return true;
      });
    }
    return [];
  }, [activeCategory, types, occupations, editingItem]);

  // Form validation
  const validateForm = () => {
    const errors: Record<string, string> = {};
    const codeTrim = formCode.trim();
    const nameTrim = formName.trim();

    if (!codeTrim) {
      errors.code = activeCategory === 'factor' ? 'Mã yếu tố không được để trống' : 'Mã số không được để trống';
    }
    if (!nameTrim) {
      errors.name = activeCategory === 'factor' ? 'Tên yếu tố không được để trống' : 'Tên không được để trống';
    }

    if (activeCategory === 'factor') {
      // Check duplicate code
      const dup = factors.find((f) => f.id.toLowerCase() === codeTrim.toLowerCase());
      if (dup && (!editingItem || editingItem.id !== dup.id)) {
        errors.code = 'Mã yếu tố này đã tồn tại';
      }
    } else {
      // Check prefix rules if parent selected
      if (formParentCode) {
        if (!codeTrim.startsWith(formParentCode)) {
          errors.code = `Mã phải bắt đầu bằng mã của nhóm cha (${formParentCode})`;
        }
      }

      // Check duplicate code
      if (activeCategory === 'type') {
        const dup = types.find((t) => t.code.toLowerCase() === codeTrim.toLowerCase());
        if (dup && (!editingItem || editingItem.code !== dup.code)) {
          errors.code = 'Mã số này đã tồn tại';
        }
      } else {
        const dup = occupations.find((o) => o.code.toLowerCase() === codeTrim.toLowerCase());
        if (dup && (!editingItem || editingItem.code !== dup.code)) {
          errors.code = 'Mã ngành này đã tồn tại';
        }
      }

      // Business Rule: For injury types, level 2 & 3 must select parent
      if (activeCategory === 'type' && codeTrim.length > 1 && !formParentCode) {
        errors.parent = 'Bắt buộc phải chọn loại chấn thương cha cho cấp này';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Save changes
  const handleSave = () => {
    if (!validateForm()) return;

    const codeTrim = formCode.trim();
    const nameTrim = formName.trim();

    if (activeCategory === 'factor') {
      if (editingItem) {
        // Edit factor
        const updated = factors.map((f) =>
          f.id === editingItem.id ? { ...f, id: codeTrim, name: nameTrim, isActive: formActive } : f
        );
        saveFactors(updated);
      } else {
        // Add factor
        const newItem: InjuryFactor = {
          id: codeTrim,
          name: nameTrim,
          isActive: formActive,
        };
        saveFactors([...factors, newItem]);
      }
    } else if (activeCategory === 'type') {
      // Calculate level
      let calculatedLevel = 1;
      if (formParentCode) {
        const parent = types.find((t) => t.code === formParentCode);
        calculatedLevel = parent ? parent.level + 1 : 1;
      }

      if (editingItem) {
        // Edit type
        // If parent changed, verify item doesn't have children (prevent nesting issue)
        const hasChildren = types.some((t) => t.parentCode === editingItem.code);
        if (hasChildren && formParentCode !== editingItem.parentCode) {
          setFormErrors({ parent: 'Không thể thay đổi nhóm cha của mục đang có nhóm con' });
          return;
        }

        const updated = types.map((t) =>
          t.code === editingItem.code
            ? { ...t, code: codeTrim, name: nameTrim, parentCode: formParentCode || undefined, level: calculatedLevel }
            : t
        );
        saveTypes(updated);
      } else {
        // Add type
        const newItem: InjuryType = {
          code: codeTrim,
          name: nameTrim,
          level: calculatedLevel,
          parentCode: formParentCode || undefined,
        };
        saveTypes([...types, newItem]);
      }
    } else {
      // Occupation
      let calculatedLevel = 1;
      if (formParentCode) {
        const parent = occupations.find((o) => o.code === formParentCode);
        calculatedLevel = parent ? parent.level + 1 : 1;
      }

      if (editingItem) {
        // Edit occupation
        const hasChildren = occupations.some((o) => o.parentCode === editingItem.code);
        if (hasChildren && formParentCode !== editingItem.parentCode) {
          setFormErrors({ parent: 'Không thể thay đổi nhóm cha của mục đang có nhóm con' });
          return;
        }

        const updated = occupations.map((o) =>
          o.code === editingItem.code
            ? { ...o, code: codeTrim, name: nameTrim, parentCode: formParentCode || undefined, level: calculatedLevel }
            : o
        );
        saveOccs(updated);
      } else {
        // Add occupation
        const newItem: Occupation = {
          code: codeTrim,
          name: nameTrim,
          level: calculatedLevel,
          parentCode: formParentCode || undefined,
        };
        saveOccs([...occupations, newItem]);
      }
    }

    setShowModal(false);
  };

  // Handle Delete Selected
  const handleDeleteSelected = () => {
    if (activeCategory === 'factor') {
      const remaining = factors.filter((f) => !selectedIds.includes(f.id));
      saveFactors(remaining);
    } else if (activeCategory === 'type') {
      // Check if trying to delete a parent that has children remaining
      const childrenOfDeleted = types.filter(
        (t) => selectedIds.includes(t.parentCode || '') && !selectedIds.includes(t.code)
      );
      if (childrenOfDeleted.length > 0) {
        alert('Không thể xoá danh mục cha khi chưa xoá hết danh mục con!');
        setShowDeleteConfirm(false);
        return;
      }
      const remaining = types.filter((t) => !selectedIds.includes(t.code));
      saveTypes(remaining);
    } else {
      const childrenOfDeleted = occupations.filter(
        (o) => selectedIds.includes(o.parentCode || '') && !selectedIds.includes(o.code)
      );
      if (childrenOfDeleted.length > 0) {
        alert('Không thể xoá danh mục cha khi chưa xoá hết danh mục con!');
        setShowDeleteConfirm(false);
        return;
      }
      const remaining = occupations.filter((o) => !selectedIds.includes(o.code));
      saveOccs(remaining);
    }
    setSelectedIds([]);
    setShowDeleteConfirm(false);
  };

  const handleExport = () => {
    let csvContent = "\uFEFF"; // UTF-8 BOM
    if (activeCategory === 'factor') {
      csvContent += "Mã yếu tố,Yếu tố gây chấn thương,Trạng thái\n";
      factors.forEach(f => {
        csvContent += `"${f.id}","${f.name}","${f.isActive ? 'Sử dụng' : 'Ngừng hoạt động'}"\n`;
      });
    } else if (activeCategory === 'type') {
      csvContent += "Mã số,Tên loại chấn thương,Cấp,Mã cha\n";
      types.forEach(t => {
        csvContent += `"${t.code}","${t.name}","${t.level}","${t.parentCode || ''}"\n`;
      });
    } else {
      csvContent += "Mã ngành,Tên ngành,Cấp,Mã cha\n";
      occupations.forEach(o => {
        csvContent += `"${o.code}","${o.name}","${o.level}","${o.parentCode || ''}"\n`;
      });
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    
    let fileName = 'danh_muc.csv';
    if (activeCategory === 'factor') {
      fileName = 'Yếu tố gây chấn thương.csv';
    } else if (activeCategory === 'type') {
      fileName = 'Loại chấn thương.csv';
    } else if (activeCategory === 'occupation') {
      fileName = 'Danh mục nghề nghiệp.csv';
    }
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
      if (lines.length <= 1) return;

      if (activeCategory === 'factor') {
        const newFactors: InjuryFactor[] = [...factors];
        for (let i = 1; i < lines.length; i++) {
          const parts = lines[i].split(",").map(p => p.replace(/^"|"$/g, '').trim());
          if (parts.length >= 2) {
            const id = parts[0];
            const name = parts[1];
            const activeStr = parts[2] || '';
            const isActive = activeStr !== 'Ngừng hoạt động';
            
            const idx = newFactors.findIndex(f => f.id.toLowerCase() === id.toLowerCase());
            if (idx >= 0) {
              newFactors[idx] = { id, name, isActive };
            } else {
              newFactors.push({ id, name, isActive });
            }
          }
        }
        saveFactors(newFactors);
      } else if (activeCategory === 'type') {
        const newTypes: InjuryType[] = [...types];
        for (let i = 1; i < lines.length; i++) {
          const parts = lines[i].split(",").map(p => p.replace(/^"|"$/g, '').trim());
          if (parts.length >= 2) {
            const code = parts[0];
            const name = parts[1];
            const level = parts[2] ? parseInt(parts[2]) : 1;
            const parentCode = parts[3] || undefined;
            
            const idx = newTypes.findIndex(t => t.code.toLowerCase() === code.toLowerCase());
            if (idx >= 0) {
              newTypes[idx] = { code, name, level, parentCode };
            } else {
              newTypes.push({ code, name, level, parentCode });
            }
          }
        }
        saveTypes(newTypes);
      } else {
        const newOccs: Occupation[] = [...occupations];
        for (let i = 1; i < lines.length; i++) {
          const parts = lines[i].split(",").map(p => p.replace(/^"|"$/g, '').trim());
          if (parts.length >= 2) {
            const code = parts[0];
            const name = parts[1];
            const level = parts[2] ? parseInt(parts[2]) : 1;
            const parentCode = parts[3] || undefined;
            
            const idx = newOccs.findIndex(o => o.code.toLowerCase() === code.toLowerCase());
            if (idx >= 0) {
              newOccs[idx] = { code, name, level, parentCode };
            } else {
              newOccs.push({ code, name, level, parentCode });
            }
          }
        }
        saveOccs(newOccs);
      }
      alert('Nhập danh mục từ file thành công!');
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="p-6">
      {/* Top Header Panel */}
      <div className="flex items-center justify-between mb-4 bg-white px-6 py-4 rounded-xl shadow-sm border border-slate-100">
        <h1 className="text-base font-bold text-slate-800">
          Khai báo danh mục
        </h1>
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-blue-500 text-blue-500 text-sm font-medium bg-white hover:bg-blue-50 transition-colors"
          >
            Xuất danh sách
          </button>
          <label className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-blue-500 text-blue-500 text-sm font-medium bg-white hover:bg-blue-50 transition-colors cursor-pointer">
            <Upload size={16} />
            Thêm từ file
            <input type="file" accept=".csv" onChange={handleImport} className="hidden" />
          </label>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus size={16} />
            Thêm mới
          </button>
        </div>
      </div>

      {/* Dropdown Selector to switch category */}
      <div className="mb-4 max-w-xs">
        <div className="relative">
          <select
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value as any)}
            className="w-full appearance-none border border-slate-200 rounded-lg px-4 py-2 pr-10 text-sm font-semibold outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-700 shadow-sm"
          >
            <option value="factor">Yếu tố gây chấn thương</option>
            <option value="type">Loại chấn thương</option>
            <option value="occupation">Danh mục nghề nghiệp</option>
          </select>
          <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500" />
        </div>
      </div>

      {/* Main Category Table */}
      <div className="w-full overflow-hidden border border-slate-200 rounded-xl bg-white shadow-sm">
        <table className="w-full border-collapse">
          <thead>
            {/* Columns headers */}
            {activeCategory === 'factor' && (
              <tr className="bg-slate-50/75 border-b border-slate-200">
                <th className="w-12 px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={filteredFactors.length > 0 && selectedIds.length === filteredFactors.length}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedIds(filteredFactors.map((f) => f.id));
                      else setSelectedIds([]);
                    }}
                    className="rounded text-[#1D4ED8] focus:ring-[#1D4ED8]"
                  />
                </th>
                <th className="w-16 px-2 py-3 text-center text-xs font-semibold text-slate-500 uppercase">
                  Thao tác
                </th>
                <th className="w-48 px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                  Mã yếu tố
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                  Yếu tố gây chấn thương
                </th>
                <th className="w-40 px-3 py-3 text-center text-xs font-semibold text-slate-500 uppercase">
                  Trạng thái
                </th>
              </tr>
            )}

            {activeCategory === 'type' && (
              <tr className="bg-slate-50/75 border-b border-slate-200">
                <th className="w-12 px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={filteredTypes.length > 0 && selectedIds.length === filteredTypes.length}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedIds(filteredTypes.map((t) => t.code));
                      else setSelectedIds([]);
                    }}
                    className="rounded text-[#1D4ED8] focus:ring-[#1D4ED8]"
                  />
                </th>
                <th className="w-16 px-2 py-3 text-center text-xs font-semibold text-slate-500 uppercase">
                  Thao tác
                </th>
                <th className="w-48 px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                  Mã số
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                  Tên loại chấn thương
                </th>
                <th className="w-40 px-3 py-3 text-center text-xs font-semibold text-slate-500 uppercase">
                  Cấp
                </th>
              </tr>
            )}

            {activeCategory === 'occupation' && (
              <tr className="bg-slate-50/75 border-b border-slate-200">
                <th className="w-12 px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={filteredOccupations.length > 0 && selectedIds.length === filteredOccupations.length}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedIds(filteredOccupations.map((o) => o.code));
                      else setSelectedIds([]);
                    }}
                    className="rounded text-[#1D4ED8] focus:ring-[#1D4ED8]"
                  />
                </th>
                <th className="w-16 px-2 py-3 text-center text-xs font-semibold text-slate-500 uppercase">
                  Thao tác
                </th>
                <th className="w-48 px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                  Mã nghề
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                  Tên nghề nghiệp
                </th>
                <th className="w-40 px-3 py-3 text-center text-xs font-semibold text-slate-500 uppercase">
                  Cấp
                </th>
              </tr>
            )}

            {/* Filter inputs row */}
            <tr className="border-b border-slate-200 bg-white">
              <td className="px-4 py-2" />
              <td className="px-2 py-2" />
              <td className="px-2 py-2">
                <input
                  type="text"
                  placeholder={
                    activeCategory === 'factor' ? 'Lọc theo mã yếu tố...' :
                    activeCategory === 'type' ? 'Lọc theo mã số...' : 'Lọc theo mã nghề...'
                  }
                  value={filterCode}
                  onChange={(e) => setFilterCode(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </td>
              <td className="px-2 py-2">
                <input
                  type="text"
                  placeholder={
                    activeCategory === 'factor' ? 'Lọc theo tên yếu tố...' :
                    activeCategory === 'type' ? 'Lọc theo tên loại...' : 'Lọc theo tên nghề...'
                  }
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </td>
              <td className="px-2 py-2">
                {activeCategory === 'factor' ? (
                  <div className="relative">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-full appearance-none border border-slate-200 rounded-lg px-2.5 py-1.5 pr-8 text-xs outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-600"
                    >
                      <option value="">Tất cả</option>
                      <option value="active">Hoạt động</option>
                      <option value="inactive">Không sử dụng</option>
                    </select>
                    <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                  </div>
                ) : (
                  <input
                    type="text"
                    placeholder=""
                    value={filterLevel}
                    onChange={(e) => setFilterLevel(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-center"
                  />
                )}
              </td>
            </tr>
          </thead>
          <tbody>
            {/* Factors list */}
            {activeCategory === 'factor' && (
              filteredFactors.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-400">
                    Không tìm thấy yếu tố nào
                  </td>
                </tr>
              ) : (
                filteredFactors.map((item) => (
                  <tr key={item.id} className="border-b border-slate-200 hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.id)}
                        onChange={() => {
                          setSelectedIds((prev) =>
                            prev.includes(item.id) ? prev.filter((id) => id !== item.id) : [...prev, item.id]
                          );
                        }}
                        className="rounded text-[#1D4ED8] focus:ring-[#1D4ED8]"
                      />
                    </td>
                    <td className="px-2 py-3 text-center">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-slate-400 hover:text-[#1D4ED8] transition"
                      >
                        <Pencil size={14} />
                      </button>
                    </td>
                    <td className="px-3 py-3 text-sm text-slate-700 font-mono">
                      {item.id}
                    </td>
                    <td className="px-3 py-3 text-sm text-slate-700 font-medium">
                      {item.name}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleFactorActive(item.id)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 ${
                          item.isActive ? 'bg-[#1D4ED8]' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-200 ${
                            item.isActive ? 'translate-x-[18px]' : 'translate-x-[2px]'
                          }`}
                        />
                      </button>
                    </td>
                  </tr>
                ))
              )
            )}

            {/* Types list */}
            {activeCategory === 'type' && (
              filteredTypes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-400">
                    Không tìm thấy loại chấn thương nào
                  </td>
                </tr>
              ) : (
                filteredTypes.map((item) => (
                  <tr key={item.code} className="border-b border-slate-200 hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.code)}
                        onChange={() => {
                          setSelectedIds((prev) =>
                            prev.includes(item.code) ? prev.filter((c) => c !== item.code) : [...prev, item.code]
                          );
                        }}
                        className="rounded text-[#1D4ED8] focus:ring-[#1D4ED8]"
                      />
                    </td>
                    <td className="px-2 py-3 text-center">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-slate-400 hover:text-[#1D4ED8] transition"
                      >
                        <Pencil size={14} />
                      </button>
                    </td>
                    <td className="px-3 py-3 text-sm text-slate-700 font-mono">
                      {item.code}
                    </td>
                    <td className="px-3 py-3 text-sm text-slate-700 font-medium">
                      <span className="text-slate-400 font-mono select-none">
                        {renderDashes(item.level)}
                      </span>
                      {item.name}
                    </td>
                    <td className="px-3 py-3 text-sm text-slate-500 text-center">
                      Cấp {item.level}
                    </td>
                  </tr>
                ))
              )
            )}

            {/* Occupations list */}
            {activeCategory === 'occupation' && (
              filteredOccupations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-400">
                    Không tìm thấy nghề nghiệp nào
                  </td>
                </tr>
              ) : (
                filteredOccupations.map((item) => (
                  <tr key={item.code} className="border-b border-slate-200 hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.code)}
                        onChange={() => {
                          setSelectedIds((prev) =>
                            prev.includes(item.code) ? prev.filter((c) => c !== item.code) : [...prev, item.code]
                          );
                        }}
                        className="rounded text-[#1D4ED8] focus:ring-[#1D4ED8]"
                      />
                    </td>
                    <td className="px-2 py-3 text-center">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-slate-400 hover:text-[#1D4ED8] transition"
                      >
                        <Pencil size={14} />
                      </button>
                    </td>
                    <td className="px-3 py-3 text-sm text-slate-700 font-mono">
                      {item.code}
                    </td>
                    <td className="px-3 py-3 text-sm text-slate-700 font-medium">
                      <span className="text-slate-400 font-mono select-none">
                        {renderDashes(item.level)}
                      </span>
                      {item.name}
                    </td>
                    <td className="px-3 py-3 text-sm text-slate-500 text-center">
                      Cấp {item.level}
                    </td>
                  </tr>
                ))
              )
            )}
          </tbody>
        </table>

        {/* Paging Footer (Matching Mockup 1-3 of 3 layout) */}
        <div className="flex items-center justify-end gap-4 px-6 py-3 border-t border-slate-200 bg-white text-xs text-slate-500 font-medium animate-in fade-in">
          <div className="flex items-center gap-1">
            <span>Hiển thị</span>
            <div className="relative">
              <select className="appearance-none border border-slate-200 rounded px-2 py-0.5 pr-5 bg-white text-slate-600 font-semibold focus:outline-none">
                <option>10</option>
                <option>20</option>
                <option>50</option>
              </select>
              <ChevronDown size={10} className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500" />
            </div>
          </div>
          <span>
            1 - {
              activeCategory === 'factor' ? filteredFactors.length :
              activeCategory === 'type' ? filteredTypes.length :
              filteredOccupations.length
            } of {
              activeCategory === 'factor' ? filteredFactors.length :
              activeCategory === 'type' ? filteredTypes.length :
              filteredOccupations.length
            }
          </span>
          <div className="flex gap-1.5">
            <button disabled className="p-1 rounded border border-slate-200 opacity-50 cursor-not-allowed">&lt;</button>
            <button disabled className="p-1 rounded border border-slate-200 opacity-50 cursor-not-allowed">&gt;</button>
          </div>
        </div>
      </div>

      {/* Floating Selection Bar for bulk actions */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-slate-900/95 text-white px-5 py-3 rounded-xl shadow-2xl border border-slate-800 animate-in slide-in-from-bottom duration-200">
          <span className="text-xs font-semibold">Đang chọn {selectedIds.length} mục</span>
          <div className="h-4 w-[1px] bg-slate-700" />
          <button
            onClick={() => setSelectedIds([])}
            className="text-xs hover:text-slate-300 font-semibold transition"
          >
            Bỏ chọn
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition shadow-md"
          >
            Xoá đã chọn
          </button>
        </div>
      )}

      {/* Delete Confirmation Alert Overlay */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
          <div className="w-full max-w-sm bg-white rounded-xl shadow-xl p-6 border border-slate-100 animate-in zoom-in-95 duration-150">
            <h3 className="text-slate-800 font-bold text-base mb-2">Xác nhận xoá</h3>
            <p className="text-slate-600 text-sm mb-6">Bạn có chắc chắn muốn xoá {selectedIds.length} mục đã chọn không?</p>
            <div className="flex justify-end gap-3 text-sm">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="text-slate-500 font-semibold hover:text-slate-700 px-4 py-2"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteSelected}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg transition"
              >
                Đồng ý xoá
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Dialog Modals */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
          {/* DIFFERENT STYLES FOR CATEGORIES: 
              - Yếu tố chấn thương: White Header, Bottom buttons (Huỷ, Lưu - Lưu has icon)
              - Loại chấn thương / Nghề nghiệp: Solid Blue Header, Bottom buttons (Huỷ bỏ, Lưu lại - Lưu lại has no icon)
          */}
          
          {activeCategory === 'factor' ? (
            /* Yếu tố chấn thương Modal */
            <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              {/* White Header */}
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-white">
                <h2 className="text-slate-800 font-bold text-base">
                  {editingItem ? 'Chỉnh sửa' : 'Thêm mới'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-slate-400 hover:text-slate-600 transition"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form Content */}
              <div className="p-6 space-y-6">
                {/* Code */}
                <div className="relative">
                  <input
                    type="text"
                    value={formCode}
                    onChange={(e) => {
                      setFormCode(e.target.value);
                      if (formErrors.code) setFormErrors((p) => ({ ...p, code: '' }));
                    }}
                    placeholder="Mã yếu tố chấn thương *"
                    disabled={!!editingItem}
                    className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition ${
                      editingItem
                        ? 'border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed'
                        : formErrors.code
                        ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                        : 'border-slate-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                  />
                  {formCode && (
                    <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-slate-500">
                      Mã yếu tố chấn thương <span className="text-red-500">*</span>
                    </label>
                  )}
                  {formErrors.code && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.code}</p>
                  )}
                </div>

                {/* Name */}
                <div className="relative">
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => {
                      setFormName(e.target.value);
                      if (formErrors.name) setFormErrors((p) => ({ ...p, name: '' }));
                    }}
                    placeholder="Tên yếu tố chấn thương *"
                    className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition ${
                      formErrors.name
                        ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                        : 'border-slate-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                  />
                  {formName && (
                    <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-slate-500">
                      Tên yếu tố chấn thương <span className="text-red-500">*</span>
                    </label>
                  )}
                  {formErrors.name && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                  )}
                </div>

                {/* Status selector */}
                <div className="relative">
                  <div className="relative">
                    <select
                      value={formActive ? 'active' : 'inactive'}
                      onChange={(e) => setFormActive(e.target.value === 'active')}
                      className="w-full appearance-none rounded-lg border border-slate-200 px-3 py-2 pr-8 text-sm outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                      <option value="active">Sử dụng</option>
                      <option value="inactive">Ngừng hoạt động</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                  </div>
                  <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-slate-500">
                    Trạng thái <span className="text-red-500">*</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-6 py-4 flex items-center justify-end gap-3 border-t border-slate-100 bg-white">
                <button
                  onClick={() => setShowModal(false)}
                  className="text-slate-500 hover:text-slate-700 font-semibold transition text-sm px-4 py-2"
                >
                  Huỷ
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1.5 bg-[#1D4ED8] text-white font-semibold px-5 py-2 rounded-lg hover:bg-blue-700 transition text-sm shadow-sm"
                >
                  <Save size={14} />
                  Lưu
                </button>
              </div>
            </div>
          ) : (
            /* Loại chấn thương and Danh mục nghề nghiệp Modals */
            <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              {/* Solid Blue Header */}
              <div className="flex items-center justify-between bg-[#1D4ED8] px-6 py-3.5 text-white">
                <h2 className="font-bold text-sm">
                  {editingItem 
                    ? (activeCategory === 'type' ? 'Chỉnh sửa loại chấn thương' : 'Chỉnh sửa nghề nghiệp') 
                    : (activeCategory === 'type' ? 'Thêm mới loại chấn thương' : 'Thêm mới nghề nghiệp')}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-white/85 hover:text-white transition"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form Content */}
              <div className="p-6 space-y-6">
                {/* Code Field */}
                <div className="relative">
                  <input
                    type="text"
                    value={formCode}
                    onChange={(e) => {
                      setFormCode(e.target.value);
                      if (formErrors.code) setFormErrors((p) => ({ ...p, code: '' }));
                    }}
                    placeholder={activeCategory === 'type' ? 'Mã số *' : 'Mã ngành *'}
                    disabled={!!editingItem}
                    className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition ${
                      editingItem
                        ? 'border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed'
                        : formErrors.code
                        ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                        : 'border-slate-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                  />
                  {formCode && (
                    <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-slate-500">
                      {activeCategory === 'type' ? 'Mã số' : 'Mã ngành'} <span className="text-red-500">*</span>
                    </label>
                  )}
                  {formErrors.code && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.code}</p>
                  )}
                </div>

                {/* Name Field */}
                <div className="relative">
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => {
                      setFormName(e.target.value);
                      if (formErrors.name) setFormErrors((p) => ({ ...p, name: '' }));
                    }}
                    placeholder={activeCategory === 'type' ? 'Tên loại chấn thương *' : 'Tên ngành *'}
                    className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition ${
                      formErrors.name
                        ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                        : 'border-slate-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                  />
                  {formName && (
                    <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-slate-500">
                      {activeCategory === 'type' ? 'Tên loại chấn thương' : 'Tên ngành'} <span className="text-red-500">*</span>
                    </label>
                  )}
                  {formErrors.name && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                  )}
                </div>

                {/* Parent Selection Dropdown */}
                <div className="relative">
                  <div className="relative">
                    <select
                      value={formParentCode}
                      onChange={(e) => {
                        setFormParentCode(e.target.value);
                        if (formErrors.parent) setFormErrors((p) => ({ ...p, parent: '' }));
                      }}
                      className={`w-full appearance-none rounded-lg border px-3 py-2 pr-8 text-sm outline-none transition bg-white ${
                        formErrors.parent
                          ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                          : 'border-slate-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                    >
                      <option value="">
                        {activeCategory === 'type' ? 'Không có (Cấp 1)' : 'Không có (Ngành cấp 1)'}
                      </option>
                      {parentOptions.map((opt) => (
                        <option key={opt.code} value={opt.code}>
                          {opt.code} - {opt.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                  </div>
                  <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-slate-500">
                    {activeCategory === 'type' ? 'Tên loại chấn thương cha' : 'Nhóm ngành cha'}
                    {activeCategory === 'type' && formCode.length > 1 && <span className="text-red-500"> *</span>}
                  </label>
                  {formErrors.parent && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.parent}</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-6 py-4 flex items-center justify-end gap-3 border-t border-slate-100 bg-white">
                <button
                  onClick={() => setShowModal(false)}
                  className="text-slate-500 hover:text-slate-700 font-semibold transition text-sm px-4 py-2"
                >
                  Huỷ bỏ
                </button>
                <button
                  onClick={handleSave}
                  className="bg-[#1D4ED8] text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition text-sm shadow-sm"
                >
                  Lưu lại
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
