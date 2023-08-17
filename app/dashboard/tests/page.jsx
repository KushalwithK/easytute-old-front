'use client'

import JoditEditor from 'jodit-react';
import { useRef, useState } from 'react';

const Tests = () => {

    const [content, setContent] = useState('')
    const editorRef = useRef(null)

    return (
        <div>
            <JoditEditor
                ref={editorRef}
                value={content}
                tabIndex={1} // tabIndex of textarea
                onChange={newContent => console.log(newContent)}
            />
        </div>
    )
}

export default Tests