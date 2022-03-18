import React, { useRef } from 'react'
import Editor, { DiffEditor, useMonaco, loader } from "@monaco-editor/react";
import axios from 'axios'
import qs from 'qs'
import { useEffect } from 'react'
import { IconButton } from '@mui/material';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import Snackbar from '@mui/material/Snackbar';
import { Alert } from '@mui/material';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Run from './Run';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const CentralMonaco = ({ path, text, type }) => {
  const editorRef = useRef(null);

  const handleKeyDown = (event) => {
    let charCode = String.fromCharCode(event.which).toLowerCase();
    if ((event.ctrlKey || event.metaKey) && charCode === 's') {
      event.preventDefault();
      saveFile();
    }
  }

  function handleEditorDidMount(editor, monaco) {
    // here is the editor instance
    // you can store it in `useRef` for further usage
    editorRef.current = editor;
  }

  function saveFile() {
    // console.log(editorRef.current.getValue());
    axios.post(`http://localhost:8888/fileOp/updateFile`, qs.stringify(
      {
        path: path,
        content: editorRef.current.getValue()
      }
    )).then(function (response) {
      if (response.data === 0) {
        setOpenAlert(true)
      } else {
        setOpenAlert2(true)
      }
    })

  }

  const [openAlert, setOpenAlert] = React.useState(false);

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenAlert(false);
  };

  const [openAlert2, setOpenAlert2] = React.useState(false);

  const handleCloseAlert2 = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenAlert2(false);
  };

  const detectType = () => {
    if (type === 'py') {
      return 'python'
    }
    if (type === 'js') {
      return 'javascript'
    }
    if (type === 'iml') {
      return 'xml'
    }
    return type;
  }
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <div onKeyDown={handleKeyDown}>
      <Snackbar open={openAlert} autoHideDuration={3000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity="success" sx={{ width: '100%' }}>
          Saved !
        </Alert>
      </Snackbar>
      <Snackbar open={openAlert2} autoHideDuration={3000} onClose={handleCloseAlert2}>
        <Alert onClose={handleCloseAlert2} severity="error" sx={{ width: '100%' }}>
          Unable to Save
        </Alert>
      </Snackbar>
      <Editor
        height="74vh"
        width="100%"
        language={detectType()}
        theme="vs-dark"
        value={text}
        onMount={handleEditorDidMount}
      />
      <div style={{ position: 'absolute' }}>
        <div>

        </div>
        <IconButton aria-label="delete" onClick={saveFile}
          style={{ position: 'fixed', bottom: '20vh', right: '5vw', height: '60px', width: '60px', backgroundColor: '#2196F3' }}>
          <SaveAsIcon />
        </IconButton>

      </div>

      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Run" {...a11yProps(0)} />
            <Tab label="Terminal" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0} style={{height:'25vh'}}>
          <Run path={path}></Run>
        </TabPanel>
        <TabPanel value={value} index={1} style={{height:'25vh'}}>
          <iframe src='http://localhost:2222/ssh/host/129.146.137.164' style={{bottom:'0px', left:'15vw', height:'23vh', width:'80vw'}}></iframe>
        </TabPanel>
      </Box>
      
    </div>
  )
}

export default CentralMonaco