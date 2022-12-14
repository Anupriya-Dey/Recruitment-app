import React,{useEffect} from "react"
import { ThemeProvider,IconButton,Menu,MenuItem,Modal, TextField,Button,Typography,Link,Breadcrumbs,createTheme,AppBar, Paper,Table, TablePagination,TableFooter, Toolbar,Box,Tabs,Tab,Divider, TableContainer, TableHead, TableRow, TableCell, TableBody, TableSortLabel, Checkbox, FormLabel, Radio,RadioGroup, FormControlLabel ,FormControl} from "@mui/material";
import axios from "axios";



const headCells=[{id:"slno",value:"Sl No"},{id:"name",value:"Name"},{id: "enrollment",value:"Enrollment No"},{id:"eval_status",value:'Evaluation Status'}]
//NOTE: id must be same as objects' keys

export default function TestTable(props){

    const {round_id}=props    
    const [sections,setSections]=React.useState([])
    const [rows,setRows]=React.useState([])
    useEffect(()=>{
            axios
            .get("http://localhost:8000/section/get_sections/",{params:{round_id:round_id}},{withCredentials:true})
            .then(function(response){
                setSections(response.data)
            })
            axios
            .get("http://localhost:8000/candidate_round/get_marks/",{params:{round_id:round_id}},{withCredentials:true})
            .then(function(response){
                setRows(response.data)
            })
           
        
    },[round_id])   


    //ordering in table
    const [order,setOrder]=React.useState('asc');
    const [orderBy,setOrderBy]=React.useState("Sl No");
    let orderedRows=rows;

    function createSortHandler(property){
        const isAsc= orderBy === property && order==='asc';
        setOrder(isAsc?'desc':'asc');
        setOrderBy(property);

        let ord=isAsc?'desc':'asc'
        orderedRows=rows.sort((a,b)=>{
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
    <>
        <TableContainer>
        <Table>

        <TableHead>
            <TableRow>

                <TableCell padding="checkbox" rowSpan={2}></TableCell>

                {headCells.map((header)=>(
                    <TableCell rowSpan={2}>
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

                {sections.map((s)=>(
                    <TableCell colSpan={s.ques_list.length} align="center">
                    <Typography sx={{fontWeight:'bold', fontSize:20}}>
                       {s.name}
                       </Typography>
                </TableCell>
                ))}
            </TableRow>


            <TableRow>
                {sections.map((s)=>(
                    <>
                    {s.ques_list.map((question)=>(
                    <TableCell>
                        <Typography sx={{fontWeight:'bold', fontSize:20}} align="center">
                        <span title={question.text}>Q_ID{question.id}</span>
                        </Typography>
                    </TableCell>
                    ))}
                    </>
                ))}

            </TableRow>            
        </TableHead>


        <EnhancedTableBody orderedRows={orderedRows} sections={sections} />
        </Table>
        </TableContainer>
        </>
    )
}

function EnhancedTableBody(props){
    const {orderedRows,sections}=props;        
    
    const [page,setPage]=React.useState(0);
    const[rowsPerPage,setRowsPerPage]=React.useState(5);

    const handleChangePage=(event,newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value));
        setPage(0);
      };


    //update marks and remarks
    let [marks,setMarks]=React.useState('');
    const [remarks,setRemarks]=React.useState('');
    const [quesID,setQuesID]=React.useState()
    const [candidateID,setCandidateID]=React.useState()
    const [openModal,setOpenModal]=React.useState(false)
    const handleOpenModal= (q_id,season_id) => {setOpenModal(true);setQuesID(q_id);setCandidateID(season_id)};
    const handleCloseModal = () => {setOpenModal(false);setQuesID();setCandidateID();setMarks('');setRemarks('');};
    const handleMarksChange=(event)=>{
        setMarks(event.target.value)
    }
    const handleRemarksChange=(event)=>{
        setRemarks(event.target.value)
    }
    const changeMarksRemarks=(marks,remarks)=>{
        if(marks=="")
        marks=null
        const params=JSON.stringify({"marks":marks,"remarks":remarks,"ques_id":quesID,"candidate_id":candidateID});
        axios
        .post("http://localhost:8000/candidate_marks/update_marks/",params,{headers:{"Content-Type":"application/json"}},{withCredentials:true})        
        handleCloseModal()
        window.location.href=window.location.href
    }

    //move to menu
    const [selected,setSelected]=React.useState([])
    const isSelected = (id) => selected.indexOf(id) !== -1;
    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];
    
        if (selectedIndex === -1) {
          newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
          newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
          newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
          newSelected = newSelected.concat(
            selected.slice(0, selectedIndex),
            selected.slice(selectedIndex + 1),
          );
        }
        setSelected(newSelected);
      };

    const [open,setOpen]=React.useState(false)
    const [anchorEl,setAnchorEl]=React.useState(null)
    const openMenu=(event)=>{
        setOpen(!open)
        setAnchorEl(event.currentTarget)
    }
    const handleCloseMenu=()=>{
        setAnchorEl(null)
        setOpen(false)
    }
    const moveToSelected=()=>{
        
        for(let i=0;i<selected.length;i++)
        {
            const params=JSON.stringify({"candidate_id":selected[i]})
            axios
            .post("http://localhost:8000/candidate_round/move_to_selected/",params,{headers:{'Content-Type':'application/json'}},{withCredentials:true})
        }
        window.location.href=window.location.href

    }
    const moveToInterview=()=>{
        for(let i=0;i<selected.length;i++)
        {
            const params=JSON.stringify({"candidate_id":selected[i]})
            axios
            .post("http://localhost:8000/candidate_round/move_to_interview/",params,{headers:{'Content-Type':'application/json'}},{withCredentials:true})
        }
        window.location.href=window.location.href
    }

    return(      
        <>
        <TableBody>
            
        {(orderedRows.slice(page*rowsPerPage,(page+1)*rowsPerPage)).map((row,index)=>{
            const isItemSelected = isSelected(row.id);
            return(
            <TableRow hover selected={isItemSelected}  onClick={(event) => handleClick(event, row.id)}>          
            <TableCell padding="checkbox"><Checkbox checked={isItemSelected}/></TableCell>
            <TableCell>{index+1}</TableCell>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.enrollment}</TableCell>
            <TableCell>{row.eval_status}</TableCell>          
            {sections.map((s)=>(
                <>
                {s.ques_list.map((ques)=>(
                    <TableCell align="center" onClick={()=>{handleOpenModal(ques.q_id,row.id)}} sx={{cursor:'pointer'}}>
                    {row.mark_list.map((mark,index)=>(
                        <>
                        {mark[0]==ques.q_id?<div title={mark[2]}>{mark[1]}</div>:null}                         
                        </>
                    ))}
                    </TableCell>
                ))}
                </>
            ))} 



            <Modal open={openModal} onClose={handleCloseModal}>
            <Box sx={{height:"20vh", width:"20vw", position:"absolute", bgcolor:"background.paper", boxShadow:24, top:"50%",left:"50%",transform: 'translate(-50%, -50%)', p:3}}>
                <Typography sx={{mb:3,fontSize:20,fontWeight:'bold'}}>Update Marks and Remarks</Typography>
                <FormControl sx={{mb:3}}>
                    <label for="marks">Enter New Marks*</label>
                    <input type="number" onChange={handleMarksChange} id="marks" placeholder="Mandatory Field" />
                </FormControl>
                <FormControl>
                    <label for="remarks">Enter New Remarks</label>
                    <input type="text" onChange={handleRemarksChange} id="remarks"/>
                </FormControl>

                <Button variant="contained" sx={{position:"absolute", right:"2vw", bottom:'2vh'}} onClick={()=>{changeMarksRemarks(marks,remarks)}}>Submit</Button>
            </Box>
            </Modal>

            
            </TableRow>            
        )})}
        </TableBody>
        

        <TableFooter  sx={{pt:3}}>   
        <Button variant="contained" sx={{height:'1%', width:'40%',mt:1}} onClick={openMenu}>Move to  Round</Button>
                <Menu open={open} anchorEl={anchorEl} onClose={handleCloseMenu} >
                    
                    <MenuItem onClick={()=>{moveToInterview()}}>Interview Round </MenuItem>
                    
                    <MenuItem onClick={()=>{moveToSelected()}}>Selected</MenuItem>
                </Menu>     
            <TableRow>
           
                <TablePagination rowsPerPageOptions={[2,3,5]}
                count={orderedRows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}/>
            </TableRow>            
        </TableFooter>


        
        </>        
        
    )
}
