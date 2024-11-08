import { Link } from 'react-router-dom';
import { Container, Row, Col, Image, Button } from 'react-bootstrap';

// this runs whenever a URL is not represnted by the routes/components I've built
function NotFound() {
    return (
        <Container className="bg-info-subtle text-center p-5">
            <Row>
                <Col>
                    <h1 className="text-danger">404 Not Found</h1>
                    <p className="text-muted">The page you're looking for doesn't exist.</p>
                    <p><Image src="src/assets/not-found.jpg" style={{ maxHeight: '50vh', paddingBottom: '20px', paddingLeft: '20px'}} fluid/></p>
                    <Button variant="primary" href="/">Go Back Home</Button>
                </Col>
            </Row>
        </Container>
    )
}

export default NotFound