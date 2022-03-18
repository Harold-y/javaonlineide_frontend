import React from 'react'
import { useEffect } from 'react'
import { ListItem } from '@mui/material'
import { ListItemAvatar, ListItemText } from '@mui/material'
import { Avatar } from '@mui/material'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { GrJava } from 'react-icons/gr'
import { FiCoffee } from 'react-icons/fi'
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';
import { AiFillSetting } from 'react-icons/ai'
import { RiFilePaperLine } from 'react-icons/ri'
import { RiLeafLine } from 'react-icons/ri'
import { GiMasonJar } from 'react-icons/gi'
import { AiOutlineFileMarkdown } from 'react-icons/ai'
import { ImFilePicture } from 'react-icons/im'
import { useState } from 'react'
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import DeleteIcon from '@mui/icons-material/Delete';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { IconButton } from '@mui/material'
import { Popover, List, ListItemButton } from '@mui/material'
import { ListItemIcon, Divider } from '@mui/material'
import axios from 'axios'
import { Modal } from '@mui/material'
import { Backdrop } from '@mui/material'
import { Fade } from '@mui/material'
import { Box } from '@mui/system'
import { Typography } from '@mui/material'
import { TextField } from '@mui/material'
import { Button } from '@mui/material'
import qs from 'qs'
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Tooltip from '@mui/material/Tooltip';

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

const styleBlock = {
  cursor: 'default',
  userSelect: 'none'
}

const styleHovered = {
  backgroundColor: '#F5ECE7'
}

const styleAvatar = {
  height: '30px',
  width: '30px',
}

const styleIcon = {
  height: '20px',
  width: '20px',
}

const styleItem = {
  paddingLeft: '20px',
  paddingTop: '0px',
  paddingBottom: '0px',
}

const File = (props) => {
  const [name, setName] = React.useState("")
  const [path, setPath] = React.useState("")
  const [type, setType] = React.useState("")
  const [parent, setParent] = React.useState("")

  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const setInfo = () => {
      setName(props.fileName)
      setPath(props.path)
      setType(props.type)
      setParent(props.parent)
    };
    setInfo()
  }, [props.fileName, props.path, props.type, props.parent])

  const getIcon = () => {
    if (type === "java") {
      return (<FiCoffee style={styleIcon}></FiCoffee>)
    }
    if (type === "txt") {
      return (<TextSnippetOutlinedIcon style={styleIcon}></TextSnippetOutlinedIcon>)
    }
    if (type === "iml") {
      return (<AiFillSetting style={styleIcon}></AiFillSetting>)
    }
    if (type === "xml") {
      return (<RiFilePaperLine style={styleIcon}></RiFilePaperLine>)
    }
    if (type === "properties" || type === "yml" || type === "yaml") {
      return (<RiLeafLine style={styleIcon}></RiLeafLine>)
    }
    if (type === "jar") {
      return (<GiMasonJar style={styleIcon}></GiMasonJar>)
    }
    if (type === "md") {
      return (<AiOutlineFileMarkdown style={styleIcon}></AiOutlineFileMarkdown>)
    }
    if (type === "jpg" || type === "jpeg" || type === "png" || type === "git" || type === "webp") {
      return (<ImFilePicture style={styleIcon}></ImFilePicture>)
    }
    else {
      return (<InsertDriveFileIcon style={styleIcon} />)
    }
  }



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

  const [wisdom, setWisdom] = React.useState("")
  const [wisdomOrg, setWisdomOrg] = React.useState("")

  const getWisdom = () => {
    setEditText("")
    axios.get(`http://localhost:8888/wisdom/rand`).then((res) => {
      setWisdom(res.data.wisdomDescription)
      setWisdomOrg(res.data.wisdomOrigin)
    })
  }

  const [editText, setEditText] = React.useState("")
  const [editOpen, setEditOpen] = React.useState(false)
  const handleEditModal = () => {
    setEditOpen(!editOpen);
  };

  const [invisibility, setInvisibility] = React.useState(false);

  const deleteFile = () => {
    axios.delete(`http://localhost:8888/fileOp/deleteFile`, { params: { path: path } }).then(function (response) {
      if (response.data === true) {
        setInvisibility(true);
        setOpenAlert(true);
      }
    })
  }

  const editFileName = () => {
    axios.post(`http://localhost:8888/fileOp/renameFile`, qs.stringify({
      path: parent + "/" + name,
      newName: editText
    })).then(function (response) {
      if (response.data === true) {
        setName(editText);
        getIcon();
        setOpenAlert(true);
      }
    })
    setEditText("")
    setEditOpen(false)
  }

  const [openAlert, setOpenAlert] = React.useState(false);

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenAlert(false);
  };

  const handleNameTooLong = () => {
    if (name.length > 22)
      return name.substring(0, 21) + '...';
    return name;
  }

  return (
    <>

      {!invisibility ? <>
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
              <Typography id="modal-modal-title" variant="h6" component="h2" style={{ marginBottom: "20px" }}>
                Edit File Name
              </Typography>
              <form style={{ float: 'left' }}>
                <TextField id="outlined-basic" label="Name" variant="outlined"
                  value={editText} onChange={(e) => setEditText(e.target.value)} />
                <Button variant="outlined" style={{ marginLeft: '50px', padding: '15px' }} onClick={() => { editFileName() }}>Confirm</Button>
                <Divider style={{ marginTop: '20px', marginBottom: '20px' }} />
                <Typography variant="body2" gutterBottom >
                  {wisdom} —— {wisdomOrg}
                </Typography>
              </form>
            </Box>
          </Fade>
        </Modal>
        <Tooltip title={name}>
          <ListItem style={{ ...styleItem, ...styleBlock, ...(hovered ? styleHovered : null) }}
            onMouseEnter={() => {
              setHovered(true);
            }}
            onMouseLeave={() => {
              setHovered(false);
            }}
            secondaryAction={
              <>
                <IconButton edge="end" aria-label="more">
                  <MoreHorizIcon onClick={handleClick} style={{ height: '20px', width: '20px' }} />
                </IconButton>
                <IconButton edge="end" aria-label="new">
                  <OpenInNewIcon onClick={() => { props.handleNewOpenClick(path, name, type) }} style={{ height: '20px', width: '20px' }} />
                </IconButton>
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
                      <ListItemButton onClick={() => { getWisdom(); setEditText(name); setEditOpen(true); }}>
                        <ListItemIcon>
                          <DriveFileRenameOutlineIcon />
                        </ListItemIcon>
                        <ListItemText primary="Edit File Name" />
                      </ListItemButton>
                    </ListItem>
                    <Divider />
                    <ListItem disablePadding >
                      <ListItemButton onClick={deleteFile}>
                        <ListItemIcon>
                          <DeleteIcon />
                        </ListItemIcon>
                        <ListItemText primary="Delete File" />
                      </ListItemButton>
                    </ListItem>
                  </List>
                </Popover>
              </>

            }
          >
            <ListItemAvatar>
              <Avatar style={styleAvatar}>
                {getIcon()}

              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={handleNameTooLong()} style={{ marginLeft: '-15px' }} />
          </ListItem>
        </Tooltip>

      </> : ''}

    </>

  )
}

export default File