export const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
export const OPENROUTER_MODEL = 'stepfun/step-3.5-flash:free';
export const OPENROUTER_APP_NAME = 'VocabMan';

export function sanitizeApiKey(apiKey) {
  return String(apiKey || '').trim().replace(/[^\x00-\x7F]/g, '');
}

function getAppOrigin() {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }

  return 'https://vocabman.netlify.app';
}

function getApiErrorMessage(errorData, status) {
  return errorData?.error?.message || errorData?.message || `API调用失败: ${status}`;
}

export async function createOpenRouterChatCompletion({
  apiKey,
  messages,
  temperature = 0.7,
  maxTokens = 800,
  topP
}) {
  const cleanedApiKey = sanitizeApiKey(apiKey);

  if (!cleanedApiKey) {
    throw new Error('API密钥无效');
  }

  const body = {
    model: OPENROUTER_MODEL,
    messages,
    temperature,
    max_tokens: maxTokens
  };

  if (typeof topP === 'number') {
    body.top_p = topP;
  }

  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${cleanedApiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': getAppOrigin(),
      'X-Title': OPENROUTER_APP_NAME
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(getApiErrorMessage(errorData, response.status));
  }

  return response.json();
}

export function getCompletionText(data) {
  return data?.choices?.[0]?.message?.content || '';
}
