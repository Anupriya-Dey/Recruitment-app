import { ThemeProvider,IconButton,Menu,MenuItem,Modal, TextField,Button,Typography,Link,Breadcrumbs,createTheme,AppBar, Paper,Table, TablePagination,TableFooter, Toolbar,Box,Tabs,Tab,Divider, TableContainer, TableHead, TableRow, TableCell, TableBody, TableSortLabel, Checkbox, FormLabel, Radio,RadioGroup, FormControlLabel ,FormControl} from "@mui/material";
import React, { useEffect } from "react";
import axios from "axios";
import TestTable from "./test_table";
import Selected from "./selected";
import ProfileIcon from "./profile_icon";
import { useParams } from "react-router-dom";
import InterviewTable from "./int_table";

//add filter for top X candidates based on weightage



const theme=createTheme({
    palette:{
        primary: {
            main:"rgb(33, 72, 99)",
        },
        secondary:{
            main:"rgb(255,255,255)",
        }
    },
})


export default function Dashboard(){

    let {year}=useParams()

    const [seasonYear,setSeasonYear]=React.useState()
    const [seasonRole,setSeasonRole]=React.useState()
    useEffect(()=>{
        let url="http://127.0.0.1:8000/recruitment_season/"+year+"/"
    axios
    .get(url)
    .then(function(response){
        setSeasonYear(response.data.year)
        setSeasonRole(response.data.role)
    })
    },[])


    return(
        <ThemeProvider theme={theme}>

            <AppBar sx={{height:'6.5%' }}>
                <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1,fontFamily:'cursive',fontSize:30 }} textAlign="center">
                    IMG Recruitment
                </Typography>
                <ProfileIcon year={year}/>
                </Toolbar> 
            </AppBar>             
            

            <Box sx={{p:10}}>
                <Toolbar />
                <Typography variant="h4" sx={{mb:5}}>
                {seasonRole=='dev'?"Developers":"Designers"}</Typography>
                <Box>
                    <RoundTab season_id={year}/>
                </Box>
            </Box>
        </ThemeProvider>
    )
}



function RoundTab(props){
    const {season_id}=props

    const[value,setValue]=React.useState(0);
    function handleChange(event,newValue){
        setValue(newValue);
    }

    return(
        <>
        <Toolbar sx={{mb:5}}>
            <Tabs 
            value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary">              
                   
                <Tab label={`Test Paper`} sx={{fontSize:12}} /> 
                <Tab label={`Projects`} sx={{fontSize:12}} />
                <Tab label={`Interview Round `} sx={{fontSize:12}} />
                <Tab label={`HR Round `} sx={{fontSize:12}} />
                <Tab label={`Selected`} sx={{fontSize:12}} />
          </Tabs>
          
        </Toolbar>
        
        <Divider />
        
        {value<1 &&<TestTable value={value} />}
        {/* {1<value<3 &&<InterviewTable value={value} />} */}
        {value>3 && <Selected season_id={season_id}/>}
        </>
    )
}



