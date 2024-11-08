import { Container, Card, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';


function Homepage() {
    return (
        <Container className="bg-info-subtle text-center p-5 border border-info">
            <h1 className="primary pb-5 fw-bold">Welcome to the E-Commerce App!</h1>
            <Image src="src/assets/welcome-image.jpg" style={{ maxHeight: '50vh', paddingBottom: '20px', paddingLeft: '20px'}} fluid/>
            <Card className="card m-3"><div className="card-body"><h5 className="card-title">Card 1:</h5>Testimonials</div></Card>
            <Card className="card m-3"><div className="card-body"><h5 className="card-title">Card 2:</h5>Features</div></Card>
            <Card className="card m-3"><div className="card-body"><h5 className="card-title">Card 3:</h5>Deals</div></Card>
            <Link to={`/shop`} className="btn bg-primary shadow-lg p-3 m-5 rounded text-white text-decoration-none">
                Shop Now
            </Link>
        </Container>
    );
}


export default Homepage