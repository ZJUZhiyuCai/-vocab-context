import { ref, onMounted } from 'vue'
import logger from '../utils/logger.js'

// 主题类型
const THEMES = {
    LIGHT: 'light',
    DARK: 'dark',
    SYSTEM: 'system'
}

// 存储键名
const STORAGE_KEY = 'vocabman-theme'

// 全局主题状态
const theme = ref(THEMES.DARK) // 默认深色
const isDark = ref(true)

// 获取系统主题偏好
function getSystemTheme() {
    if (typeof window === 'undefined') return THEMES.DARK
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? THEMES.DARK : THEMES.LIGHT
}

// 应用主题到 DOM
function applyTheme(themeValue) {
    const root = document.documentElement

    if (themeValue === THEMES.SYSTEM) {
        const systemTheme = getSystemTheme()
        isDark.value = systemTheme === THEMES.DARK
    } else {
        isDark.value = themeValue === THEMES.DARK
    }

    if (isDark.value) {
        root.classList.add('dark')
    } else {
        root.classList.remove('dark')
    }
}

// 保存主题偏好
function saveTheme(themeValue) {
    try {
        localStorage.setItem(STORAGE_KEY, themeValue)
    } catch (e) {
        logger.warn('Failed to save theme preference:', e)
    }
}

// 加载主题偏好
function loadTheme() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved && Object.values(THEMES).includes(saved)) {
            return saved
        }
    } catch (e) {
        logger.warn('Failed to load theme preference:', e)
    }
    return THEMES.DARK // 默认深色
}

// 初始化是否已执行
let initialized = false

// 初始化主题
function initTheme() {
    if (initialized) return
    initialized = true

    const savedTheme = loadTheme()
    theme.value = savedTheme
    applyTheme(savedTheme)

    // 监听系统主题变化
    if (typeof window !== 'undefined') {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        mediaQuery.addEventListener('change', () => {
            if (theme.value === THEMES.SYSTEM) {
                applyTheme(THEMES.SYSTEM)
            }
        })
    }
}

// 导出 composable
export function useTheme() {
    onMounted(() => {
        initTheme()
    })

    // 设置主题
    function setTheme(newTheme) {
        if (!Object.values(THEMES).includes(newTheme)) {
            logger.warn('Invalid theme:', newTheme)
            return
        }
        theme.value = newTheme
        saveTheme(newTheme)
        applyTheme(newTheme)
    }

    // 切换深浅色
    function toggleTheme() {
        const newTheme = isDark.value ? THEMES.LIGHT : THEMES.DARK
        setTheme(newTheme)
    }

    return {
        theme,
        isDark,
        setTheme,
        toggleTheme,
        THEMES
    }
}

// 立即初始化（避免闪烁）
if (typeof window !== 'undefined') {
    initTheme()
}
