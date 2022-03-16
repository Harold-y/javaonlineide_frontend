import * as React from 'react';
import { useEffect } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import axios from 'axios'
import InventoryIcon from '@mui/icons-material/Inventory';
import File from './File';
import Folder from './Folder';

const styleList = {
    paddingLeft:'20px',
    paddingTop:'8px',
    paddingBottom:'8px',
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
    paddingTop:'8px',
    paddingBottom:'8px',
}

const FileList = () => {
    const addFile = (project) =>
    {
        project.sort(function(a, b) {
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
                        <ListItemText primary={name} secondary="Project" />
            </ListItem>
            <List style={styleList}>{project.map((file)=>{
                if(file.type === "folder")
                {
                    return (<Folder fileName = {file.fileName} path = {file.path} folderContainer = {file.folderContainer}
                     numChildren = {file.numChildren} parent = {path} key = {file.path}></Folder>)
                }else {
                    return (<File fileName = {file.fileName} path = {file.path} type = {file.type} parent = {path} key = {file.path}></File>)
                }
            })}</List>
        </List>)
    }
    const [fileList, setListFiles] = React.useState([])
    const [name, setName] = React.useState("")
    const [path, setPath] = React.useState("")
    useEffect(() => {
        const getRegion = async () => {
            const res =
                await axios.get(`http://localhost:8888/sf/searchFile`);
                setListFiles(res.data.t.folderContainer);
                setName(res.data.t.fileName);
                setPath(res.data.t.path)
        };
        getRegion()
    }, [])
  return (
    <div>
        {addFile(fileList)}
    </div>
  )
}

export default FileList