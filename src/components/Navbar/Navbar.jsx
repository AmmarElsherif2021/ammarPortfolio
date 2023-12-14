import { useUser } from '../../routes/userContext';
import { useState } from 'react';
import './Navbar.css'
import { Outlet, Link } from "react-router-dom";
const Login=()=>{// Use state to store the values of the inputs
    const [user, setUser] = useState(
        {
            name:'',
            password:''
        }
    );
    
  
    // Define a function to handle the change of the inputs
    function handleChange(event) {
      // Get the name and value of the target input
      const { name, value } = event.target;
      // Update the state of the corresponding input
      setUserData((prev)=>({
        ...prev,
        [name]:value
      }))
    }
  
    // Define a function to handle the submit of the form
    function handleSubmit(event) {
      
      event.preventDefault();
      
    }
  
    // Return the JSX code that renders the form
    return (
      <form onSubmit={handleSubmit} className="two-inputs-form">
        <input
          type="text"
          name="name"
          value={user.name}
          onChange={handleChange}
          placeholder="Enter something"
        />
        <input
          type="text"
          name="password"
          value={user.password}
          onChange={handleChange}
          placeholder="Enter something else"
        />
        <button type="submit">Submit</button>
      </form>
    );
  }
const Navbar=()=>{
    const {user}=useUser();
    
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
                {/*
                 <div>
                    <Link to={`Admin`}><h4>Dashboard</h4></Link>
                    <Outlet/>
                 </div>
                 */
                }
                 
                 <userProvider><Login/></userProvider>
                
                
                </div>
            </div>

        </div>
    )
}
export default Navbar