import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Settings, Save } from 'lucide-react';
import { useAIAnalysis } from '@/hooks/useAIAnalysis';

export function AISettingsPanel() {
  const { settings, updateSettings } = useAIAnalysis();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          AI Integration
        </CardTitle>
        <CardDescription>Configure provider, model, and features</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground">Provider</label>
            <Select value={settings.provider} onValueChange={(value: any) => updateSettings({ provider: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="anthropic">Anthropic</SelectItem>
                <SelectItem value="local">Local (Built-in)</SelectItem>
                <SelectItem value="custom">Custom Endpoint</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Analysis Frequency</label>
            <Select value={settings.analysisFrequency} onValueChange={(value: any) => updateSettings({ analysisFrequency: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">Manual Only</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="on-milestone">On Milestones</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground">Model</label>
            <Input
              placeholder="e.g., gpt-4o, claude-3-5"
              value={settings.model}
              onChange={(e) => updateSettings({ model: e.target.value })}
            />
          </div>
          {settings.provider === 'custom' && (
            <div>
              <label className="text-sm font-medium text-foreground">Custom Endpoint</label>
              <Input
                placeholder="https://your-api/analyze"
                value={settings.customEndpoint || ''}
                onChange={(e) => updateSettings({ customEndpoint: e.target.value })}
              />
            </div>
          )}
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-foreground">Enabled Features</h4>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(settings.enabledFeatures).map(([key, enabled]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                <Switch
                  checked={enabled}
                  onCheckedChange={(checked) => updateSettings({ enabledFeatures: { ...settings.enabledFeatures, [key]: checked } })}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="outline">
            <Save className="h-4 w-4 mr-2" />
            Saved automatically
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
