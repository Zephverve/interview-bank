<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import {
  getSyncConfig,
  getSyncState,
  onSyncStateChange,
  initGistSync,
  syncNow,
  clearSyncConfig,
  isSyncEnabled,
  type SyncState,
} from '../composables/useGistSync'

const emit = defineEmits<{ toast: [msg: string] }>()

const expanded = ref(false)
const token = ref('')
const syncState = ref<SyncState>(getSyncState())
const enabled = ref(isSyncEnabled())

let unsub: (() => void) | null = null

onMounted(() => {
  enabled.value = isSyncEnabled()
  const cfg = getSyncConfig()
  if (cfg) token.value = cfg.token
  unsub = onSyncStateChange((s) => {
    syncState.value = s
  })
})

onUnmounted(() => {
  unsub?.()
})

function statusLabel() {
  if (!enabled.value) return '未开启'
  if (syncState.value.status === 'syncing') return '同步中…'
  if (syncState.value.status === 'error') return '同步失败'
  if (syncState.value.lastSyncAt) return '已开启'
  return '已开启'
}

function statusClass() {
  if (!enabled.value) return 'off'
  if (syncState.value.status === 'syncing') return 'syncing'
  if (syncState.value.status === 'error') return 'error'
  return 'on'
}

async function handleEnable() {
  const result = await initGistSync(token.value)
  if (result.ok) {
    enabled.value = true
    emit('toast', '云同步已启用，正在同步…')
    await syncNow()
    emit('toast', '同步完成')
  } else {
    emit('toast', result.error || '启用失败')
  }
}

async function handleSync() {
  const result = await syncNow()
  if (!result) emit('toast', syncState.value.message || '同步完成')
}

function handleDisable() {
  if (!confirm('关闭后本机数据仍保留，但不再自动上传。确定关闭？')) return
  clearSyncConfig()
  enabled.value = false
  emit('toast', '已关闭云同步')
}
</script>

<template>
  <div class="qb-sync-panel">
    <button type="button" class="qb-sync-toggle" @click="expanded = !expanded">
      <span class="qb-sync-dot" :class="statusClass()" />
      <span>云同步 · {{ statusLabel() }}</span>
      <span class="qb-sync-chevron">{{ expanded ? '▾' : '▸' }}</span>
    </button>

    <div v-if="expanded" class="qb-sync-body">
      <p class="qb-sync-desc">
        通过 GitHub 私密 Gist 跨设备同步「我的题库」。Token 只存在本机浏览器，不会上传到本站服务器。
      </p>

      <ol class="qb-sync-steps">
        <li>
          打开
          <a href="https://github.com/settings/tokens/new" target="_blank" rel="noopener">GitHub Token 设置</a>
          ，勾选 <strong>gist</strong> 权限，生成 Token
        </li>
        <li>在下方粘贴 Token，点击「启用云同步」</li>
        <li>其他设备用<strong>同一个 Token</strong> 再点一次，会自动找到同一份数据</li>
      </ol>

      <div class="qb-sync-field">
        <label>GitHub Token</label>
        <input
          v-model="token"
          type="password"
          class="qb-input"
          placeholder="ghp_… 或 github_pat_…"
          autocomplete="off"
        />
      </div>

      <div class="qb-sync-actions">
        <button v-if="!enabled" type="button" class="qb-btn primary sm" @click="handleEnable">
          启用云同步
        </button>
        <template v-else>
          <button type="button" class="qb-btn primary sm" @click="handleSync">立即同步</button>
          <button type="button" class="qb-btn ghost sm" @click="handleDisable">关闭同步</button>
        </template>
      </div>

      <p v-if="syncState.message" class="qb-sync-msg" :class="syncState.status">
        {{ syncState.message }}
        <span v-if="syncState.lastSyncAt" class="qb-sync-time">
          · {{ new Date(syncState.lastSyncAt).toLocaleString() }}
        </span>
      </p>
    </div>
  </div>
</template>

<style scoped>
.qb-sync-panel {
  margin-bottom: 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  overflow: hidden;
}

.qb-sync-toggle {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  text-align: left;
}

.qb-sync-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.qb-sync-dot.off {
  background: var(--vp-c-text-3);
}

.qb-sync-dot.on {
  background: #10b981;
}

.qb-sync-dot.syncing {
  background: #f59e0b;
  animation: pulse 1s infinite;
}

.qb-sync-dot.error {
  background: #ef4444;
}

@keyframes pulse {
  50% {
    opacity: 0.4;
  }
}

.qb-sync-chevron {
  margin-left: auto;
  color: var(--vp-c-text-3);
}

.qb-sync-body {
  padding: 0 16px 16px;
  border-top: 1px dashed var(--vp-c-divider);
}

.qb-sync-desc {
  font-size: 13px;
  color: var(--vp-c-text-2);
  margin: 12px 0;
  line-height: 1.6;
}

.qb-sync-steps {
  font-size: 13px;
  color: var(--vp-c-text-2);
  margin: 0 0 14px;
  padding-left: 20px;
  line-height: 1.7;
}

.qb-sync-field {
  margin-bottom: 12px;
}

.qb-sync-field label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 6px;
}

.qb-sync-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.qb-sync-msg {
  margin: 12px 0 0;
  font-size: 12px;
  color: var(--vp-c-text-3);
}

.qb-sync-msg.error {
  color: #ef4444;
}

.qb-sync-msg.ok {
  color: #10b981;
}

.qb-sync-time {
  color: var(--vp-c-text-3);
}
</style>
