// src/pages/ComputersPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { getComputers, createComputer, updateComputer, deleteComputer, getClassrooms } from '../services/api';
import ComputerList from '../components/Computers/ComputerList'; // Create this
import ComputerForm from '../components/Computers/ComputerForm'; // Create this
import Modal from '../components/UI/Modal';

const ComputersPage = () => {
    const [computers, setComputers] = useState([]);
    const [classrooms, setClassrooms] = useState([]); // For dropdown in form
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingComputer, setEditingComputer] = useState(null);
    const [filterClassroomId, setFilterClassroomId] = useState('');


    const fetchClassroomsData = useCallback(async () => {
        try {
            const res = await getClassrooms();
            setClassrooms(res.data);
        } catch (err) {
            console.error("Failed to fetch classrooms for filter/form", err);
            // Handle error appropriately, maybe set an error state for classrooms
        }
    }, []);


    const fetchComputers = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const params = {};
            if (filterClassroomId) {
                params.classroomId = filterClassroomId;
            }
            const response = await getComputers(params);
            setComputers(response.data);
        } catch (err) {
            console.error("Failed to fetch computers", err);
            setError(err.response?.data?.message || "Could not load computers.");
        } finally {
            setLoading(false);
        }
    }, [filterClassroomId]);

    useEffect(() => {
        fetchClassroomsData();
        fetchComputers();
    }, [fetchComputers, fetchClassroomsData]);


    const handleFormSubmit = async (formData) => {
        try {
            setError(null);
            if (editingComputer) {
                await updateComputer(editingComputer._id, formData);
            } else {
                await createComputer(formData);
            }
            setShowModal(false);
            setEditingComputer(null);
            fetchComputers();
        } catch (err) {
            console.error("Failed to save computer", err);
            setError(err.response?.data?.message || "Failed to save computer.");
            if (!showModal && editingComputer) setShowModal(true);
        }
    };

    const handleEdit = (computer) => {
        setEditingComputer(computer);
        setError(null);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this computer? This may fail if it has open issues.')) {
            try {
                setError(null);
                await deleteComputer(id);
                fetchComputers();
            } catch (err) {
                console.error("Failed to delete computer", err);
                setError(err.response?.data?.message || "Failed to delete computer.");
            }
        }
    };

    const openAddModal = () => {
        setEditingComputer(null);
        setError(null);
        setShowModal(true);
    };

    if (loading && computers.length === 0 && classrooms.length === 0) return <p>Loading computers and classroom data...</p>;

    return (
        <div>
            <h1>Manage Computers</h1>
            <div className="form-group" style={{ maxWidth: '300px', marginBottom: '20px' }}>
                <label htmlFor="filterClassroom">Filter by Classroom:</label>
                <select
                    id="filterClassroom"
                    value={filterClassroomId}
                    onChange={(e) => setFilterClassroomId(e.target.value)}
                >
                    <option value="">All Classrooms</option>
                    {classrooms.map(cr => (
                        <option key={cr._id} value={cr._id}>{cr.name}</option>
                    ))}
                </select>
            </div>
            <button onClick={openAddModal} className="btn-primary" style={{ marginBottom: '20px' }}>
                Add New Computer
            </button>

            {error && <p className="error-message" style={{ border: '1px solid red', padding: '10px', backgroundColor: '#ffe0e0' }}>{error}</p>}
            {loading && <p>Refreshing data...</p>}

            <ComputerList computers={computers} onEdit={handleEdit} onDelete={handleDelete} /> {/* Create this component */}

            <Modal title={editingComputer ? "Edit Computer" : "Add New Computer"} show={showModal} onClose={() => { setShowModal(false); setEditingComputer(null); setError(null) }}>
                <ComputerForm
                    onSubmit={handleFormSubmit}
                    initialData={editingComputer}
                    classrooms={classrooms} /* Pass classrooms for dropdown */
                    onCancel={() => { setShowModal(false); setEditingComputer(null); setError(null) }}
                />
                {error && showModal && <p className="error-message" style={{ marginTop: '10px' }}>{error}</p>}
            </Modal>
        </div>
    );
};

export default ComputersPage;