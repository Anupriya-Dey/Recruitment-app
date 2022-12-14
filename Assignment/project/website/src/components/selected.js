import { TableContainer,Table,Menu,MenuItem, Checkbox,TableBody,Button,Modal,Box,TableHead,TableCell,TableFooter,TablePagination,TableRow,Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect } from "react";


const headers=[{value:'Sl No'},{value:'Name'},{value:'Enrollment No'},{value:'Branch'},{value:'Email'},{value:'Phone'}]
export default function Selected(props){

    const {int_rounds, season_id}=props
    const [page,setPage]=React.useState(0);
    const[rowsPerPage,setRowsPerPage]=React.useState(5);
    const handleChangePage=(event,newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value));
        setPage(0);
    };

    const [rows,setRows]=React.useState([])
    useEffect(()=>{
        axios
        .get("http://localhost:8000/candidate_round/get_selected/",{params:{season_id:season_id}},{withCredentials:true})
        .then(function(response){
            setRows(response.data)
        })
    },[])


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
        console.log(newSelected)
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

        <TableBody>
            {(rows.slice(page*rowsPerPage,(page+1)*rowsPerPage)).map((row,index)=>{
            const isItemSelected = isSelected(row.id);
            return(
                <TableRow hover selected={isItemSelected}  onClick={(event) => handleClick(event, row.id)}>
                    <TableCell padding="checkbox"><Checkbox checked={isItemSelected}/></TableCell>
                    <TableCell>{index+1}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.enrollment}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{row.phone}</TableCell>
                </TableRow>
            )})}
        </TableBody>

        <TableFooter>
       

        <TableRow>
            <TablePagination rowsPerPageOptions={[1,3,5]}
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}/>
        </TableRow>
        </TableFooter>
            </Table>
        </TableContainer>


        </>
    )
}