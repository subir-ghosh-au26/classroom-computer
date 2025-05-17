// admin-portal/src/pages/Auth/LoginPage.js
import React from 'react';
import LoginForm from '../../components/Auth/LoginForm'; // The actual form fields and logic

const LoginPage = () => {
    return (
        // Basic styling for the login page container
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh', // Take full viewport height
            padding: '20px',
            backgroundColor: '#f0f2f5' // A light background color for the page
        }}>
            <div style={{
                padding: '30px 40px',
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                width: '100%',
                maxWidth: '400px', // Max width of the login box
                textAlign: 'center' // Center the heading
            }}>
                <h2 style={{ marginBottom: '25px', color: '#333' }}>Admin Portal Login</h2>
                <LoginForm />
            </div>
        </div>
    );
};

export default LoginPage;