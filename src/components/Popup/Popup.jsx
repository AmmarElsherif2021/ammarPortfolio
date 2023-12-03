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
          <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To subscribe to this website, please enter your email address here. We will send updates
              occasionally.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Email Address"
              type="email"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleClose} color="primary">
              Subscribe
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
}
export default Popup
