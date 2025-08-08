import type { AIIntegrationSettings, AIAnalysisResult } from '../useAIAnalysis';

// Provider runner that calls a custom endpoint when configured.
// Falls back to throwing so the caller can use local generation.
export async function runProviderAnalysis(
  settings: AIIntegrationSettings,
  contextData: any
): Promise<AIAnalysisResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

  try {
    const endpoint = settings.customEndpoint;

    // For OpenAI/Anthropic we require a proxy/custom endpoint in this environment
    if (!endpoint) {
      throw new Error('No custom endpoint configured for external AI provider. Set a Custom Endpoint in AI settings.');
    }

    const res = await fetch(endpoint, {
      method: 'POST',
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider: settings.provider,
        model: settings.model,
        features: settings.enabledFeatures,
        context: contextData,
      })
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`Provider request failed (${res.status}): ${text}`);
    }

    const data = await res.json();

    // Basic validation and coercion to expected shape
    if (!data || !data.projectOptimization || !data.codeQualityInsights || !data.learningInsights) {
      throw new Error('Invalid analysis result shape from provider');
    }

    return data as AIAnalysisResult;
  } finally {
    clearTimeout(timeout);
  }
}
