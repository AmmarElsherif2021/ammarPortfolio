import { useState, useEffect } from 'react';

import { Button, Dialog, DialogActions, DialogContent, DialogTitle , DialogContentText} from '@material-ui/core';
import { styled } from '@mui/material/styles';

import TextField from '@material-ui/core/TextField';

//acronyms
/*
props:
list
itemType:project || tech
*/

// unique id


const uniqueId = () => {
  return Math.random().toString(36).substr(2, 9);
}

// Problem carry new values to Admin
const Dialogue=(props,{popToParent})=>{
  
  const [addedToList,setAddedToList]=useState({
    ...props.list
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
        //test
         console.log(props.list)
         popToParent(addedToList,props.list);
        //set admin data
        
      
      setOpen(false);
      setAddedToList(
        {
          id:'',
          title:'',
          discription: '',
          link:'',
          img:'',
          github:''
        
        }
      
      )
      

    };
    
    const handleCloseCancel = () => {
      console.log(addedToList.title)
      setOpen(false);
      setAddedToList(
        {
          id:'',
          title:'',
          discription: '',
          link:'',
          img:'',
          github:''
        
        }

      )}
   const handleChange=(event)=>{
    const {name,value}=event.target
    setAddedToList((prevItem)=>(
      {
        ...prevItem,
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
    <DialogTitle id="form-dialog-title">Add new {props.itemType}</DialogTitle>
    <DialogContent>
      
      <TextField
        autoFocus
        margin="dense"
        id="title"
        label="Project title"
        type="text"
        value={addedToList.title}
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
        value={addedToList.discription}
        onChange={handleChange}
        fullWidth
      />
    </DialogContent>

    
      
      {
        props.itemType=='project'? 
      <DialogContent>
      <TextField
        autoFocus
        margin="dense"
        id="project_link"
        label="Project link"
        type="url"
        value={addedToList.link}
        onChange={handleChange}
        fullWidth
      />
      

      <TextField
        autoFocus
        margin="dense"
        id="project_github"
        label="Project github"
        type="url"
        value={addedToList.github}
        onChange={handleChange}
        fullWidth
      />
    </DialogContent>
   
    :
      ``
      }


    
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

export default Dialogue
/**
 *import React, { useState } from 'react';
import Child from './Child';

export default function Parent() {
  const [data, setData] = useState('');

  const childToParent = (childData) => {
    setData(childData);
  }

  return (
    <div>
      <Child childToParent={childToParent} />
      <div>
        <p>Data from Child: {data}</p>
      </div>
    </div>
  )
}
 
 * <Child childToParent={childToParent} />

 * import React from 'react'

export default function Child({ childToParent }) {
  const childData = "This is data from Child Component to the Parent Component.";
  childToParent(childData);

  return (
    <div>
     ...
      </div>
      )
    }
    
 * 
 * 
 * 
 * 
 * 
 */