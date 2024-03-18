import { userContext, UserProvider } from '../../routes/userContext';
import { useState, useContext, useEffect } from 'react';
import './Navbar.css'
import { Outlet, Link } from "react-router-dom";
import Logo from '../../../src/assets/Avatar.svg';
import toggleLogo from '../../../src/assets/menu.svg'

const Login = () => {
  const { logged, setLogged } = useContext(userContext);
  const [userData, setUserData] = useState({ name: '', password: '' });
  const [toggled, setToggeled] = useState(false);

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
    <div className='login'>
      {logged ? (

        <div  > <Link to={`Admin`}><h3>Dashboard</h3></Link><Outlet /></div>
      ) : (
        <form className='login' onSubmit={handleSubmit}>
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

const Navbar = () => {
  const { logged, setLogged } = useContext(userContext);

  return (
    <UserProvider>
      <div className='nav'>
        <div >

          <Link to={`/`}><img className='avatar' src={Logo} /></Link>
          <Outlet />
          {window.innerWidth <= 900 && <div className='toggle'><img className='menu' src={toggleLogo} /></div>}
        </div>
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


      </div>
    </UserProvider>
  )
}
export default Navbar