import React, { useState, useEffect } from 'react';

const ClassroomForm = ({ onSubmit, initialData, onCancel }) => {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (initialData) {
            setName(initialData.name || '');
            setLocation(initialData.location || '');
        } else {
            setName('');
            setLocation('');
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('Classroom name is required.');
            return;
        }
        setError('');
        onSubmit({ name, location });
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && <p className="error-message">{error}</p>}
            <div className="form-group">
                <label htmlFor="classroomName">Name:</label>
                <input
                    type="text"
                    id="classroomName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="classroomLocation">Location (Optional):</label>
                <input
                    type="text"
                    id="classroomLocation"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />
            </div>
            <button type="submit" className="btn-primary">
                {initialData ? 'Update' : 'Create'} Classroom
            </button>
            {onCancel && <button type="button" onClick={onCancel} className="btn-secondary" style={{ marginLeft: '10px' }}>Cancel</button>}
        </form>
    );
};

export default ClassroomForm;