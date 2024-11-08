import React, { useState, useEffect, useCallback } from 'react';
import { func } from 'prop-types';
import { Link } from 'react-router-dom';
import { Button, Alert, Container, ListGroup } from 'react-bootstrap';
import axios from 'axios';

const ProductList = ({ onProductSelect }) => {
    const [products, setProducts] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [error, setError] = useState(null);

    const fetchProducts = useCallback(async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Failed to fetch customers. Please try again later.');
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const selectProducts = (id) => {
        setSelectedProductId(id);
        onProductSelect(id);
    };

    return (
        <Container>
            {error && <Alert variant="danger">{error}</Alert>}
            <h3 className='mt-3 mb-3 text-center'>Products</h3>
            <ListGroup>
                {products.map(product => (
                    <ListGroup.Item
                        key={product.id}
                        className="d-flex justify-content-between align-items-center shadows-sm p-3 mb-3 bg-light-subtle rounded list-group-item "
                    >
                        <Link to={`/product-details/${product.id}`} className='text-primary'>
                            {product.id}
                        </Link>
                        <div>
                            {product.name}
                        </div>
                        <div>
                            ${product.price}
                        </div>
                        <Button variant='primary' size='sm'>
                            <Link to={`/products/${product.id}`} className="text-white text-decoration-none">
                                Edit
                            </Link>
                        </Button>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </Container>
    );
};

ProductList.propTypes = {
    onProductSelect: func,
};

export default ProductList;