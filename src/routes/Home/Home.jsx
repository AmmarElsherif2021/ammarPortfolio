import Navbar from "../../components/Navbar/Navbar";
import Hero from "../../components/Hero/Hero";
import Strip from "../../components/Strip/Strip";
import './Home.css';
import ListOverview from "../ListOverview/ListOverview";
import { useEffect, useState } from "react";
import axios from "axios";

// should be handled in a separate json file

const Home=()=>{
    //projects
    const [projects,setProjects]=useState([]);
    //fetch projects ...............................................................  
    const fetchProjects = async () => {
        try {
        const response = await axios.get("src/routes/Admin/AdminData/projects.json");
        setProjects(response.data);
        } catch (error) {
        console.error(error);
        }
    };
    useEffect(() => {
        fetchProjects(); 
      }, []);

     //libs ...............................................................
    const [libs,setLibs]=useState([]);
    //fetch libs
    const fetchLibs = async () => {
        try {
        const response = await axios.get("src/routes/Admin/AdminData/libs.json");
        setLibs(response.data);
        } catch (error) {
        console.error(error);
        }
    };
    useEffect(() => {
        fetchLibs(); 
    }, []);

    
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
                     <Strip libsList={[...libs]}/>
                </div>
           </div>
           <div className='home-list-overview'>
                <div>
                    <h1>Here a list of projects I worked on will be added</h1>
                </div>
                <div>
                 <ListOverview projectsList={[...projects]}/>
                </div>
           </div>
           <div className='home-footer'>
                <div>
                    <h4>Welcome to Ammar portfolio</h4>
                </div>
                <div>
                    <ul>
                     <li>Blogs</li>
                     <li>Contacts</li>
                     <li>FAQs</li>
                    </ul>
                </div>
           </div>
            
         
         
        </div>
    )
}
export default Home