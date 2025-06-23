import { useEffect, useRef, forwardRef, useImperativeHandle, Dispatch, SetStateAction } from 'react';
import ClassicEditor from './ckeditor'; // Import your ClassicEditor
import { Editor } from '@ckeditor/ckeditor5-core'; // Import Editor type from CKEditor core
// import "./EditorComponent.css";

// Define the type of the ref that will be exposed via useImperativeHandle
export type EditorComponentRef = {
  getEditorContent: () => string; // Method to get editor content
  resetEditorContent?: () => void; // Method to reset editor content
  setEditorContent?: (content: string) => void; // Method to set editor content dynamically
};

type EditorComponentProps = {
  content?: string; // Optional content prop to set initial content
  setValue?: any;
  name?: string;
};

const EditorComponent = forwardRef<EditorComponentRef, EditorComponentProps>(
  ({ content = '<p></p>', setValue, name }, ref) => {
    const editorRef = useRef<HTMLDivElement>(null); // Reference for the editor container
    const editorInstanceRef = useRef<Editor | null>(null); // Store the editor instance

    // Use useImperativeHandle to expose getEditorContent to the parent component
    useImperativeHandle(ref, () => ({
      getEditorContent: () => {
        return editorInstanceRef.current?.getData() || ''; // Return the editor content or an empty string
      },
      resetEditorContent: () => {
        editorInstanceRef.current?.setData('<p></p>'); // Clear content
      },
      setEditorContent: (newContent: string) => {
        if (editorInstanceRef.current) {
          editorInstanceRef.current.setData(newContent); // Dynamically set the editor content
        }
      },
    }));

    useEffect(() => {
      if (editorRef.current) {
        ClassicEditor.create(editorRef.current, {
          initialData: content,
        })
          .then((editor) => {
            editor.model.document.on('change:data', () => {
              const data = editor.getData(); // Get the editor's current content
              if (setValue) setValue(name, data); // Update the form value
            });
            editorInstanceRef.current = editor; // Store the editor instance
            console.log('Editor was initialized', editor);
          })
          .catch((error) => {
            console.error('Error initializing the editor', error);
          });
      }

      // Cleanup function to destroy the editor when the component unmounts
      return () => {
        if (editorInstanceRef.current) {
          editorInstanceRef.current.destroy().then(() => {
            console.log('Editor was destroyed');
          });
        }
      };
    }, []);

    return <div ref={editorRef} id="editor"></div>;
  }
);

export default EditorComponent;
