import { useState ,useEffect } from 'react';
import Card from '../../components/Card/Card'
import Strip from '../../components/Strip/Strip'
//import AddProject from './AddProject/AddProject';
//import Dialogue from './Dialogue/Dialogue';
import { ReactDOM } from 'react-dom';
import './Admin.css'
import Popup from './Popup/Popup';
const projects=[
  
]



const Admin=()=>{
 
  const [projects,setProjects]=useState([]);
  useEffect(() => {
    fetch("src\routes\Admin\AdminData\projects.json")
      .then((response) => response.json())
      .then((jsonData) => setProjects(jsonData));
  }, []);
  useEffect(()=>console.log('refresh projects list'),[projects])

  //handle popup ops:
  

  const handleEdit = () => {
    // Modify the data as needed
    const newData = { ...data, key: "new value" };

    // Send the updated data to the server
    fetch("src\routes\Admin\AdminData\projects.json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newData),
    })
      .then((response) => response.json())
      .then((jsonData) => setData(jsonData));
  };
  
  function popToParent(childData){
      console.log('pop to parent working !')
      projects.push(childData);
      console.log(projects)
    }         
  

    //useEffect

    useEffect(()=>{
      console.log(...projects)
    },[projects])
    return(
        <div className='admin'>
           
            <div>
               <h1>This is your admin dashboard</h1>
            </div>
            <div className='admin-grid1'>
              {projects && projects.map((project)=>{
                return(
                  <div><Card key={project.pid} project_title={project.project_title} discription={project.discription} img={project.img}/></div>
                )
              })}
              <div className='admin-grid1-add'> <Popup popToParent={popToParent}/> </div>
            </div>
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