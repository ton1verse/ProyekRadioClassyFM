'use client';

import { useState, useEffect } from 'react';
import { Gallery } from '@/models/Gallery';
import { Eye, Edit, Trash2, X, Plus, Upload, ChevronLeft, ChevronRight } from 'lucide-react';
import DeleteModal from './DeleteModal';
import { useToast } from '@/context/ToastContext';

interface GalleryImage {
  id: number;
  url: string;
}

interface GalleryWithImages extends Gallery {
  images?: GalleryImage[];
}

export default function GalleryTable() {
  const [galleries, setGalleries] = useState<GalleryWithImages[]>([]);
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [editingGallery, setEditingGallery] = useState<GalleryWithImages | null>(null);
  const [galleryToDelete, setGalleryToDelete] = useState<number | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    judul: '',
    deskripsi: '',
    tanggal: new Date().toISOString().split('T')[0],
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [isDragOver, setIsDragOver] = useState(false);


  useEffect(() => {
    fetchGalleries();
  }, []);

  const fetchGalleries = async () => {
    try {
      const response = await fetch('/api/galleries');
      const data = await response.json();
      if (Array.isArray(data)) {
        setGalleries(data);
      } else {
        console.error('API returned non-array data:', data);
        setGalleries([]);
      }
    } catch (error) {
      console.error('Error fetching galleries:', error);
      setGalleries([]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files));
    }
  };

  const addFiles = (files: File[]) => {
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    setImageFiles(prev => [...prev, ...validFiles]);

    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeFile = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isViewMode) return;

    try {
      const url = editingGallery ? `/api/galleries/${editingGallery.id}` : '/api/galleries';
      const method = editingGallery ? 'PUT' : 'POST';

      const data = new FormData();
      data.append('judul', formData.judul);
      data.append('deskripsi', formData.deskripsi);
      data.append('tanggal', formData.tanggal);

      imageFiles.forEach(file => {
        data.append('imageFiles', file);
      });

      const response = await fetch(url, {
        method,
        body: data,
      });

      if (response.ok) {
        fetchGalleries();
        setIsModalOpen(false);
        resetForm();
        showToast('Gallery saved successfully!', 'success');
      } else {
        const errorData = await response.json();
        console.error('Failed to save gallery:', errorData);
        showToast(`Failed to save: ${errorData.error || 'Unknown error'}`, 'error');
      }
    } catch (error) {
      console.error('Error saving gallery:', error);
      showToast('Error saving gallery: Check console for details.', 'error');
    }
  };

  const handleEdit = (gallery: GalleryWithImages) => {
    setEditingGallery(gallery);
    setIsViewMode(false);
    setFormData({
      judul: gallery.judul,
      deskripsi: gallery.deskripsi,
      tanggal: gallery.tanggal ? new Date(gallery.tanggal).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    });
    setFormData({
      judul: gallery.judul,
      deskripsi: gallery.deskripsi,
      tanggal: gallery.tanggal ? new Date(gallery.tanggal).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    });
    setImageFiles([]);
    setPreviews([]);
    setIsModalOpen(true);
  };

  const handleView = (gallery: GalleryWithImages) => {
    setEditingGallery(gallery);
    setIsViewMode(true);
    setFormData({
      judul: gallery.judul,
      deskripsi: gallery.deskripsi,
      tanggal: gallery.tanggal ? new Date(gallery.tanggal).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    });
    setPreviews([]);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setGalleryToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!galleryToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/galleries/${galleryToDelete}`, { method: 'DELETE' });
      if (response.ok) {
        fetchGalleries();
        setIsDeleteModalOpen(false);
        setGalleryToDelete(null);
      }
    } catch (error) {
      console.error('Error deleting gallery:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const resetForm = () => {
    setEditingGallery(null);
    setIsViewMode(false);
    setFormData({ judul: '', deskripsi: '', tanggal: new Date().toISOString().split('T')[0] });
    setImageFiles([]);
    setPreviews([]);
  };

  const filteredGalleries = galleries.filter(gallery =>
    gallery.judul.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredGalleries.length / itemsPerPage);
  const currentItems = filteredGalleries.slice(
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
          placeholder="Cari galeri..."
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Tambah Galeri
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Cover</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Judul</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Tanggal</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Jumlah Gambar</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((gallery) => (
              <tr key={gallery.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">
                  {(gallery.images && gallery.images.length > 0) ? (
                    <div className="flex -space-x-2">
                      {gallery.images.slice(0, 3).map((img, i) => (
                        <img key={i} src={img.url} className="w-10 h-10 rounded-full border-2 border-white object-cover" />
                      ))}
                    </div>
                  ) : gallery.gambar ? (
                    <img
                      src={gallery.gambar}
                      alt={gallery.judul}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : <div className="w-10 h-10 bg-gray-200 rounded-full"></div>}
                </td>
                <td className="py-3 px-4 font-medium">{gallery.judul}</td>
                <td className="py-3 px-4 text-gray-600">
                  {gallery.tanggal ? new Date(gallery.tanggal).toLocaleDateString() : '-'}
                </td>
                <td className="py-3 px-4">
                  {gallery.images?.length || (gallery.gambar ? 1 : 0)} Photos
                </td>
                <td className="py-3 px-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleView(gallery)}
                      className="text-blue-500 hover:text-blue-700 transition-colors"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleEdit(gallery)}
                      className="text-yellow-500 hover:text-yellow-700 transition-colors"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(gallery.id)}
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

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <p className="text-sm text-gray-500">
            Showing <span className="font-bold">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold">{Math.min(currentPage * itemsPerPage, filteredGalleries.length)}</span> of <span className="font-bold">{filteredGalleries.length}</span> results
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
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {isViewMode ? 'Detail Galeri' : editingGallery ? 'Edit Gallery' : 'Tambah Galeri'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Basic Fields */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Judul <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isViewMode}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    value={formData.judul}
                    onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                    placeholder="Masukkan Judul"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tanggal
                  </label>
                  <input
                    type="date"
                    disabled={isViewMode}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    value={formData.tanggal}
                    onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                    placeholder="Masukkan Tanggal"
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
                    placeholder="Masukkan Deskripsi"
                  />
                </div>
              </div>

              {(isViewMode || editingGallery) && editingGallery?.images && editingGallery.images.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Foto</label>
                  <div className="grid grid-cols-3 gap-2">
                    {editingGallery.images.map(img => (
                      <img
                        key={img.id}
                        src={img.url}
                        onClick={() => setPreviewImage(img.url)}
                        className="h-24 w-full object-cover rounded-md border cursor-pointer hover:opacity-80 transition-opacity"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Section */}
              {!isViewMode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Foto</label>

                  {/* Dropzone */}
                  <div
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('fileInput')?.click()}
                  >
                    <input
                      type="file"
                      id="fileInput"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <Upload className="w-8 h-8 mb-2 opacity-50" />
                      <span className="text-sm font-medium">Klik untuk mengunggah atau tarik dan lepaskan</span>
                      <span className="text-xs opacity-75">SVG, PNG, JPG atau GIF (max. 5MB)</span>
                    </div>
                  </div>

                  {previews.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-4">
                      {previews.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            onClick={() => setPreviewImage(url)}
                            className="h-24 w-full object-cover rounded-lg shadow-sm cursor-pointer hover:opacity-80 transition-opacity"
                          />
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t">
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
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                  >
                    {editingGallery ? 'Perbarui' : 'Buat'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => { setIsDeleteModalOpen(false); setGalleryToDelete(null); }}
        onConfirm={executeDelete}
        title="Hapus Gallery"
        message="Apakah Anda yakin ingin menghapus gallery ini? Tindakan ini tidak dapat dibatalkan."
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