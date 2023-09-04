import React from "react";
import "./Pagination.css"; // You can create a CSS file for styling

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  
    return (
    <div className="pagination">
        <button
            className="pagination-button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
        >
            Previous
        </button>
        <span className="page-number"><strong>Page {currentPage} </strong></span>
        <button
            className="pagination-button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
        >
            Next
        </button>
    </div>
    );
};

export default Pagination;
