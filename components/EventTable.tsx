'use client';

import { useState, useEffect } from 'react';
import { Event } from '@/models/Event';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import DeleteModal from './DeleteModal';
import { useToast } from '@/context/ToastContext';

export default function EventTable() {
  const [events, setEvents] = useState<Event[]>([]);
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Selection States
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [eventToDelete, setEventToDelete] = useState<number | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    judul: '',
    lokasi: '',
    tanggal: '',
    deskripsi: '',
    poster: ''
  });

  const [imageMode, setImageMode] = useState<'url' | 'file'>('url');
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isViewMode) return;

    try {
      const url = editingEvent ? `/api/events/${editingEvent.id}` : '/api/events';
      const method = editingEvent ? 'PUT' : 'POST';

      const data = new FormData();
      data.append('judul', formData.judul);
      data.append('lokasi', formData.lokasi);
      data.append('tanggal', formData.tanggal);
      data.append('deskripsi', formData.deskripsi);

      if (imageMode === 'url') {
        data.append('imageUrl', formData.poster);
      } else if (imageFile) {
        data.append('imageFile', imageFile);
      }

      if (editingEvent && !imageFile && imageMode === 'file') {
        if (formData.poster) data.append('imageUrl', formData.poster);
      }

      const response = await fetch(url, {
        method,
        body: data,
      });

      if (response.ok) {
        fetchEvents();
        setIsModalOpen(false);
        resetForm();
        showToast('Event saved successfully!', 'success');
      } else {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const errorData = await response.json();
          console.error('Failed to save event:', errorData);
          showToast(`Failed to save: ${errorData.error || 'Unknown error'}`, 'error');
        } else {
          const text = await response.text();
          console.error('Failed to save event (Non-JSON):', text);
          showToast('Failed to save: Server returned an unexpected error.', 'error');
        }
      }
    } catch (error) {
      console.error('Error saving event:', error);
      showToast('Error saving event: Check console for details.', 'error');
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setIsViewMode(false);
    setFormData({
      judul: event.judul,
      lokasi: event.lokasi,
      tanggal: event.tanggal.toString().slice(0, 16),
      deskripsi: event.deskripsi,
      poster: event.poster || ''
    });
    setImageMode('url');
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleView = (event: Event) => {
    setEditingEvent(event);
    setIsViewMode(true);
    setFormData({
      judul: event.judul,
      lokasi: event.lokasi,
      tanggal: event.tanggal.toString().slice(0, 16),
      deskripsi: event.deskripsi,
      poster: event.poster || ''
    });
    setImageMode('url');
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setEventToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!eventToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/events/${eventToDelete}`, { method: 'DELETE' });
      if (response.ok) {
        fetchEvents();
        setIsDeleteModalOpen(false);
        setEventToDelete(null);
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const resetForm = () => {
    setEditingEvent(null);
    setIsViewMode(false);
    setFormData({ judul: '', lokasi: '', tanggal: '', deskripsi: '', poster: '' });
    setImageMode('url');
    setImageFile(null);
  };

  const filteredEvents = events.filter(event =>
    event.judul.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search events..."
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Add New Event
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Poster</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Judul</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Lokasi</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Tanggal</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map((event) => (
              <tr key={event.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">
                  {event.poster && (
                    <img
                      src={event.poster}
                      alt={event.judul}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                </td>
                <td className="py-3 px-4 font-medium">{event.judul}</td>
                <td className="py-3 px-4">{event.lokasi}</td>
                <td className="py-3 px-4">
                  <span className="text-sm">{new Date(event.tanggal).toLocaleString()}</span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleView(event)}
                      className="text-blue-500 hover:text-blue-700 transition-colors"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleEdit(event)}
                      className="text-yellow-500 hover:text-yellow-700 transition-colors"
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(event.id)}
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
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {isViewMode ? 'Detail Event' : editingEvent ? 'Edit Event' : 'Add New Event'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
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
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lokasi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  disabled={isViewMode}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  value={formData.lokasi}
                  onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  required
                  disabled={isViewMode}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  value={formData.tanggal}
                  onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
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

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setIsModalOpen(false); resetForm(); }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  {isViewMode ? 'Close' : 'Cancel'}
                </button>
                {!isViewMode && (
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {editingEvent ? 'Update' : 'Create'}
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
        onClose={() => { setIsDeleteModalOpen(false); setEventToDelete(null); }}
        onConfirm={executeDelete}
        title="Hapus Event"
        message="Apakah Anda yakin ingin menghapus event ini? Tindakan ini tidak dapat dibatalkan."
        isDeleting={isDeleting}
      />
    </div>
  );
}