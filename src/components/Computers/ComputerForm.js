import React, { useState, useEffect } from 'react';

const ComputerForm = ({ onSubmit, initialData, classrooms, onCancel }) => {
    const [formData, setFormData] = useState({
        assetTag: '',
        classroomId: '', // Store as classroomId
        make: '',
        model: '',
        status: 'working', // Default status
    });
    const [error, setError] = useState('');

    useEffect(() => {
        if (initialData) {
            setFormData({
                assetTag: initialData.assetTag || '',
                classroomId: initialData.classroom?._id || initialData.classroom || '', // Handle populated or just ID
                make: initialData.make || '',
                model: initialData.model || '',
                status: initialData.status || 'working',
            });
        } else {
            // Reset form for new entry
            setFormData({
                assetTag: '',
                classroomId: classrooms && classrooms.length > 0 ? classrooms[0]._id : '', // Default to first classroom if available
                make: '',
                model: '',
                status: 'working',
            });
        }
    }, [initialData, classrooms]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors

        if (!formData.assetTag.trim()) {
            setError('Asset Tag is required.');
            return;
        }
        if (!formData.classroomId) {
            setError('Classroom selection is required.');
            return;
        }

        // Prepare data to send (ensure classroomId is sent correctly)
        const dataToSubmit = {
            assetTag: formData.assetTag,
            classroom: formData.classroomId, // Backend expects 'classroom' as the field name for the ID
            make: formData.make,
            model: formData.model,
            status: formData.status,
        };

        onSubmit(dataToSubmit);
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && <p className="error-message">{error}</p>}
            <div className="form-group">
                <label htmlFor="assetTag">Asset Tag (Unique ID for QR):</label>
                <input
                    type="text"
                    id="assetTag"
                    name="assetTag"
                    value={formData.assetTag}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="classroomId">Classroom:</label>
                <select
                    id="classroomId"
                    name="classroomId"
                    value={formData.classroomId}
                    onChange={handleChange}
                    required
                >
                    <option value="">-- Select a Classroom --</option>
                    {classrooms && classrooms.map((cr) => (
                        <option key={cr._id} value={cr._id}>
                            {cr.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="make">Make (e.g., Dell, HP):</label>
                <input
                    type="text"
                    id="make"
                    name="make"
                    value={formData.make}
                    onChange={handleChange}
                />
            </div>

            <div className="form-group">
                <label htmlFor="model">Model (e.g., Optiplex 3070):</label>
                <input
                    type="text"
                    id="model"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                />
            </div>

            <div className="form-group">
                <label htmlFor="status">Status:</label>
                <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                >
                    <option value="working">Working</option>
                    <option value="issue">Issue Reported</option>
                </select>
            </div>

            <button type="submit" className="btn-primary">
                {initialData ? 'Update Computer' : 'Create Computer'}
            </button>
            {onCancel && (
                <button type="button" onClick={onCancel} className="btn-secondary" style={{ marginLeft: '10px' }}>
                    Cancel
                </button>
            )}
        </form>
    );
};

export default ComputerForm;