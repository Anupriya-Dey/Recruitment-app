import React from "react";
import { Menu,MenuItem,IconButton, Button } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import axios from "axios";

export default function ProfileIcon(props){
    const {id}=props
    const [open,setOpen]=React.useState(false)
    const [anchorEl,setAnchorEl]=React.useState(null)
    const openMenu=(event)=>{
        setOpen(!open)
        setAnchorEl(event.currentTarget)
    }

    return(
        <>
        <IconButton variant="outlined" sx={{ position: "absolute", right: "5% ", }} color="secondary" onClick={openMenu}>
            <AccountCircleIcon fontSize="large" />
            <Menu
                anchorEl={anchorEl}
                open={open}
            >
                <MenuItem onClick={() => { window.location.href = "http://localhost:3000/profile/"; } }>Profile</MenuItem>
                <MenuItem onClick={() => { axios.get("http://localhost:8000/api-auth/logout/"); } }>Logout</MenuItem>
            </Menu>
        </IconButton>
        <div style={{ position: 'absolute', left: '70%', top: '8vh' }}>
                {/* <ButtonGroup variant="outlined" size="large"> */}
                <Button onClick={() => { window.location.href = "http://localhost:3000/"; } }>Home</Button>
                <Button onClick={() => { window.location.href = "http://localhost:3000/dashboard/" + id + "/"; } }>Dashboard</Button>
                <Button onClick={() => { window.location.href = "http://localhost:3000/candidates/" + id + "/"; } }>Candidate List</Button>
                <Button onClick={() => { window.location.href = "http://localhost:3000/test/" + id + "/"; } }>Rounds</Button>
                {/* </ButtonGroup> */}
            </div></>
                 
    )
}

    