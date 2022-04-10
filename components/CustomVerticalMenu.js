import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { IconButton } from '@material-ui/core';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {auth} from "../firebase.js"
import { withStyles, makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles({
  root: {
    display: "block",
    margin: "2px",
    padding: "10px",
    borderRadius: "5px"
  }
});
export default function CustomVerticalMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const signOut = () => {
      auth.signOut()
      handleClose()
  }
  const classes = useStyles();

  return (
    <>
      <IconButton
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        
      >
        <MenuItem className={classes.root} onClick={handleClose}>Profile</MenuItem>
        <MenuItem className={classes.root} onClick={handleClose}>My account</MenuItem>
        <MenuItem className={classes.root} onClick={signOut}>Logout</MenuItem>
      </Menu>
    </>
  );
}
