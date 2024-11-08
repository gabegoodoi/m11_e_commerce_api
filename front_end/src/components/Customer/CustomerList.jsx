import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Alert, Container, ListGroup } from 'react-bootstrap';
import axios from 'axios';

const CustomerList = ({ onCustomerSelect }) => {
    const [customers, setCustomers] = useState([]);
    const [selectedCustomerId, setSelectedCustomerId] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/customers');
                setCustomers(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to fetch customers. Please try again later.');
            }
        };

        fetchCustomers();
    }, []); // This effect runs only once when the component mounts

    const selectCustomer = (id) => {
        setSelectedCustomerId(id);
        onCustomerSelect(id);
    };

    return (
        <Container>
            {error && <Alert variant="danger">{error}</Alert>}
            <h3 className='mt-3 mb-3 text-center'>Customers</h3>
            <ListGroup>
                {customers.map(customer => (
                    <ListGroup.Item
                        key={customer.id}
                        className="d-flex justify-content-between align-items-center shadows-sm p-3 mb-3 bg-light-subtle rounded list-group-item "
                    >
                        <Link to={`/customer-details/${customer.id}`} className='text-primary'>
                            {customer.name}
                        </Link>
                        <Button variant='primary' size='sm'>
                            <Link to={`/customers/${customer.id}`} className="text-white text-decoration-none">
                                Edit
                            </Link>
                        </Button>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </Container>
    );
};

export default CustomerList;