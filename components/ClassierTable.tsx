'use client';

import { useState, useEffect } from 'react';
import { Classier } from '@/models/Classier';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import DeleteModal from './DeleteModal';
import { useToast } from '@/context/ToastContext';

export default function ClassierTable() {
  const [classiers, setClassiers] = useState<Classier[]>([]);
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Selection States
  const [editingClassier, setEditingClassier] = useState<Classier | null>(null);
  const [classierToDelete, setClassierToDelete] = useState<number | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nama: '',
    deskripsi: '',
    foto: '',
    status: 'active' as 'active' | 'inactive',
    honor_per_jam: 0
  });

  const [imageMode, setImageMode] = useState<'url' | 'file'>('url');
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Fetch data dari MongoDB
  useEffect(() => {
    fetchClassiers();
  }, []);

  const fetchClassiers = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching classiers from API...');

      const response = await fetch('/api/classiers');
      const data = await response.json();

      console.log('API Response:', data);

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}: Failed to fetch classiers`);
      }

      setClassiers(data);

    } catch (error) {
      console.error('Error fetching classiers:', error);

      if (error instanceof Error) {
        setError(`Failed to load classiers: ${error.message}`);
      } else {
        setError('Failed to load classiers.');
      }

      // Set empty array jika error
      setClassiers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isViewMode) return;

    try {
      setError(null);

      // Validasi form
      if (!formData.nama.trim()) {
        throw new Error('Nama is required');
      }
      if (!formData.deskripsi.trim()) {
        throw new Error('Deskripsi is required');
      }
      if (formData.honor_per_jam < 0) {
        throw new Error('Honor per jam must be positive');
      }

      console.log('Submitting form data:', formData);

      const url = editingClassier ? `/api/classiers/${editingClassier.id}` : '/api/classiers';
      const method = editingClassier ? 'PUT' : 'POST';

      const data = new FormData();
      data.append('nama', formData.nama);
      data.append('deskripsi', formData.deskripsi);
      data.append('status', formData.status);
      data.append('honor_per_jam', formData.honor_per_jam.toString());

      if (imageMode === 'url') {
        data.append('imageUrl', formData.foto);
      } else if (imageFile) {
        data.append('imageFile', imageFile);
      }

      if (editingClassier && !imageFile && imageMode === 'file') {
        if (formData.foto) data.append('imageUrl', formData.foto);
      }

      const response = await fetch(url, {
        method,
        body: data,
      });

      if (response.ok) {
        fetchClassiers();
        setIsModalOpen(false);
        resetForm();
        showToast('Classier saved successfully!', 'success');
      } else {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const errorData = await response.json();
          console.error('Failed to save classier:', errorData);
          showToast(`Failed to save: ${errorData.error || 'Unknown error'}`, 'error');
        } else {
          const text = await response.text();
          console.error('Failed to save classier (Non-JSON):', text);
          showToast('Failed to save: Server returned an unexpected error.', 'error');
        }
      }
    } catch (error) {
      console.error('Error saving classier:', error);
      showToast('Error saving classier: Check console for details.', 'error');
    }
  };

  const handleEdit = (classier: Classier) => {
    console.log('Editing classier:', classier);
    setEditingClassier(classier);
    setIsViewMode(false);
    setFormData({
      nama: classier.nama,
      deskripsi: classier.deskripsi,
      foto: classier.foto || '',
      status: classier.status,
      honor_per_jam: classier.honor_per_jam
    });
    setImageMode('url');
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleView = (classier: Classier) => {
    setEditingClassier(classier);
    setIsViewMode(true);
    setFormData({
      nama: classier.nama,
      deskripsi: classier.deskripsi,
      foto: classier.foto || '',
      status: classier.status,
      honor_per_jam: classier.honor_per_jam
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setClassierToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!classierToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/classiers/${classierToDelete}`, {
        method: 'DELETE'
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || `HTTP ${response.status}: Failed to delete classier`);
      }

      // Refresh data dari server
      await fetchClassiers();
      setIsDeleteModalOpen(false);
      setClassierToDelete(null);

    } catch (error) {
      console.error('Error deleting classier:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete classier');
    } finally {
      setIsDeleting(false);
    }
  };

  const resetForm = () => {
    setEditingClassier(null);
    setIsViewMode(false);
    setFormData({
      nama: '',
      deskripsi: '',
      foto: '',
      status: 'active',
      honor_per_jam: 0
    });
    setImageMode('url');
    setImageFile(null);
  };

  const filteredClassiers = classiers.filter(classier =>
    classier.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classier.deskripsi.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getClassierId = (classier: Classier): number => {
    return classier.id;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-32">
          <div className="text-gray-600">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            Loading classiers...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <div className="flex items-center">
            <span className="mr-2">Alert: </span>
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-700 hover:text-red-900"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Success Message */}
      {!error && classiers.length === 0 && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 text-blue-700 rounded">
          <div className="flex items-center">
            <span className="mr-2"></span>
            <span>No classiers found. Add your first classier to get started!</span>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search classiers by name or description..."
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex items-center space-x-3">
          <button
            onClick={() => { resetForm(); setIsModalOpen(true); }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Add New Classier
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Photo</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Nama</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Deskripsi</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Honor/Jam</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClassiers.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-500">
                </td>
              </tr>
            ) : (
              filteredClassiers.map((classier) => (
                <tr key={getClassierId(classier)} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      {classier.foto ? (
                        <img
                          src={classier.foto}
                          alt={classier.nama}
                          className="w-10 h-10 rounded-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(classier.nama)}&background=random`;
                          }}
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-bold text-lg">
                            {classier.nama.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-gray-900">{classier.nama}</span>
                    <p className="text-xs text-gray-500 mt-1">
                      Added: {new Date(classier.createdAt as string).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm text-gray-600 line-clamp-2">{classier.deskripsi}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${classier.status === 'active'
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : 'bg-red-100 text-red-800 border border-red-200'
                      }`}>
                      {classier.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-gray-900">
                      Rp {classier.honor_per_jam.toLocaleString('id-ID')}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">per hour</p>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleView(classier)}
                        className="text-blue-500 hover:text-blue-700 transition-colors"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleEdit(classier)}
                        className="text-yellow-500 hover:text-yellow-700 transition-colors"
                        title="Edit classier"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(getClassierId(classier))}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        title="Delete classier"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Stats Summary */}
      {classiers.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Showing {filteredClassiers.length} of {classiers.length} classiers</span>
              {searchTerm && (
                <span className="ml-2 text-blue-600">
                  (filtered by: "{searchTerm}")
                </span>
              )}
            </div>
            <div className="flex space-x-4 text-sm">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                Active: {classiers.filter(c => c.status === 'active').length}
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                Inactive: {classiers.filter(c => c.status === 'inactive').length}
              </span>
              <span className="text-gray-700 font-medium">
                Total Honor: Rp {classiers.reduce((sum, c) => sum + c.honor_per_jam, 0).toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {isViewMode ? 'Detail Classier' : editingClassier ? 'Edit Classier' : 'Add New Classier'}
              </h2>
              <button
                onClick={() => { setIsModalOpen(false); resetForm(); }}
                className="text-gray-400 hover:text-gray-600 text-lg"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  disabled={isViewMode}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  placeholder="Enter classier name"
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
                  placeholder="Describe the classier's expertise and experience"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Foto Source</label>
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
                    placeholder="https://example.com/photo.jpg"
                    disabled={isViewMode}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    value={formData.foto}
                    onChange={(e) => setFormData({ ...formData, foto: e.target.value })}
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
                        setFormData({ ...formData, foto: URL.createObjectURL(e.target.files[0]) });
                      }
                    }}
                  />
                )}

                {/* Image Preview */}
                {formData.foto && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-700 mb-1">Preview:</p>
                    <img
                      src={formData.foto}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg border border-gray-200"
                      onError={(e) => (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=Invalid+Image+URL'}
                    />
                  </div>
                )}
                {!isViewMode && (
                  <p className="text-xs text-gray-500 mt-1">
                    Leave empty for default avatar. Recommended: square image, 400x400px
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    disabled={isViewMode}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Honor per Jam <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      Rp
                    </span>
                    <input
                      type="number"
                      required
                      min="0"
                      step="10000"
                      disabled={isViewMode}
                      className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                      value={formData.honor_per_jam}
                      onChange={(e) => setFormData({ ...formData, honor_per_jam: parseInt(e.target.value) || 0 })}
                      placeholder="500000"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => { setIsModalOpen(false); resetForm(); }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {isViewMode ? 'Close' : 'Cancel'}
                </button>
                {!isViewMode && (
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    {editingClassier ? 'Update Classier' : 'Create Classier'}
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
        onClose={() => { setIsDeleteModalOpen(false); setClassierToDelete(null); }}
        onConfirm={executeDelete}
        title="Hapus Classier"
        message="Apakah Anda yakin ingin menghapus classier ini? Tindakan ini tidak dapat dibatalkan."
        isDeleting={isDeleting}
      />
    </div>
  );
}