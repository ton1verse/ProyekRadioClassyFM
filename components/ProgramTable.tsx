'use client';

import { useState, useEffect } from 'react';
import { Program } from '@/models/Program';
import { Classier } from '@/models/Classier';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import DeleteModal from './DeleteModal';
import { useToast } from '@/context/ToastContext';

export default function ProgramTable() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const { showToast } = useToast();
  const [classiers, setClassiers] = useState<Classier[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Selection States
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
    durasi: 0
  });

  const [imageMode, setImageMode] = useState<'url' | 'file'>('url');
  const [imageFile, setImageFile] = useState<File | null>(null);

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
      data.append('durasi', formData.durasi.toString());

      if (imageMode === 'url') {
        data.append('imageUrl', formData.poster);
      } else if (imageFile) {
        data.append('imageFile', imageFile);
      }

      if (editingProgram && !imageFile && imageMode === 'file') {
        if (formData.poster) data.append('imageUrl', formData.poster);
      }

      const response = await fetch(url, {
        method,
        body: data,
      });

      if (response.ok) {
        fetchPrograms();
        setIsModalOpen(false);
        resetForm();
        showToast('Program saved successfully!', 'success');
      } else {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const errorData = await response.json();
          console.error('Failed to save program:', errorData);
          showToast(`Failed to save: ${errorData.error || 'Unknown error'}`, 'error');
        } else {
          const text = await response.text();
          console.error('Failed to save program (Non-JSON):', text);
          showToast('Failed to save: Server returned an unexpected error.', 'error');
        }
      }
    } catch (error) {
      console.error('Error saving program:', error);
      showToast('Error saving program: Check console for details.', 'error');
    }
  };

  const getSafeClassierId = (program: any) => {
    // Handle various possible field names from API (classierId, classier_id, or nested classier object)
    if (program.classierId) return program.classierId.toString();
    if (program.classier_id) return program.classier_id.toString();
    if (program.classier && program.classier.id) return program.classier.id.toString();
    return '';
  };

  const handleEdit = (program: Program) => {
    setEditingProgram(program);
    setIsViewMode(false);

    setFormData({
      classier_id: getSafeClassierId(program) || '',
      nama_program: program.nama_program || '',
      deskripsi: program.deskripsi || '',
      jadwal: program.jadwal ? new Date(program.jadwal).toISOString().slice(0, 16) : '',
      poster: program.poster || '',
      durasi: program.durasi || 0
    });
    setImageMode('url');
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleView = (program: Program) => {
    setEditingProgram(program);
    setIsViewMode(true);

    setFormData({
      classier_id: getSafeClassierId(program) || '',
      nama_program: program.nama_program || '',
      deskripsi: program.deskripsi || '',
      jadwal: program.jadwal ? new Date(program.jadwal).toISOString().slice(0, 16) : '',
      poster: program.poster || '',
      durasi: program.durasi || 0
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
      }
    } catch (error) {
      console.error('Error deleting program:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const resetForm = () => {
    setEditingProgram(null);
    setIsViewMode(false);
    setFormData({ classier_id: '', nama_program: '', deskripsi: '', jadwal: '', poster: '', durasi: 0 });
    setImageMode('url');
    setImageFile(null);
  };

  const filteredPrograms = programs.filter(program =>
    program.nama_program.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search programs..."
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Add New Program
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Program</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Classier</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Deskripsi</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Jadwal</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Durasi</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPrograms.map((program) => (
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
                  <span className="text-sm">{new Date(program.jadwal).toLocaleString()}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="font-medium">{program.durasi} menit</span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleView(program)}
                      className="text-blue-500 hover:text-blue-700 transition-colors"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleEdit(program)}
                      className="text-yellow-500 hover:text-yellow-700 transition-colors"
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(program.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {isViewMode ? 'Detail Program' : editingProgram ? 'Edit Program' : 'Add New Program'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Classier <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  disabled={isViewMode}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  value={formData.classier_id}
                  onChange={(e) => setFormData({ ...formData, classier_id: e.target.value })}
                >
                  <option value="">Select a Classier</option>
                  {classiers.map((classier) => (
                    <option key={classier.id} value={classier.id}>
                      {classier.nama}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Program <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  disabled={isViewMode}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  value={formData.nama_program}
                  onChange={(e) => setFormData({ ...formData, nama_program: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  disabled={isViewMode}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jadwal <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  required
                  disabled={isViewMode}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  value={formData.jadwal}
                  onChange={(e) => setFormData({ ...formData, jadwal: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Poster Source</label>
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
                    <span className="text-sm text-gray-700">Image URL</span>
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
                    <span className="text-sm text-gray-700">Upload File</span>
                  </label>
                </div>

                {imageMode === 'url' ? (
                  <input
                    type="url"
                    placeholder="https://example.com/poster.jpg"
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

                {/* Image Preview */}
                {formData.poster && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-700 mb-1">Preview:</p>
                    <img
                      src={formData.poster}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg border border-gray-200"
                      onError={(e) => (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=Invalid+Image+URL'}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Durasi (menit) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  disabled={isViewMode}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  onChange={(e) => setFormData({ ...formData, durasi: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setIsModalOpen(false); resetForm(); }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg"
                >
                  {isViewMode ? 'Close' : 'Cancel'}
                </button>
                {!isViewMode && (
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {editingProgram ? 'Update' : 'Create'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => { setIsDeleteModalOpen(false); setProgramToDelete(null); }}
        onConfirm={executeDelete}
        title="Hapus Program"
        message="Apakah Anda yakin ingin menghapus program ini? Tindakan ini tidak dapat dibatalkan."
        isDeleting={isDeleting}
      />
    </div>
  );
}