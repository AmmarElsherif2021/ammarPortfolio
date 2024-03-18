import { useState } from "react"
//It is intended to be a popup to add a new project
const AddedProject=[]
const AddProject=(props)=>{
    const[project,setProject]=useState(
        {
            id:'',
            title:'',
            discription: '',
            project_link:'',
            img:'',
            github:''
          
          }
    );
    // generate a unique id
    function getId(){
        x=Date.now()
       return x%1223
    }
    function handleSubmit(e){
        e.preventDefault();
        project.id= getId();
        AddedProject.push(project);
         console.log(AddedProject)

    }
    (
        <div div className='projects-form'>
         <form onSubmit={handleSubmit}>
           <fieldset>
            <div className='projects-form-title'>
            <label>name:</label>
            <input
             type='text'
             placeholder='Project title'
             name='title'
             value={project.title}
            />
            </div>


            <div className='projects-form-discription'>
            <label>discription:</label>
            <input
             type='text'
             placeholder='Project discription'
             name='discription'
             value={project.discription}
            />
            </div>


            <div className='projects-form-link'>
            <label>link:</label>
            <input
             type='text'
             placeholder='link'
             name='link'
             value={project.project_link}
            />
            </div>


            <div className='projects-form-github'>
            <label>github:</label>
            <input
             type='text'
             placeholder='github'
             name='github'
             value={project.github}
            />
            </div>


            <div className='projects-form-discription'>
            <label>name:</label>
            <input
             type='text'
             placeholder='Project discription'
             name='discription'
             value={project.discription}
            />
            </div>
           </fieldset>
         </form>
        
        </div>
    )
}
export default AddProject
