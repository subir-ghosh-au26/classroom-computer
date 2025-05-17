import React from 'react';
import '../../assets/CardGrid.css';

const ClassroomList = ({ classrooms, computerCounts, onEdit, onDelete }) => {
    if (!classrooms || classrooms.length === 0) {
        return <p className="empty-grid-message">No classrooms found. Add a new classroom to get started!</p>;
    }

    return (
        <div className="card-grid">
            {classrooms.map((classroom) => (
                <div key={classroom._id} className="card">
                    {/* <div className="card-header"> */}
                    <h3 className="card-title">{classroom.name} </h3>
                    <h4 className="card-subtitle">{classroom.location}</h4>
                    {/* </div> */}
                    <div className="card-body">
                        {/* <p>
                            <strong>ID:</strong> {classroom._id}
                        </p> */}
                        <p>

                            <strong>Total Computers:</strong> {computerCounts && computerCounts[classroom._id] !== undefined ? computerCounts[classroom._id] : 'N/A'}
                        </p>
                        {/* <p>
                            <strong>Created:</strong> {new Date(classroom.createdAt).toLocaleDateString()}
                        </p> */}
                    </div>
                    <div className="card-actions">
                        <button onClick={() => onEdit(classroom)} className="btn btn-secondary">
                            Edit
                        </button>
                        <button onClick={() => onDelete(classroom._id)} className="btn btn-danger">
                            Delete
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ClassroomList;