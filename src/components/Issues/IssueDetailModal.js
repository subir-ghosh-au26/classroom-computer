import React, { useState, useEffect } from 'react';
import Modal from '../UI/Modal'; // Assuming you have this general Modal component

const IssueDetailModal = ({ show, issue, onClose, onUpdate, updateError }) => {
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [component, setComponent] = useState(''); // For admin editing
  const [description, setDescription] = useState(''); // For admin editing
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_API_URL?.replace('/api', ''); // To construct image URLs

  useEffect(() => {
    if (issue) {
      setStatus(issue.status || 'open');
      setNotes(issue.notes || '');
      setComponent(issue.component || '');
      setDescription(issue.description || '');
    }
  }, [issue]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const updateData = { status, notes, component, description };
    await onUpdate(issue._id, updateData); // onUpdate is passed from IssuesPage
    setIsSubmitting(false);
    // Modal closure is handled by IssuesPage based on success/failure of onUpdate
  };

  if (!show || !issue) {
    return null;
  }

  return (
    <Modal show={show} onClose={onClose} title={`Issue Details: ${issue.computer?.assetTag || 'N/A'}`}>
      <div>
        <h4>Issue Information:</h4>
        <p><strong>Computer:</strong> {issue.computer?.assetTag} (In Classroom: {issue.computer?.classroom?.name || 'N/A'})</p>
        <p><strong>Reported By:</strong> {issue.reportedBy?.name || issue.reportedBy?.username}</p>
        <p><strong>Reported Date:</strong> {new Date(issue.reportedDate).toLocaleString()}</p>
        <p><strong>Original Component:</strong> <span style={{ textTransform: 'capitalize' }}>{issue.component.replace('_', ' ')}</span></p>
        <p><strong>Original Description:</strong></p>
        <p style={{ whiteSpace: 'pre-wrap', background: '#f9f9f9', padding: '10px', border: '1px solid #eee' }}>{issue.description}</p>

        {issue.photos && issue.photos.length > 0 && (
          <div>
            <strong>Photos:</strong>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
              {issue.photos.map((photoUrl, index) => (
                <a key={index} href={`${API_BASE_URL}${photoUrl}`} target="_blank" rel="noopener noreferrer">
                  <img
                    src={`${API_BASE_URL}${photoUrl}`} // Assumes photos are served from backend /uploads folder
                    alt={`Issue evidence ${index + 1}`}
                    style={{ width: '100px', height: '100px', objectFit: 'cover', border: '1px solid #ddd' }}
                  />
                </a>
              ))}
            </div>
          </div>
        )}
        <hr style={{ margin: '20px 0' }} />

        <h4>Update Issue (Admin):</h4>
        <form onSubmit={handleSubmit}>
          {updateError && <p className="error-message">{updateError}</p>}
          <div className="form-group">
            <label htmlFor="issueStatus">Status:</label>
            <select id="issueStatus" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="issueComponent">Component (Admin Edit):</label>
            <select id="issueComponent" name="component" value={component} onChange={(e) => setComponent(e.target.value)}>
              <option value="cpu">CPU</option>
              <option value="mouse">Mouse</option>
              <option value="keyboard">Keyboard</option>
              <option value="monitor">Monitor</option>
              <option value="power_cable">Power Cable</option>
              <option value="software">Software</option>
              <option value="network">Network</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="issueDescription">Description (Admin Edit):</label>
            <textarea
              id="issueDescription"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="adminNotes">Admin Notes:</label>
            <textarea
              id="adminNotes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="4"
              placeholder="Add notes about resolution or steps taken..."
            ></textarea>
          </div>
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update Issue'}
          </button>
          <button type="button" onClick={onClose} className="btn-secondary" style={{ marginLeft: '10px' }} disabled={isSubmitting}>
            Cancel
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default IssueDetailModal;