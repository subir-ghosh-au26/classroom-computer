// admin-portal/src/pages/IssuesPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { getIssues, updateIssue, getClassrooms, getComputers } from '../services/api';
import IssueList from '../components/Issues/IssueList';
import IssueDetailModal from '../components/Issues/IssueDetailModal';
import * as XLSX from 'xlsx'; // Import the xlsx library

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const IssuesPage = () => {
    const query = useQuery();
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedIssue, setSelectedIssue] = useState(null);

    const [filterStatus, setFilterStatus] = useState(query.get('status') || '');
    const [filterClassroomId, setFilterClassroomId] = useState('');
    const [filterComputerId, setFilterComputerId] = useState('');

    const [classrooms, setClassrooms] = useState([]);
    const [computersInSelectedClassroom, setComputersInSelectedClassroom] = useState([]);

    const fetchFilterData = useCallback(async () => {
        try {
            const classRes = await getClassrooms();
            setClassrooms(classRes.data);
            if (filterClassroomId) {
                const compRes = await getComputers({ classroomId: filterClassroomId });
                setComputersInSelectedClassroom(compRes.data);
            } else {
                setComputersInSelectedClassroom([]);
            }
        } catch (err) {
            console.error("Failed to fetch filter data (classrooms/computers)", err);
        }
    }, [filterClassroomId]);

    const fetchIssues = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const params = {};
            if (filterStatus) params.status = filterStatus;
            if (filterClassroomId) params.classroomId = filterClassroomId;
            if (filterComputerId) params.computerId = filterComputerId;

            const response = await getIssues(params);
            setIssues(response.data);
        } catch (err) {
            console.error("Failed to fetch issues", err);
            setError(err.response?.data?.message || "Could not load issues.");
        } finally {
            setLoading(false);
        }
    }, [filterStatus, filterClassroomId, filterComputerId]);

    useEffect(() => {
        fetchFilterData();
    }, [fetchFilterData]);

    useEffect(() => {
        fetchIssues();
    }, [fetchIssues]);

    const handleUpdateIssue = async (issueId, updateData) => {
        try {
            setError(null);
            await updateIssue(issueId, updateData);
            setShowDetailModal(false);
            setSelectedIssue(null);
            fetchIssues();
        } catch (err) {
            console.error("Failed to update issue", err);
            setError(err.response?.data?.message || "Failed to update issue.");
            if (!showDetailModal && selectedIssue) setShowDetailModal(true);
        }
    };

    const handleViewDetails = (issue) => {
        setSelectedIssue(issue);
        setError(null);
        setShowDetailModal(true);
    };

    const handleClassroomFilterChange = async (e) => {
        const newClassroomId = e.target.value;
        setFilterClassroomId(newClassroomId);
        setFilterComputerId('');
        if (newClassroomId) {
            try {
                const res = await getComputers({ classroomId: newClassroomId });
                setComputersInSelectedClassroom(res.data);
            } catch (err) {
                console.error("Failed to fetch computers for selected classroom", err);
                setComputersInSelectedClassroom([]);
            }
        } else {
            setComputersInSelectedClassroom([]);
        }
    };

    // --- EXPORT TO EXCEL FUNCTIONALITY ---
    const handleExportToExcel = () => {
        if (issues.length === 0) {
            alert("No issues to export!");
            return;
        }

        // 1. Prepare data for the worksheet
        const dataToExport = issues.map(issue => ({
            'Status': issue.status.replace('_', ' '),
            'Computer Asset Tag': issue.computer?.assetTag || 'N/A',
            'Classroom': issue.computer?.classroom?.name || 'N/A',
            'Component': issue.component.replace('_', ' '),
            'Description': issue.description,
            // 'Reported By (Username)': issue.reportedBy?.username || 'N/A',
            'Reported By (Name)': issue.reportedBy?.name || 'N/A',
            'Reported Date': issue.reportedDate ? new Date(issue.reportedDate).toLocaleDateString() : 'N/A',
            'Resolved Date': issue.resolvedDate ? new Date(issue.resolvedDate).toLocaleDateString() : 'N/A',
            'Admin Notes': issue.notes || '',
            'Photos Count': issue.photos?.length || 0,
            'Issue ID': issue._id
            // Add more fields if needed
        }));

        // 2. Create a new worksheet
        const worksheet = XLSX.utils.json_to_sheet(dataToExport);

        // 3. Create a new workbook
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Issues Report"); // "Issues Report" is the sheet name

        // 4. Auto-fit column widths (optional, but nice)
        // This is a bit simplistic, more advanced logic might be needed for perfect fitting
        const columnWidths = [];
        if (dataToExport.length > 0) {
            Object.keys(dataToExport[0]).forEach(key => {
                // Get header length or max data length in column
                let maxLength = key.length;
                dataToExport.forEach(row => {
                    const cellValue = String(row[key] || "");
                    if (cellValue.length > maxLength) {
                        maxLength = cellValue.length;
                    }
                });
                columnWidths.push({ wch: Math.min(maxLength + 2, 50) }); // Max width 50 chars
            });
            worksheet['!cols'] = columnWidths;
        }


        // 5. Generate Excel file and trigger download
        const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
        XLSX.writeFile(workbook, `Issues_Report_${date}.xlsx`);
    };
    // --- END EXPORT TO EXCEL ---


    if (loading && issues.length === 0) return <p>Loading issues...</p>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>Manage Issues</h1>
                <button onClick={handleExportToExcel} className="btn btn-primary"> {/* EXPORT BUTTON */}
                    Export to Excel
                </button>
            </div>

            {/* Filter UI */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '20px', padding: '15px', border: '1px solid #eee', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
                <div className="form-group">
                    <label htmlFor="filterStatus">Status:</label>
                    <select id="filterStatus" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="form-control">
                        <option value="">All</option>
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="filterClassroom">Classroom:</label>
                    <select id="filterClassroom" value={filterClassroomId} onChange={handleClassroomFilterChange} className="form-control">
                        <option value="">All</option>
                        {classrooms.map(cr => <option key={cr._id} value={cr._id}>{cr.name}</option>)}
                    </select>
                </div>
                {filterClassroomId && (
                    <div className="form-group">
                        <label htmlFor="filterComputer">Computer:</label>
                        <select id="filterComputer" value={filterComputerId} onChange={(e) => setFilterComputerId(e.target.value)} disabled={computersInSelectedClassroom.length === 0} className="form-control">
                            <option value="">All in Classroom</option>
                            {computersInSelectedClassroom.map(comp => <option key={comp._id} value={comp._id}>{comp.assetTag}</option>)}
                        </select>
                    </div>
                )}
            </div>

            {error && <p className="error-message" style={{ border: '1px solid red', padding: '10px', backgroundColor: '#ffe0e0' }}>{error}</p>}
            {loading && <p>Refreshing data...</p>}

            <IssueList issues={issues} onViewDetails={handleViewDetails} />

            {selectedIssue && (
                <IssueDetailModal
                    show={showDetailModal}
                    issue={selectedIssue}
                    onClose={() => { setShowDetailModal(false); setSelectedIssue(null); setError(null) }}
                    onUpdate={handleUpdateIssue}
                    updateError={error}
                />
            )}
        </div>
    );
};

export default IssuesPage;