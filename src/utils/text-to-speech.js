/**
 * 文本转语音 (TTS) 工具
 * 使用 Web Speech API 提供语音合成功能
 * - 支持英语单词和句子朗读
 * - 可调节语速和音调
 * - 支持多种语音选择
 * - 提供播放控制（播放、暂停、停止、恢复）
 */

// localStorage keys
const SETTINGS_KEY = 'vocabcontext_tts_settings';

/**
 * 默认 TTS 设置
 */
const DEFAULT_SETTINGS = {
  rate: 1.0,           // 语速：0.1-10，默认 1.0
  pitch: 1.0,          // 音调：0-2，默认 1.0
  volume: 1.0,         // 音量：0-1，默认 1.0
  lang: 'en-US',       // 语言：默认美式英语
  voiceIndex: -1,      // 语音索引：-1 表示自动选择
  autoPlay: false      // 是否自动播放
};

/**
 * TTS 服务类
 */
export class TextToSpeech {
  constructor() {
    this.synth = window.speechSynthesis;
    this.settings = this.loadSettings();
    this.voices = [];
    this.currentUtterance = null;
    this.isPlaying = false;
    this.isPaused = false;
    this.listeners = {};
    this.isInitialized = false;

    // 初始化语音列表
    this.initVoices();

    // 监听语音列表变化（某些浏览器需要）
    if (this.synth) {
      this.synth.onvoiceschanged = () => {
        this.initVoices();
      };
    }
  }

  /**
   * 初始化语音列表
   * @private
   */
  initVoices() {
    if (!this.synth) {
      console.warn('当前浏览器不支持 Web Speech API');
      return;
    }

    this.voices = this.synth.getVoices();
    this.emit('voicesChanged', this.voices);
  }

  /**
   * 加载设置
   * @private
   */
  loadSettings() {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch (error) {
      console.error('加载TTS设置失败:', error);
    }
    return { ...DEFAULT_SETTINGS };
  }

  /**
   * 保存设置
   * @private
   */
  saveSettings() {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.settings));
    } catch (error) {
      console.error('保存TTS设置失败:', error);
    }
  }

  /**
   * 获取最佳语音
   * @param {string} lang - 语言代码
   * @returns {SpeechSynthesisVoice|null} 语音对象
   * @private
   */
  getBestVoice() {
    // 如果用户指定了语音索引，使用该索引
    if (this.settings.voiceIndex >= 0 && this.settings.voiceIndex < this.voices.length) {
      return this.voices[this.settings.voiceIndex];
    }

    // 优先选择高质量的自然英语语音
    const preferredVoices = [
      // Google 美式英语
      'Google US English',
      'Google UK English Male',
      'Google UK English Female',
      // Microsoft 自然语音
      'Microsoft Zira',
      'Microsoft David',
      'Microsoft Aria',
      // Apple 自然语音
      'Samantha',
      'Daniel',
      'Karen',
      'Moira',
      // 其他高质量语音
      'Google US English'
    ];

    // 英语语音列表
    const englishVoices = this.voices.filter(voice =>
      voice.lang.startsWith('en')
    );

    // 尝试找到首选的高质量语音
    for (const preferred of preferredVoices) {
      const voice = englishVoices.find(v =>
        v.name.includes(preferred) || v.name === preferred
      );
      if (voice) {
        console.log('找到高质量语音:', voice.name);
        return voice;
      }
    }

    // 按优先级选择：美式英语 > 英式英语 > 其他
    const priorityLangs = ['en-US', 'en-GB', 'en'];
    for (const langCode of priorityLangs) {
      const voices = englishVoices.filter(v => v.lang === langCode);
      // 优先选择本地服务
      const localVoice = voices.find(v => v.localService);
      if (localVoice) return localVoice;
      // 其次选择任意语音
      if (voices.length > 0) return voices[0];
    }

    // 最后使用默认语音
    return this.voices[0] || null;
  }

  /**
   * 朗读文本
   * @param {string} text - 要朗读的文本
   * @param {Object} options - 可选配置
   * @returns {Promise<void>}
   */
  speak(text, options = {}) {
    return new Promise((resolve, reject) => {
      if (!this.synth) {
        reject(new Error('当前浏览器不支持 Web Speech API'));
        return;
      }

      // 停止当前播放
      this.stop();

      // 创建新的朗读对象
      const utterance = new SpeechSynthesisUtterance(text);
      this.currentUtterance = utterance;

      // 配置语音参数
      const voice = this.getBestVoice(options.lang || this.settings.lang);
      if (voice) {
        utterance.voice = voice;
      }

      utterance.rate = options.rate ?? this.settings.rate;
      utterance.pitch = options.pitch ?? this.settings.pitch;
      utterance.volume = options.volume ?? this.settings.volume;
      utterance.lang = options.lang || this.settings.lang;

      // 设置事件监听
      utterance.onstart = () => {
        this.isPlaying = true;
        this.isPaused = false;
        this.emit('start', { text });
      };

      utterance.onend = () => {
        this.isPlaying = false;
        this.isPaused = false;
        this.currentUtterance = null;
        this.emit('end', { text });
        resolve();
      };

      utterance.onerror = (event) => {
        this.isPlaying = false;
        this.isPaused = false;
        this.currentUtterance = null;
        this.emit('error', { error: event.error, text });

        if (event.error !== 'interrupted') {
          reject(new Error(`语音合成错误: ${event.error}`));
        } else {
          resolve();
        }
      };

      utterance.onpause = () => {
        this.isPaused = true;
        this.emit('pause');
      };

      utterance.onresume = () => {
        this.isPaused = false;
        this.emit('resume');
      };

      // 开始朗读
      this.synth.speak(utterance);
    });
  }

  /**
   * 暂停朗读
   */
  pause() {
    if (this.synth && this.isPlaying && !this.isPaused) {
      this.synth.pause();
    }
  }

  /**
   * 恢复朗读
   */
  resume() {
    if (this.synth && this.isPlaying && this.isPaused) {
      this.synth.resume();
    }
  }

  /**
   * 停止朗读
   */
  stop() {
    if (this.synth) {
      this.synth.cancel();
      this.isPlaying = false;
      this.isPaused = false;
      this.currentUtterance = null;
    }
  }

  /**
   * 朗读单词（带发音优化）
   * @param {string} word - 单词
   * @param {Object} options - 可选配置
   */
  speakWord(word, options = {}) {
    // 单词朗读使用稍慢的语速
    return this.speak(word, {
      ...options,
      rate: (options.rate ?? this.settings.rate) * 0.9
    });
  }

  /**
   * 朗读例句
   * @param {string} sentence - 例句
   * @param {Object} options - 可选配置
   */
  speakSentence(sentence, options = {}) {
    // 例句使用正常语速
    return this.speak(sentence, options);
  }

  /**
   * 批量朗读（队列模式）
   * @param {Array<string>} texts - 文本数组
   * @param {Object} options - 可选配置
   */
  async speakBatch(texts, options = {}) {
    for (const text of texts) {
      if (!this.isPlaying) break;
      await this.speak(text, options);
      // 短暂停顿
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }

  /**
   * 更新设置
   * @param {Object} newSettings - 新设置
   */
  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    this.saveSettings();
    this.emit('settingsChanged', this.settings);
  }

  /**
   * 获取设置
   * @returns {Object} 当前设置
   */
  getSettings() {
    return { ...this.settings };
  }

  /**
   * 获取所有可用语音
   * @returns {Array<SpeechSynthesisVoice>} 语音列表
   */
  getVoices() {
    return [...this.voices];
  }

  /**
   * 获取英语语音列表
   * @returns {Array<SpeechSynthesisVoice>} 英语语音列表
   */
  getEnglishVoices() {
    return this.voices.filter(voice =>
      voice.lang.startsWith('en') &&
      (voice.lang.includes('US') || voice.lang.includes('GB') || voice.lang.includes('en'))
    );
  }

  /**
   * 检查是否正在播放
   * @returns {boolean}
   */
  getIsPlaying() {
    return this.isPlaying;
  }

  /**
   * 检查是否已暂停
   * @returns {boolean}
   */
  getIsPaused() {
    return this.isPaused;
  }

  /**
   * 检查浏览器是否支持 TTS
   * @returns {boolean}
   */
  isSupported() {
    return !!this.synth;
  }

  /**
   * 事件监听
   * @param {string} event - 事件名称
   * @param {Function} callback - 回调函数
   */
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  /**
   * 移除事件监听
   * @param {string} event - 事件名称
   * @param {Function} callback - 回调函数
   */
  off(event, callback) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  }

  /**
   * 触发事件
   * @param {string} event - 事件名称
   * @param {*} data - 事件数据
   * @private
   */
  emit(event, data) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach(callback => callback(data));
  }

  /**
   * 销毁实例
   */
  destroy() {
    this.stop();
    this.listeners = {};
  }
}

// ==================== 单例模式 ====================

let ttsInstance = null;

/**
 * 获取 TTS 服务实例
 * @returns {TextToSpeech}
 */
export function getTTS() {
  if (!ttsInstance) {
    ttsInstance = new TextToSpeech();
  }
  return ttsInstance;
}

/**
 * 重置 TTS 服务（用于测试）
 * @returns {TextToSpeech}
 */
export function resetTTS() {
  if (ttsInstance) {
    ttsInstance.destroy();
  }
  ttsInstance = new TextToSpeech();
  return ttsInstance;
}

/**
 * 快捷方法：朗读单词
 * @param {string} word - 单词
 * @param {Object} options - 可选配置
 */
export function speakWord(word, options = {}) {
  return getTTS().speakWord(word, options);
}

/**
 * 快捷方法：朗读例句
 * @param {string} sentence - 例句
 * @param {Object} options - 可选配置
 */
export function speakSentence(sentence, options = {}) {
  return getTTS().speakSentence(sentence, options);
}

/**
 * 快捷方法：停止朗读
 */
export function stopSpeaking() {
  return getTTS().stop();
}

/**
 * 快捷方法：暂停朗读
 */
export function pauseSpeaking() {
  return getTTS().pause();
}

/**
 * 快捷方法：恢复朗读
 */
export function resumeSpeaking() {
  return getTTS().resume();
}

/**
 * 检查浏览器是否支持 TTS
 * @returns {boolean}
 */
export function isTTSSupported() {
  return getTTS().isSupported();
}
