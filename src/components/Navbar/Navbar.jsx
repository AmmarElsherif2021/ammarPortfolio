import { useUserContext, userProvider } from '../../routes/userContext';
import { useState,useContext } from 'react';
import './Navbar.css'
import { Outlet, Link } from "react-router-dom";
const Login=()=>{
    // Use the useContext hook to get the context value
    const { user, login } = useContext(useUserContext);
    // Define some state variables for the username and password inputs
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    // Define a function to handle the form submission
    const handleSubmit = (e) => {
      // Prevent the default behavior of the form
      e.preventDefault();
      // Use the login function from the context value to authenticate the user
      login(username, password);
    }
    return (
      <div className="login-container">
        <h1>Login</h1>
        {user ? (
          <Admin/>
         ):(
          <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input type="submit" value="Login" />
          </form>
        )}
        </div>)
  }
const Navbar=()=>{
    const {user}=useUserContext();
    
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
                {
                  
                  /*
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