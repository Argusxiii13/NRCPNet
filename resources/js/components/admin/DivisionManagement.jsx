import React, { useState } from 'react';
import { Search, Filter, Edit, Trash2, Plus, ChevronDown } from 'lucide-react';
import '../../../css/styles/admin/DivisionManagement.css';
import DivisionModal from '../admin/DivisionModal';

const DivisionManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDivision, setCurrentDivision] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Sample data - will be replaced with API calls
  const [divisions, setDivisions] = useState([
    {
      id: 1,
      code: 'OP',
      name: 'Office of the President',
      hasSections: false,
      sections: []
    },
    {
      id: 2,
      code: 'OED',
      name: 'Office of the Executive Directory',
      hasSections: false,
      sections: []
    },
    {
      id: 3,
      code: 'FAD',
      name: 'Finance and Administrative Division',
      hasSections: true,
      sections: [
        { id: 1, name: 'Budget Section' },
        { id: 2, name: 'Accounting Section' },
        { id: 3, name: 'Cash Section' },
        { id: 4, name: 'HR Section' },
        { id: 5, name: 'Records Section' }
      ]
    },
    {
      id: 4,
      code: 'RDMD',
      name: 'Research and Development Management Division',
      hasSections: true,
      sections: [
        { id: 6, name: 'REMS' },
        { id: 7, name: 'TCDS' }
      ]
    },
    {
      id: 5,
      code: 'RIDD',
      name: 'Research Information and Data Division',
      hasSections: true,
      sections: [
        { id: 8, name: 'IDS' },
        { id: 9, name: 'LS' },
        { id: 10, name: 'MIS' }
      ]
    }
  ]);

  const handleOpenModal = (division = null) => {
    setCurrentDivision(division);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentDivision(null);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredDivisions = divisions.filter(division => 
    division.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    division.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteDivision = (id, e) => {
    e.stopPropagation();
    // In production, this would be an API call
    setDivisions(divisions.filter(division => division.id !== id));
  };

  return (
    <div className="division-management">
      <div className="panel">
        <div className="panel-header">
          <h2 className="text-2xl font-bold">Division Management</h2>
          <button 
            className="add-button"
            onClick={() => handleOpenModal()}
          >
            <Plus size={18} />
            <span>Add Division</span>
          </button>
        </div>
        
        <div className="panel-content">
          {/* Search and Filters */}
          <div className="filters-container">
            <div className="search-box">
              <Search size={20} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search divisions..." 
                className="search-input"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>

          {/* Divisions List */}
          <div className="divisions-list">
            {filteredDivisions.map((division) => (
              <div key={division.id} className="division-card">
                <div className="division-header">
                  <div className="division-title">
                    <span className="division-code">{division.code}</span>
                    <h3 className="division-name">{division.name}</h3>
                  </div>
                  <div className="division-actions">
                    <button 
                      className="edit-button"
                      onClick={() => handleOpenModal(division)}
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      className="delete-button"
                      onClick={(e) => handleDeleteDivision(division.id, e)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                
                {division.hasSections && (
                  <div className="sections-container">
                    <h4 className="sections-title">Sections</h4>
                    <div className="sections-list">
                      {division.sections.map((section) => (
                        <div key={section.id} className="section-item">
                          <span className="section-name">{section.name}</span>
                          <div className="section-actions">
                            <button className="edit-button-sm">
                              <Edit size={14} />
                            </button>
                            <button className="delete-button-sm">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                      <button className="add-section-button">
                        <Plus size={14} />
                        <span>Add Section</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Division Modal */}
      <DivisionModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        division={currentDivision}
      />
    </div>
  );
};

export default DivisionManagement;