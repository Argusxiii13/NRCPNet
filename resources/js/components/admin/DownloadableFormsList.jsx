import React, { useState, useEffect } from 'react';
import { Download, Edit2, Trash2, Eye } from 'lucide-react';
import styles from '../../../css/styles/admin/DownloadableFormsList.module.css';

const DownloadableFormsList = ({ forms, loading, totalForms, itemsPerPage, currentPage, setCurrentPage, refreshForms, selectedForm, setSelectedForm }) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [formToDelete, setFormToDelete] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editedForm, setEditedForm] = useState({ title: '', status: '', division: '', section: '', type: '' });
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfError, setPdfError] = useState(null);
  const [divisions, setDivisions] = useState([]);
  const [loadingDivisions, setLoadingDivisions] = useState(false);

  const totalPages = Math.ceil(totalForms / itemsPerPage);

  // Fetch divisions when edit modal opens
  useEffect(() => {
    if (isEditOpen) {
      fetchDivisions();
    }
  }, [isEditOpen]);

  const fetchDivisions = async () => {
    try {
      setLoadingDivisions(true);
      const response = await fetch('/api/divisions');
      if (!response.ok) {
        throw new Error('Failed to fetch divisions');
      }
      const data = await response.json();
      setDivisions(data);
    } catch (error) {
      console.error('Error fetching divisions:', error);
    } finally {
      setLoadingDivisions(false);
    }
  };

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
      division: form.division || 'General',
      type: form.type || 'Downloadable',
      section: form.section
    });
    setIsEditOpen(true);
  };

  const openPdfModal = (form, e) => {
    e.stopPropagation();
    setPdfError(null);
    const fileUrl = form.content || null;
    
    if (!fileUrl) {
      setPdfError("No PDF file available for this form.");
      setIsPdfOpen(true);
      return;
    }
    
    setPdfUrl(fileUrl);
    setIsPdfOpen(true);
  };

  const handleDownload = (form, e) => {
    if (e) e.stopPropagation();
    const fileUrl = form?.content;
    if (fileUrl) {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = form?.title || 'document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.error('No file URL available for download');
    }
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`/api/downloadables/${formToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      setIsConfirmOpen(false);
      setFormToDelete(null);
      refreshForms();
    } catch (error) {
      console.error('Error deleting form:', error);
    }
  };

  const handleEditSubmit = async () => {
    try {
      // Check if division is valid
      if (!editedForm.division) {
        console.error('Division is required');
        return;
      }

      const response = await fetch(`/api/downloadables/update-form/${editedForm.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editedForm.title,
          status: editedForm.status,
          division: editedForm.division,
          type: editedForm.type
        })
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      setIsEditOpen(false);
      setEditedForm({ id: null, title: '', status: '', division: '', type: '' });
      refreshForms();
    } catch (error) {
      console.error('Error updating form:', error);
    }
  };

  return (
    <div className={styles['panel'] + ' ' + styles['forms-list-panel']}>
      <div className={styles['panel-header']}>
        <h2 className="text-2xl font-bold">Downloadable Forms</h2>
      </div>
      <div className={styles['panel-content']}>
        <div className={styles['forms-list']}>
          {forms.map((form) => (
            <div
              key={form.id}
              className={`${styles['form-item']} ${selectedForm?.id === form.id ? styles['selected'] : ''}`}
              onClick={() => handleFormClick(form)}
            >
              <div className={styles['form-info']}>
                <h3 className={styles['form-title']}>{form.title}</h3>
                <span className={`${styles['form-status']} ${styles[form.status.toLowerCase()]}`}>
                  {form.status}
                </span>
              </div>
              <div className={styles['form-meta']}>
                <span className={styles['form-division']}>{form.division || 'General'}</span>
                {form.section && <span className={styles['form-section']}>{form.section}</span>}
                <span className={styles['form-date']}>{form.created_at || 'N/A'}</span>
              </div>
              <div className={styles['form-actions']}>
                <button className={styles['action-button']} title="Download" onClick={(e) => handleDownload(form, e)}>
                  <Download size={16} />
                </button>
                <button className={styles['action-button']} title="View" onClick={(e) => openPdfModal(form, e)}>
                  <Eye size={16} />
                </button>
                <button className={styles['action-button']} title="Edit" onClick={(e) => openEditModal(form, e)}>
                  <Edit2 size={16} />
                </button>
                <button className={`${styles['action-button']} ${styles['delete']}`} title="Delete" onClick={(e) => openConfirmModal(form, e)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          
          {forms.length === 0 && !loading && (
            <div className={styles['no-forms-message']}>
              <p>No forms available. Please upload forms to see them listed here.</p>
            </div>
          )}
          
          {loading && (
            <div className={styles['loading-indicator']}>
              <p>Loading forms...</p>
            </div>
          )}
        </div>
      </div>

      {/* Integrated Pagination - Corrected class names */}
      <div className={styles['pagination']}>
        <div className={styles['pagination-info']}>
          {loading ? 'Loading...' :
            `Showing ${totalForms > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-${Math.min(currentPage * itemsPerPage, totalForms)} of ${totalForms} features`
          }
        </div>
        <div className={styles['pagination-buttons']}>
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className={styles['filter-button']}
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage * itemsPerPage >= totalForms || loading}
            className={styles['filter-button']}
          >
            Next
          </button>
        </div>
      </div>
      
      {/* Confirmation Modal */}
      {isConfirmOpen && (
        <div className={styles['modal-overlay']}>
          <div className={styles['modal-container']}>
            <div className={styles['modal-header']}>
              <h4 className={styles['modal-title']}>Confirm Deletion</h4>
              <button className={styles['close-button']} onClick={() => setIsConfirmOpen(false)}>✖</button>
            </div>
            <div className={styles['modal-content']}>
              <p>Are you sure you want to delete this form? This action cannot be undone.</p>
            </div>
            <div className={styles['modal-footer']}>
              <button className={styles['cancel-button']} onClick={() => setIsConfirmOpen(false)}>Cancel</button>
              <button className={styles['delete-button']} onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal with Dynamic Divisions */}
      {isEditOpen && (
        <div className={styles['modal-overlay']}>
          <div className={styles['modal-container']}>
            <div className={styles['modal-header']}>
              <h4 className={styles['modal-title']}>Edit Form</h4>
              <button className={styles['close-button']} onClick={() => setIsEditOpen(false)}>✖</button>
            </div>
            <div className={styles['modal-content']}>
              <div className={styles['modal-field']}>
                <label htmlFor="title">Title:</label>
                <input
                  id="title"
                  type="text"
                  value={editedForm.title}
                  onChange={(e) => setEditedForm({ ...editedForm, title: e.target.value })}
                  className={styles['modal-input']}
                />
              </div>
              <div className={styles['modal-field']}>
                <label htmlFor="status">Status:</label>
                <select
                  id="status"
                  value={editedForm.status}
                  onChange={(e) => setEditedForm({ ...editedForm, status: e.target.value })}
                  className={styles['modal-select']}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className={styles['modal-field']}>
                <label htmlFor="division">Division:</label>
                <select
                  id="division"
                  value={editedForm.division}
                  onChange={(e) => setEditedForm({ ...editedForm, division: e.target.value })}
                  className={styles['modal-select']}
                  disabled={loadingDivisions}
                >
                  {loadingDivisions ? (
                    <option value="">Loading divisions...</option>
                  ) : (
                    <>
                      <option value="General">General</option>
                      {divisions.map((division) => (
                        <option key={division.code} value={division.code}>
                          {division.name}
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </div>
              <div className={styles['modal-field']}>
                <label htmlFor="type">Type:</label>
                <select
                  id="type"
                  value={editedForm.type}
                  onChange={(e) => setEditedForm({ ...editedForm, type: e.target.value })}
                  className={styles['modal-select']}
                >
                  <option value="Request">Request</option>
                  <option value="Memo">Memo</option>
                  <option value="Miscellaneous">Miscellaneous</option>
                </select>
              </div>
              {editedForm.section && (
                <div className={styles['modal-field']}>
                  <label htmlFor="section">Section:</label>
                  <input
                    id="section"
                    type="text"
                    value={editedForm.section}
                    onChange={(e) => setEditedForm({ ...editedForm, section: e.target.value })}
                    className={styles['modal-input']}
                    readOnly
                  />
                </div>
              )}
            </div>
            <div className={styles['modal-footer']}>
              <button className={styles['cancel-button']} onClick={() => setIsEditOpen(false)}>Cancel</button>
              <button className={styles['save-button']} onClick={handleEditSubmit}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* PDF Viewer Modal */}
      {isPdfOpen && (
        <div className={styles['modal-overlay']}>
          <div className={`${styles['modal-container']} ${styles['pdf-modal']}`}>
            <div className={styles['modal-header']}>
              <h4 className={styles['modal-title']}>PDF Viewer</h4>
              <button className={styles['close-button']} onClick={() => setIsPdfOpen(false)}>✖</button>
            </div>
            <div className={`${styles['modal-content']} ${styles['pdf-viewer']}`}>
              {pdfError ? (
                <div className={styles['pdf-error']}>
                  <p>{pdfError}</p>
                </div>
              ) : !pdfUrl ? (
                <div className={styles['pdf-placeholder']}>
                  <p>No PDF available for this form.</p>
                </div>
              ) : (
                <div className={styles['iframe-container']} style={{ height: '70vh', width: '100%' }}>
                  <iframe 
                    src={pdfUrl} 
                    title="PDF Viewer" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 'none' }}
                    onError={() => setPdfError("Failed to load PDF file.")}
                  />
                </div>
              )}
            </div>
            <div className={styles['modal-footer']}>
              <button className={styles['cancel-button']} onClick={() => setIsPdfOpen(false)}>Close</button>
              {pdfUrl && !pdfError && (
                <button className={styles['download-button']} onClick={() => handleDownload({content: pdfUrl, title: selectedForm?.title || 'document.pdf'})}>
                  Download
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DownloadableFormsList;