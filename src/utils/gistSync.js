/**
 * GitHub Gist 云端同步服务
 * 用于备份和同步学习数据
 */

import logger from './logger.js'

const GIST_CONFIG_KEY = 'vocabcontext_gist_config'
const LAST_SYNC_KEY = 'vocabcontext_last_sync'

/**
 * 保存Gist配置
 */
export function saveGistConfig(config) {
  try {
    localStorage.setItem(GIST_CONFIG_KEY, JSON.stringify(config))
    return true
  } catch (error) {
    logger.error('保存Gist配置失败:', error)
    return false
  }
}

/**
 * 加载Gist配置
 */
export function loadGistConfig() {
  try {
    const saved = localStorage.getItem(GIST_CONFIG_KEY)
    return saved ? JSON.parse(saved) : null
  } catch (error) {
    logger.error('加载Gist配置失败:', error)
    return null
  }
}

/**
 * 清除Gist配置
 */
export function clearGistConfig() {
  localStorage.removeItem(GIST_CONFIG_KEY)
}

/**
 * 收集所有需要同步的数据
 */
export function collectSyncData() {
  const data = {}

  // 收集所有vocabcontext_开头的key
  const keys = Object.keys(localStorage)
  const vocabKeys = keys.filter(k => k.startsWith('vocabcontext_'))

  vocabKeys.forEach(key => {
    try {
      data[key] = localStorage.getItem(key)
    } catch (error) {
      logger.error(`读取数据失败 ${key}:`, error)
    }
  })

  return {
    version: '1.0',
    updatedAt: new Date().toISOString(),
    device: navigator.userAgent,
    data
  }
}

/**
 * 恢复同步的数据
 */
export function restoreSyncData(syncData) {
  if (!syncData || !syncData.data) {
    throw new Error('无效的同步数据')
  }

  const { data } = syncData
  let restoredCount = 0

  Object.entries(data).forEach(([key, value]) => {
    try {
      localStorage.setItem(key, value)
      restoredCount++
    } catch (error) {
      logger.error(`恢复数据失败 ${key}:`, error)
    }
  })

  logger.info(`恢复了 ${restoredCount} 条数据`)
  return restoredCount
}

/**
 * 创建Gist
 * @param {string} token - GitHub Personal Access Token
 * @param {Object} data - 要同步的数据
 */
export async function createGist(token, data) {
  const config = loadGistConfig()
  const filename = config.filename || 'vocabcontext-backup.json'

  const response = await fetch('https://api.github.com/gists', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      description: 'VocabMan 学习数据备份',
      public: false,
      files: {
        [filename]: {
          content: JSON.stringify(data, null, 2)
        }
      }
    })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || '创建Gist失败')
  }

  const gist = await response.json()
  return gist
}

/**
 * 更新Gist
 * @param {string} token - GitHub Personal Access Token
 * @param {string} gistId - Gist ID
 * @param {Object} data - 要同步的数据
 */
export async function updateGist(token, gistId, data) {
  const config = loadGistConfig()
  const filename = config.filename || 'vocabcontext-backup.json'

  // 先获取Gist以获取当前的文件版本
  const getResponse = await fetch(`https://api.github.com/gists/${gistId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  })

  if (!getResponse.ok) {
    throw new Error('获取Gist失败')
  }

  const gist = await getResponse.json()
  const currentFile = gist.files[filename]

  const response = await fetch(`https://api.github.com/gists/${gistId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      files: {
        [filename]: {
          content: JSON.stringify(data, null, 2),
          filename: currentFile.filename
        }
      }
    })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || '更新Gist失败')
  }

  return await response.json()
}

/**
 * 上传数据到Gist（自动选择创建或更新）
 */
export async function uploadToGist(token) {
  const config = loadGistConfig()
  const data = collectSyncData()

  if (config.gistId) {
    // 更新现有Gist
    return await updateGist(token, config.gistId, data)
  } else {
    // 创建新Gist
    const gist = await createGist(token, data)

    // 保存Gist ID
    config.gistId = gist.id
    saveGistConfig(config)

    return gist
  }
}

/**
 * 从Gist下载数据
 */
export async function downloadFromGist(token) {
  const config = loadGistConfig()

  if (!config.gistId) {
    throw new Error('未配置Gist ID')
  }

  const response = await fetch(`https://api.github.com/gists/${config.gistId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  })

  if (!response.ok) {
    throw new Error('下载Gist失败')
  }

  const gist = await response.json()
  const filename = config.filename || 'vocabcontext-backup.json'
  const file = gist.files[filename]

  if (!file) {
    throw new Error('Gist中未找到备份数据')
  }

  const syncData = JSON.parse(file.content)
  return syncData
}

/**
 * 获取最后同步时间
 */
export function getLastSyncTime() {
  try {
    const saved = localStorage.getItem(LAST_SYNC_KEY)
    return saved ? new Date(saved) : null
  } catch {
    return null
  }
}

/**
 * 保存最后同步时间
 */
export function saveLastSyncTime() {
  localStorage.setItem(LAST_SYNC_KEY, new Date().toISOString())
}

/**
 * 同步数据（上传并下载合并）
 */
export async function syncData(token) {
  try {
    logger.info('开始同步...')

    // 1. 先下载远程数据
    let remoteData = null
    try {
      remoteData = await downloadFromGist(token)
      logger.info('下载远程数据成功')
    } catch (error) {
      logger.warn('下载远程数据失败（可能是首次同步）:', error.message)
    }

    // 2. 收集本地数据
    const localData = collectSyncData()
    logger.info('本地数据收集完成')

    // 3. 如果有远程数据，判断哪个更新
    let dataToUpload = localData

    if (remoteData) {
      const remoteTime = new Date(remoteData.updatedAt).getTime()
      const localTime = new Date(localData.updatedAt).getTime()

      if (remoteTime > localTime) {
        // 远程更新，使用远程数据
        logger.info('远程数据更新，使用远程数据')
        restoreSyncData(remoteData)
        // 然后重新收集本地数据（可能已更新）
        dataToUpload = collectSyncData()
      }
    }

    // 4. 上传本地数据
    const gist = await uploadToGist(token, dataToUpload)
    logger.info('上传到云端成功')

    // 5. 保存同步时间
    saveLastSyncTime()

    return {
      success: true,
      gistId: gist.id,
      gistUrl: gist.html_url
    }
  } catch (error) {
    logger.error('同步失败:', error)
    throw error
  }
}

/**
 * 测试Gist配置
 */
export async function testGistConfig(token) {
  try {
    // 尝试获取用户信息
    const response = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    })

    if (!response.ok) {
      throw new Error('Token无效或权限不足')
    }

    const user = await response.json()
    return {
      success: true,
      username: user.login
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * 获取同步统计
 */
export function getSyncStats() {
  const lastSync = getLastSyncTime()
  const config = loadGistConfig()

  return {
    hasConfig: !!config,
    hasToken: !!(config && config.token),
    gistId: config?.gistId || null,
    lastSync: lastSync ? lastSync.toLocaleString('zh-CN') : '从未同步',
    autoSync: config?.autoSync || false
  }
}
