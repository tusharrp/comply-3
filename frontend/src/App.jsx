import React, { useRef, useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import TextEditor from './components/Editor';
import InputBox from './components/InputBox';
import Taskbar from './components/Taskbar';

function App() {
  const [editorContent, setEditorContent] = useState(''); // State to hold editor content
  const editorRef = useRef(); // Reference to TextEditor
  const inputRef = useRef();  // Reference to InputBox

  // Function to get editor content and selection
  const getValues = () => {
    const editor = editorRef.current.getEditorInstance();
    const text = editor.getText();
    const selection = editor.getSelection();
    let sel = null;
    if (selection === null) {
      sel = '';
    }else{
      if (selection.length === 0) {
        sel = '';
      } else {
        sel = text.substring(selection.index, selection.length + selection.index);
      }
      return { Text: text, Sel: sel };
    }
  };

  const handleEditorChange = (data) => {
    const editor = editorRef.current.getEditorInstance();
    const text = editor.getText();
    const selection = editor.getSelection();
    const newText = data;  // The new text to replace the selected text
    editor.deleteText(selection.index, selection.length);  // Remove the old text
    editor.insertText(selection.index, newText);
  }

  // Function to handle form submission from InputBox
  const handleSubmit = async (input) => {
    try {
      const editorContent = getValues().Text;
      const textToEdit = getValues().Sel;
      const prompt = input; // The input from InputBox is passed here

      const data = {
        industry: 'Pharmaceutical Manufacturing',
        doctype: 'SOP',
        title: '',
        context: editorContent,
        textToEdit: textToEdit,
        prompt: prompt,
      };

      console.log('Request Payload:', data);

      // Send data to backend
      const res = await fetch('http://localhost:5000/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      handleEditorChange(result.response); // Update editor with response
    } catch (error) {
      console.error('Error:', error);
      // Handle error (you can also set an error message in a state)
    }
  };

  return (
    <div className="app-container">
      <div className='taskbar'>
          <Taskbar/>
      </div>
      <Sidebar />
      <div className='middle-section'>
        <div className='editor'>
          <TextEditor ref={editorRef} content={editorContent} />
        </div>
        <InputBox ref={inputRef} onSubmit={handleSubmit} />  {/* Pass handleSubmit to InputBox */}
      </div>
    </div>
  );
}

export default App;
