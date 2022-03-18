import React, { Children } from 'react'
import { useEffect } from 'react'
import { List, ListItem } from '@mui/material'
import { IconButton } from '@mui/material'
import { ListItemAvatar } from '@mui/material'
import { Avatar } from '@mui/material'
import { ListItemText } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import DeleteIcon from '@mui/icons-material/Delete';
import File from './File'
import FolderIcon from '@mui/icons-material/Folder';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { hover } from '@testing-library/user-event/dist/hover'
import { useState } from 'react'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Popover from '@mui/material/Popover';
import { ListItemButton } from '@mui/material'
import ListItemIcon from '@mui/material/ListItemIcon';
import AddIcon from '@mui/icons-material/Add';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import qs from 'qs'
import axios from 'axios'
import { Modal } from '@mui/material'
import { Fade } from '@mui/material'
import { Box } from '@mui/system'
import { Typography } from '@mui/material'
import { Backdrop } from '@mui/material'
import { TextField } from '@mui/material'
import { Button } from '@mui/material'
import { Divider } from '@mui/material'
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

const styleHovered = {
    backgroundColor:'#F5ECE7',
    transitionDuration: '0.1s'
  }

const styleList = {
    paddingLeft:'20px',
    paddingTop:'5px',
    paddingBottom:'5px',
}

const styleAvatar = {
    height:'30px',
    width:'30px',
}

const styleIcon = {
    height:'20px',
    width:'20px',
}

const styleItem = {
    paddingLeft:'20px',
    paddingTop:'0px',
    paddingBottom:'0px',
}


const Folder = (props) => {
    const [name, setName] = React.useState("")
    const [path, setPath] = React.useState("")
    const [isOpen, setOpen] = React.useState(false)
    const [children, setChildren] = React.useState([])
    const [numChildren, setNumChildren] = React.useState(0)
    const [parent, setParent] = React.useState("")

    const [editOpen, setEditOpen] = React.useState(false)
    const [editText, setEditText] = React.useState("")

    const [wisdom, setWisdom] = React.useState("")
    const [wisdomOrg, setWisdomOrg] = React.useState("")

    const [invisibility, setInvisibility] = React.useState(false)

    const getWisdom = () => {
        setEditText("")
        axios.get(`http://localhost:8888/wisdom/rand`).then((res) => {
            setWisdom(res.data.wisdomDescription)
            setWisdomOrg(res.data.wisdomOrigin)
        })
    }

    const handleEditModal = () => {
        setEditOpen(!editOpen);
    };
    const [addType, setAddType] = React.useState(0) // 0 for folder, 1 for file, 2 for edit folder name

    const [hover, setHover] = useState(false);

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    useEffect(() => {
        const setInfo = () => {
            setName(props.fileName)
            setPath(props.path)
            sortChildren()
            setChildren(props.folderContainer)
            setNumChildren(props.numChildren)
            setParent(props.parent)
        };
        setInfo()
      }, [props.fileName, props.path, props.folderContainer, props.numChildren, props.parent])

    const reverseOpen = () => {
        setOpen(!isOpen)
        const res = axios.get(`http://localhost:8888/sf/searchFilePath`, {
            params:{
                path:path
            }
        }).then((res) => {
            sortChildren2(res.data.t.folderContainer)
            setChildren(res.data.t.folderContainer)
            setNumChildren(res.data.t.numChildren)
        });
    }

    const sortChildren = () => {
        props.folderContainer.sort(function(a, b) {
                    var typeA = a.type;
                    var typeB = b.type;
                    if(typeA === "folder" && typeB === "folder")
                        return a.fileName.toLowerCase() < b.fileName.toLowerCase()
                    if(typeA === "folder")
                        return -1;
                    if(typeB === "folder")
                        return 1;
                    return a.fileName.toLowerCase() < b.fileName.toLowerCase()
        });
    }

    const sortChildren2 = (chi) => {
        chi.sort(function(a, b) {
                    var typeA = a.type;
                    var typeB = b.type;
                    if(typeA === "folder" && typeB === "folder")
                        return a.fileName.toLowerCase() < b.fileName.toLowerCase()
                    if(typeA === "folder")
                        return -1;
                    if(typeB === "folder")
                        return 1;
                    return a.fileName.toLowerCase() < b.fileName.toLowerCase()
        });
    }

    const confirmOperation = () => {
        if (addType === 0) // add folder
        {
            addNewFolder();
        }
        if(addType === 1) // add file
        {
            addNewFile();
        }
        if(addType === 2) // Edit Folder Name
        {
            editFolder();
        }
        handleEditModal()
        setEditText("")
    }

    const addNewFolder = () => {
        axios.post(`http://localhost:8888/fileOp/createDir`, qs.stringify({
            path:path,
            name:editText
        })).then(function(response)
            {
                if(response.data === true)
                {
                    const res = axios.get(`http://localhost:8888/sf/searchFilePath`, {
                        params:{
                            path:path
                        }
                    }).then((res) => {
                        sortChildren2(res.data.t.folderContainer)
                        setChildren(res.data.t.folderContainer)
                        setNumChildren(res.data.t.numChildren)
                    });
                    setOpenAlert(true);
                }
            })
    }

    const addNewFile = () => {
        axios.post(`http://localhost:8888/fileOp/createFile`, qs.stringify({
            path:path,
            name:editText
        })).then(function(response)
            {
                if(response.data === true)
                {
                    /** 
                    var tempPath = path + "\\" + editText;
                    var type = editText.split('.');
                    var lastType = type[type.length - 1];
                    var fName = editText;
                    setChildren([...children, {fileName:fName, path:{tempPath}, type:{lastType}}])
                    sortChildren2()
                    */
                    const res = axios.get(`http://localhost:8888/sf/searchFilePath`, {
                        params:{
                            path:path
                        }
                    }).then((res) => {
                        sortChildren2(res.data.t.folderContainer)
                        setChildren(res.data.t.folderContainer)
                        setNumChildren(res.data.t.numChildren)
                    });
                    setOpenAlert(true);
                }
            })
    }

    const editFolder = () => {
        axios.post(`http://localhost:8888/fileOp/renameFile`, qs.stringify({
            path:parent + "/" + name,
            newName:editText
        })).then(function(response)
            {
                if(response.data === true)
                {
                    setName(editText);
                    setOpenAlert(true);
                }
            })
    }

    const deleteFolder = () => {
        axios.delete(`http://localhost:8888/fileOp/deleteFile`, {params:{path:path}}).then(function(response)
            {
                if(response.data === true)
                {
                    setOpenAlert(true);
                    setInvisibility(true);
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

  return (
    <>
        <Snackbar open={openAlert} autoHideDuration={3000} onClose={handleCloseAlert}>
            <Alert onClose={handleCloseAlert} severity="success" sx={{ width: '100%' }}>
            Success !
            </Alert>
      </Snackbar>
        <Modal
        open={editOpen}
        onClose={handleEditModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={editOpen}>
          <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2" style={{marginBottom:"20px"}}>
                     {addType === 0 ? "Create New Folder" : ""} {addType === 1 ? "Create New File" : ""} {addType === 2 ? "Edit Folder Name" : ""}
                </Typography>
                <form style={{float:'left'}}>
                    <TextField id="outlined-basic" label="Name" variant="outlined"
                    value = {editText}  onChange={(e) => setEditText(e.target.value)}/>
                    <Button variant="outlined" style={{marginLeft:'50px', padding:'15px'}} onClick={()=>{confirmOperation()}}>Create</Button>
                    <Divider style={{marginTop:'20px', marginBottom:'20px'}}/>
                    <Typography variant="body2" gutterBottom >
                        {wisdom} —— {wisdomOrg}
                    </Typography>
                </form>
          </Box>
        </Fade>
      </Modal>
      
        {!invisibility ? <ListItem onMouseEnter={()=>{
                setHover(true);
            }}
            onMouseLeave={()=>{
                setHover(false);
            }}
            style={{...styleItem, ...(hover ? styleHovered : null)}} secondaryAction={
                <>
                    <IconButton edge="end" aria-label="more">
                            <MoreHorizIcon onClick = {handleClick} style={{height:'20px', width:'20px'}}/>
                    </IconButton>
                    {
                        numChildren > 0 ? 
                        <IconButton edge="end" aria-label="delete">
                            {!isOpen ? <KeyboardArrowDownIcon onClick = {()=>{reverseOpen()}} style={{height:'20px', width:'20px'}}/> :
                            <KeyboardArrowUpIcon onClick = {()=>{reverseOpen()}} style={{height:'20px', width:'20px'}}/>}
                        </IconButton> : ''
                    }
                    <Popover
                        id={id}
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                        }}
                        
                    >
                        <List>
                            <ListItem disablePadding>
                                <ListItemButton onClick={() => {getWisdom(); setEditOpen(true); setAddType(1)}}>
                                <ListItemIcon>
                                    <AddIcon />
                                </ListItemIcon>
                                <ListItemText primary="Add New File" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton  onClick={() => {getWisdom(); setEditOpen(true); setAddType(0)}}>
                                <ListItemIcon>
                                    <CreateNewFolderIcon />
                                </ListItemIcon>
                                <ListItemText primary="Add New Folder"/>
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton  onClick={() => {getWisdom(); setEditText(name); setEditOpen(true); setAddType(2)}}>
                                <ListItemIcon>
                                    <DriveFileRenameOutlineIcon />
                                </ListItemIcon>
                                <ListItemText primary="Edit Dir Name"/>
                                </ListItemButton>
                            </ListItem>
                            <Divider/>
                            <ListItem disablePadding >
                                <ListItemButton onClick={deleteFolder}>
                                <ListItemIcon>
                                    <DeleteIcon />
                                </ListItemIcon>
                                <ListItemText primary="Delete Folder"/>
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </Popover>
                </>
                
        } onDoubleClick={()=>{reverseOpen()}}>
                <ListItemAvatar>
                <Avatar style={styleAvatar}>
                    {isOpen ? <FolderIcon style={styleIcon}/> : <FolderOpenIcon style={styleIcon}></FolderOpenIcon>}
                </Avatar>
                </ListItemAvatar>
                <ListItemText primary={name} style={{marginLeft:'-15px', cursor:'default', userSelect:'none'}}/>
            </ListItem> : ''}
        {isOpen && !invisibility ?
        <List style={styleList}>{
            children.map((file)=>{
                if(file.type === "folder")
                {
                    return (<Folder fileName = {file.fileName} path = {file.path} folderContainer = {file.folderContainer}
                    numChildren = {file.numChildren} key = {file.path} parent = { path } handleNewOpenClick={props.handleNewOpenClick}></Folder>)
                }else {
                    return (<File fileName = {file.fileName} path = {file.path} type = {file.type} key = {file.path} parent = {path} handleNewOpenClick={props.handleNewOpenClick}></File>)
                }
            })
        }</List> : ''}
  </>
    
  )
}

export default Folder