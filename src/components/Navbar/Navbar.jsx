import { userContext,UserProvider } from '../../routes/userContext';
import { useState,useContext,useEffect } from 'react';
import './Navbar.css'
import { Outlet, Link } from "react-router-dom";
const Login = () => {
  const { logged, setLogged } = useContext(userContext);
  const [userData, setUserData] = useState({ name: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userData.name === 'ammar' && userData.password === '4331077') {
      setLogged(true);
      console.log('You are logged in');
    } else {
      console.log('Error');
    }
  };

  useEffect(() => {
    console.log(userData);
  }, [userData]);

  useEffect(() => {
    console.log(userContext);
  }, [userContext]);

  return (
    <div className="login-container">
      {logged ? (
        
        <div > 'Welcome Ammar' <Link to={`Admin`}><h3>Dashboard</h3></Link><Outlet/></div>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            id="name"
            value={userData.name}
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          <input
            type="password"
            id="password"
            value={userData.password}
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, password: e.target.value }))
            }
          />
          <button type="submit">Login</button>
        </form>
      )}
    </div>
  );
};

const Navbar=()=>{
    const {logged,setLogged}=useContext(userContext);
    
    return(
        <UserProvider>
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
            
              
             
              <Login/>
             
             
            
            
            
            
            
            </div>
        </div>

    </div>
        </UserProvider>
    )
}
export default Navbar