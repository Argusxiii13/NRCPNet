import React, { useState } from 'react';
import { Download, Edit2, Trash2, Eye } from 'lucide-react';
import Pagination from '../reusable/Pagination'; // Adjust the import path as necessary
import '../../../css/styles/admin/DownloadableFormsList.css'

const DownloadableFormsList = ({ forms, loading, totalForms, itemsPerPage, currentPage, setCurrentPage, refreshForms, selectedForm, setSelectedForm }) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [formToDelete, setFormToDelete] = useState(null);
  
  // Edit modal state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editedForm, setEditedForm] = useState({ title: '', status: '', division: '', section: '' });

  // PDF viewer modal state
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');

  const handleFormClick = (form) => {
    setSelectedForm(selectedForm?.id === form.id ? null : form);
  };

  const openConfirmModal = (form, e) => {
    e.stopPropagation();
    setFormToDelete(form);
    setIsConfirmOpen(true);
  };

  const openEditModal = (form, e) => {
    e.stopPropagation();
    setEditedForm({
        id: form.id,
        title: form.title, 
        status: form.status,
        division: form.division,
        section: form.section
    });
    setIsEditOpen(true);
  };

  const openPdfModal = (form, e) => {
    e.stopPropagation();
    // Just for design, no actual functionality
    setPdfUrl('#');
    setIsPdfOpen(true);
  };

  const handleDownload = (form, e) => {
    e.stopPropagation();
    // Just for design, no functionality
    console.log(`Design mock: Download button clicked for ${form.title}`);
  };

  const confirmDelete = () => {
    // Just for design, no functionality
    setIsConfirmOpen(false);
    setFormToDelete(null);
  };

  const handleEditSubmit = () => {
    // Just for design, no functionality
    setIsEditOpen(false);
    setEditedForm({ id: null, title: '', status: '', division: '', section: '' });
  };

  return (
    <div className="panel forms-list-panel">
      <div className="panel-header">
        <h2 className="text-2xl font-bold">Downloadable Forms</h2>
      </div>
      <div className="panel-content">
        <div className="forms-list">
          {forms.map((form) => (
            <div
              key={form.id}
              className={`form-item ${selectedForm?.id === form.id ? 'selected' : ''}`}
              onClick={() => handleFormClick(form)}
            >
              <div className="form-info">
                <h3 className="form-title">{form.title}</h3>
                <span className={`form-status ${form.status.toLowerCase()}`}>
                  {form.status}
                </span>
              </div>
              <div className="form-meta">
                <span className="form-division">{form.division}</span>
                {form.section && <span className="form-section">{form.section}</span>}
                <span className="form-date">{form.uploadDate}</span>
              </div>
              <div className="form-actions">
                <button className="action-button" title="Download" onClick={(e) => handleDownload(form, e)}>
                  <Download size={16} />
                </button>
                <button className="action-button" title="View" onClick={(e) => openPdfModal(form, e)}>
                  <Eye size={16} />
                </button>
                <button className="action-button" title="Edit" onClick={(e) => openEditModal(form, e)}>
                  <Edit2 size={16} />
                </button>
                <button className="action-button delete" title="Delete" onClick={(e) => openConfirmModal(form, e)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          
          {forms.length === 0 && !loading && (
            <div className="no-forms-message">
              <p>No forms available. Please upload forms to see them listed here.</p>
            </div>
          )}
          
          {loading && (
            <div className="loading-indicator">
              <p>Loading forms...</p>
            </div>
          )}
        </div>
      </div>
      <Pagination 
        loading={loading}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalItems={totalForms}
        itemsPerPage={itemsPerPage}
      />
      
      {/* Confirmation Modal */}
      {isConfirmOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h4 className="modal-title">Confirm Deletion</h4>
              <button className="close-button" onClick={() => setIsConfirmOpen(false)}>✖</button>
            </div>
            <div className="modal-content">
              <p>Are you sure you want to delete this form? This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="cancel-button" onClick={() => setIsConfirmOpen(false)}>Cancel</button>
              <button className="delete-button" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h4 className="modal-title">Edit Form</h4>
              <button className="close-button" onClick={() => setIsEditOpen(false)}>✖</button>
            </div>
            <div className="modal-content">
              <div className="modal-field">
                <label htmlFor="title">Title:</label>
                <input
                  id="title"
                  type="text"
                  value={editedForm.title}
                  onChange={(e) => setEditedForm({ ...editedForm, title: e.target.value })}
                  className="modal-input"
                />
              </div>
              <div className="modal-field">
                <label htmlFor="status">Status:</label>
                <select
                  id="status"
                  value={editedForm.status}
                  onChange={(e) => setEditedForm({ ...editedForm, status: e.target.value })}
                  className="modal-select"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="modal-field">
                <label htmlFor="division">Division:</label>
                <input
                  id="division"
                  type="text"
                  value={editedForm.division}
                  onChange={(e) => setEditedForm({ ...editedForm, division: e.target.value })}
                  className="modal-input"
                  readOnly
                />
              </div>
              {editedForm.section && (
                <div className="modal-field">
                  <label htmlFor="section">Section:</label>
                  <input
                    id="section"
                    type="text"
                    value={editedForm.section}
                    onChange={(e) => setEditedForm({ ...editedForm, section: e.target.value })}
                    className="modal-input"
                    readOnly
                  />
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="cancel-button" onClick={() => setIsEditOpen(false)}>Cancel</button>
              <button className="save-button" onClick={handleEditSubmit}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* PDF Viewer Modal */}
      {isPdfOpen && (
        <div className="modal-overlay">
          <div className="modal-container pdf-modal">
            <div className="modal-header">
              <h4 className="modal-title">PDF Viewer</h4>
              <button className="close-button" onClick={() => setIsPdfOpen(false)}>✖</button>
            </div>
            <div className="modal-content pdf-viewer">
              <div className="pdf-placeholder">
                <p>PDF preview would appear here</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-button" onClick={() => setIsPdfOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DownloadableFormsList;