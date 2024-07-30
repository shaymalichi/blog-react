import React from 'react';
import { useNavigate } from 'react-router-dom';

const ThankYou = () => {
    const navigate = useNavigate();

    return (
        <div>
            <h2>Thank You for Your Purchase!</h2>
            <button onClick={() => navigate('/')}>Return to Store</button>
        </div>
    );
};

export default ThankYou;
