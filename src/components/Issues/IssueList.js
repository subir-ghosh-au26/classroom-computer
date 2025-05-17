// admin-portal/src/components/Issues/IssueList.js
import React from 'react';

const IssueList = ({ issues, onViewDetails }) => {
    if (!issues || issues.length === 0) {
        return <p className="empty-grid-message" style={{ textAlign: 'center', padding: '20px' }}>
            No issues found. Try adjusting the filters or wait for new reports.
        </p>;
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'open':
                return '#dc3545'; // Red
            case 'in_progress':
                return '#ffc107'; // Orange/Yellow
            case 'resolved':
                return '#28a745'; // Green
            default:
                return '#6c757d'; // Grey for other statuses
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString();
        } catch (error) {
            return 'Invalid Date';
        }
    };

    return (
        <div style={{ overflowX: 'auto' }}> {/* Make table horizontally scrollable on small screens */}
            <table>
                <thead style={{ backgroundColor: '#f5d2bc' }}>
                    <tr>
                        <th>Status</th>
                        <th>Computer</th>
                        <th>Classroom</th>
                        <th>Component</th>
                        <th>Description</th>
                        <th>Reported By</th>
                        <th>Reported Date</th>
                        <th>Resolved Date</th>
                        <th>Photos</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {issues.map((issue) => (
                        <tr key={issue._id}>
                            <td>
                                <span
                                    style={{
                                        color: getStatusColor(issue.status),
                                        fontWeight: 'bold',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        backgroundColor: `${getStatusColor(issue.status)}20`, // Lighter background
                                        display: 'inline-block',
                                        minWidth: '80px', // Ensure consistent width for status
                                        textAlign: 'center',
                                        textTransform: 'capitalize'
                                    }}
                                >
                                    {issue.status.replace('_', ' ')}
                                </span>
                            </td>
                            <td>{issue.computer?.assetTag || 'N/A'}</td>
                            <td>{issue.computer?.classroom?.name || 'N/A'}</td>
                            <td style={{ textTransform: 'capitalize' }}>{issue.component.replace('_', ' ')}</td>
                            <td>
                                {issue.description.substring(0, 70)}
                                {issue.description.length > 70 ? '...' : ''}
                            </td>
                            <td>{issue.reportedBy?.name || issue.reportedBy?.username || 'N/A'}</td>
                            <td>{formatDate(issue.reportedDate)}</td>
                            <td>{formatDate(issue.resolvedDate)}</td> {/* DISPLAY RESOLVED DATE */}
                            <td>{issue.photos && issue.photos.length > 0 ? `${issue.photos.length} image(s)` : 'No'}</td>
                            <td>
                                <button onClick={() => onViewDetails(issue)} className="btn btn-secondary">
                                    View/Update
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default IssueList;