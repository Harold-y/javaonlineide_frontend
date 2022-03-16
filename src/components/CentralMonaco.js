import React, { useRef } from 'react'
import Editor, { DiffEditor, useMonaco, loader } from "@monaco-editor/react";
import axios from 'axios'
import qs from 'qs'
import { useEffect } from 'react'
import { IconButton } from '@mui/material';
import SaveAsIcon from '@mui/icons-material/SaveAs';


const CentralMonaco = ({path}) => {
    const [text, setText] = React.useState("")

    useEffect(() => {
        const getContent = () => {
            axios.get(`http://localhost:8888/fileOp/getContent`, {params:{path:path}}).then(function(response)
                {
                    setText(response.data)
                })
        };
        getContent()
      }, [])

      const editorRef = useRef(null);

      function handleEditorDidMount(editor, monaco) {
        // here is the editor instance
        // you can store it in `useRef` for further usage
        editorRef.current = editor;
      }

      function showValue() {
        // TODO: update the file via button and do auto-save
        // console.log(editorRef.current.getValue());
      }

  return (
    <>
      <Editor
          height="74vh"
          width="100%"
          language='java'
          theme="vs-dark"
          defaultValue={text}
          onMount={handleEditorDidMount}
        />
        <div style={{position:'absolute'}}>
          <div>
            <iframe src='http://localhost:2222/ssh/host/129.146.137.164' style={{position:'fixed', bottom:'0px', left:'15vw', height:'17vh', width:'84vw'}}></iframe>
          </div>
          <IconButton aria-label="delete" onClick={showValue} 
            style={{position:'fixed', bottom:'20vh', right:'5vw', height:'60px', width:'60px', backgroundColor:'#2196F3'}}>
            <SaveAsIcon />
          </IconButton>
      
    </div>
    </>
  )
}

export default CentralMonaco