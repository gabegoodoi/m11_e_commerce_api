import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Container, Modal } from 'react-bootstrap';

const ProductEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState({ name: '', price: '' });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(() => {
        axios.get(`http://127.0.0.1:5000/products/${id}`)
            .then(response => {
                setProduct(response.data);
            })
            .catch(err => {
                setError('Error fetching product details');
            });
    }, [id]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        // for the price field validate for up to 2 decimal places
        if (name === 'price') {
            const regex = /^[0-9]+(\.[0-9]{0,2})?$/;
            if (value === '' || regex.test(value)) {
                setProduct(prevProduct => ({
                    ...prevProduct,
                    [name]: value
                }));
            }
        } else {
            setProduct(prevProduct => ({
                ...prevProduct,
                [name]: value
            }));
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!product.name) errors.name = 'Name is required';
        if (!product.price) errors.price = 'Price is required';
        return errors;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const formErrors = validateForm();
        if (Object.keys(formErrors).length === 0) {
            setIsLoading(true);
            setError(null);

            axios.put(`http://127.0.0.1:5000/products/${id}`, product)
                .then(() => {
                    setIsLoading(false);
                    setShowSuccessModal(true);
                })
                .catch(err => {
                    setIsLoading(false);
                    setError('Error submitting product data');
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
            {isLoading && <Alert variant='info'>Updating product data...</Alert>}
            {error && <Alert variant='danger'>{error}</Alert>}
            <h1>Edit Product</h1>

            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formGroupName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control 
                        type="text" 
                        name="name" 
                        value={product.name} 
                        onChange={handleChange} 
                    />
                    {errors.name && <div style={{ color: 'red' }}>{errors.name}</div>}
                </Form.Group>

                <Form.Group controlId="formGroupPrice">
                    <Form.Label>Price</Form.Label>
                    <Form.Control 
                        type="text" 
                        name="price" 
                        value={product.price} 
                        onChange={handleChange} 
                        placeholder="Enter price (e.g., 12.34)"
                    />
                    {errors.price && <div style={{ color: 'red' }}>{errors.price}</div>}
                </Form.Group>

                <Button variant='primary' type='submit'>Save Changes</Button>
            </Form>

            <Modal show={showSuccessModal} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Success!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    The product details have been successfully updated.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={closeModal} className="mt-3">Close</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ProductEdit;