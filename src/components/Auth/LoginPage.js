import React from 'react';
import LoginForm from './LoginPage';

const LoginPage = () => {
    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#fff' }}>
            <h2>Admin Login</h2>
            <LoginForm />
        </div>
    );
};

export default LoginPage;