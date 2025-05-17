import React from 'react';
import '../../assets/CardGrid.css';

const ComputerList = ({ computers, onEdit, onDelete }) => {
    if (!computers || computers.length === 0) {
        return <p className="empty-grid-message">No computers found. Try adjusting filters or adding new computers.</p>;
    }

    const getStatusStyle = (status) => {
        return {
            fontWeight: 'bold',
            color: status === 'issue' ? '#dc3545' : '#28a745', // Red for issue, Green for working
            textTransform: 'capitalize'
        };
    };

    const getBrandImagePath = (make) => {
        const brand = make ? make.toLowerCase().trim() : 'generic';
        switch (brand) {
            case 'dell':
                return '/images/brands/dell.png';
            case 'hp':
            case 'hewlett-packard': // Handle variations
                return '/images/brands/hp.png';
            case 'lenovo':
                return '/images/brands/lenovo.png';
            case 'apple':
                return '/images/brands/apple.png';
            // Add more cases for other brands
            default:
                return '/images/brands/computer.png'; // Fallback image
        }
    };

    return (
        <div className="card-grid">
            {computers.map((computer) => (
                <div key={computer._id} className="card">
                    <div className="card-header">
                        <div className="card-image-container">
                            <img
                                src={process.env.PUBLIC_URL + getBrandImagePath(computer.make)}
                                alt={computer.make || 'Computer'}
                                className="card-image"
                            />
                        </div>
                        <div className="card-header-content">
                            <h3 className="card-title">{computer.assetTag}</h3>
                            {computer.classroom?.name && (
                                <p className="card-subtitle">
                                    {computer.classroom.name}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="card-body">
                        <p>
                            <strong>Make:</strong> {computer.make || 'N/A'}
                        </p>
                        <p>
                            <strong>Model:</strong> {computer.model || 'N/A'}
                        </p>
                        <p>
                            <strong>Status:</strong>{' '}
                            <span style={getStatusStyle(computer.status)}>
                                {computer.status}
                            </span>
                        </p>
                        {/* <p>
                            <strong>Last Updated:</strong> {new Date(computer.updatedAt).toLocaleDateString()}
                        </p> */}
                    </div>
                    <div className="card-actions">
                        <button onClick={() => onEdit(computer)} className="btn btn-secondary">
                            Edit
                        </button>
                        <button onClick={() => onDelete(computer._id)} className="btn btn-danger">
                            Delete
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ComputerList;