import React,{useEffect} from 'react';
import { TableContainer,Table,TableHead,Checkbox,Menu,TableRow,TableCell,Typography, TableBody,TableFooter,TablePagination, FormControl, Select,InputLabel, TextField, Button,Modal, MenuItem} from '@mui/material';
import axios from 'axios';
import { Box, height } from '@mui/system';



const headers=[{value:'Sl No'},{value:"Name"},{value:'Phone'},{value:'Status'},{value:'Slot Timings'},{value:'Marks'},{value:'Remarks'}]
export default function InterviewTable(props)
{
    const {int_rounds,index}=props
    const [rows,setRows]=React.useState([])
    useEffect(()=>{
        axios
        .get("http://localhost:8000/interview_panel/get_info/",{params:{int_round_id:int_rounds[index].id}})
        .then(function(response){
            console.log(response.data)
            setRows(response.data)
            
        })
      
    },[index])

    return(<>

        <TableContainer>
        <Table>
        <TableHead>
            <TableRow>
            <TableCell padding="checkbox"></TableCell>
            {headers.map((header)=>(
                    <TableCell>
                        <Typography sx={{fontWeight:'bold', fontSize:20}}>
                           {header.value}
                           </Typography>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>

        <InterviewTableBody rows={rows} this_round_id={int_rounds[index].id} int_rounds={int_rounds}/>
        </Table>
        </TableContainer>
        </>
    )
}


function InterviewTableBody(props){

    const {rows, this_round_id, int_rounds}=props

    const [page,setPage]=React.useState(0);
    const[rowsPerPage,setRowsPerPage]=React.useState(5);
    const handleChangePage=(event,newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value));
        setPage(0);
      };


    let [status,setStatus]=React.useState(null)
    let [timing,setTiming]=React.useState('')
    let [marks,setMarks]=React.useState('');
    let [remarks,setRemarks]=React.useState('');
    const [rowID,setRowID]=React.useState(-1);
    const [openModal,setOpenModal]=React.useState(false)
    const handleOpenModal= (id,status,marks,remarks,timing) => {setOpenModal(true);setRowID(id);setStatus(status);setMarks(marks);setRemarks(remarks);setTiming(timing);};
    const handleClose = () => {setOpenModal(false);setRowID(-1);setStatus(null);setMarks('');setRemarks('');setTiming('');};
    const handleStatusChange=(event)=>{
        setStatus(event.target.value)
    }
    
    const handleTimingChange=(event)=>{
        setTiming(event.target.value)
    }
    const handleMarksChange=(event)=>{
        setMarks(event.target.value)
    }
    const handleRemarksChange=(event)=>{
        setRemarks(event.target.value)
    }
    const changeMarksRemarks=(marks,remarks)=>{
        if(marks=="")
        marks=null
        const params=JSON.stringify({"marks":marks,"remarks":remarks,"interview_id":rowID,"status":status,"timing":timing});
        axios
        .post("http://localhost:8000/candidate_marks/update_marks/",params,{headers:{"Content-Type":"application/json"}},{withCredentials:true})
        handleClose()
        window.location.href=window.location.href        
    }
    
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
    const moveToTest=()=>{
        for(let i=0;i<selected.length;i++)
        {
            const params=JSON.stringify({"id":selected[i]})
            axios
            .post("http://localhost:8000/candidate_round/move_to_test/",params,{headers:{'Content-Type':'application/json'}},{withCredentials:true})
        }
        window.location.href=window.location.href
    }
    const moveToSelected=()=>{
        for(let i=0;i<selected.length;i++)
        {
            const params=JSON.stringify({"id":selected[i]})
            axios
            .post("http://localhost:8000/candidate_round/move_to_selected/",params,{headers:{'Content-Type':'application/json'}},{withCredentials:true})
        }

    }
    const moveToInterview=(round_id)=>{
        for(let i=0;i<selected.length;i++)
        {
            const params=JSON.stringify({"candidate_id":selected[i],"round_id":round_id})
            axios
            .post("http://localhost:8000/candidate_round/move_to_interview/",params,{headers:{'Content-Type':'application/json'}},{withCredentials:true})
        }
    }

    return(
        <>
        <TableBody>
            {(rows.slice(page*rowsPerPage,(page+1)*rowsPerPage)).map((row,index)=>{
                const isItemSelected = isSelected(row.candidate_id);
                return(
            <TableRow hover selected={isItemSelected}  onClick={(event) => handleClick(event, row.candidate_id)} sx={{cursor:'pointer'}}>          
            <TableCell padding="checkbox"><Checkbox checked={isItemSelected}/></TableCell>
            <TableCell>{index+1}</TableCell>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.phone}</TableCell>
            <TableCell onClick={()=>{handleOpenModal(row.id,row.status,row.marks,row.remarks,row.slot_timing)}} >{row.slot_timing}</TableCell>
            <TableCell onClick={()=>{handleOpenModal(row.id,row.status,row.marks,row.remarks,row.slot_timing)}} >{row.marks}</TableCell>
            <TableCell onClick={()=>{handleOpenModal(row.id,row.status,row.marks,row.remarks,row.slot_timing)}} >{row.status}</TableCell>
            <TableCell onClick={()=>{handleOpenModal(row.id,row.status,row.marks,row.remarks,row.slot_timing)}} >{row.remarks}</TableCell>          
            </TableRow>
            )})}
        </TableBody>

        <TableFooter>

        <Button variant="contained" sx={{height:'4h', width:'10vw', mt:2}} onClick={openMenu}>Move to  Round</Button>
                <Menu open={open} anchorEl={anchorEl} onClose={handleCloseMenu} >
                    <MenuItem onClick={()=>{moveToTest()}}>Test Round / Project</MenuItem>
                    {int_rounds.map((round,index)=>{
                        return round.id!=this_round_id?
                    <MenuItem onClick={()=>{moveToInterview(round.id)}}>Interview Round {index+1}</MenuItem>:null
                    })}
                    <MenuItem onClick={()=>{moveToSelected()}}>Selected</MenuItem>
                </Menu>

        <TableRow>
            <TablePagination rowsPerPageOptions={[2,3,5]}
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}/>
        </TableRow>
        </TableFooter>


        <Modal open={openModal} onClose={handleClose}>
            <Box sx={{height:"50vh", width:"20vw", position:"absolute", bgcolor:"background.paper", boxShadow:24, top:"50%",left:"50%",transform: 'translate(-50%, -50%)', p:3}}>
                <Typography sx={{mb:3,fontSize:20,fontWeight:'bold'}}>Update Interview Details</Typography>

                <FormControl sx={{mb:3}}>
                    <Typography>Enter Interview Status</Typography>
                    <Select defaultValue={status} onChange={handleStatusChange}>
                        <MenuItem value="Notified">NOTIFIED</MenuItem>
                        <MenuItem value="Not notified">NOT NOTIFIED</MenuItem>
                        <MenuItem value="interview">IN_INTERVIEW</MenuItem>
                        <MenuItem value="Waiting">IN_WAITING_ROOM</MenuItem>
                        <MenuItem value="Complete">COMPLETE</MenuItem>
                    </Select>
                </FormControl>
                
               
                <FormControl sx={{mb:3}}>
                    <Typography>Update Slot Timing</Typography>
                    <input type="datetime-local" onChange={handleTimingChange} />
                </FormControl>
                <FormControl sx={{mb:3}}>
                    <Typography>Enter Marks</Typography>
                    <input type="number" defaultValue={marks} onChange={handleMarksChange}/>
                </FormControl>
                <FormControl>
                    <Typography>Enter Remarks</Typography>
                    <TextField defaultValue={remarks} onChange={handleRemarksChange} />
                </FormControl>

                <Button variant="contained" sx={{position:"absolute", right:"2vw", bottom:'2vh'}} onClick={()=>{changeMarksRemarks(marks,remarks)}}>Submit</Button>
            </Box>
            </Modal>

        </>
    )
}