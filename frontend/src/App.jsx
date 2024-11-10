import React, { useRef, useState, useEffect } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import TextEditor from './components/Editor';
import InputBox from './components/InputBox';
import Taskbar from './components/Taskbar';
import Console from './components/Console';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import DocPreview from './pages/DocPreview';
import { ItemsProvider, useItems } from './ItemsContext';

function AppLayout() {
  const [editorContent, setEditorContent] = useState(''); // State to hold editor content
  const editorRef = useRef(); // Reference to TextEditor
  const inputRef = useRef();  // Reference to InputBox
  const { items, setItems, addItem } = useItems();
  // const [items, setItems] = useState([]);

  // // Initial items for testing
  // useEffect(() => {
  //   const initialItems = [
  //     { section: 'Item 1', text: 'This is the first item.' },
  //     { section: 'Item 2', text: 'This is the second item.' },
  //     { section: 'Item 3', text: 'This is the third item.' },
  //   ];
  //   setItems(initialItems);
  // }, []);

  // const addItem = (newsection, newText) => {
  //   setItems([...items, { section: newsection, text: newText }]);
  //   console.log(items);
  // };

  const [dropdownValues, setDropdownValues] = useState({
    documentType: '',
    section: '',
  });

  const handleDropdownChange = (dropdownType, value) => {
    setDropdownValues(prevValues => ({
      ...prevValues,
      [dropdownType]: value,
    }));
  };

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
    editorRef.current.setGeneratedText(data); // This will set the new content in the editor
  };

  // Function to handle form submission from InputBox
  const handleSubmit = async (input) => {
    try {
      const editorContent = getValues().Text;
      const textToEdit = getValues().Sel;
      const prompt = input; // The input from InputBox is passed here

      const data = {
        industry: 'Pharmaceutical Manufacturing',
        doctype: dropdownValues.documentType,
        section: dropdownValues.section,
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

  const handleConsoleClick = (index) => {
    const editor = editorRef.current.getEditorInstance();
    const text = editor.getText();
  
    setItems((prevItems) => {
      const duplicateIndex = prevItems.findIndex((item) => item.section === dropdownValues.section);
  
      if (duplicateIndex !== -1) {
        // Create a new array with the updated text at the duplicate index
        return prevItems.map((item, idx) =>
          idx === duplicateIndex ? { ...item, text: text } : item
        );
      } else {
        // Append the new item to the array
        return [...prevItems, { section: dropdownValues.section, text: text }];
      }
    });
  };
  


  return (
      <div className="app-container">
        <div className='taskbar'>
          <Taskbar onDropdownChange={handleDropdownChange} />
        </div>
        <Sidebar />
        <div className='middle-section'>
          <div className='editor'>
            <TextEditor ref={editorRef} content={editorContent} setItems={setItems} onAddItem={handleConsoleClick} section={dropdownValues.section} />
          </div>
          <InputBox ref={inputRef} onSubmit={handleSubmit} />
        </div>
        <Console items={items} onItemSelect={handleConsoleClick} />
      </div>
  );
}

function App() {
  return (
    <ItemsProvider>
    <Router>
      <Routes>
        {/* Main layout for the app */}
        <Route path="/" element={<AppLayout />} />
        
        {/* Standalone route for DocPreview */}
        <Route path="/docpreview" element={<DocPreview />} />
      </Routes>
    </Router>
    </ItemsProvider>
  );
}

export default App;
