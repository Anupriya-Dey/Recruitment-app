import React, { useEffect } from "react";
import { Table,TableHead,TableBody,TableFooter,TablePagination,TableRow,TableCell,TableSortLabel,TableContainer,ThemeProvider,Tabs,Tab,Divider,Breadcrumbs,Link,Modal,Paper,FormControl,InputLabel,Select,Button, Menu, MenuItem,createTheme,Grid, Card,Box,AppBar,Toolbar,Typography, IconButton, CardMedia, CardContent, CircularProgress } from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProfileIcon from "./profile_icon";



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

const ways_of_recruitment=["Projects","Recruitment Test"];

export default function CandidateList(){

    const {year}=useParams()
    // let year = 2021
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
    // console.log(seasonRole);

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
                    Candidates appearing in Season {seasonYear} <br />
                    {seasonRole=='dev'?"Developers":"Designers"}
                </Typography>

                <Box>
                    <CandidateTable year={year}/>
                </Box>

            </Box>

            </ThemeProvider>
    )
}







function CandidateTable(props) 
{
    const {year}=props
    const[value,setValue]=React.useState(1);
    
    function handleChange(event,newValue){
        setValue(newValue);  
    }   

    return(
        <>
        <Toolbar>
            <Tabs 
            value={value}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"  >
               {ways_of_recruitment.map((way) => (

                   <Tab label={way} sx={{ml:3,fontSize:17}}/>

               ))}
          </Tabs>
        </Toolbar>

        <Divider />

        <TableDisplay value={value} id={year}/>
        

        </>
    )
}


const headCells=[{value:"Sl No",id:"slno"},{value: "Name",id:"name"},{value:"Enrolment No",id:"enrollment_no"},{value:"Mobile No.",id:"mob"},{value:"Email ID",id:"email"}]


function TableDisplay(props)
{
    const {value,id} = props;
   
    const [candidate_list,setCandidate_list]=React.useState([])
    useEffect(()=>{
    axios
        .get("http://127.0.0.1:8000/candidate_round/",{params:{appeared_test:value,round_seasonid:id}})
        .then(function(response){
            let cl=[];
            for(var i=0;i<response.data.length;i++)
            {
                console.log("ldjgnh")
                cl.push(response.data[i].applicant);
                
            }
            setCandidate_list(cl)
        })
    },[value])





    //order rows
    const [order,setOrder]=React.useState('asc');
    const [orderBy,setOrderBy]=React.useState("slno");
    let orderedRows=candidate_list;
    function createSortHandler(property){
        const isAsc= orderBy === property && order==='asc';
        setOrder(isAsc?'desc':'asc');
        setOrderBy(property);
        let ans=0;
        let ord=isAsc?'desc':'asc'
        orderedRows=candidate_list.sort((a,b)=>{
            let ans=0;
            if(a[property]>b[property])
            ans=1;
            else
            ans=-1;

            if(ord==='asc')
            return ans;
            else
            return -ans;
        })
    }

    return(
        <TableContainer>
        <Table>

        <TableHead>
            <TableRow>
                {headCells.map((header)=>(
                    <TableCell>
                       <TableSortLabel 
                       active={orderBy === header.id} 
                       direction={orderBy===header.id?order:'asc'} 
                       onClick={()=>{createSortHandler(header.id)}}
                       >
                           <Typography sx={{fontWeight:'bold', fontSize:20}}>
                           {header.value}
                           </Typography>
                        </TableSortLabel> 
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>

        <TableContent orderedRows={orderedRows} candidate_list={candidate_list}/>

        </Table>
        </TableContainer>
    )
}



function TableContent(props){
    const {orderedRows,candidate_list}=props;

    const [page,setPage]=React.useState(0);
    const[rowsPerPage,setRowsPerPage]=React.useState(10);
    const handleChangePage=(event,newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value));
        setPage(0);
      };

    return(      
        <>
        <TableBody>
        {(orderedRows.slice(page*rowsPerPage,(page+1)*rowsPerPage)).map((row,index)=>(
            <TableRow>
            <TableCell>{index+1}</TableCell>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.enrollment_no}</TableCell>
            <TableCell>{row.mob}</TableCell>
            <TableCell>{row.email}</TableCell>
            </TableRow>
        ))}
        </TableBody>

        <TableFooter>
            <TableRow>
                <TablePagination rowsPerPageOptions={[3,5,10]}
                count={candidate_list.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}/>
            </TableRow>
        </TableFooter>
        </>        

    )
}