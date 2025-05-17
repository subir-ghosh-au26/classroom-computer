import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav>
            <div>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/classrooms">Classrooms</Link>
                <Link to="/computers">Computers</Link>
                <Link to="/issues">Issues</Link>
            </div>
            {user && (
                <div>
                    <span>Welcome, {user.name || user.username}!</span>
                    <button onClick={handleLogout} style={{ marginLeft: '1rem' }}>Logout</button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;