export const AI_PROVIDER_NAME = 'SiliconFlow';
export const AI_PROVIDER_LABEL = '硅基流动';
export const AI_MODEL = 'Qwen/Qwen2.5-72B-Instruct';
export const AI_ENV_API_KEY_NAME = 'SILICONFLOW_API_KEY';
export const AI_PROXY_URL = '/api/ai/chat';

export function sanitizeApiKey(apiKey) {
  return String(apiKey || '').trim().replace(/[^\x00-\x7F]/g, '');
}

export function resolveApiKey(apiKey) {
  return sanitizeApiKey(apiKey);
}

export async function createAIChatCompletion({
  apiKey,
  messages,
  temperature = 0.7,
  maxTokens = 800,
  topP
}) {
  const body = {
    apiKey: resolveApiKey(apiKey) || undefined,
    messages,
    temperature,
    maxTokens
  };

  if (typeof topP === 'number') {
    body.topP = topP;
  }

  const response = await fetch(AI_PROXY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || errorData?.message || `AI 请求失败: ${response.status}`);
  }

  return response.json();
}

export function getCompletionText(data) {
  return data?.choices?.[0]?.message?.content || '';
}
