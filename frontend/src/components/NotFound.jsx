import React from 'react';
import {Link} from 'react-router-dom';

const NotFound = () => {
    return (
        <div style={{ textAlign: 'center', padding: '100px'}}>
            <h1>404 - Page Not Found</h1>
            <p>OOPs! The page you are looking for doesn't exist.</p>
            <Link to="/" style={{textDecoration: 'underline',color:'blue'}}>
                Go back to Home
            </Link>
        </div>
    );
};

export default NotFound;