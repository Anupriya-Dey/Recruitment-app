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

// require('react-dom');
// window.React2 = require('react');
// console.log(window.React1 === window.React2);

const theme=createTheme({ 
    palette:{
        primary: {
            main:"rgb(33, 72, 99)",
        },
    },
})

const Rec_Seasons=["2022", "2021"]
export default function Home(){

    const [open, setOpen] = React.useState(-2);
    const handleClick = (season_year) => {
        if(open!=season_year)
        setOpen(season_year);
        else
        setOpen(-2);
      };
    return (
        <ThemeProvider theme={theme}>

        <AppBar sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, height:'6.5%' }}>
                <Toolbar>
                    
                <Typography variant="h6" sx={{flexGrow:1,fontFamily:'cursive',fontSize:30 }} textAlign="center">
                
                    IMG Recruitment
                    
                </Typography>
                </Toolbar>
            </AppBar>

            <Drawer variant="permanent" sx={{width: '20%'} }>
                <Toolbar />
                <Toolbar>
                    <Typography>
                        Rounds
                    </Typography>
                    </Toolbar>
                <Divider />
        
        <List>
            {Rec_Seasons.map((season,index) =>
            (
            <>
                <ListItemButton onClick={()=>handleClick(index)}>
                <ListItemText primary={"Recruitment Season "+(season)} />
                {open==index ? <ExpandLess /> : <ExpandMore />}
                
                </ListItemButton>
                <Collapse in={open==index} timeout="auto">
                    <List>
                        <ListItemButton>
                            <ListItemText secondary="Developer" onClick={() => { window.location.href = "http://localhost:3000/dashboard/" + season + "/"; } }/>
                        </ListItemButton>
                        
                        <ListItemButton>
                            <ListItemText secondary="Designer" onClick={() => { window.location.href = "http://localhost:3000/dashboard/" + season + "/"; }}/>
                        </ListItemButton>
                    </List>
                </Collapse>
                <Divider />
            </>
            ))}
        </List>
        
        <Button 
        variant="contained" 
        startIcon={<AddIcon />} 
        sx={{width:'90%', fontSize:15, position:'absolute',bottom:10, right:10}} 
        disablePadding>
            Create New Season
        </Button>
    </Drawer>


    </ThemeProvider>
    )
}