import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Alert, Container, ListGroup, Button } from 'react-bootstrap';
import axios from 'axios';

const ProductDetails = () => {
    const { id } = useParams();
    const [details, setDetails] = useState({});
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:5000/products/${id}`);
                setDetails(response.data);
            } catch (error) {
                console.error('Error fetching product details:', error);
                setError('Failed to fetch product details. Please try again later.');
            }
        };

        fetchProductDetails();
    }, [id]);

    const deleteProduct = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:5000/products/${id}`);
            setSuccess('Product successfully deleted!');
            setTimeout(() => {
                navigate('/products');
            }, 2000);
        } catch (error) {
            console.error('Error deleting product:', error);
            setError('Failed to delete product. Please try again.');
        }
    };

    return (
        <Container>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <h3 className='mt-3 mb-3 text-center'>Product Details</h3>
            <ListGroup>
                <ListGroup.Item className="shadows-sm p-3 mb-3 bg-white rounded">
                    <strong>ID:</strong> {id}
                </ListGroup.Item>
                <ListGroup.Item className="shadows-sm p-3 mb-3 bg-white rounded">
                    <strong>Name:</strong> {details.name}
                </ListGroup.Item>
                <ListGroup.Item className="shadows-sm p-3 mb-3 bg-white rounded">
                    <strong>Price:</strong> {details.price}
                </ListGroup.Item>
            </ListGroup>

            <Button variant='danger' size='sm' onClick={() => deleteProduct(id)}>
                Delete Product
            </Button>
        </Container>
    );
};

export default ProductDetails;