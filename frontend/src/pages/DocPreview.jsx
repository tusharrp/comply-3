import React from 'react';
import { useLocation } from 'react-router-dom';
import { useItems } from '../ItemsContext';
import { useCallback, useEffect, useState } from "react"
import Quill from "quill"
import "quill/dist/quill.snow.css"
import { useParams } from "react-router-dom"
import './DocPreview.css'
import MarkdownShortcuts from 'quilljs-markdown';
import { marked } from 'marked';
import QuillTableBetter from 'quill-table-better';
import 'quill-table-better/dist/quill-table-better.css'
import htmltopdf from 'html2pdf.js'

Quill.register({
  'modules/table-better': QuillTableBetter
}, true);


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

export function TextEditor() {
  const { id: documentId } = useParams()
  const [quill, setQuill] = useState(null);
  const [hasContent, setHasContent] = useState(false);
  const { items, setItems, addItem } = useItems();


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

  useEffect(() => {
    if (quill) {
      const combinedText = items.map(item => item.text).join('<br>');
      console.log(combinedText);
      quill.root.innerHTML = combinedText;
    }
  }, [quill, items]);

  return <div className="container" ref={wrapperRef}></div>
}

const DocPreview = () => {
  const location = useLocation();
  const { items, setItems, addItem } = useItems();

  const handlePrint = () => {
    const options = {
      margin: 1,
      filename: 'document.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    const element = document.querySelector('.ql-editor');
    htmltopdf().from(element).set(options).save();
  };

  return (
    <>
    <div className="taskbar">
      <h2>Taskbar</h2>
      <button className="print-button" onClick={handlePrint}>Print</button>
    </div>
    <div className="doc-preview-container">
      
      <div className="title">
      </div>
    </div>
    <TextEditor />
    </>
  );
};

export default DocPreview;
