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
import { convertHtmlToDelta } from 'quill-delta-to-html';

const turndownService = new TurndownService();

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
  const [isSaving, setIsSaving] = useState(false);
  const [hasContent, setHasContent] = useState(false);

  useImperativeHandle(ref, () => ({
    getEditorInstance: () => quill,
    getText: () => (quill ? quill.getText() : ''),
    getSelection: () => (quill ? quill.getSelection() : null),
    setGeneratedText: (text) => {
      if (quill) {
        console.log('Generated Text (Markdown):', text);

        // Convert Markdown to HTML
        const html = marked(text);
        console.log('Converted HTML:', html);

        // Convert HTML to Delta format
        const delta = quill.clipboard.convert(html);
        console.log('Converted Delta:', delta);

        // Set content in Quill
        quill.setContents(delta);
        
        // Alternative approach: Directly setting HTML (for debugging)
        quill.root.innerHTML = html;
        console.log('Editor root innerHTML set directly');
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
        toolbar: TOOLBAR_OPTIONS,
        markdownShortcuts: {
          bold: true,
          italic: true,
          strike: true,
          link: true,
          header: true,
          blockquote: true,
          code: true,
          list: true
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

      // Add paste handler for markdown
      quill.root.addEventListener('paste', handlePaste);
      return () => quill.root.removeEventListener('paste', handlePaste);
    }
  }, [quill]);

  const handlePaste = useCallback((e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text');
    if (text) {
      const html = marked(text); // Convert Markdown to HTML
      const delta = quill.clipboard.convert(html);
      quill.setContents(delta); // Replace editor content with formatted HTML
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
  

  return (
    <div className="editor-container">
      <div className="quill-wrapper" ref={wrapperRef} />

      {hasContent && (
        <div className="editor-button-container">
          <button
            className="add-symbol-button"
            onClick={() => {
              if (quill) {
                const length = quill.getLength();
                quill.insertText(length - 1, '+');
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
