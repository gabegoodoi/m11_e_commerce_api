import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Alert, Container, Modal } from 'react-bootstrap';

const AddOrderForm = ({ navigate }) => {

    // started by getting the date for a better UX in the form
    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [customerId, setCustomerId] = useState(''); // State for customer ID
    const [customers, setCustomers] = useState([]); // State for customer
    const [productIds, setProductIds] = useState(['']); // State for array of product IDs
    const [date, setDate] = useState(getTodayDate); // State for date preloaded with today
    const [errors, setErrors] = useState({}); // State for array of errors
    const [isLoading, setIsLoading] = useState(false); // State for isLoading
    const [showSuccessModal, setShowSuccessModal] = useState(false); // Modal for success
    const [products, setProducts] = useState([]); // State for prouduct array
    const [error, setError] = useState(null); // State for error
    const [invalidProductIds, setInvalidProductIds] = useState([]); // Store invalid product IDs
    const [showInvalidProductModal, setShowInvalidProductModal] = useState(false); // Show modal for invalid product IDs
    const [invalidCustomerId, setInvalidCustomerId] = useState(false); // State for invalid customer ID
    const [showInvalidCustomerModal, setShowInvalidCustomerModal] = useState(false); // Modal for invalid customer


   // Fetch all products & all customers when the component mounts
   useEffect(() => {
    axios.get('http://127.0.0.1:5000/products')
        .then((response) => {
            setProducts(response.data);
        })
        .catch((err) => {
            console.error("Error fetching products:", err);
        });
        
        axios.get('http://127.0.0.1:5000/customers')  // Fetch customers as well
        .then((response) => {
            setCustomers(response.data);
        })
        .catch((err) => {
            console.error("Error fetching customers:", err);
        });
}, []);
    
    // Handle form changes
    const handleChange = (event, index) => {
        const { name, value } = event.target;
        if (name === 'customerId') {
            setCustomerId(value);
        } else if (name === 'productIds') {
            const updatedProductIds = [...productIds];
            updatedProductIds[index] = value;
            setProductIds(updatedProductIds);
        } else if (name === 'date') {
            setDate(value);
        }
    };

    // Add a new product ID input field
    const addProductIdField = () => {
        setProductIds([...productIds, '']);
    };

    // Remove a product ID input field
    const removeProductIdField = (index) => {
        setProductIds(productIds.filter((_, i) => i !== index));
    };

    // Validate form fields
    const validateForm = () => {
        const errors = {};
        if (!customerId) errors.customerId = 'Customer ID is required';
        if (!productIds.some(id => id.trim())) errors.productIds = 'At least one Product ID is required';
        if (!date) errors.date = 'Date is required';
        return errors;
    };

    // Validate product IDs
    const validateProductIds = () => {
        const invalidIds = productIds.filter(id => {
            return !products.some(product => product.id === parseInt(id.trim())); // Check if product exists
        });

        if (invalidIds.length > 0) {
            setInvalidProductIds(invalidIds);
            setShowInvalidProductModal(true); // Show modal if invalid product IDs exist
            return false;
        }
        return true;
    };

    // Validate customer ID
    const validateCustomerId = () => {
        const isValid = customers.some(customer => customer.id === parseInt(customerId.trim()));
        if (!isValid) {
            setInvalidCustomerId(true);
            setShowInvalidCustomerModal(true);
            return false;
        }
        return true;
    };

    // Handle form submission for adding a new order
    const handleSubmit = (event) => {
        event.preventDefault();

        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        // Validate product IDs 
        if (!validateProductIds() || !validateCustomerId()) {
            return; // stop submission if product or Customer IDs are invalid
        }

        setIsLoading(true);
        const orderData = { 
            customer_id: customerId.trim(), 
            product_ids: productIds.filter(id => id.trim()),
            order_date: date 
        };

        axios.post('http://127.0.0.1:5000/orders', orderData)
            .then(() => {
                setCustomerId('');
                setProductIds(['']);
                setDate('');
                setErrors({});
                setIsLoading(false);
                setShowSuccessModal(true);
            })
            .catch(err => {
                setIsLoading(false);
                setError(err.response?.data || "Error submitting order data");
            });
    };

    // Close success modal and navigate to orders page
    const closeSuccessModal = () => {
        setShowSuccessModal(false);
        navigate('/orders');
    };

    // Close invalid product modal
    const closeInvalidProductModal = () => {
        setShowInvalidProductModal(false);
    };


    // Close invalid customer modal
    const closeInvalidCustomerModal = () => {
        setShowInvalidCustomerModal(false);
    };

    return (
        <Container>
            {isLoading && <Alert variant='info'>Submitting order data...</Alert>}
            <h3 className='mt-3 mb-3 text-center'>Order Form</h3>
            {error && <Alert variant='danger'>Error submitting order data: {error}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formGroupCustomerId">
                    <Form.Label>Customer ID</Form.Label>
                    <Form.Control type="text" name="customerId" value={customerId} placeholder="Example: 2" onChange={(e) => handleChange(e)} />
                    {errors.customerId && <div style={{ color: 'red' }}>{errors.customerId}</div>}
                </Form.Group>

                <Form.Label>Product ID</Form.Label>
                {productIds.map((productId, index) => (
                    <Form.Group key={index} controlId={`formGroupProductId${index}`}>
                        <Form.Control 
                            type="number" 
                            name="productIds" 
                            value={productId} 
                            onChange={(e) => handleChange(e, index)} 
                            placeholder={`Example: ${index + 1}`}
                        />
                        {productIds.length > 1 && (
                            <Button 
                                variant="danger" 
                                onClick={() => removeProductIdField(index)} 
                                className="mt-1"
                            >
                                Remove
                            </Button>
                        )}
                        {index === productIds.length - 1 && (
                            <Button 
                                variant="secondary" 
                                onClick={addProductIdField} 
                                className="mt-1"
                            >
                                Add another Product ID
                            </Button>
                        )}
                        {index === 0 && errors.productIds && <div style={{ color: 'red' }}>{errors.productIds}</div>}
                    </Form.Group>
                ))}

                <Form.Group controlId="formGroupDate">
                    <Form.Label>Order Date</Form.Label>
                    <Form.Control type="date" name="date" value={date} onChange={(e) => handleChange(e)} />
                    {errors.date && <div style={{ color: 'red' }}>{errors.date}</div>}
                </Form.Group>

                <Button variant='primary' type='submit' className="mt-3">Submit</Button>
            </Form>

            <Modal show={showSuccessModal} onHide={closeSuccessModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Success!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    The order has been successfully added.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={closeSuccessModal}>Close</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showInvalidProductModal} onHide={closeInvalidProductModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Invalid Product ID</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>The following Product ID(s) are not in our database:</p>
                    <ul>
                        {invalidProductIds.map((id, index) => (
                            <li key={index}>{id}</li>
                        ))}
                    </ul>
                    <p>Please correct the invalid product ID(s) and try again.</p>                
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={closeInvalidProductModal}>Close</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showInvalidCustomerModal} onHide={closeInvalidCustomerModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Invalid Customer ID</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p> Customer ID {invalidCustomerId} is not in our database:</p>
                    <p>Please correct the invalid Customer ID and try again.</p>                
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={closeInvalidCustomerModal}>Close</Button>
                </Modal.Footer>
            </Modal>

        </Container>
    );
};

export default AddOrderForm;