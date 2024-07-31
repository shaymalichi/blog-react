import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ItemWindow from './ItemWindow';
import { TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Container, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Admin = ({ isUsername }) => {
    const [items, setItems] = useState([]);
    const [activities, setActivities] = useState([]);
    const [filter, setFilter] = useState("");

    useEffect(() => {
        fetchItems();
        fetchActivities();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await axios.get('/items');
            setItems(response.data);
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    };

    const fetchActivities = async () => {
        try {
            const response = await axios.get('/admin/activities');
            setActivities(response.data);
        } catch (error) {
            console.error('Error fetching activities:', error);
        }
    };

    const handleDeleteItem = async (itemId) => {
        try {
            await axios.delete(`/items/${itemId}`);
            setItems(prevItems => prevItems.filter(item => item.id !== itemId));
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const filteredActivities = activities.filter(activity => activity.username && activity.username.startsWith(filter));

    return (
        <Container>
            <Typography variant="h4" component="h2" gutterBottom>
                Admin Panel
            </Typography>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h5" component="h3">Activities</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <TextField
                        label="Filter by username"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date/Time</TableCell>
                                    <TableCell>Username</TableCell>
                                    <TableCell>Activity Type</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredActivities.map(activity => (
                                    <TableRow key={activity.id}>
                                        <TableCell>{activity.datetime}</TableCell>
                                        <TableCell>{activity.username}</TableCell>
                                        <TableCell>{activity.type}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </AccordionDetails>
            </Accordion>
            <Typography variant="h5" component="h3" gutterBottom>
                Manage Items
            </Typography>
            <ItemWindow items={items} isUserName={isUsername} onDeleteItem={handleDeleteItem} context="admin" />
        </Container>
    );
};

export default Admin;
