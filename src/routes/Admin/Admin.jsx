import { useState ,useEffect } from 'react';
//import { readFile, writeFile } from "react-file-reader";
import axios from 'axios';


import Card from '../../components/Card/Card'
import ListOverview from '../ListOverview/ListOverview';
import Strip from '../../components/Strip/Strip'
//import AddProject from './AddProject/AddProject';
//import Dialogue from './Dialogue/Dialogue';
import { ReactDOM } from 'react-dom';
import './Admin.css'
import Popup from './Popup/Popup';

// unique id
const uniqueId = () => {
  return Math.random().toString(36).substr(2, 9);
}



const Admin=()=>{
 
  //projects data
  const [projects,setProjects]=useState([]);
  //methods and libraries data
  const [libs,setLibs]=useState([]);
 
  //get projects from projects.json
  useEffect(() => {
    fetchProjects(); 
  }, []);
  useEffect(()=>console.log('refresh projects list'),[projects]);
  //fetch projects
  const fetchProjects = async () => {
    try {
      const response = await axios.get("src/routes/Admin/AdminData/projects.json");
      setProjects(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  //fetch libs
  const fetchLibs = async () => {
    try {
      const response = await axios.get("src/routes/Admin/AdminData/projects.json");
      setLibs(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  //handle popup ops:
  
  const handleCreate=(item)=>{
    const newItem={
      ...item,
      pid:uniqueId()
    }
    setProjects((prev)=>(
      [...prev,
      newItem]
    ))
    console.log(`pid of new added is >>>> ${item.pid} <<<<`)
  }

  //save popup ops
  const saveData = async () => {
    try {
      await axios.put("src/routes/Admin/AdminData/projects.json", JSON.stringify(projects));
      
    } catch (error) {
      console.error(error);
    }
  };

  /*
    const handleEdit = (id,newData) => {
    // Modify the data as needed
    const newData = { ...data, key: "new value" };

  

    // Send the updated data to the server
    fetch("src/routes/Admin/AdminData/projects.json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newData),
    })
      .then((response) => response.json())
      .then((jsonData) => setData(jsonData));
  };
  */
  function popToParent(childData){
      console.log('pop to parent working !')
      handleCreate(childData);
      console.log(projects)
      saveData()
      console.log('updated?')
    }         
  

    //useEffect

    useEffect(()=>{
      console.log(...projects)
      saveData()
    },[projects])
    return(
        <div className='admin'>
           
            <div>
               <h1>This is your admin dashboard</h1>
            </div>
            <div>
            <ListOverview projectsList={[...projects]}/>
            
            </div>
            <Popup popToParent={popToParent}/> 
            <div>
            <h1>This is your admin dashboard</h1>
            </div>
            <div>
            <Strip/>
            </div>
            
            <div className='admin-links'>
            <table>
           
            <tbody>
              <tr>
                <td>Row 1, Column 1</td>
                <td>Row 1, Column 2</td>
                <td>Row 1, Column 3</td>
              </tr>
              <tr>
                <td>Row 2, Column 1</td>
                <td>Row 2, Column 2</td>
                <td>Row 2, Column 3</td>
              </tr>
              <tr>
                <td>Row 3, Column 1</td>
                <td>Row 3, Column 2</td>
                <td>Row 3, Column 3</td>
              </tr>
            </tbody>
          </table>
            </div>

        </div>
    )
}
export default Admin