import { Button } from "@mui/material";
import axios from "axios";
import React from "react";

export default function Upload(){

    const [selectFile, setSelectFile] = React.useState();
    const changeHandler=(event)=>{
        setSelectFile(event.target.files[0])
    }
    const uploadFile=()=>{
        const uploadData=new FormData()
        uploadData.append('File', selectFile)
        const url='http://localhost:8000/candidate_round/info_from_csv/'; 
        const config = {
            headers: { 'content-type': 'multipart/form-data' }
        }
        axios.post(url,uploadData,config)
    }

    //todo change formatting
    return(<div style={{position:'absolute', left:'40%',top:'45%',}}> 
        <input type="file" onChange={changeHandler}></input> 
        <Button variant="contained" onClick={uploadFile} sx={{position:'relative', right:'6%'}}>Upload Data</Button>
        </div>
    )
}
 