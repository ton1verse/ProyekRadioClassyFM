'use client';

import { useState, useEffect } from 'react';
import { Classier } from '@/models/Classier';
import { useRouter } from 'next/navigation';
import { Eye, Edit, Trash2, ChevronLeft, ChevronRight, Printer, FileText } from 'lucide-react';
import DeleteModal from './DeleteModal';
import { useToast } from '@/context/ToastContext';

export default function ClassierTable() {
  const router = useRouter();
  const [classiers, setClassiers] = useState<Classier[]>([]);
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  const [reportMonth, setReportMonth] = useState(new Date().getMonth());
  const [reportYear, setReportYear] = useState(new Date().getFullYear());
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [editingClassier, setEditingClassier] = useState<Classier | null>(null);
  const [classierToDelete, setClassierToDelete] = useState<number | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nama: '',
    motto: '',
    foto: '',
    status: 'active' as 'active' | 'inactive',
    honor_per_jam: 0,
    instagram: '',
    facebook: '',
    twitter: ''
  });

  const [imageMode, setImageMode] = useState<'url' | 'file'>('url');
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchClassiers();
  }, []);

  const fetchClassiers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/classiers');
      const data = await response.json();

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

      if (!formData.nama.trim()) {
        throw new Error('Nama is required');
      }
      if (!formData.motto.trim()) {
      }
      if (formData.honor_per_jam < 0) {
        throw new Error('Honor per jam must be positive');
      }

      console.log('Submitting form data:', formData);

      const url = editingClassier ? `/api/classiers/${editingClassier.id}` : '/api/classiers';
      const method = editingClassier ? 'PUT' : 'POST';

      const data = new FormData();
      data.append('nama', formData.nama);
      data.append('motto', formData.motto);
      data.append('status', formData.status);
      data.append('honor_per_jam', formData.honor_per_jam.toString());
      data.append('instagram', formData.instagram);
      data.append('facebook', formData.facebook);
      data.append('twitter', formData.twitter);

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
      showToast(error instanceof Error ? error.message : 'Error saving classier', 'error');
    }
  };

  const handleEdit = (classier: Classier) => {
    setEditingClassier(classier);
    setIsViewMode(false);
    setFormData({
      nama: classier.nama,
      motto: classier.motto || classier.deskripsi || '',
      foto: classier.foto || '',
      status: classier.status,
      honor_per_jam: classier.honor_per_jam,
      instagram: classier.instagram || '',
      facebook: classier.facebook || '',
      twitter: classier.twitter || ''
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
      motto: classier.motto || classier.deskripsi || '',
      foto: classier.foto || '',
      status: classier.status,
      honor_per_jam: classier.honor_per_jam,
      instagram: classier.instagram || '',
      facebook: classier.facebook || '',
      twitter: classier.twitter || ''
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
      motto: '',
      foto: '',
      status: 'active',
      honor_per_jam: 0,
      instagram: '',
      facebook: '',
      twitter: ''
    });
    setImageMode('url');
    setImageFile(null);
  };

  const handlePrintAll = () => {
    router.push(`/dashboard/laporan-honor?month=${reportMonth}&year=${reportYear}`);
  };

  const handlePrintSlip = (classierId: number) => {
    router.push(`/dashboard/laporan-honor?month=${reportMonth}&year=${reportYear}&classierId=${classierId}`);
  };

  const filteredClassiers = classiers.filter(classier =>
    classier.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (classier.motto || classier.deskripsi || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredClassiers.length / itemsPerPage);
  const currentItems = filteredClassiers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

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
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <div className="flex items-center">
            <span className="mr-2">Alert: </span>
            <span>{error}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Cari classier..."
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />


        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
          <button
            onClick={handlePrintAll}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors flex items-center gap-2"
            title="Cetak Laporan Bulanan (Semua Classier)"
          >
            <Printer size={16} />
            Cetak Laporan
          </button>

          <button
            onClick={() => { resetForm(); setIsModalOpen(true); }}
            className="bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold shadow-sm"
          >
            + Tambah Classier
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Foto</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Nama</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Motto</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredClassiers.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-500">
                  No classiers found.
                </td>
              </tr>
            ) : (
              currentItems.map((classier) => (
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
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm text-gray-600 line-clamp-2">{classier.motto || classier.deskripsi}</p>
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
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(getClassierId(classier))}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        title="Delete classier"
                      >
                        <Trash2 size={18} />
                      </button>
                      <button
                        onClick={() => handlePrintSlip(getClassierId(classier))}
                        className="text-gray-600 hover:text-gray-800 transition-colors"
                        title="Cetak Slip Honor"
                      >
                        <Printer size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <p className="text-sm text-gray-500">
            Showing <span className="font-bold">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold">{Math.min(currentPage * itemsPerPage, filteredClassiers.length)}</span> of <span className="font-bold">{filteredClassiers.length}</span> results
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
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {isViewMode ? 'Detail Classier' : editingClassier ? 'Edit Classier' : 'Tambah Classier'}
              </h2>
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
                  placeholder="Masukkan Nama"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Motto <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  disabled={isViewMode}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  value={formData.motto}
                  onChange={(e) => setFormData({ ...formData, motto: e.target.value })}
                  placeholder="Masukkan Motto"
                />
              </div>

              <div className="border-t border-b py-4 my-2">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Sosial Media (Opsional)</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Instagram Profile URL</label>
                    <input
                      type="url"
                      disabled={isViewMode}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:bg-gray-100 text-sm"
                      value={formData.instagram}
                      onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                      placeholder="https://instagram.com/username"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Facebook Profile URL</label>
                    <input
                      type="url"
                      disabled={isViewMode}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-gray-100 text-sm"
                      value={formData.facebook}
                      onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                      placeholder="https://facebook.com/username"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Twitter/X Profile URL</label>
                    <input
                      type="url"
                      disabled={isViewMode}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100 text-sm"
                      value={formData.twitter}
                      onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                      placeholder="https://twitter.com/username"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sumber Foto</label>
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
                    placeholder="https://example.com/photo.jpg or /images/..."
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

                {formData.foto && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-700 mb-1">Pratinjau:</p>
                    <img
                      src={formData.foto}
                      alt="Pratinjau"
                      className="w-full h-48 object-cover rounded-lg border border-gray-200"
                      onError={(e) => (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=Invalid+Image+URL'}
                    />
                  </div>
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
                  className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  {isViewMode ? 'Tutup' : 'Batal'}
                </button>
                {!isViewMode && (
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    {editingClassier ? 'Perbarui' : 'Buat'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

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