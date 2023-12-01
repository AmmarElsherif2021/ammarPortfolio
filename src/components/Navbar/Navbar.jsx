import './Navbar.css'
import { Outlet, Link } from "react-router-dom";
const Navbar=()=>{
    return(
        <div className = 'nav'>
            <div className='left-nav'>
              
              <Link to={`Home1`}><h3>Logo</h3></Link>
              <Outlet/>
            </div>
            <div></div>
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
            </div>

        </div>
    )
}
export default Navbar