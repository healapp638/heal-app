'use client';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import React, { useEffect, useRef } from 'react';

// Type assertion to fix the TypeScript error
const CustomEditorComponent = CKEditor as any;

interface CustomEditorProps {
  editorData?: string;
  setEditorData?: (data: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const CustomEditor = ({
  editorData = '',
  setEditorData,
  placeholder = 'Enter content here...',
  disabled = false,
}: CustomEditorProps) => {
  const editorRef = useRef<any>(null);

  // Update editor content when editorData changes externally
  useEffect(() => {
    if (editorRef.current) {
      try {
        const currentData = editorRef.current.getData();
        
        // Only update if the content is actually different
        if (editorData !== currentData) {
          editorRef.current.setData(editorData);
        }
      } catch (error) {
        console.error('Error updating editor:', error);
      }
    }
  }, [editorData]);

  return (
    <div className="ckeditor-wrapper" style={{ minHeight: '400px' }}>
      <CustomEditorComponent
        editor={ClassicEditor}
        data={editorData}
        disabled={disabled}
        config={{
          licenseKey: 'GPL',
          placeholder,
          // Optional: Add toolbar configuration if needed
          toolbar: {
            items: [
              'heading',
              '|',
              'bold',
              'italic',
              'link',
              'bulletedList',
              'numberedList',
              '|',
              'outdent',
              'indent',
              '|',
              'blockQuote',
              'insertTable',
              'mediaEmbed',
              'undo',
              'redo'
            ]
          }
        }}
        onReady={(editor: any) => {
          editorRef.current = editor;
          // Set initial content explicitly
          if (editorData) {
            editor.setData(editorData);
          }
        }}
        onChange={(event: any, editor: any) => {
          const data = editor.getData();
          setEditorData?.(data);
        }}
      />
    </div>
  );
};

export default CustomEditor;