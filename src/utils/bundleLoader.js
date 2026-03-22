const bundleCache = new Map();
const bundleLoaders = new Map();

function normalizeBundleContext(context, bundleId, index) {
  return {
    id: `${bundleId}_context_${index + 1}`,
    sentence: context.text || '',
    translation: context.translation || '',
    source: context.kind || 'reading',
    purpose: context.purpose || 'core'
  };
}

function scoreFrequencyFromQuality(sourceQuality = {}) {
  const total =
    Number(sourceQuality.relevanceScore || 0) +
    Number(sourceQuality.transferabilityScore || 0) +
    Number(sourceQuality.outputUtilityScore || 0) +
    Number(sourceQuality.exampleQualityScore || 0);

  return Math.max(1, Math.min(5, Math.round(total / 4)));
}

function normalizeBundle(bundle) {
  const contexts = Array.isArray(bundle.contexts) ? bundle.contexts : [];

  return {
    id: bundle.bundleId,
    bundleId: bundle.bundleId,
    word: bundle.word,
    ipa: bundle.ipa || '',
    partOfSpeech: bundle.partOfSpeech || '',
    meaning: bundle.chineseMeaning || '',
    englishDefinition: bundle.englishDefinition || '',
    sense: bundle.sense || '',
    topic: bundle.topic || 'general',
    taskTypes: bundle.taskTypes || [],
    register: bundle.register || 'formal',
    collocations: bundle.collocations || [],
    paraphrases: bundle.paraphrases || [],
    contexts,
    examples: contexts.map((context, index) => normalizeBundleContext(context, bundle.bundleId, index)),
    productionPrompt: bundle.productionPrompt || null,
    sourceQuality: bundle.sourceQuality || {},
    frequency: scoreFrequencyFromQuality(bundle.sourceQuality),
    isBundle: true,
    draft: !!bundle.draft
  };
}

export class BundleLoader {
  constructor(bundleFile) {
    this.bundleFile = bundleFile;
    this.cacheKey = bundleFile;
    this.fullData = null;
    this.totalBundles = 0;
    this.isLoading = false;
    this.loadPromise = null;
  }

  async ensureLoaded() {
    if (this.fullData) return;

    if (bundleCache.has(this.cacheKey)) {
      this.fullData = bundleCache.get(this.cacheKey);
      this.totalBundles = this.fullData.totalBundles || this.fullData.words.length;
      return;
    }

    if (this.isLoading) {
      await this.loadPromise;
      return;
    }

    this.isLoading = true;
    this.loadPromise = this.loadFullFile();

    try {
      await this.loadPromise;
    } finally {
      this.isLoading = false;
      this.loadPromise = null;
    }
  }

  async loadFullFile() {
    const response = await fetch(this.bundleFile);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const bundles = Array.isArray(data.bundles) ? data.bundles : [];
    const words = bundles.map(normalizeBundle);

    this.fullData = {
      ...data,
      words,
      totalBundles: bundles.length
    };
    this.totalBundles = bundles.length;

    bundleCache.set(this.cacheKey, this.fullData);
  }

  async getWordsRange(startIndex, count) {
    await this.ensureLoaded();
    const endIndex = Math.min(startIndex + count, this.totalBundles);
    return this.fullData.words.slice(startIndex, endIndex);
  }

  async getWord(bundleId) {
    await this.ensureLoaded();
    return this.fullData.words.find(word => word.id === bundleId) || null;
  }

  async getTotalCount() {
    await this.ensureLoaded();
    return this.totalBundles;
  }

  clearCache() {
    this.fullData = null;
    this.totalBundles = 0;
  }
}

export function getBundleLoader(bundleFile) {
  if (!bundleLoaders.has(bundleFile)) {
    bundleLoaders.set(bundleFile, new BundleLoader(bundleFile));
  }
  return bundleLoaders.get(bundleFile);
}

export function clearBundleLoader(bundleFile) {
  const loader = bundleLoaders.get(bundleFile);
  if (loader) {
    loader.clearCache();
  }
  bundleLoaders.delete(bundleFile);
}
