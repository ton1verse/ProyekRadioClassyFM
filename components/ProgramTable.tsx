'use client';

import { useState, useEffect } from 'react';
import { Program } from '@/models/Program';
import { Classier } from '@/models/Classier';
import { Eye, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import DeleteModal from './DeleteModal';
import { useToast } from '@/context/ToastContext';

export default function ProgramTable() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const { showToast } = useToast();
  const [classiers, setClassiers] = useState<Classier[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [programToDelete, setProgramToDelete] = useState<number | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    classier_id: '',
    nama_program: '',
    deskripsi: '',
    jadwal: '',
    poster: '',
  });

  const [imageMode, setImageMode] = useState<'url' | 'file'>('url');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  type TimeRange = { start: string; end: string };
  type DaySchedule = { ranges: TimeRange[]; enabled: boolean };
  const [schedules, setSchedules] = useState<Record<string, DaySchedule>>({});

  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  const daysOfWeek = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

  useEffect(() => {
    const initialSchedules: Record<string, DaySchedule> = {};
    daysOfWeek.forEach(day => {
      initialSchedules[day] = { ranges: [{ start: '00:00', end: '00:00' }], enabled: false };
    });
    setSchedules(prev => ({ ...initialSchedules, ...prev }));
  }, []);

  useEffect(() => {
    const activeSchedules = daysOfWeek
      .filter(day => schedules[day]?.enabled)
      .map(day => {
        const rangesStr = schedules[day].ranges
          .map(r => `${r.start}-${r.end}`)
          .join(', ');
        return `${day} ${rangesStr}`;
      });

    if (activeSchedules.length > 0) {
      setFormData(prev => ({ ...prev, jadwal: activeSchedules.join('; ') }));
    } else if (Object.values(schedules).some(s => s.enabled)) {
      setFormData(prev => ({ ...prev, jadwal: '' }));
    }
  }, [schedules]);

  useEffect(() => {
    fetchPrograms();
    fetchClassiers();
  }, []);

  const fetchPrograms = async () => {
    try {
      const response = await fetch('/api/programs');
      const data = await response.json();
      setPrograms(data);
    } catch (error) {
      console.error('Error fetching programs:', error);
    }
  };

  const fetchClassiers = async () => {
    try {
      const response = await fetch('/api/classiers');
      const data = await response.json();
      setClassiers(data);
    } catch (error) {
      console.error('Error fetching classiers:', error);
    }
  };

  const getSafeClassierId = (program: any) => {
    if (program.classierId) return program.classierId.toString();
    if (program.classier_id) return program.classier_id.toString();
    if (program.classier && program.classier.id) return program.classier.id.toString();
    return '';
  };

  const parseSchedule = (jadwalStr: string) => {
    const newSchedules: Record<string, DaySchedule> = {};
    daysOfWeek.forEach(day => {
      newSchedules[day] = { ranges: [{ start: '00:00', end: '00:00' }], enabled: false };
    });

    if (!jadwalStr) return newSchedules;

    const parts = jadwalStr.split(';').map(s => s.trim());
    parts.forEach(part => {
      const firstSpaceIndex = part.indexOf(' ');
      if (firstSpaceIndex === -1) return;
      const day = part.substring(0, firstSpaceIndex).trim();
      const rangesStr = part.substring(firstSpaceIndex + 1).trim();

      if (daysOfWeek.includes(day)) {
        const rangeParts = rangesStr.split(',').map(r => r.trim());
        const parsedRanges: TimeRange[] = [];
        rangeParts.forEach(rStr => {
          const match = rStr.match(/(\d{2}[:.]\d{2})\s*-\s*(\d{2}[:.]\d{2})/);
          if (match) {
            const start = match[1].replace('.', ':');
            const end = match[2].replace('.', ':');
            parsedRanges.push({ start, end });
          }
        });
        if (parsedRanges.length > 0) {
          newSchedules[day] = { ranges: parsedRanges, enabled: true };
        }
      }
    });

    const hasData = Object.values(newSchedules).some(s => s.enabled);
    if (!hasData) {
      const legacyParts = jadwalStr.split(',').map(s => s.trim());
      const legacyTimeMatch = legacyParts[legacyParts.length - 1].match(/(\d{2}[:.]\d{2})\s*-\s*(\d{2}[:.]\d{2})/);
      if (legacyTimeMatch) {
        const start = legacyTimeMatch[1].replace('.', ':');
        const end = legacyTimeMatch[2].replace('.', ':');
        const days = legacyParts.slice(0, legacyParts.length - 1);
        days.forEach(d => {
          if (daysOfWeek.includes(d)) {
            newSchedules[d] = { ranges: [{ start, end }], enabled: true };
          }
        });
      }
    }
    return newSchedules;
  };

  const handleEdit = (program: Program) => {
    setEditingProgram(program);
    setIsViewMode(false);
    const parsedSchedules = parseSchedule(program.jadwal || '');
    setSchedules(prev => ({ ...prev, ...parsedSchedules }));
    setFormData({
      classier_id: getSafeClassierId(program) || '',
      nama_program: program.nama_program || '',
      deskripsi: program.deskripsi || '',
      jadwal: program.jadwal || '',
      poster: program.poster || '',
    });
    setImageMode('url');
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleView = (program: Program) => {
    setEditingProgram(program);
    setIsViewMode(true);
    const parsedSchedules = parseSchedule(program.jadwal || '');
    setSchedules(prev => ({ ...prev, ...parsedSchedules }));
    setFormData({
      classier_id: getSafeClassierId(program) || '',
      nama_program: program.nama_program || '',
      deskripsi: program.deskripsi || '',
      jadwal: program.jadwal || '',
      poster: program.poster || '',
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setProgramToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!programToDelete) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/programs/${programToDelete}`, { method: 'DELETE' });
      if (response.ok) {
        fetchPrograms();
        setIsDeleteModalOpen(false);
        setProgramToDelete(null);
        showToast('Program deleted successfully!', 'success');
      } else {
        const errorData = await response.json().catch(() => ({}));
        showToast(`Failed to delete: ${errorData.error || 'Unknown error'}`, 'error');
      }
    } catch (error) {
      console.error('Error deleting program:', error);
      showToast('Error deleting program', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const resetForm = () => {
    setEditingProgram(null);
    setIsViewMode(false);
    setFormData({ classier_id: '', nama_program: '', deskripsi: '', jadwal: '', poster: '' });
    const initialSchedules: Record<string, DaySchedule> = {};
    daysOfWeek.forEach(day => {
      initialSchedules[day] = { ranges: [{ start: '00:00', end: '00:00' }], enabled: false };
    });
    setSchedules(initialSchedules);
    setImageMode('url');
    setImageFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isViewMode) return;
    try {
      const url = editingProgram ? `/api/programs/${editingProgram.id}` : '/api/programs';
      const method = editingProgram ? 'PUT' : 'POST';
      const data = new FormData();
      data.append('classier_id', formData.classier_id);
      data.append('nama_program', formData.nama_program);
      data.append('deskripsi', formData.deskripsi);
      data.append('jadwal', formData.jadwal);
      if (imageMode === 'url') {
        data.append('imageUrl', formData.poster);
      } else if (imageFile) {
        data.append('imageFile', imageFile);
      }
      if (editingProgram && !imageFile && imageMode === 'file') {
        if (formData.poster) data.append('imageUrl', formData.poster);
      }
      const response = await fetch(url, { method, body: data });
      if (response.ok) {
        fetchPrograms();
        setIsModalOpen(false);
        resetForm();
        showToast('Program saved successfully!', 'success');
      } else {
        const errorData = await response.json().catch(() => ({}));
        showToast(`Failed to save: ${errorData.error || 'Unknown error'}`, 'error');
      }
    } catch (error) {
      console.error('Error saving program:', error);
      showToast('Error saving program', 'error');
    }
  };

  const filteredPrograms = programs.filter(program =>
    program.nama_program.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPrograms.length / itemsPerPage);
  const currentItems = filteredPrograms.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Cari program..."
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Tambah Program
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Program</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Classier</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Deskripsi</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Jadwal</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((program) => (
              <tr key={program.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="flex items-center">
                    {program.poster && (
                      <img src={program.poster} alt={program.nama_program} className="w-8 h-8 rounded mr-3" />
                    )}
                    <span className="font-medium">{program.nama_program}</span>
                  </div>
                </td>
                <td className="py-3 px-4">{program.classier?.nama || '-'}</td>
                <td className="py-3 px-4">
                  <p className="text-sm text-gray-600 line-clamp-2">{program.deskripsi}</p>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm">{program.jadwal || '-'}</span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex space-x-2">
                    <button onClick={() => handleView(program)} className="text-blue-500 hover:text-blue-700 transition-colors"><Eye size={18} /></button>
                    <button onClick={() => handleEdit(program)} className="text-yellow-500 hover:text-yellow-700 transition-colors"><Edit size={18} /></button>
                    <button onClick={() => handleDeleteClick(program.id)} className="text-red-500 hover:text-red-700 transition-colors"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <p className="text-sm text-gray-500">
            Showing <span className="font-bold">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold">{Math.min(currentPage * itemsPerPage, filteredPrograms.length)}</span> of <span className="font-bold">{filteredPrograms.length}</span> results
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg font-bold text-sm transition-colors ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#A12227] text-white hover:bg-[#A12227]/80'
                }`}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg font-bold text-sm transition-colors ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#001A3A] text-white hover:bg-[#001A3A]/80'
                }`}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {isViewMode ? 'Detail Program' : editingProgram ? 'Edit Program' : 'Tambah Program'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Classier <span className="text-red-500">*</span></label>
                <select required disabled={isViewMode} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100" value={formData.classier_id} onChange={(e) => setFormData({ ...formData, classier_id: e.target.value })}>
                  <option value="">Pilih Classier</option>
                  {classiers.map((classier) => (<option key={classier.id} value={classier.id}>{classier.nama}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Program <span className="text-red-500">*</span></label>
                <input type="text" required disabled={isViewMode} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100" value={formData.nama_program} onChange={(e) => setFormData({ ...formData, nama_program: e.target.value })} placeholder="Masukkan Nama Program" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi <span className="text-red-500">*</span></label>
                <textarea required rows={3} disabled={isViewMode} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100" value={formData.deskripsi} onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })} placeholder="Masukkan Deskripsi" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jadwal <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3 border rounded-lg p-3 bg-gray-50 max-h-60 overflow-y-auto">
                  {daysOfWeek.map(day => (
                    <div key={day} className={`flex flex-col sm:flex-row sm:items-center gap-2 p-2 rounded-md border transition-colors ${schedules[day]?.enabled ? 'bg-white border-blue-200 shadow-sm' : 'bg-transparent border-transparent opacity-70 hover:opacity-100 hover:bg-gray-100'}`}>

                      <label className="flex items-center space-x-2 cursor-pointer w-24 flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={schedules[day]?.enabled || false}
                          disabled={isViewMode}
                          onChange={(e) => {
                            setSchedules(prev => ({
                              ...prev,
                              [day]: { ...prev[day], enabled: e.target.checked }
                            }));
                          }}
                          className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                        />
                        <span className={`font-medium ${schedules[day]?.enabled ? 'text-blue-700' : 'text-gray-600'}`}>{day}</span>
                      </label>

                      {schedules[day]?.enabled && (
                        <div className="flex flex-col gap-2 flex-1 animate-in fade-in slide-in-from-left-2 duration-200">
                          {schedules[day].ranges.map((range, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <div className="flex items-center space-x-1 flex-1">
                                <div className="flex items-center border rounded px-1 bg-white focus-within:ring-1 focus-within:ring-blue-500">
                                  <select
                                    disabled={isViewMode}
                                    value={range.start.split(':')[0] || '00'}
                                    onChange={(e) => {
                                      const newRanges = [...schedules[day].ranges];
                                      const m = range.start.split(':')[1] || '00';
                                      newRanges[index] = { ...newRanges[index], start: `${e.target.value}:${m}` };
                                      setSchedules(prev => ({ ...prev, [day]: { ...prev[day], ranges: newRanges } }));
                                    }}
                                    className="appearance-none bg-transparent outline-none text-sm py-1 px-1 cursor-pointer w-10 text-center"
                                  >
                                    {hours.map(h => <option key={h} value={h}>{h}</option>)}
                                  </select>
                                  <span className="text-gray-400">:</span>
                                  <select
                                    disabled={isViewMode}
                                    value={range.start.split(':')[1] || '00'}
                                    onChange={(e) => {
                                      const newRanges = [...schedules[day].ranges];
                                      const h = range.start.split(':')[0] || '00';
                                      newRanges[index] = { ...newRanges[index], start: `${h}:${e.target.value}` };
                                      setSchedules(prev => ({ ...prev, [day]: { ...prev[day], ranges: newRanges } }));
                                    }}
                                    className="appearance-none bg-transparent outline-none text-sm py-1 px-1 cursor-pointer w-10 text-center"
                                  >
                                    {minutes.map(m => <option key={m} value={m}>{m}</option>)}
                                  </select>
                                </div>

                                <span className="text-gray-400">-</span>

                                <div className="flex items-center border rounded px-1 bg-white focus-within:ring-1 focus-within:ring-blue-500">
                                  <select
                                    disabled={isViewMode}
                                    value={range.end.split(':')[0] || '00'}
                                    onChange={(e) => {
                                      const newRanges = [...schedules[day].ranges];
                                      const m = range.end.split(':')[1] || '00';
                                      newRanges[index] = { ...newRanges[index], end: `${e.target.value}:${m}` };
                                      setSchedules(prev => ({ ...prev, [day]: { ...prev[day], ranges: newRanges } }));
                                    }}
                                    className="appearance-none bg-transparent outline-none text-sm py-1 px-1 cursor-pointer w-10 text-center"
                                  >
                                    {hours.map(h => <option key={h} value={h}>{h}</option>)}
                                  </select>
                                  <span className="text-gray-400">:</span>
                                  <select
                                    disabled={isViewMode}
                                    value={range.end.split(':')[1] || '00'}
                                    onChange={(e) => {
                                      const newRanges = [...schedules[day].ranges];
                                      const h = range.end.split(':')[0] || '00';
                                      newRanges[index] = { ...newRanges[index], end: `${h}:${e.target.value}` };
                                      setSchedules(prev => ({ ...prev, [day]: { ...prev[day], ranges: newRanges } }));
                                    }}
                                    className="appearance-none bg-transparent outline-none text-sm py-1 px-1 cursor-pointer w-10 text-center"
                                  >
                                    {minutes.map(m => <option key={m} value={m}>{m}</option>)}
                                  </select>
                                </div>
                              </div>

                              {!isViewMode && (
                                <div className="flex space-x-1">
                                  <button
                                    type="button"
                                    disabled={schedules[day].ranges.length === 1}
                                    onClick={() => {
                                      const newRanges = schedules[day].ranges.filter((_, i) => i !== index);
                                      setSchedules(prev => ({
                                        ...prev,
                                        [day]: { ...prev[day], ranges: newRanges }
                                      }));
                                    }}
                                    className={`p-1 rounded hover:bg-red-100 text-red-500 ${schedules[day].ranges.length === 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
                                  >
                                    <Trash2 size={14} />
                                  </button>

                                  {index === schedules[day].ranges.length - 1 && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSchedules(prev => ({
                                          ...prev,
                                          [day]: { ...prev[day], ranges: [...prev[day].ranges, { start: '00:00', end: '00:00' }] }
                                        }));
                                      }}
                                      className="p-1 rounded hover:bg-green-100 text-green-600"
                                      title="Add another time slot"
                                    >
                                      <span className="text-xs font-bold">+</span>
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sumber Poster</label>
                <div className="flex space-x-4 mb-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="imageMode"
                      value="url"
                      checked={imageMode === 'url'}
                      onChange={() => setImageMode('url')}
                      disabled={isViewMode}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">URL</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="imageMode"
                      value="file"
                      checked={imageMode === 'file'}
                      onChange={() => setImageMode('file')}
                      disabled={isViewMode}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Upload</span>
                  </label>
                </div>

                {imageMode === 'url' ? (
                  <input
                    type="text"
                    placeholder="https://example.com/poster.jpg or /images/..."
                    disabled={isViewMode}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    value={formData.poster}
                    onChange={(e) => setFormData({ ...formData, poster: e.target.value })}
                  />
                ) : (
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isViewMode}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setImageFile(e.target.files[0]);
                        setFormData({ ...formData, poster: URL.createObjectURL(e.target.files[0]) });
                      }
                    }}
                  />
                )}

                {formData.poster && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-700 mb-1">Pratinjau:</p>
                    <img
                      src={formData.poster}
                      alt="Pratinjau"
                      onClick={() => setPreviewImage(formData.poster)}
                      className="w-full h-48 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
                      onError={(e) => (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=Invalid+Image+URL'}
                    />
                    <p className="text-xs text-center text-gray-500 mt-1">Klik gambar untuk memperbesar</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setIsModalOpen(false); resetForm(); }}
                  className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  {isViewMode ? 'Tutup' : 'Batal'}
                </button>
                {!isViewMode && (
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {editingProgram ? 'Perbarui' : 'Buat'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => { setIsDeleteModalOpen(false); setProgramToDelete(null); }}
        onConfirm={executeDelete}
        title="Hapus Program"
        message="Apakah Anda yakin ingin menghapus program ini? Tindakan ini tidak dapat dibatalkan."
        isDeleting={isDeleting}
      />

      {previewImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-[60] flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            alt="Full size"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </div>
  );
}
