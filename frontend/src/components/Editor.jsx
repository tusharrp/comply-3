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
  const [hasContent, setHasContent] = useState(false); // State to track if content is present

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    getEditorInstance: () => quill,
    getText: () => (quill ? quill.getText() : ''),
    getSelection: () => (quill ? quill.getSelection() : null),
    setGeneratedText: (text) => {
      if (quill) {
        quill.setText(text);       // Set the generated text
        setHasContent(text.trim().length > 0); // Show "+" button if content is present
      }
    }
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

  // Enable editor and set content check once it's ready
  useEffect(() => {
    if (quill) {
      quill.enable();
      quill.root.style.color = 'black'; // Ensure text color is readable
      
      // Check initial content to update hasContent
      setHasContent(quill.getText().trim().length > 0);
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
        toast.success('Content saved successfully!'); 
        setIsSaving(false); // Reset saving status after saving
      }, 1000); // Simulated save delay (1 second)
    }
  };

  // Create a debounced version of the saveContent function
  const debouncedSaveContent = useCallback(debounce(saveContent, 1000), [quill]); // Adjust the debounce time as necessary

  // Track content changes to show/hide the "+" button
  useEffect(() => {
    if (quill) {
      const handleTextChange = () => {
        const content = quill.getText().trim();
        setHasContent(content.length > 0); // Update hasContent based on text presence
      };

      quill.on('text-change', handleTextChange); // Attach event listener to track content changes
      return () => quill.off('text-change', handleTextChange); // Clean up event listener on unmount
    }
  }, [quill]);

  return (
    <div className="editor-container">
      <div className="quill-wrapper" ref={wrapperRef} />
      
      {/* Conditionally render the "+" symbol button based on content */}
      {hasContent && (
        <div className="editor-button-container">
          <button
            className="add-symbol-button"
            onClick={() => {
              if (quill) {
                const length = quill.getLength(); // Get current length of the content
                quill.insertText(length - 1, '+'); // Insert '+' at the end of content
              }
            }}
          >
            +
          </button>
        </div>
      )}

      <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar closeOnClick draggable pauseOnHover />
    </div>
  );
});

export default TextEditor;
