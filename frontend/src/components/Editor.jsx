// src/components/TextEditor.jsx
import React, { useEffect, useCallback, useImperativeHandle, useState, forwardRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { useParams } from 'react-router-dom';
import './Editor.css'; // Custom CSS for better styling
import { ToastContainer, toast } from 'react-toastify'; // For notifications
import 'react-toastify/dist/ReactToastify.css'; // Include styles for notifications
import debounce from "lodash/debounce"; // Ensure lodash is imported

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ color: [] }, { background: [] }],
  [{ script: 'sub' }, { script: 'super' }],
  [{ align: [] }],
  ['image', 'blockquote', 'code-block'],
  ['clean'],
];

const TextEditor = forwardRef((props, ref) => {
  const { id: documentId } = useParams();
  const [quill, setQuill] = useState(null);
  const [isSaving, setIsSaving] = useState(false); // State for saving status

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    getEditorInstance: () => quill,
    getText: () => (quill ? quill.getText() : ''),
    getSelection: () => (quill ? quill.getSelection() : null),
  }));

  // Initialize Quill editor
  const wrapperRef = useCallback((wrapper) => {
    if (!wrapper) return;

    wrapper.innerHTML = ''; // Clean previous editor instance
    const editor = document.createElement('div');
    wrapper.append(editor);

    const q = new Quill(editor, {
      theme: 'snow',
      modules: { toolbar: TOOLBAR_OPTIONS },
    });

    q.disable(); // Disable until content loads
    q.setText('Loading...'); // Temporary loading state
    setQuill(q);
  }, []);

  // Enable editor once it's ready
  useEffect(() => {
    if (quill) {
      quill.enable();
      quill.root.style.color = 'black'; // Ensure text color is readable
    }
  }, [quill]);

  // Function to handle content save
  const saveContent = () => {
    if (quill && !isSaving) {
      const content = quill.root.innerHTML; // Get editor content
      setIsSaving(true); // Set saving status to true
      
      // Simulate an API call with a timeout (replace this with your actual API call)
      setTimeout(() => {
        // Assume save is successful; implement your save logic here
        // If there's an error, you can use toast.error() here
        toast.success('Content saved successfully!'); 
        setIsSaving(false); // Reset saving status after saving
      }, 1000); // Simulated save delay (1 second)
    }
  };

  // Create a debounced version of the saveContent function
  const debouncedSaveContent = useCallback(debounce(saveContent, 1000), [quill]); // Adjust the debounce time as necessary

  // Example of how to trigger save on user input
  useEffect(() => {
    if (quill) {
      quill.on('text-change', debouncedSaveContent); // Attach event listener to save on text change
    }

    return () => {
      if (quill) {
        quill.off('text-change', debouncedSaveContent); // Clean up event listener on unmount
      }
    };
  }, [quill, debouncedSaveContent]);

  return (
    <div className="editor-container">
      <div className="quill-wrapper" ref={wrapperRef} />
      <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar closeOnClick draggable pauseOnHover />
    </div>
  );
});

export default TextEditor;
