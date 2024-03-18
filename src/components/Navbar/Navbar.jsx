<<<<<<< HEAD
import { userContext, UserProvider } from '../../routes/userContext';
import { useState, useContext, useEffect } from 'react';
import './Navbar.css'
import useWindowDimensions from '../../routes/windowContext';
import { Outlet, Link } from "react-router-dom";
import Logo from '../../../src/assets/Avatar.svg';
import toggleLogo from '../../../src/assets/menu.svg'

=======
import { userContext,UserProvider } from '../../routes/userContext';
import { useState,useContext,useEffect } from 'react';
import './Navbar.css'
import { Outlet, Link } from "react-router-dom";
import Logo from '../../../src/assets/Avatar.svg'
>>>>>>> 89d6d93dc339359dac1cdd0c06145a4c98440a7e
const Login = () => {
  const { logged, setLogged } = useContext(userContext);
  const [userData, setUserData] = useState({ name: '', password: '' });

<<<<<<< HEAD

=======
>>>>>>> 89d6d93dc339359dac1cdd0c06145a4c98440a7e
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
<<<<<<< HEAD
    <div className='login'>
      {logged ? (

        <div  > <Link to={`Admin`}><h3>Dashboard</h3></Link><Outlet /></div>
=======
    <div className="login-container">
      {logged ? (
        
        <div className='login' > <Link to={`Admin`}><h3>Dashboard</h3></Link><Outlet/></div>
>>>>>>> 89d6d93dc339359dac1cdd0c06145a4c98440a7e
      ) : (
        <form className='login' onSubmit={handleSubmit}>
          <input
            type="text"
            id="name"
<<<<<<< HEAD
            placeholder='name'
=======
>>>>>>> 89d6d93dc339359dac1cdd0c06145a4c98440a7e
            value={userData.name}
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          <input
            type="password"
            id="password"
<<<<<<< HEAD
            placeholder='password'
=======
>>>>>>> 89d6d93dc339359dac1cdd0c06145a4c98440a7e
            value={userData.password}
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, password: e.target.value }))
            }
          />
<<<<<<< HEAD
          <button className='login-btn' type="submit">Login</button>
=======
          <button type="submit">Login</button>
>>>>>>> 89d6d93dc339359dac1cdd0c06145a4c98440a7e
        </form>
      )}
    </div>
  );
};

<<<<<<< HEAD
const Navbar = () => {
  const { width, height } = useWindowDimensions();
  const { logged, setLogged } = useContext(userContext);
  const [toggled, setToggeled] = useState(false);
  return (
    <UserProvider>
      <div className={width <= 900 && toggled ? 'nav-v' : 'nav'}>
        <div >

          <Link to={`/`}><img className='avatar' src={Logo} /></Link>
          <Outlet />
        </div>
        {width <= 900 ? <div className='toggle' onClick={() => setToggeled((prev) => !prev)}><img className='menu-img' src={toggleLogo} /></div> : <div></div>}
        {(width <= 900 && toggled) || width > 900 ?

          <div className='menu' >
            <div>
              <h4>Browse</h4>
            </div>
            <div>
              <h4>About me</h4>
            </div>
            <div>
              <h4>Contact</h4>
            </div>
            <Login />

          </div> : <div></div>}




      </div>
    </UserProvider>
  )
=======
const Navbar=()=>{
    const {logged,setLogged}=useContext(userContext);
    
    return(
        <UserProvider>
        <div className = 'nav'>
        <div className='left-nav'>
          
          <Link to={`Home`}><img className='avatar' src={Logo}/></Link>
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
>>>>>>> 89d6d93dc339359dac1cdd0c06145a4c98440a7e
}
export default Navbar