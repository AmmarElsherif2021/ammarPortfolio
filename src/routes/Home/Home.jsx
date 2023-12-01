import Navbar from "../../components/Navbar/Navbar";
import Hero from "../../components/Hero/Hero";
import Strip from "../../components/Strip/Strip";
import './Home.css'
import ListOverview from "../../pages/ListOverview/ListOverview";
const Home=()=>{
    return(
        <div className='home'>
           <div className='home-intro'>
               
                <div>
                    <Hero/>
                </div>
           </div>
           <div className='home-strips'>
                <div>
                    <h1>lorem ipsum</h1>
                    <p> kjgjdk gkdc,ncd jklc jklbbad.skjbjkbvdjkkb kb,jdvvjk</p>
                </div>
                <div>
                     <Strip/>
                </div>
           </div>
           <div className='home-list-overview'>
                <div>
                    <h1>Here a list of projects I worked on will be added</h1>
                </div>
                <div>
                 <ListOverview/>
                </div>
           </div>
            
         
         
        </div>
    )
}
export default Home