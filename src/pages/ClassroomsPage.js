// admin-portal/src/pages/ClassroomsPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { getClassrooms, createClassroom, updateClassroom, deleteClassroom, getComputers } from '../services/api'; // Add getComputers
import ClassroomList from '../components/Classrooms/ClassroomList';
import ClassroomForm from '../components/Classrooms/ClassroomForm';
import Modal from '../components/UI/Modal';

const ClassroomsPage = () => {
    const [classrooms, setClassrooms] = useState([]);
    const [computerCounts, setComputerCounts] = useState({}); // Store counts here
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingClassroom, setEditingClassroom] = useState(null);

    const fetchClassroomsAndCounts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const [classroomsResponse, computersResponse] = await Promise.all([
                getClassrooms(),
                getComputers() // Fetch all computers
            ]);

            const fetchedClassrooms = classroomsResponse.data;
            const allComputers = computersResponse.data;

            // Calculate computer counts
            const counts = {};
            fetchedClassrooms.forEach(cr => {
                counts[cr._id] = allComputers.filter(comp => comp.classroom === cr._id || comp.classroom?._id === cr._id).length;
            });

            setClassrooms(fetchedClassrooms);
            setComputerCounts(counts);

        } catch (err) {
            console.error("Failed to fetch data", err);
            setError(err.response?.data?.message || "Could not load data.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchClassroomsAndCounts();
    }, [fetchClassroomsAndCounts]);

    const handleFormSubmit = async (formData) => {
        try {
            setError(null);
            if (editingClassroom) {
                await updateClassroom(editingClassroom._id, formData);
            } else {
                await createClassroom(formData);
            }
            setShowModal(false);
            setEditingClassroom(null);
            fetchClassroomsAndCounts(); // Refresh list and counts
        } catch (err) {
            // ... error handling
            console.error("Failed to save classroom", err);
            setError(err.response?.data?.message || "Failed to save classroom.");
            if (!showModal && editingClassroom) setShowModal(true);
        }
    };

    const handleDelete = async (id) => {
        // ... (confirm and delete logic)
        if (window.confirm('Are you sure you want to delete this classroom? This action might fail if computers are assigned to it.')) {
            try {
                setError(null);
                await deleteClassroom(id);
                fetchClassroomsAndCounts(); // Refresh list and counts
            } catch (err) {
                console.error("Failed to delete classroom", err);
                setError(err.response?.data?.message || "Failed to delete classroom. It might have computers assigned.");
            }
        }
    };

    const handleEdit = (classroom) => {
        setEditingClassroom(classroom);
        setError(null);
        setShowModal(true);
    };

    const openAddModal = () => {
        setEditingClassroom(null);
        setError(null);
        setShowModal(true);
    };


    if (loading && classrooms.length === 0) return <p>Loading classrooms...</p>;


    return (
        <div>
            <h1>Manage Classrooms</h1>
            <button onClick={openAddModal} className="btn-primary" style={{ marginBottom: '20px' }}>
                Add New Classroom
            </button>

            {error && <p className="error-message" style={{ border: '1px solid red', padding: '10px', backgroundColor: '#ffe0e0' }}>{error}</p>}
            {loading && <p>Refreshing data...</p>}

            {/* Pass computerCounts to ClassroomList */}
            <ClassroomList
                classrooms={classrooms}
                computerCounts={computerCounts}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <Modal title={editingClassroom ? "Edit Classroom" : "Add New Classroom"} show={showModal} onClose={() => { setShowModal(false); setEditingClassroom(null); setError(null) }}>
                <ClassroomForm
                    onSubmit={handleFormSubmit}
                    initialData={editingClassroom}
                    onCancel={() => { setShowModal(false); setEditingClassroom(null); setError(null) }}
                />
                {error && showModal && <p className="error-message" style={{ marginTop: '10px' }}>{error}</p>}
            </Modal>
        </div>
    );
};

export default ClassroomsPage;