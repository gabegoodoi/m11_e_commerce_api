import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, Alert, Container, Modal } from 'react-bootstrap';


const AddCustomerForm = () => {
    const navigate = useNavigate(); // Initialize navigate using useNavigate hook
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showPhoneErrorModal, setShowPhoneErrorModal] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === 'name') setName(value);
        if (name === 'email') setEmail(value);
        if (name === 'phone') setPhone(value);
    };
    const validateForm = () => {
        const errors = {};
        if (!name) errors.name = 'Name is required';
        if (!email) errors.email = 'Email is required';
        if (!phone) errors.phone = 'Phone number is required';
        return errors;
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        // Check if phone number contains only digits
        const phonePattern = /^\d+$/;
        if (!phonePattern.test(phone)) {
            setShowPhoneErrorModal(true);
            return;
        }

        const formErrors = validateForm();
        if (Object.keys(formErrors).length === 0) {
            setIsLoading(true);
            setError(null);
            const customerData = { name: name.trim(), email: email.trim(), phone: phone.trim() };

            axios.post('http://127.0.0.1:5000/add-customers', customerData)
                .then(() => {
                    setName('');
                    setEmail('');
                    setPhone('');
                    setErrors({});
                    setIsLoading(false);
                    setShowSuccessModal(true);
                })
                .catch(err => {
                    setIsLoading(false);
                    setError("Error submitting customer data");
                });
        } else {
            setErrors(formErrors);
        }
    };

    // Close modals
    const closeModal = () => setShowSuccessModal(false);
    const closePhoneErrorModal = () => setShowPhoneErrorModal(false);

    return (
        <Container>
            {isLoading && <Alert variant='info'>Submitting customer data...</Alert>}
            <h3 className='mt-3 mb-3 text-center'>Customer Form</h3>
            {error && <Alert variant='danger'>Error submitting customer data: {error}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formGroupName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" name="name" value={name}  placeholder="Enter name (For example: Lebron James)" onChange={handleChange} />
                    {errors.name && <div style={{ color: 'red' }}>{errors.name}</div>}
                </Form.Group>

                <Form.Group controlId="formGroupEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" name="email" placeholder="Enter email address (For example: legoat@lakers.com)" value={email} onChange={handleChange} />
                    {errors.email && <div style={{ color: 'red' }}>{errors.email}</div>}
                </Form.Group>

                <Form.Group controlId="formGroupPhone">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control type="tel" name="phone" placeholder="Enter phone number (For example: 2366232323)" value={phone} onChange={handleChange} />
                    {errors.phone && <div style={{ color: 'red' }}>{errors.phone}</div>}
                </Form.Group>

                <Button variant='primary' type='submit' className="mt-3">Submit</Button>
            </Form>

            <Modal show={showSuccessModal} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Success!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    The customer has been successfully added.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={closeModal}>Close</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showPhoneErrorModal} onHide={closePhoneErrorModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Invalid Phone Number</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Did not recognize phone number, must be numerical digits.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={closePhoneErrorModal}>Close</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default AddCustomerForm;