import React, { useEffect, useCallback, useImperativeHandle, useState, forwardRef } from 'react';
import Quill from 'quill';
import MarkdownShortcuts from 'quilljs-markdown';
import 'quill/dist/quill.snow.css';
import { useParams } from 'react-router-dom';
import './Editor.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import debounce from "lodash/debounce";
import { marked } from 'marked'; // Import marked
import TurndownService from 'turndown';
import { useItems } from '../ItemsContext';
import QuillTableBetter from 'quill-table-better';
import 'quill-table-better/dist/quill-table-better.css'

Quill.register({
  'modules/table-better': QuillTableBetter
}, true);

const turndownService = new TurndownService();

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ color: [] }, { background: [] }],
  [{ script: 'sub' }, { script: 'super' }],
  [{ align: [] }],
  ['table-better'],
  ['image', 'blockquote'],
  ['clean'],
  
];



const TextEditor = forwardRef((props, ref) => {
  const { id: documentId } = useParams();
  const [quill, setQuill] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasContent, setHasContent] = useState(false);
  const { items, setItems, addItem } = useItems();
  const { section } = props;


  useImperativeHandle(ref, () => ({
    getEditorInstance: () => quill,
    getText: () => (quill ? quill.getText() : ''),
    getSelection: () => (quill ? quill.getSelection() : null),
    setGeneratedText: (text) => {
      if (quill) {
        const html = marked(text);
        console.log(html);
        const delta = quill.clipboard.convert(html);
        console.log(delta);
        //quill.setContents(delta);
        //quill.root.innerHTML = html;
        quill.clipboard.dangerouslyPasteHTML(0, html);
        setHasContent(true);
      } else {
        console.warn("Quill editor instance not ready");
      }
    }
  }), [quill]);

  const wrapperRef = useCallback((wrapper) => {
    if (!wrapper) return;
    wrapper.innerHTML = '';
    const editor = document.createElement('div');
    wrapper.append(editor);
    Quill.register('modules/markdownShortcuts', MarkdownShortcuts);
    const q = new Quill(editor, {
      theme: 'snow',
      modules: {
        table: false,
        'table-better': {
          language: 'en_US',
          menus: ['column', 'row', 'merge', 'table', 'cell', 'wrap', 'delete'],
          toolbarTable: true
        },
        keyboard: {
          bindings: QuillTableBetter.keyboardBindings
        },
        toolbar: TOOLBAR_OPTIONS,
        markdownShortcuts: {
          bold: true,
          italic: true,
          strike: true,
          link: true,
          header: true,
          blockquote: true,
          code: true,
          list: true,
          table: true
        }
      },
    });
    new MarkdownShortcuts(q);
    

    q.disable();
    q.setText('Loading...');
    setQuill(q);
  }, []);

  

  useEffect(() => {
    if (quill) {
      quill.enable();
      quill.root.style.color = 'black';

      setHasContent(quill.getText().trim().length > 0);

      // // Get the toolbar instance
      // const toolbar = quill.getModule('toolbar');

      // // Create a custom button for inserting a table
      // const buttonContainer = document.querySelector('.ql-toolbar');
      // const tableButton = document.createElement('button');
      // tableButton.innerHTML = 'Table'; // You can use an icon here if preferred
      // tableButton.classList.add('ql-table-button');

      // // Append the button to the toolbar
      // buttonContainer.appendChild(tableButton);

      // // Add event listener to insert a table on button click
      // tableButton.addEventListener('click', () => {
      //   quill.getModule('better-table').insertTable(3, 3); // Example: insert a 3x3 table
      // });


      quill.root.addEventListener('paste', handlePaste);
      return () => quill.root.removeEventListener('paste', handlePaste);
    }
  }, [quill]);

  const handlePaste = useCallback((e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text');
    if (text) {
      const html = marked(text);
      const delta = quill.clipboard.convert(html);
      quill.setContents(delta);
    }
  }, [quill]);

  const saveContent = () => {
    if (quill && !isSaving) {
      const content = quill.root.innerHTML;
      setIsSaving(true);

      setTimeout(() => {
        toast.success('Content saved successfully!');
        setIsSaving(false);
      }, 1000);
    }
  };

  const debouncedSaveContent = useCallback(debounce(saveContent, 1000), [quill]);

  useEffect(() => {
    if (quill) {
      const handleTextChange = () => {
        const content = quill.getText().trim();
        setHasContent(content.length > 0);
        debouncedSaveContent();
      };

      quill.on('text-change', handleTextChange);
      return () => quill.off('text-change', handleTextChange);
    }
  }, [quill, debouncedSaveContent]);

  const handleAddSymbol = () => {
    if (quill) {
      const text = quill.root.innerHTML.trim(); // Retrieve HTML and trim any extra whitespace
  
      setItems((items) => {
        const duplicateIndex = items.findIndex((item) => item.section === section);
  
        if (duplicateIndex !== -1) {
          // Update the text at the duplicate index
          return items.map((item, idx) =>
            idx === duplicateIndex ? { ...item, text: text } : item
          );
        } else {
          // Append the new item to the array
          return [...items, { section: section, text: text }];
        }
      });
    }
    console.log(items);
  };
  
  return (
    <div className="editor-container">
      <div className="quill-wrapper" ref={wrapperRef} />

      {hasContent && (
        <div className="editor-button-container">
          <button
            className="add-symbol-button"
            onClick={handleAddSymbol}
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
