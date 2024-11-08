// here's where it all comes together.
import { Routes, Route }  from 'react-router-dom'; // import Routes to declare elements that should be rendered on certain URL paths
// Import all of my homemade components
import Homepage from './components/Homepage';
import CustomerList from './components/Customer/CustomerList';
import CustomerDetails from './components/Customer/CustomerDetails';
import CustomerFormWrapper from './components/Customer/CustomerFormWrapper';
import CustomerEditWrapper from './components/CustomerEditWrapper';
import ProductList from './components/Product/ProductList';
import ProductEdit from './components/Product/ProductEdit';
import ProductDetails from './components/Product/ProductDetails';
import ProductForm from './components/Product/ProductForm';
import OrderForm from './components/OrderForm';
import NavigationBar from './components/NavigationBar';
import NotFound from './components/NotFound';

//import styles & bootstrap to make the webpages gorgeous
import './AppStyles.css';
import 'bootstrap/dist/css/bootstrap.min.css'

// define the functional component APP
function App() {
  return (
    // render a container
    <div className='app-container'>
      <NavigationBar /> {/* within the container render the navigation bar */}
      <Routes> {/* depending on the URL render one of these routes */}
        <Route path='/' element={<Homepage />} />
        <Route path="/add-customers" element={<CustomerFormWrapper />} />
        <Route path="/customers/:id" element={<CustomerEditWrapper />} />
        <Route path="/customers" element={<CustomerList />} />
        <Route path="/customer-details/:id" element={<CustomerDetails />} />
        <Route path="/add-products" element={<ProductForm />} />
        <Route path="/products/:id" element={<ProductEdit />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/product-details/:id" element={<ProductDetails />} />
        <Route path="/orders" element={<OrderForm />} />
        <Route path='*' element={<NotFound />} /> {/* Render this special route for any route not mentioned above */}
      </Routes>
    </div>
  );
}

export default App;