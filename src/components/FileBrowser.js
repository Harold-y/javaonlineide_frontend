import React from 'react'
import axios from 'axios'
import { useEffect } from 'react'

const FileBrowser = () => {
    const addFileHelper = (file) => 
    {
            if(file.type == "folder")
            {
                var folderList = file.folderContainer;
                folderList.sort(function(a, b) {
                    var typeA = a.type;
                    var typeB = b.type;
                    if(typeA == "folder" && typeB == "folder")
                        return a.fileName.toLowerCase() < b.fileName.toLowerCase()
                    if(typeA == "folder")
                        return -1;
                    if(typeB == "folder")
                        return 1;
                    return a.fileName.toLowerCase() < b.fileName.toLowerCase()
                });
                return (<div style={{paddingLeft:'20px'}}>
                    
                    <p> - Folder Name: {file.fileName}</p>
                    {folderList.map((file)=>{return (addFileHelper(file))})}
                </div>)
            }else if(file.type != undefined)
            {
                return (<div style={{paddingLeft:'20px'}}>
                    File Name: {file.fileName}&nbsp;&nbsp;&nbsp;&nbsp;
                    Type: {file.type}
                </div>)
            }else{
                return ("")
            }
    }
    const addFile = (files) =>
    {
        return (<div style={{border:"1px solid red"}}>
            {addFileHelper(files)}
        </div>)
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
        <h1>FileBrowser</h1>
        {addFile(listFiles)}
    </div>
  )
}

export default FileBrowser