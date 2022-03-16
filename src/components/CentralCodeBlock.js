import React from 'react'
import axios from 'axios'
import qs from 'qs'
import { useEffect } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const CentralCodeBlock = ({path}) => {

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


  return (
    <div>
        <SyntaxHighlighter language="java" style={docco} showLineNumbers="True">
            {text}
        </SyntaxHighlighter>
    </div>
  )
}

export default CentralCodeBlock