import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Container, Modal } from 'react-bootstrap';

const CustomerEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [customer, setCustomer] = useState({ name: '', email: '', phone: '' }); // sets customer as an object with 3 keys (empty for now)
    const [errors, setErrors] = useState({}); // allows storage of errors for each form field later on, not just one error
    const [isLoading, setIsLoading] = useState(false); // used to track if form msubmission is actively running
    const [error, setError] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(() => {
        axios.get(`http://127.0.0.1:5000/customers/${id}`)
            .then(response => {
                setCustomer(response.data);
            })
            .catch(err => {
                setError('Error fetching customer details');
            });
    }, [id]);

    // Handle form changes
    const handleChange = (event) => { // arrow function that takes an event as it's argument
        const { name, value } = event.target; // destructures the input field
        setCustomer(prevState => ({ // arrow function that updates the customer object variable by updating the new values in the keys that match the name
            ...prevState,
            [name]: value
        }));
    };

    // Validate form fields
    const validateForm = () => {
        const errors = {};
        if (!customer.name) errors.name = 'Name is required';
        if (!customer.email) errors.email = 'Email is required';
        if (!customer.phone) errors.phone = 'Phone number is required';
        return errors;
    };

    // Handle form submission for updating customer details
    const handleSubmit = (event) => {
        event.preventDefault(); // prevents the page refreshing automatically
        const formErrors = validateForm();
        if (Object.keys(formErrors).length === 0) { // loop through the formErrors content and if it is 0 set loading to true and error to null
            setIsLoading(true);
            setError(null);

            // Send PUT request to update customer details through a promise chain
            axios.put(`http://127.0.0.1:5000/customers/${id}`, customer)
                .then(() => {
                    setIsLoading(false);
                    setShowSuccessModal(true);
                })
                .catch(err => {
                    setIsLoading(false);
                    setError('Error submitting customer data');
                });
        } else {
            setErrors(formErrors);
        }
    };

    // Close success modal and go to customers list page
    const closeModal = () => {
        setShowSuccessModal(false);
        navigate('/customers');
    };

    return (
        <Container>
            {isLoading && <Alert variant='info'>Updating customer data...</Alert>}
            {error && <Alert variant='danger'>{error}</Alert>}
            <h1>Edit Customer</h1>

            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formGroupName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control 
                        type="text" 
                        name="name" 
                        value={customer.name} 
                        onChange={handleChange} 
                    />
                    {errors.name && <div style={{ color: 'red' }}>{errors.name}</div>}
                </Form.Group>

                <Form.Group controlId="formGroupEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control 
                        type="email" 
                        name="email" 
                        value={customer.email} 
                        onChange={handleChange} 
                    />
                    {errors.email && <div style={{ color: 'red' }}>{errors.email}</div>}
                </Form.Group>

                <Form.Group controlId="formGroupPhone">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control 
                        type="tel" 
                        name="phone" 
                        value={customer.phone} 
                        onChange={handleChange} 
                    />
                    {errors.phone && <div style={{ color: 'red' }}>{errors.phone}</div>}
                </Form.Group>

                <Button variant='primary' type='submit'>Save Changes</Button>
            </Form>

            {/* hidden modal that appears when showSuccessModal is triggered */}
            <Modal show={showSuccessModal} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Success!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    The customer details have been successfully updated.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={closeModal} className="mt-3">Close</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default CustomerEdit;