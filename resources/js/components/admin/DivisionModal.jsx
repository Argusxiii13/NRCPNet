// ... other imports
import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import axios from 'axios';

const DivisionModal = ({ isOpen, onClose, division, onDivisionUpdated }) => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    hasSections: false,
    sections: []
  });

  const [newSection, setNewSection] = useState('');

  useEffect(() => {
    if (division) {
      setFormData({
        code: division.code || '',
        name: division.name || '',
        hasSections: division.has_sections || false,
        sections: division.sections || []
      });
    } else {
      setFormData({
        code: '',
        name: '',
        hasSections: false,
        sections: []
      });
    }
  }, [division, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSectionInputChange = (e) => {
    setNewSection(e.target.value);
  };

  const addSection = () => {
    if (newSection.trim()) {
      setFormData({
        ...formData,
        sections: [
          ...formData.sections,
          { id: Date.now(), name: newSection.trim() } // Temporary ID
        ]
      });
      setNewSection('');
    }
  };

  const removeSection = (id) => {
    setFormData({
      ...formData,
      sections: formData.sections.filter(section => section.id !== id)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare data for submission
    const submissionData = {
        code: formData.code,
        name: formData.name,
        has_sections: formData.hasSections,
        sections: formData.hasSections ? formData.sections.map(section => ({ name: section.name })) : [],
    };

    try {
        const response = division 
            ? await axios.put(`/api/divisions/${division.id}`, submissionData)
            : await axios.post('/api/divisions', submissionData);

        console.log('Success:', response.data);
        onDivisionUpdated(); // Call this to refresh the divisions
        onClose(); // Close modal after success
    } catch (error) {
        console.error('Error submitting:', error.response.data);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3 className="modal-title">
            {division ? 'Edit Division' : 'Add New Division'}
          </h3>
          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-content">
            <div className="form-group">
              <label htmlFor="code">Division Code</label>
              <input
                type="text"
                id="code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="e.g. OP, FAD, RIDD"
                className="form-input"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="name">Division Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full division name"
                className="form-input"
                required
              />
            </div>
            
            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="hasSections"
                name="hasSections"
                checked={formData.hasSections}
                onChange={handleChange}
                className="form-checkbox"
              />
              <label htmlFor="hasSections">This division has sections</label>
            </div>
            
            {formData.hasSections && (
              <div className="sections-form">
                <h4>Sections</h4>
                
                <div className="add-section-form">
                  <input
                    type="text"
                    value={newSection}
                    onChange={handleSectionInputChange}
                    placeholder="New section name"
                    className="section-input"
                  />
                  <button 
                    type="button" 
                    className="add-section-btn"
                    onClick={addSection}
                  >
                    <Plus size={16} />
                    Add
                  </button>
                </div>
                
                <div className="sections-list-modal">
                  {formData.sections.length > 0 ? (
                    formData.sections.map((section) => (
                      <div key={section.id} className="section-item-modal">
                        <span>{section.name}</span>
                        <button 
                          type="button"
                          className="remove-section-btn"
                          onClick={() => removeSection(section.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="no-sections">No sections added yet</p>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="modal-footer">
            <button 
              type="button" 
              className="cancel-button"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="save-button"
            >
              {division ? 'Update Division' : 'Create Division'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DivisionModal;