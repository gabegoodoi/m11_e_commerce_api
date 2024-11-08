import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Alert, Container, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const AddProductForm = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === 'name') setName(value);

        if (name === 'price') {
            // Allow only valid price with up to 2 decimal places
            const regex = /^[0-9]+(\.[0-9]{0,2})?$/;
            if (value === '' || regex.test(value)) {
                setPrice(value);
            }
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!name) errors.name = 'Name is required';
        if (!price || isNaN(price)) errors.price = 'Price is required and must be a valid number';
        return errors;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const formErrors = validateForm();
        if (Object.keys(formErrors).length === 0) {
            setIsLoading(true);
            setError(null);
            const productData = { name: name.trim(), price: parseFloat(price).toFixed(2) };

            axios.post('http://127.0.0.1:5000/add-products', productData)
                .then(() => {
                    setName('');
                    setPrice('');
                    setErrors({});
                    setIsLoading(false);
                    setShowSuccessModal(true);
                })
                .catch(err => {
                    setIsLoading(false);
                    setError("Error submitting product data");
                });
        } else {
            setErrors(formErrors);
        }
    };

    const closeModal = () => {
        setShowSuccessModal(false);
        navigate('/products');
    };

    return (
        <Container>
            {isLoading && <Alert variant='info'>Submitting product data...</Alert>}
            <h3 className='mt-3 mb-3 text-center'>Product Form</h3>
            {error && <Alert variant='danger'>Error submitting product data: {error}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formGroupName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" name="name" placeholder="Enter product name (For example: Hammer)" value={name} onChange={handleChange} />
                    {errors.name && <div style={{ color: 'red' }}>{errors.name}</div>}
                </Form.Group>

                <Form.Group controlId="formGroupPrice">
                    <Form.Label>Price</Form.Label>
                    <Form.Control 
                        type="text" 
                        name="price" 
                        value={price} 
                        onChange={handleChange} 
                        placeholder="Enter price (For example: 12.25)"
                    />
                    {errors.price && <div style={{ color: 'red' }}>{errors.price}</div>}
                </Form.Group>

                <Button variant='primary' type='submit' className="mt-3">Submit</Button>
            </Form>

            <Modal show={showSuccessModal} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Success!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    The product has been successfully added.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={closeModal}>Close</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default AddProductForm;