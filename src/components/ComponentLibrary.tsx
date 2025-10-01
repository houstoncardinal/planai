import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Layout, 
  Type, 
  Image, 
  Square,
  Circle,
  Star,
  Heart,
  MessageSquare,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  User,
  Users,
  Settings,
  Search,
  Filter,
  Download,
  Upload,
  Share,
  Bookmark,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Check,
  X,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Menu,
  Grid,
  List,
  Columns,
  Rows,
  Container,
  Box,
  Package,
  Zap,
  Sparkles,
  Palette,
  Layers,
  Code,
  Database,
  Server,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Camera,
  Video,
  Music,
  File,
  Folder,
  Link,
  ExternalLink,
  Copy,
  Edit,
  Trash2,
  Save,
  RefreshCw,
  RotateCcw,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Wifi,
  WifiOff,
  Battery,
  Signal,
  Bell,
  BellOff,
  Home,
  Navigation,
  Compass,
  Map,
  Flag,
  Award,
  Trophy,
  Gift,
  ShoppingCart,
  CreditCard,
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Activity,
  Target,
  Shield,
  AlertTriangle,
  Info,
  HelpCircle,
  Lightbulb,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  CloudSnow,
  Wind,
  Thermometer,
  Droplets,
  Umbrella,
  Snowflake,
  Leaf,
  Trees,
  Flower,
  Sprout,
  Plane,
  Mountain,
  Fish
} from 'lucide-react';

interface Component {
  id: string;
  name: string;
  category: string;
  icon: React.ComponentType<any>;
  description: string;
  code: string;
  tags: string[];
}

const components: Component[] = [
  // Layout Components
  {
    id: 'container',
    name: 'Container',
    category: 'Layout',
    icon: Container,
    description: 'Responsive container with max-width',
    code: '<div className="container mx-auto px-4">Content</div>',
    tags: ['layout', 'responsive', 'container']
  },
  {
    id: 'grid',
    name: 'Grid',
    category: 'Layout',
    icon: Grid,
    description: 'CSS Grid layout system',
    code: '<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">Content</div>',
    tags: ['layout', 'grid', 'responsive']
  },
  {
    id: 'flex',
    name: 'Flexbox',
    category: 'Layout',
    icon: Rows,
    description: 'Flexbox layout container',
    code: '<div className="flex items-center justify-center gap-4">Content</div>',
    tags: ['layout', 'flexbox', 'flex']
  },
  {
    id: 'columns',
    name: 'Columns',
    category: 'Layout',
    icon: Columns,
    description: 'Multi-column layout',
    code: '<div className="columns-1 md:columns-2 lg:columns-3 gap-6">Content</div>',
    tags: ['layout', 'columns', 'responsive']
  },

  // UI Components
  {
    id: 'button',
    name: 'Button',
    category: 'UI',
    icon: Square,
    description: 'Interactive button component',
    code: '<Button variant="default">Click me</Button>',
    tags: ['ui', 'button', 'interactive']
  },
  {
    id: 'input',
    name: 'Input',
    category: 'UI',
    icon: Type,
    description: 'Text input field',
    code: '<Input placeholder="Enter text..." />',
    tags: ['ui', 'input', 'form']
  },
  {
    id: 'card',
    name: 'Card',
    category: 'UI',
    icon: Square,
    description: 'Content container with shadow',
    code: '<Card><CardContent>Content</CardContent></Card>',
    tags: ['ui', 'card', 'container']
  },
  {
    id: 'badge',
    name: 'Badge',
    category: 'UI',
    icon: Circle,
    description: 'Small status indicator',
    code: '<Badge variant="default">Status</Badge>',
    tags: ['ui', 'badge', 'status']
  },

  // Navigation Components
  {
    id: 'navbar',
    name: 'Navigation',
    category: 'Navigation',
    icon: Navigation,
    description: 'Top navigation bar',
    code: '<nav className="bg-white shadow-sm border-b">Navigation</nav>',
    tags: ['navigation', 'navbar', 'header']
  },
  {
    id: 'menu',
    name: 'Menu',
    category: 'Navigation',
    icon: Menu,
    description: 'Dropdown menu component',
    code: '<div className="relative">Menu Content</div>',
    tags: ['navigation', 'menu', 'dropdown']
  },
  {
    id: 'breadcrumb',
    name: 'Breadcrumb',
    category: 'Navigation',
    icon: ChevronDown,
    description: 'Breadcrumb navigation',
    code: '<nav className="flex" aria-label="Breadcrumb">Breadcrumbs</nav>',
    tags: ['navigation', 'breadcrumb', 'path']
  },

  // Content Components
  {
    id: 'heading',
    name: 'Heading',
    category: 'Content',
    icon: Type,
    description: 'Section heading',
    code: '<h2 className="text-2xl font-bold">Heading</h2>',
    tags: ['content', 'heading', 'text']
  },
  {
    id: 'paragraph',
    name: 'Paragraph',
    category: 'Content',
    icon: Type,
    description: 'Text paragraph',
    code: '<p className="text-gray-600">Paragraph text</p>',
    tags: ['content', 'paragraph', 'text']
  },
  {
    id: 'image',
    name: 'Image',
    category: 'Content',
    icon: Image,
    description: 'Image component',
    code: '<img src="/image.jpg" alt="Description" className="rounded-lg" />',
    tags: ['content', 'image', 'media']
  },
  {
    id: 'video',
    name: 'Video',
    category: 'Content',
    icon: Video,
    description: 'Video player',
    code: '<video controls className="w-full rounded-lg"><source src="/video.mp4" /></video>',
    tags: ['content', 'video', 'media']
  },

  // Form Components
  {
    id: 'form',
    name: 'Form',
    category: 'Forms',
    icon: Edit,
    description: 'Form container',
    code: '<form className="space-y-4">Form fields</form>',
    tags: ['form', 'input', 'validation']
  },
  {
    id: 'textarea',
    name: 'Textarea',
    category: 'Forms',
    icon: Type,
    description: 'Multi-line text input',
    code: '<textarea className="w-full p-2 border rounded-md" rows={4} />',
    tags: ['form', 'textarea', 'input']
  },
  {
    id: 'select',
    name: 'Select',
    category: 'Forms',
    icon: ChevronDown,
    description: 'Dropdown select',
    code: '<select className="w-full p-2 border rounded-md"><option>Option</option></select>',
    tags: ['form', 'select', 'dropdown']
  },
  {
    id: 'checkbox',
    name: 'Checkbox',
    category: 'Forms',
    icon: Check,
    description: 'Checkbox input',
    code: '<input type="checkbox" className="rounded" />',
    tags: ['form', 'checkbox', 'input']
  },

  // Data Display
  {
    id: 'table',
    name: 'Table',
    category: 'Data',
    icon: Grid,
    description: 'Data table',
    code: '<table className="w-full border-collapse border">Table content</table>',
    tags: ['data', 'table', 'grid']
  },
  {
    id: 'list',
    name: 'List',
    category: 'Data',
    icon: List,
    description: 'Ordered or unordered list',
    code: '<ul className="list-disc list-inside">List items</ul>',
    tags: ['data', 'list', 'items']
  },
  {
    id: 'chart',
    name: 'Chart',
    category: 'Data',
    icon: BarChart3,
    description: 'Data visualization',
    code: '<div className="w-full h-64 bg-gray-100 rounded-lg">Chart</div>',
    tags: ['data', 'chart', 'visualization']
  },
  {
    id: 'progress',
    name: 'Progress',
    category: 'Data',
    icon: Activity,
    description: 'Progress indicator',
    code: '<div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-blue-600 h-2 rounded-full" style={{width: "45%"}}></div></div>',
    tags: ['data', 'progress', 'indicator']
  },

  // Feedback Components
  {
    id: 'alert',
    name: 'Alert',
    category: 'Feedback',
    icon: AlertTriangle,
    description: 'Alert message',
    code: '<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">Alert message</div>',
    tags: ['feedback', 'alert', 'message']
  },
  {
    id: 'toast',
    name: 'Toast',
    category: 'Feedback',
    icon: Bell,
    description: 'Toast notification',
    code: '<div className="fixed top-4 right-4 bg-white shadow-lg rounded-lg p-4">Toast message</div>',
    tags: ['feedback', 'toast', 'notification']
  },
  {
    id: 'loading',
    name: 'Loading',
    category: 'Feedback',
    icon: RefreshCw,
    description: 'Loading spinner',
    code: '<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>',
    tags: ['feedback', 'loading', 'spinner']
  },
  {
    id: 'skeleton',
    name: 'Skeleton',
    category: 'Feedback',
    icon: Square,
    description: 'Loading skeleton',
    code: '<div className="animate-pulse bg-gray-200 rounded h-4 w-full"></div>',
    tags: ['feedback', 'skeleton', 'loading']
  }
];

const categories = ['Layout', 'UI', 'Navigation', 'Content', 'Forms', 'Data', 'Feedback'];

export function ComponentLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Layout');

  const filteredComponents = components.filter(component => {
    const matchesSearch = component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         component.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         component.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || component.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDragStart = (e: React.DragEvent, component: Component) => {
    e.dataTransfer.setData('application/json', JSON.stringify(component));
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-card">
        <div className="flex items-center gap-2 mb-3">
          <Layers className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Component Library</h3>
        </div>
        
        <Input
          placeholder="Search components..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-3"
        />

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="Layout" className="text-xs">Layout</TabsTrigger>
            <TabsTrigger value="UI" className="text-xs">UI</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Component List */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {filteredComponents.map((component) => (
            <Card
              key={component.id}
              className="cursor-grab hover:shadow-md transition-shadow border-dashed border-2 border-muted hover:border-primary/50"
              draggable
              onDragStart={(e) => handleDragStart(e, component)}
            >
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <component.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{component.name}</h4>
                    <p className="text-xs text-muted-foreground truncate">{component.description}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1 mt-2">
                  {component.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs px-1 py-0">
                      {tag}
                    </Badge>
                  ))}
                  {component.tags.length > 2 && (
                    <Badge variant="outline" className="text-xs px-1 py-0">
                      +{component.tags.length - 2}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredComponents.length === 0 && (
          <div className="text-center py-8">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h4 className="font-medium text-muted-foreground mb-2">No components found</h4>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or category filter
            </p>
          </div>
        )}
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t bg-card">
        <div className="text-xs text-muted-foreground text-center">
          Drag components to the builder
        </div>
      </div>
    </div>
  );
} 