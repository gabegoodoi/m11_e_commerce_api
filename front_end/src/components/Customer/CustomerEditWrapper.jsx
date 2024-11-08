import { useNavigate } from 'react-router-dom';
import CustomerEdit from './Customer/CustomerEdit';

function CustomerEditWrapper() {
    let navigate = useNavigate();
    return <CustomerEdit navigate={navigate} />;
}

export default CustomerEditWrapper;