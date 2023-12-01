import { Outlet, Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";

const Root=()=>{
    return(
        <div className="root">
          <div>
            <Navbar/> 
            <Outlet /> 
          </div>
        
     


        </div>
    )
}
export default Root