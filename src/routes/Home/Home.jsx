//interns@logic-designs.com;
//venture.studio@athareg.com;
// hr@uranium-corp.com intern backend
//



import Navbar from "../../components/Navbar/Navbar";
import Hero from "../../components/Hero/Hero";
import Strip from "../../components/Strip/Strip";
import './Home.css';
import ListOverview from "../ListOverview/ListOverview";
import { useEffect, useState } from "react";
import axios from "axios";

// should be handled in a separate json file

const Home = () => {
    //projects
    const [projects, setProjects] = useState([]);
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
    const [libs, setLibs] = useState([]);
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


    return (
        <div className='home'>
            <div className='home-intro'>

                <div>
                    <Hero />
                </div>
            </div>
            <div className='home-strips'>
                <div>
                    <h1>lorem ipsum</h1>
                    <p> kjgjdk gkdc,ncd jklc jklbbad.skjbjkbvdjkkb kb,jdvvjk</p>
                </div>
                <div>
                    <Strip libsList={[...libs]} />
                </div>
            </div>
            <div className='home-list-overview'>
                <div>
                    <h1>Here is a list of projects I worked on and will be added</h1>
                </div>
                <div>
                    <ListOverview projectsList={[...projects]} />
                </div>
            </div>
            <div>
                <h1> Activities</h1>

                <h3>Date , link , details</h3>
                <h1>.................................</h1>

            </div>
            <div>
                <h1>Resources</h1>
                <h3>img,brief,link</h3>
                <h1>.................................</h1>
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