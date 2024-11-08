import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Alert, Container, ListGroup, Button } from 'react-bootstrap';
import axios from 'axios';


// define the Functional Component that will display the customer details
const CustomerDetails = () => {
    const { id } = useParams(); // get the id parameter from the current URL
    const [details, setDetails] = useState({});
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate(); // define a variable that uses the react hook useNavigate to change the URL later

    // Set up a react hook to do the defined side-effects on mount or when the id changes
    useEffect(() => {
        
        // defining the useEffect hook's first side-effect: an async/await promise that uses the axios library to make an HTTP request to get the data to fill the details variable.
        const fetchCustomerDetails = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:5000/customers/${id}`);
                setDetails(response.data);
            } catch (error) {
                console.error('Error fetching customer details:', error);
                setError('Failed to fetch customer details. Please try again later.');
            }
        };

        // running the side-effect defined above
        fetchCustomerDetails();
    }, [id]);

    // defining an async/await promise used to delete customers from the database
    const deleteCustomer = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:5000/customers/${id}`); // deletes the customer with that primary key (id) in the database
            setSuccess('Customer successfully deleted!');
            setTimeout(() => {
                navigate('/customers'); // sends the user to the customer list webpage after 2 seconds
            }, 2000);
        } catch (error) {
            console.error('Error deleting customer:', error);
            setError('Failed to delete customer. Please try again.');
        }
    };

    // the returned values use react bootstrap Components that act like HTML and ultimately are written to the webpage that users interact with.
    return (
        // all the returned values are positioned into a Container react component with bootstrap styling
        <Container>
            {error && <Alert variant="danger">{error}</Alert>} {/* the alert below is rendered to the screen if error is truthy, otherwise it gets skipped over */}
            {success && <Alert variant="success">{success}</Alert>} {/* similarly, the alert below is rendered to the screen if success is truthy, otherwise it gets skipped over */}
            <h3 className='mt-3 mb-3 text-center'>Customer Details</h3> {/* this h3 HTML is rendered regardless with react-bootstrap classes to prettify it, ultimately it's just a header for the webpage */}
            
            <ListGroup> {/* creates a container for a list */}
                <ListGroup.Item className="shadows-sm p-3 mb-3 bg-white rounded">
                    <strong>ID:</strong> {id} {/* this list-item renders ID: and the ID# useParams scrapped from the URL */}
                </ListGroup.Item>
                <ListGroup.Item className="shadows-sm p-3 mb-3 bg-white rounded">
                    <strong>Name:</strong> {details.name} {/* this list-item renders Name: and the name variable extracted by the axios promise function when mounting occurred */}
                </ListGroup.Item>
                <ListGroup.Item className="shadows-sm p-3 mb-3 bg-white rounded">
                    <strong>Email:</strong> {details.email} {/* this list-item renders Email: and the email variable extracted by the axios promise function when mounting occurred */}
                </ListGroup.Item>
                <ListGroup.Item className="shadows-sm p-3 mb-3 bg-white rounded">
                    <strong>Phone:</strong> {details.phone} {/* this list-item renders Phone: and the phone variable extracted by the axios promise function when mounting occurred */}
                </ListGroup.Item>
            </ListGroup>

            <Button variant='danger' size='sm' onClick={() => deleteCustomer(id)}>
                {/* this button component renders with an event listener that when clicked performs the deleteCustomer function defined before the return */}
                Delete Customer
            </Button>
        </Container>
    );
};

export default CustomerDetails; // the whole Component is exported so other files can use it without having to use curly braces