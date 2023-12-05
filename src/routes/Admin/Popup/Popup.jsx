import { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle , DialogContentText} from '@material-ui/core';
import { styled } from '@mui/material/styles';

import TextField from '@material-ui/core/TextField';



// unique id
const uniqueId = () => {
  return Math.random().toString(36).substr(2, 9);
}

// Problem carry new values to Admin
const Popup=()=>{
  
  const [addedProject,setAddedProject]=useState({
    pid:'',
    project_title:'',
    discription: '',
    project_link:'',
    img:'',
    github:''
  
  })
   
  const StyledButton = styled(Button)(({ theme }) => ({
    width: '100%',
    height:'100%',
    display: 'block',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  }));
  
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
      setOpen(true);
      
    };
  
    const handleCloseAdd = () => {
      console.log(addedProject.project_title)
      setAddedProject((prev)=>(
        {
          ...prev,
          id:uniqueId()
        }
      ))
      props.addedProject={
        ...addedProject
      }
      setOpen(false);
      setAddedProject(
        {
          pid:'',
          project_title:'',
          discription: '',
          project_link:'',
          img:'',
          github:''
        
        }
      
      )
      console.log(addedProject.project_title)

    };
    
    const handleCloseCancel = () => {
      console.log(addedProject.project_title)
      setOpen(false);
      setAddedProject(
        {
          pid:'',
          project_title:'',
          discription: '',
          project_link:'',
          img:'',
          github:''
        
        }

      )}
   const handleChange=(event)=>{
    const {name,value}=event.target
    setAddedProject((prevProjects)=>(
      {
        ...prevProjects,
        [name]:value
          }
      ))
      }
    return (
      <div className='popup'>
      <StyledButton  variant="outlined" onClick={handleClickOpen}>
      <h1>+</h1>
     </StyledButton>
    <Dialog open={open} onClose={handleCloseCancel} aria-labelledby="form-dialog-title">
    <DialogTitle id="form-dialog-title">Add new Project</DialogTitle>
    <DialogContent>
      
      <TextField
        autoFocus
        margin="dense"
        id="title"
        label="Project title"
        type="text"
        value={addedProject.title}
        onChange={handleChange}
        fullWidth
      />
    </DialogContent>

    <DialogContent>
      
      <TextField
        autoFocus
        margin="dense"
        id="discription"
        label="Discription"
        type="text"
        value={addedProject.discription}
        onChange={handleChange}
        fullWidth
      />
    </DialogContent>

    <DialogContent>
      
      <TextField
        autoFocus
        margin="dense"
        id="project_link"
        label="Project link"
        type="url"
        value={addedProject.project_link}
        onChange={handleChange}
        fullWidth
      />

      <TextField
        autoFocus
        margin="dense"
        id="project_github"
        label="Project github"
        type="url"
        value={addedProject.project_link}
        onChange={handleChange}
        fullWidth
      />
    </DialogContent>


    
    <DialogActions>
      <Button onClick={handleCloseCancel} color="primary">
        Cancel
      </Button>
      <Button onClick={handleCloseAdd} color="primary">
        Add
      </Button>
    </DialogActions>
  </Dialog>
</div>
);
}

export default Popup
