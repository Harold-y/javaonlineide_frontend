import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { IconButton } from '@mui/material';
import axios from 'axios'
import { useEffect } from 'react'
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import InventoryIcon from '@mui/icons-material/Inventory';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

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

const FileList2 = () => {
    function addFileHelper(file) 
    {
            if(file.type === "folder")
            {
                var folderList = file.folderContainer;
                folderList.sort(function(a, b) {
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
                return (
                  <>
                    <ListItem style={styleItem} secondaryAction={
                        <IconButton edge="end" aria-label="delete">
                            <KeyboardArrowDownIcon style={{height:'20px', width:'20px'}}/>
                        </IconButton>
                  }>
                        <ListItemAvatar>
                        <Avatar style={styleAvatar}>
                            <FolderIcon style={styleIcon}/>
                        </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={file.fileName} style={{marginLeft:'-15px'}}/>
                    </ListItem>
                    <List style={styleList}>{folderList.map((file)=>{return (addFileHelper(file))})}</List>
                  </>
                )   
            }else if(file.type !== undefined)
            {
                return (
                <ListItem style={styleItem}>
                    <ListItemAvatar>
                      <Avatar style={styleAvatar}>
                        <InsertDriveFileIcon style={styleIcon}/>
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={file.fileName} style={{marginLeft:'-15px'}}/>
                  </ListItem>)
            }else{
                return ("")
            }
    }
    function addFile(files)
    {
        
        var folderList = files.folderContainer;
        folderList.sort(function(a, b) {
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
        return (<List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }} dense='dense'>
            <ListItem style={styleItem}>
                        <ListItemAvatar>
                        <Avatar style={styleAvatar}>
                            <InventoryIcon style={styleIcon}/>
                        </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={files.fileName} secondary="Project" />
            </ListItem>
            <List style={styleList}>{folderList.map((file)=>{return (addFileHelper(file))})}</List>
        </List>)
    }
    const [listFiles, setListFiles] = React.useState([])
    useEffect(() => {
        const getFiles = () => {
            axios.get(`http://localhost:8888/sf/searchFile`).then(function(response)
            {
                setListFiles(response.data.t);
            })
        }
        getFiles()
    }, [])
   
  return (
    <div>
        {() => {addFile(listFiles)}}
    </div>
  )
}

export default FileList2