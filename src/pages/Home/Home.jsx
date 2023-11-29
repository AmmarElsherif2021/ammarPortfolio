import Navbar from "../../components/Navbar/Navbar";
import Hero from "../../components/Hero/Hero";
import './Home.css'
const Home=()=>{
    return(
        <div className='home'>
            <div>
               <Navbar/>
            </div>
            <div>
                <Hero/>
            </div>
         
         
        </div>
    )
}
export default Home