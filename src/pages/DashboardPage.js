import React, { useEffect, useState } from 'react';
import { getIssues, getComputers, getClassrooms } from '../services/api';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
    const [stats, setStats] = useState({
        totalClassrooms: 0,
        totalComputers: 0,
        totalIssues: 0,
        openIssues: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [recentIssues, setRecentIssues] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                setError(null);
                const [classroomsRes, computersRes, issuesRes] = await Promise.all([
                    getClassrooms(),
                    getComputers(),
                    getIssues({ status: 'open', _sort: 'reportedDate', _order: 'desc', _limit: 5 }) // Example: get 5 recent open issues
                ]);

                const allIssuesRes = await getIssues(); // Get all issues for total count

                setStats({
                    totalClassrooms: classroomsRes.data.length,
                    totalComputers: computersRes.data.length,
                    totalIssues: allIssuesRes.data.length,
                    openIssues: issuesRes.data.length, // Or filter allIssuesRes.data for open
                });
                setRecentIssues(issuesRes.data.slice(0, 5)); // Ensure only 5 are shown
            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
                setError(err.response?.data?.message || "Could not load dashboard data.");
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) return <p>Loading dashboard...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div>
            <h1 style={{ display: 'flex', justifyContent: 'space-around', color: 'brown', marginTop: 0 }}>Classroom Computer Management System</h1>
            <h3 style={{ display: 'flex', justifyContent: 'space-around', color: '#010b36' }}>Admin Dashboard</h3>
            <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px' }}>
                <div style={statCardStyle}>
                    <h3>Total Classrooms</h3>
                    <p style={statNumberStyle}>{stats.totalClassrooms}</p>
                    <Link to="/classrooms">Manage Classrooms</Link>
                </div>
                <div style={statCardStyle}>
                    <h3>Total Computers</h3>
                    <p style={statNumberStyle}>{stats.totalComputers}</p>
                    <Link to="/computers">Manage Computers</Link>
                </div>
                <div style={statCardStyle}>
                    <h3>Total Issues</h3>
                    <p style={statNumberStyle}>{stats.totalIssues}</p>
                    <Link to="/issues">Manage Issues</Link>
                </div>
                <div style={statCardStyle}>
                    <h3>Open Issues</h3>
                    <p style={statNumberStyle}>{stats.openIssues}</p>
                    <Link to="/issues?status=open">View Open Issues</Link>
                </div>
            </div>

            <h2>Recent Open Issues</h2>
            {recentIssues.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Computer</th>
                            <th>Component</th>
                            <th>Description</th>
                            <th>Reported By</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentIssues.map(issue => (
                            <tr key={issue._id}>
                                <td>{issue.computer?.assetTag || 'N/A'}</td>
                                <td>{issue.component}</td>
                                <td>{issue.description.substring(0, 50)}...</td>
                                <td>{issue.reportedBy?.name || 'N/A'}</td>
                                <td>{new Date(issue.reportedDate).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No recent open issues.</p>
            )}
        </div>
    );
};

const statCardStyle = {
    border: '1px solid #ccc',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center',
    minWidth: '200px',
    backgroundColor: '#f5d2bc'
};

const statNumberStyle = {
    fontSize: '2em',
    fontWeight: 'bold',
    margin: '10px 0'
};

export default DashboardPage;