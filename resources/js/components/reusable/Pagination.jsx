import React from 'react';
import styles from '../../../css/styles/reusable/Pagination.module.css'; // Updated to use .module.css

const Pagination = ({ loading, currentPage, setCurrentPage, totalItems, itemsPerPage }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  return (
    <div className={styles['pagination']}>
      <div className={styles['pagination-info']}>
        <p>
          {loading ? 'Loading...' :
            `Showing ${totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-${Math.min(currentPage * itemsPerPage, totalItems)} of ${totalItems} features`
          }
        </p>
      </div>
      <div className={styles['pagination-buttons']}>
        <button
          className={styles['filter-button']}
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1 || loading}
        >
          Previous
        </button>
        <button
          className={styles['filter-button']}
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