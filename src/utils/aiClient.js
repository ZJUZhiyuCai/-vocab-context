export const AI_PROVIDER_NAME = 'SiliconFlow';
export const AI_PROVIDER_LABEL = '硅基流动';
export const AI_MODEL = 'Qwen/Qwen2.5-72B-Instruct';
export const AI_ENV_API_KEY_NAME = 'SILICONFLOW_API_KEY';
export const AI_PROXY_URL = '/api/ai/chat';
export const AI_NETLIFY_FUNCTION_URL = '/.netlify/functions/ai-chat';
export const AI_BROWSER_BASE_URL = 'https://api.siliconflow.cn/v1';

export function sanitizeApiKey(apiKey) {
  // Keep only printable ASCII characters (0x20-0x7E)
  // eslint-disable-next-line no-control-regex
  return String(apiKey || '').trim().replace(/[^\x20-\x7E]/g, '');
}

export function resolveApiKey(apiKey) {
  return sanitizeApiKey(apiKey);
}

function buildRequestBody({ apiKey, messages, temperature, maxTokens, topP }) {
  const body = {
    apiKey: resolveApiKey(apiKey) || undefined,
    messages,
    temperature,
    maxTokens
  };

  if (typeof topP === 'number') {
    body.topP = topP;
  }

  return body;
}

async function requestProxy(url, body) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData?.error?.message || errorData?.message || `AI 请求失败: ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return response.json();
}

async function requestSiliconFlowDirect({ apiKey, messages, temperature, maxTokens, topP }) {
  const directApiKey = resolveApiKey(apiKey);

  if (!directApiKey) {
    throw new Error('AI proxy is unavailable and no API key was provided for direct fallback.');
  }

  const payload = {
    model: AI_MODEL,
    messages,
    temperature,
    max_tokens: maxTokens
  };

  if (typeof topP === 'number') {
    payload.top_p = topP;
  }

  const response = await fetch(`${AI_BROWSER_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${directApiKey}`,
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || errorData?.message || `AI 请求失败: ${response.status}`);
  }

  return response.json();
}

export async function createAIChatCompletion({
  apiKey,
  messages,
  temperature = 0.7,
  maxTokens = 800,
  topP
}) {
  const body = buildRequestBody({ apiKey, messages, temperature, maxTokens, topP });
  const proxyUrls = [AI_PROXY_URL, AI_NETLIFY_FUNCTION_URL];
  let lastError = null;

  for (const url of proxyUrls) {
    try {
      return await requestProxy(url, body);
    } catch (error) {
      lastError = error;
      if (error?.status && ![404, 405].includes(error.status)) {
        throw error;
      }
    }
  }

  if (resolveApiKey(apiKey)) {
    return requestSiliconFlowDirect({ apiKey, messages, temperature, maxTokens, topP });
  }

  throw lastError || new Error('AI request failed.');
}

export function getCompletionText(data) {
  return data?.choices?.[0]?.message?.content || '';
}
