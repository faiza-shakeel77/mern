import React, { useState } from 'react';

const DeleteAccount = () => {
    const [isDeleted, setIsDeleted] = useState(false);

    const handleDelete = () => {
        // Simulate account deletion logic
        setIsDeleted(true);
        // Redirect to the signup page after 2 seconds
        setTimeout(() => {
            window.location.href = '/register';
        }, 1000); // Adjust the timeout as needed
    };

    if (isDeleted) {
        return <div className="delete-account-message">Your account has been successfully deleted. Redirecting to signup page...</div>;
    }

    return (
        <div className="delete-account-container">
            <h2>Delete Account</h2>
            <p>Are you sure you want to delete your account? This action cannot be undone.</p>
            <button className="delete-account-button" onClick={handleDelete}>
                Delete My Account
            </button>
           
        </div>
    );
};

export default DeleteAccount;
