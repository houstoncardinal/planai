import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  RotateCcw, 
  ExternalLink,
  RefreshCw,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface AppSimulatorProps {
  code: string;
  viewport: 'mobile' | 'tablet' | 'desktop';
  theme: 'light' | 'dark';
  isRunning: boolean;
  showGrid: boolean;
  showGuides: boolean;
}

const viewportSizes = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1200, height: 800 }
};

export function AppSimulator({ 
  code, 
  viewport, 
  theme, 
  isRunning, 
  showGrid, 
  showGuides 
}: AppSimulatorProps) {
  const [previewHtml, setPreviewHtml] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Convert React JSX code to HTML for preview
  const convertCodeToHtml = (jsxCode: string): string => {
    try {
      // Simple JSX to HTML conversion (basic implementation)
      let html = jsxCode
        // Remove imports and exports
        .replace(/import.*?from.*?['"`][^'"`]*['"`];?\n?/g, '')
        .replace(/export default.*?;?\n?/g, '')
        // Convert JSX to HTML
        .replace(/function\s+\w+\s*\([^)]*\)\s*{[\s\S]*?return\s*\(/g, '')
        .replace(/\);?\s*}/g, '')
        // Convert React components to HTML
        .replace(/<Card/g, '<div class="card bg-white rounded-lg shadow-md border p-6"')
        .replace(/<\/Card>/g, '</div>')
        .replace(/<CardHeader>/g, '<div class="card-header mb-4">')
        .replace(/<\/CardHeader>/g, '</div>')
        .replace(/<CardTitle>/g, '<h3 class="text-xl font-semibold text-gray-900">')
        .replace(/<\/CardTitle>/g, '</h3>')
        .replace(/<CardDescription>/g, '<p class="text-gray-600 mt-1">')
        .replace(/<\/CardDescription>/g, '</p>')
        .replace(/<CardContent>/g, '<div class="card-content">')
        .replace(/<\/CardContent>/g, '</div>')
        .replace(/<Button/g, '<button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"')
        .replace(/<\/Button>/g, '</button>')
        // Convert className to class
        .replace(/className=/g, 'class=')
        // Remove JSX expressions
        .replace(/\{.*?\}/g, '')
        // Clean up extra whitespace
        .replace(/\n\s*\n/g, '\n')
        .trim();

      // Wrap in a complete HTML document
      const fullHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>App Preview</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            body { 
              margin: 0; 
              padding: 0; 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: ${theme === 'dark' ? '#1a1a1a' : '#ffffff'};
              color: ${theme === 'dark' ? '#ffffff' : '#000000'};
            }
            .card { 
              background: ${theme === 'dark' ? '#2d2d2d' : '#ffffff'};
              border: 1px solid ${theme === 'dark' ? '#404040' : '#e5e7eb'};
            }
            .grid-guide {
              background-image: linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px);
              background-size: 20px 20px;
            }
            .guide-line {
              border-left: 1px dashed rgba(59, 130, 246, 0.3);
              position: absolute;
              height: 100%;
              pointer-events: none;
            }
          </style>
        </head>
        <body class="${showGrid ? 'grid-guide' : ''}">
          ${html}
          ${showGuides ? `
            <div class="guide-line" style="left: 25%;"></div>
            <div class="guide-line" style="left: 50%;"></div>
            <div class="guide-line" style="left: 75%;"></div>
          ` : ''}
        </body>
        </html>
      `;

      return fullHtml;
    } catch (err) {
      console.error('Error converting code to HTML:', err);
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Error</title>
          <style>
            body { 
              font-family: monospace; 
              padding: 20px; 
              color: #ef4444;
              background: #fef2f2;
            }
          </style>
        </head>
        <body>
          <h2>Code Conversion Error</h2>
          <p>Unable to convert the JSX code to HTML for preview.</p>
          <pre>${err instanceof Error ? err.message : 'Unknown error'}</pre>
        </body>
        </html>
      `;
    }
  };

  useEffect(() => {
    if (isRunning && code) {
      setIsLoading(true);
      setError(null);
      
      try {
        const html = convertCodeToHtml(code);
        setPreviewHtml(html);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to convert code');
      } finally {
        setIsLoading(false);
      }
    }
  }, [code, isRunning, theme, showGrid, showGuides]);

  const refreshPreview = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  const openInNewTab = () => {
    const blob = new Blob([previewHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    URL.revokeObjectURL(url);
  };

  const { width, height } = viewportSizes[viewport];

  return (
    <div className="w-full h-full flex flex-col bg-muted/20">
      {/* Simulator Header */}
      <div className="flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {viewport === 'mobile' && <Smartphone className="h-5 w-5" />}
            {viewport === 'tablet' && <Tablet className="h-5 w-5" />}
            {viewport === 'desktop' && <Monitor className="h-5 w-5" />}
            <span className="font-medium">
              {viewport.charAt(0).toUpperCase() + viewport.slice(1)} Preview
            </span>
            <Badge variant="outline" className="text-xs">
              {width} × {height}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {error && (
            <div className="flex items-center gap-2 text-red-500 text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>Error</span>
            </div>
          )}
          
          {!error && isRunning && (
            <div className="flex items-center gap-2 text-green-500 text-sm">
              <CheckCircle className="h-4 w-4" />
              <span>Running</span>
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={refreshPreview}
            disabled={!isRunning}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={openInNewTab}
            disabled={!isRunning || !previewHtml}
            className="flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Open
          </Button>
        </div>
      </div>

      {/* Simulator Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        {!isRunning ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
              <Smartphone className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">Preview Not Running</h3>
            <p className="text-muted-foreground max-w-md">
              Click the "Run" button to start the preview and see your app in action.
            </p>
          </div>
        ) : isLoading ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <h3 className="text-lg font-semibold">Building Preview...</h3>
            <p className="text-muted-foreground">Converting your code to HTML</p>
          </div>
        ) : error ? (
          <Card className="w-full max-w-md">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-8 w-8 text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-red-600">Preview Error</h3>
                <p className="text-sm text-muted-foreground">{error}</p>
                <Button
                  variant="outline"
                  onClick={refreshPreview}
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="relative">
            {/* Device Frame */}
            <div 
              className="relative bg-white rounded-lg shadow-2xl border-8 border-gray-800 overflow-hidden"
              style={{ 
                width: width + 32, 
                height: height + 32,
                maxWidth: '100%',
                maxHeight: '100%'
              }}
            >
              {/* Status Bar */}
              <div className="absolute top-0 left-0 right-0 h-6 bg-gray-800 flex items-center justify-between px-4 z-10">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <div className="text-white text-xs font-medium">
                  {viewport === 'mobile' ? '9:41' : 'Preview'}
                </div>
              </div>

              {/* Preview Content */}
              <div 
                className="absolute inset-0 overflow-hidden"
                style={{ top: '24px' }}
              >
                <iframe
                  ref={iframeRef}
                  srcDoc={previewHtml}
                  className="w-full h-full border-0"
                  title="App Preview"
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
            </div>

            {/* Viewport Label */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
              <Badge variant="secondary" className="text-xs">
                {width} × {height}
              </Badge>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 