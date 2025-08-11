import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Settings, 
  Palette, 
  Type, 
  Layout, 
  Eye,
  EyeOff,
  Copy,
  Trash2,
  RotateCcw,
  Move,
  Lock,
  Unlock,
  Layers,
  Sparkles,
  Zap,
  Target,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface PropertyPanelProps {
  selectedComponent?: any;
  onPropertyChange?: (property: string, value: any) => void;
}

export function PropertyPanel({ selectedComponent, onPropertyChange }: PropertyPanelProps) {
  const [activeTab, setActiveTab] = useState('style');

  if (!selectedComponent) {
    return (
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b bg-card">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Properties</h3>
          </div>
        </div>

        {/* Empty State */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
              <Target className="h-8 w-8 text-muted-foreground" />
            </div>
            <h4 className="font-medium text-muted-foreground">No Component Selected</h4>
            <p className="text-sm text-muted-foreground max-w-xs">
              Select a component from the builder to edit its properties
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-card">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Properties</h3>
          </div>
          <Badge variant="outline" className="text-xs">
            {selectedComponent.type}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Copy className="h-3 w-3" />
            Copy
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Trash2 className="h-3 w-3" />
            Delete
          </Button>
        </div>
      </div>

      {/* Properties Content */}
      <ScrollArea className="flex-1">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-4 pt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="style" className="text-xs">Style</TabsTrigger>
              <TabsTrigger value="layout" className="text-xs">Layout</TabsTrigger>
              <TabsTrigger value="content" className="text-xs">Content</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="style" className="p-4 space-y-4">
            {/* Colors */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Colors
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-xs">Background Color</Label>
                  <div className="flex gap-2">
                    <Input 
                      type="color" 
                      className="w-12 h-8 p-1"
                      defaultValue="#ffffff"
                    />
                    <Input 
                      placeholder="bg-blue-500"
                      className="flex-1 text-xs"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs">Text Color</Label>
                  <div className="flex gap-2">
                    <Input 
                      type="color" 
                      className="w-12 h-8 p-1"
                      defaultValue="#000000"
                    />
                    <Input 
                      placeholder="text-gray-900"
                      className="flex-1 text-xs"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs">Border Color</Label>
                  <div className="flex gap-2">
                    <Input 
                      type="color" 
                      className="w-12 h-8 p-1"
                      defaultValue="#e5e7eb"
                    />
                    <Input 
                      placeholder="border-gray-200"
                      className="flex-1 text-xs"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Typography */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Type className="h-4 w-4" />
                  Typography
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-xs">Font Size</Label>
                  <Select defaultValue="text-base">
                    <SelectTrigger className="text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text-xs">Extra Small</SelectItem>
                      <SelectItem value="text-sm">Small</SelectItem>
                      <SelectItem value="text-base">Base</SelectItem>
                      <SelectItem value="text-lg">Large</SelectItem>
                      <SelectItem value="text-xl">Extra Large</SelectItem>
                      <SelectItem value="text-2xl">2XL</SelectItem>
                      <SelectItem value="text-3xl">3XL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs">Font Weight</Label>
                  <Select defaultValue="font-normal">
                    <SelectTrigger className="text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="font-light">Light</SelectItem>
                      <SelectItem value="font-normal">Normal</SelectItem>
                      <SelectItem value="font-medium">Medium</SelectItem>
                      <SelectItem value="font-semibold">Semibold</SelectItem>
                      <SelectItem value="font-bold">Bold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs">Text Alignment</Label>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" className="flex-1 text-xs">Left</Button>
                    <Button variant="outline" size="sm" className="flex-1 text-xs">Center</Button>
                    <Button variant="outline" size="sm" className="flex-1 text-xs">Right</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Effects */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Effects
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Shadow</Label>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Rounded Corners</Label>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Border</Label>
                  <Switch />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs">Opacity</Label>
                  <Slider defaultValue={[100]} max={100} step={1} className="w-full" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="layout" className="p-4 space-y-4">
            {/* Spacing */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Layout className="h-4 w-4" />
                  Spacing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-xs">Padding</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input placeholder="p-4" className="text-xs" />
                    <Input placeholder="px-4" className="text-xs" />
                    <Input placeholder="py-4" className="text-xs" />
                    <Input placeholder="pt-4" className="text-xs" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs">Margin</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input placeholder="m-4" className="text-xs" />
                    <Input placeholder="mx-4" className="text-xs" />
                    <Input placeholder="my-4" className="text-xs" />
                    <Input placeholder="mt-4" className="text-xs" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Size */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Move className="h-4 w-4" />
                  Size
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-xs">Width</Label>
                  <Select defaultValue="w-auto">
                    <SelectTrigger className="text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="w-auto">Auto</SelectItem>
                      <SelectItem value="w-full">Full</SelectItem>
                      <SelectItem value="w-1/2">Half</SelectItem>
                      <SelectItem value="w-1/3">Third</SelectItem>
                      <SelectItem value="w-1/4">Quarter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs">Height</Label>
                  <Select defaultValue="h-auto">
                    <SelectTrigger className="text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="h-auto">Auto</SelectItem>
                      <SelectItem value="h-full">Full</SelectItem>
                      <SelectItem value="h-screen">Screen</SelectItem>
                      <SelectItem value="h-64">256px</SelectItem>
                      <SelectItem value="h-32">128px</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Position */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Move className="h-4 w-4" />
                  Position
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-xs">Position</Label>
                  <Select defaultValue="static">
                    <SelectTrigger className="text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="static">Static</SelectItem>
                      <SelectItem value="relative">Relative</SelectItem>
                      <SelectItem value="absolute">Absolute</SelectItem>
                      <SelectItem value="fixed">Fixed</SelectItem>
                      <SelectItem value="sticky">Sticky</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Z-Index</Label>
                  <Input placeholder="z-10" className="w-20 text-xs" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="p-4 space-y-4">
            {/* Text Content */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Type className="h-4 w-4" />
                  Text Content
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-xs">Text</Label>
                  <Textarea 
                    placeholder="Enter text content..."
                    className="text-xs min-h-[60px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs">Placeholder</Label>
                  <Input 
                    placeholder="Enter placeholder text..."
                    className="text-xs"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Links & Actions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Links & Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-xs">Link URL</Label>
                  <Input 
                    placeholder="https://example.com"
                    className="text-xs"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs">On Click Action</Label>
                  <Select defaultValue="none">
                    <SelectTrigger className="text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="navigate">Navigate</SelectItem>
                      <SelectItem value="modal">Open Modal</SelectItem>
                      <SelectItem value="submit">Submit Form</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Accessibility */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Accessibility
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-xs">Alt Text</Label>
                  <Input 
                    placeholder="Alternative text for screen readers"
                    className="text-xs"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs">ARIA Label</Label>
                  <Input 
                    placeholder="aria-label value"
                    className="text-xs"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Hidden from Screen Readers</Label>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t bg-card">
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <RotateCcw className="h-3 w-3" />
            Reset
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Lock className="h-3 w-3" />
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Layers className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 