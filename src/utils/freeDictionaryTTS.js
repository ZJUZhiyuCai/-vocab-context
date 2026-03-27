/**
 * Free Dictionary API TTS 服务
 * 使用 https://api.dictionaryapi.dev 获取真人英语发音
 * 完全免费，无需 API Key
 */

import logger from './logger.js'

const API_BASE = 'https://api.dictionaryapi.dev/api/v2/entries/en'
const CACHE_KEY_PREFIX = 'vocabcontext_freedict_'

/**
 * Free Dictionary TTS 服务类
 */
export class FreeDictionaryTTS {
    constructor() {
        this.audioCache = new Map()
    }

    /**
     * 获取单词发音 URL
     * @param {string} word - 单词
     * @returns {Promise<string|null>} 音频 URL
     */
    async getAudioUrl(word) {
        const cleanWord = word.trim().toLowerCase()
        if (!cleanWord) return null

        // 检查内存缓存
        if (this.audioCache.has(cleanWord)) {
            logger.info('使用内存缓存:', cleanWord)
            return this.audioCache.get(cleanWord)
        }

        // 检查本地存储缓存
        const cached = this.getFromCache(cleanWord)
        if (cached) {
            this.audioCache.set(cleanWord, cached)
            logger.info('使用本地缓存:', cleanWord)
            return cached
        }

        try {
            logger.info('请求 Free Dictionary API:', cleanWord)
            const response = await fetch(`${API_BASE}/${encodeURIComponent(cleanWord)}`)

            if (!response.ok) {
                if (response.status === 404) {
                    logger.warn('单词未找到:', cleanWord)
                    return null
                }
                throw new Error(`API 请求失败: ${response.status}`)
            }

            const data = await response.json()

            // 从响应中提取音频 URL (尝试多个位置)
            let audioUrl = null

            if (Array.isArray(data) && data.length > 0) {
                const entry = data[0]

                // 方法1: 从 phonetics 数组获取
                if (entry.phonetics && Array.isArray(entry.phonetics)) {
                    for (const phonetic of entry.phonetics) {
                        if (phonetic.audio && phonetic.audio.length > 0) {
                            audioUrl = phonetic.audio
                            // 优先选择美式发音 (us) 或英式发音 (uk)
                            if (phonetic.audio.includes('-us.') || phonetic.audio.includes('-uk.')) {
                                break
                            }
                        }
                    }
                }

                // 方法2: 从顶层 phonetic 获取（某些响应格式）
                if (!audioUrl && entry.phonetic && entry.sourceUrls) {
                    // 尝试构建音频URL（某些词典格式）
                }
            }

            if (audioUrl) {
                // 确保是完整 URL
                if (!audioUrl.startsWith('http')) {
                    audioUrl = 'https:' + audioUrl
                }

                // 缓存结果
                this.audioCache.set(cleanWord, audioUrl)
                this.saveToCache(cleanWord, audioUrl)

                logger.info('获取发音成功:', cleanWord, audioUrl)
                return audioUrl
            }

            logger.warn('未找到发音:', cleanWord)
            return null
        } catch (error) {
            logger.error('Free Dictionary API 错误:', error)
            return null
        }
    }

    /**
     * 播放单词发音
     * @param {string} word - 单词
     * @returns {Promise<boolean>} 是否成功播放
     */
    async play(word) {
        const audioUrl = await this.getAudioUrl(word)

        if (!audioUrl) {
            return false
        }

        try {
            const audio = new Audio(audioUrl)

            await new Promise((resolve, reject) => {
                audio.onended = () => resolve()
                audio.onerror = () => reject(new Error('音频播放失败'))
                audio.oncanplaythrough = () => audio.play().catch(reject)
                audio.load()

                // 超时处理
                setTimeout(() => reject(new Error('加载超时')), 10000)
            })

            return true
        } catch (error) {
            logger.error('播放失败:', error)
            return false
        }
    }

    /**
     * 检查服务是否可用（始终可用，因为无需 API Key）
     */
    isAvailable() {
        return true
    }

    /**
     * 从本地缓存获取
     * @private
     */
    getFromCache(word) {
        try {
            const key = `${CACHE_KEY_PREFIX}${word}`
            const cached = localStorage.getItem(key)
            if (cached) {
                const data = JSON.parse(cached)
                // 检查是否过期（30天）
                const age = Date.now() - (data.timestamp || 0)
                const maxAge = 30 * 24 * 60 * 60 * 1000
                if (age < maxAge) {
                    return data.url
                } else {
                    localStorage.removeItem(key)
                }
            }
        } catch (error) {
            logger.error('读取缓存失败:', error)
        }
        return null
    }

    /**
     * 保存到本地缓存
     * @private
     */
    saveToCache(word, url) {
        try {
            const key = `${CACHE_KEY_PREFIX}${word}`
            const data = {
                url: url,
                timestamp: Date.now()
            }
            localStorage.setItem(key, JSON.stringify(data))
        } catch (error) {
            logger.error('保存缓存失败:', error)
        }
    }

    /**
     * 清除所有缓存
     */
    clearAllCache() {
        try {
            const keys = Object.keys(localStorage)
            const ttsKeys = keys.filter(k => k.startsWith(CACHE_KEY_PREFIX))

            ttsKeys.forEach(key => {
                localStorage.removeItem(key)
            })

            this.audioCache.clear()
            logger.info(`清除了 ${ttsKeys.length} 条发音缓存`)
            return ttsKeys.length
        } catch (error) {
            logger.error('清除缓存失败:', error)
            return 0
        }
    }
}

// ==================== 单例模式 ====================

let ttsInstance = null

/**
 * 获取 Free Dictionary TTS 实例
 */
export function getFreeDictionaryTTS() {
    if (!ttsInstance) {
        ttsInstance = new FreeDictionaryTTS()
    }
    return ttsInstance
}

/**
 * 重置实例
 */
export function resetFreeDictionaryTTS() {
    ttsInstance = null
    return getFreeDictionaryTTS()
}
