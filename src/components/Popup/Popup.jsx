import { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle , DialogContentText} from '@material-ui/core';
import { styled } from '@mui/material/styles';

import TextField from '@material-ui/core/TextField';



const Popup=()=> {
   
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
  
    const handleClose = () => {
      setOpen(false);
    };
   
    return (
      <div className='popup'>
        <StyledButton variant="outlined" onClick={handleClickOpen}>
        <h1>+</h1>
      </StyledButton>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Add new Project</DialogTitle>
          <DialogContent>
            
            <TextField
              autoFocus
              margin="dense"
              id="title"
              label="Project title"
              type="text"
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
              fullWidth
            />

            <TextField
              autoFocus
              margin="dense"
              id="project_github"
              label="Project github"
              type="url"
              fullWidth
            />
          </DialogContent>


          
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleClose} color="primary">
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
}
export default Popup
