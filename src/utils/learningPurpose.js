const PURPOSE_ALIASES = {
  career: 'work',
  hobby: 'daily'
};

export const LEARNING_PURPOSES = ['exam', 'work', 'academic', 'daily'];

export function normalizeLearningPurpose(purpose, fallback = 'daily') {
  const candidate = String(purpose || '').trim();
  const normalized = PURPOSE_ALIASES[candidate] || candidate;
  return LEARNING_PURPOSES.includes(normalized) ? normalized : fallback;
}
