import { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';

interface MonacoEditorProps {
  code: string;
  onChange: (value: string | undefined) => void;
  theme?: 'light' | 'dark';
  language?: string;
  height?: string;
}

export function MonacoEditor({ 
  code, 
  onChange, 
  theme = 'light', 
  language = 'javascript',
  height = '100%'
}: MonacoEditorProps) {
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    
    // Configure Monaco Editor
    monaco.editor.defineTheme('custom-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#1e1e1e',
        'editor.foreground': '#d4d4d4',
        'editor.lineHighlightBackground': '#2a2a2a',
        'editor.selectionBackground': '#264f78',
        'editor.inactiveSelectionBackground': '#3a3d41',
      }
    });

    monaco.editor.defineTheme('custom-light', {
      base: 'vs',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#ffffff',
        'editor.foreground': '#000000',
        'editor.lineHighlightBackground': '#f8f9fa',
        'editor.selectionBackground': '#add6ff',
        'editor.inactiveSelectionBackground': '#e5ebf1',
      }
    });

    // Set up auto-completion for React
    monaco.languages.registerCompletionItemProvider('javascript', {
      provideCompletionItems: (model: any, position: any) => {
        const suggestions = [
          {
            label: 'React',
            kind: monaco.languages.CompletionItemKind.Module,
            insertText: 'import React from \'react\';\n',
            documentation: 'Import React library'
          },
          {
            label: 'useState',
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: 'useState',
            documentation: 'React useState hook',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
          },
          {
            label: 'useEffect',
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: 'useEffect',
            documentation: 'React useEffect hook',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
          },
          {
            label: 'function component',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: [
              'function ${1:ComponentName}() {',
              '  return (',
              '    <div>',
              '      ${2}',
              '    </div>',
              '  );',
              '}',
              '',
              'export default ${1:ComponentName};'
            ].join('\n'),
            documentation: 'Create a new React functional component',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
          },
          {
            label: 'Card component',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: [
              '<Card className="hover:shadow-lg transition-shadow">',
              '  <CardHeader>',
              '    <CardTitle>${1:Title}</CardTitle>',
              '    <CardDescription>${2:Description}</CardDescription>',
              '  </CardHeader>',
              '  <CardContent>',
              '    <p>${3:Content}</p>',
              '  </CardContent>',
              '</Card>'
            ].join('\n'),
            documentation: 'Create a Card component with header and content',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
          },
          {
            label: 'Button component',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: '<Button variant="${1:default}" onClick={${2:handleClick}}>${3:Button Text}</Button>',
            documentation: 'Create a Button component',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
          },
          {
            label: 'Grid layout',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: [
              '<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">',
              '  ${1}',
              '</div>'
            ].join('\n'),
            documentation: 'Create a responsive grid layout',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
          },
          {
            label: 'Flexbox layout',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: [
              '<div className="flex items-center justify-center gap-4">',
              '  ${1}',
              '</div>'
            ].join('\n'),
            documentation: 'Create a flexbox layout',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
          }
        ];

        return { suggestions };
      }
    });

    // Note: Using Monaco's built-in JavaScript/TypeScript support for JSX
    // This avoids the custom tokenizer issues and provides better JSX support
  };

  const handleEditorChange = (value: string | undefined) => {
    onChange(value);
  };

  return (
    <div className="w-full h-full">
      <Editor
        height={height}
        defaultLanguage={language}
        value={code}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        theme={theme === 'dark' ? 'custom-dark' : 'custom-light'}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: 'JetBrains Mono, Consolas, Monaco, monospace',
          lineNumbers: 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          readOnly: false,
          automaticLayout: true,
          wordWrap: 'on',
          suggestOnTriggerCharacters: true,
          quickSuggestions: true,
          parameterHints: {
            enabled: true
          },
          hover: {
            enabled: true
          },
          formatOnPaste: true,
          formatOnType: true,
          tabSize: 2,
          insertSpaces: true,
          detectIndentation: false,
          trimAutoWhitespace: true,
          largeFileOptimizations: true,
          suggest: {
            insertMode: 'replace'
          }
        }}
      />
    </div>
  );
} 