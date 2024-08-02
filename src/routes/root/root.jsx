import { Outlet, Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Nav";
import Home from "../Home/Home";
const Root = () => {
  return (
    <div className="root">
      <div>
        <Navbar />
        <Home />
      </div>
    </div>
  );
};
export default Root;
