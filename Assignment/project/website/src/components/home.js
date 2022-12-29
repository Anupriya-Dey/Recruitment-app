import React from "react";
import { createTheme } from '@mui/material/styles'
import List from '@material-ui/core/List';
import { ListItem } from "@material-ui/core";
import { AppBar, Drawer, ListItemButton, ListItemText, Toolbar, Box, Collapse, ThemeProvider, Grid, Paper} from "@mui/material";
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import LoginIcon from '@mui/icons-material/Login'
import axios from 'axios';
import {CLIENT_ID,CLIENT_SECRET,REDIRECT_URI} from './oauth.js'



const theme=createTheme({
    palette:{
        primary: {
            main:"rgb(33, 72, 99)",
        },
    },
})



export default function Home(){
    

    const url="https://channeli.in/oauth/authorise/?client_id="+CLIENT_ID+"&redirect_uri="+REDIRECT_URI;

    const login=()=>{
        window.location.href=url;
    }

    return (
    <ThemeProvider theme={theme}>
    <Box>
    <AppBar sx={{ height:'6.5vh' }}>
        <Toolbar>
          <Typography variant="h4" sx={{ flexGrow: 1, fontFamily:'cursive',fontSize:30}} textAlign="center">
            Information Management Group
          </Typography>
        </Toolbar> 
    </AppBar> 

    
<Box component="div" sx={{p:'1vw', mt:'3vh', pb:'0'}}>
    <Button variant="contained" sx={{position:"absolute" ,top:"50%",right:"50%",width:'20vw', height:'5vh'}} onClick={login} >
        <LoginIcon sx={{mr:3}}/>
        <Typography>
            Login with ChannelI
        </Typography>
    </Button>
 
    </Box>
 
    </Box>
    </ThemeProvider>
    )
}