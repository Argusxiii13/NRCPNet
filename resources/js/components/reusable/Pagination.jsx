import React from 'react';
import '../../../css/styles/reusable/Pagination.css'; // Import the CSS file for pagination styles

const Pagination = ({ loading, currentPage, setCurrentPage, totalItems, itemsPerPage }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  return (
    <div className="pagination">
      <div className="pagination-info">
        <p>
          {loading ? 'Loading...' :
            `Showing ${totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-${Math.min(currentPage * itemsPerPage, totalItems)} of ${totalItems} features`
          }
        </p>
      </div>
      <div className="pagination-buttons">
        <button
          className="filter-button"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1 || loading}
        >
          Previous
        </button>
        <button
          className="filter-button"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage * itemsPerPage >= totalItems || loading}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;