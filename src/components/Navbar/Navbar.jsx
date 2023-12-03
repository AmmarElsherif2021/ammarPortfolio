import './Navbar.css'
import { Outlet, Link } from "react-router-dom";
const Navbar=()=>{
    return(
        <div className = 'nav'>
            <div className='left-nav'>
              
              <Link to={`Home`}><h3>Logo</h3></Link>
              <Outlet/>
            </div>
           
            <div className='right-nav'>
                <div>
                <h4>Browse</h4>
                </div>
                <div>
                <h4>About me</h4>
                </div>
                <div>
                <h4>Contact</h4>
                </div>
                <div>
                <Link to={`Admin`}><h4>Dashboard</h4></Link>
                <Outlet/>
                </div>
            </div>

        </div>
    )
}
export default Navbar