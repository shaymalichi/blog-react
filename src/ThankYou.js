import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button } from '@mui/material';

const ThankYou = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Typography variant="h4" gutterBottom>
                Thank You for Your Purchase!
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/')}
                style={{ marginTop: '1rem' }}
            >
                Return to Store
            </Button>
        </Container>
    );
};

export default ThankYou;
