import { useState ,useEffect } from 'react';
import Card from '../../components/Card/Card'
import Strip from '../../components/Strip/Strip'
import AddProject from './AddProject/AddProject';
import { ReactDOM } from 'react-dom';
import './Admin.css'
import Popup from '../../components/Popup/Popup';
const projects=[
  {
    id:'1',
    title:'project#',
    discription: 'lorem iopsum ufb uboi vwio ie wsui',
    project_link:'none',
    img:'img link',
    github:'github link'
  
  }, 
  {
    id:'2',
    title:'project#',
    discription: 'lorem iopsum ufb uboi vwio ie wsui',
    project_link:'none',
    img:'img link',
    github:'github link'
  
  },
  {
    id:'3',
    title:'project#',
    discription: 'lorem iopsum ufb uboi vwio ie wsui',
    project_link:'none',
    img:'img link',
    github:'github link'
  
  }
  ,
  {
    id:'4',
    title:'project#',
    discription: 'lorem iopsum ufb uboi vwio ie wsui',
    project_link:'none',
    img:'img link',
    github:'github link'
  
  }
  ,
  {
    id:'4',
    title:'project#',
    discription: 'lorem iopsum ufb uboi vwio ie wsui',
    project_link:'none',
    img:'img link',
    github:'github link'
  
  }
]



const Admin=()=>{
  // updating states
  const[updating,setUpdating]=useState(0);

  //handle projects add
  function handleProjectAdd() {
    
    setUpdating(1);
    console.log(updating)
  }
  function handleProjectCancel() {
    setUpdating(0);
    console.log(updating)
    
  }
  //useEffect to pop up and update status
 /*useEffect(() => {
    handleProjectAdd()
    document.addEventListener('click', handleProjectAdd);
    
    return () => {
      document.removeEventListener('click', handleProjectAdd);
    };
  }, [updating]);*/

  //POP up 
  


  
  
    return(
        <div className='admin'>
          {updating? <Popup/>:<div></div>}
            <div>
               <h1>This is your admin dashboard</h1>
            </div>
            <div className='admin-grid1'>
              {projects.map((project)=>{
                return(
                  <Card key={project.id} title={project.title} discription={project.discription} img={project.img}/>
                )
              })}
              <button onClick={handleProjectAdd}/>
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