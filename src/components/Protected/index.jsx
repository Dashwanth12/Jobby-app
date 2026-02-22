import Cookies from "js-cookie";
import {Navigate, Route} from "react-router-dom"

const ProtectedRoute = props => {
    const {children} = props
    const jwtToken = Cookies.get('jwt_token')
    if (!jwtToken){
        return <Navigate to='/login' />
    }else{
        return children; 
    };
}
export default ProtectedRoute