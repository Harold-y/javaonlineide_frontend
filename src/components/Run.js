import React from 'react'
import Button from '@mui/material/Button';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import axios from 'axios';
import qs from 'qs';
import { TextField } from '@mui/material';

const divider = {
    float: 'left',
    left: '5%',
    top: '5%',
    bottom: '5%',
    marginLeft: '20px',
    marginRight: '20px',
    borderLeft: '1px solid #5E72E4',
    height: '20vh',
    width: '1px'
}
const Run = ({ path }) => {
    const [content, setContent] = React.useState('')

    const run = () => {
        setContent('');
        axios.post(`http://localhost:8888/compile/compile`, qs.stringify({ path: path, input: editText })).then(function (response) {
            setContent('<p>'+response.data.replace(/\n/g, "<br />")+'</p>');
        })
    }
    const [editText, setEditText] = React.useState('')

    return (
        <>
            <div style={{ float: 'left' }}>
                <div>
                    <Button variant="outlined" onClick={run} startIcon={<PlayArrowIcon />}>
                        Run
                    </Button>
                </div>
                <div style={{paddingTop:'5vh'}}>
                    <TextField
                        id="outlined-multiline-static"
                        label="StdIN"
                        multiline
                        rows={4}
                        defaultValue=""
                        value={editText} onChange={(e) => setEditText(e.target.value)}
                    />
                </div>

            </div>
            <div style={divider}>
                <br></br>
            </div>
            <div style={{ float: 'left' }} dangerouslySetInnerHTML={{__html: content}}>
                
            </div>

        </>
    )
}

export default Run