import { ThemeProvider,Box,AppBar, Toolbar,Typography,createTheme, Drawer,List,ListItemButton,Divider,ListItemText,Button} from "@mui/material";
import React from "react";
import AddIcon from '@mui/icons-material/Add';
import ProfileIcon from "./profile_icon";


const theme=createTheme({
    palette:{   
        primary: {
            main:"rgb(33, 72, 99)",
        },
    },
})

const rounds=["Test Round","Interview Round ","HR Round"]
export default function Interview(){

    const[selectedIndex,setSelectedIndex]=React.useState(1);

    const handleClick=(index)=>{
        setSelectedIndex(index);
    }

    return(
        <>
        <ThemeProvider theme={theme}>
            
            <AppBar sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, height:'6.5vh' }}>
                <Toolbar>
                    
                <Typography variant="h6" sx={{flexGrow:1,fontFamily:'cursive',fontSize:30 }} textAlign="center">
                
                    IMG Recruitment
                    
                </Typography>
                {/* <ProfileIcon id={id}/> */}
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
                    {rounds.map((round,index)=>(
                        <>
                        <ListItemButton selected={selectedIndex==index} onClick={()=>(handleClick(index))}>
                            <ListItemText primary={round} />
                        </ListItemButton>
                        <Divider />
                        </>
                    ))}
                </List>

                <Button variant="contained" sx={{width:'100%', position:"absolute", bottom:10, right:5, left:10}} startIcon={<AddIcon />}>
                    Add New Round
                </Button>
            </Drawer>

        </ThemeProvider>
        </>
    )
}