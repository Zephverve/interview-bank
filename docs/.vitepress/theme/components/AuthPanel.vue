<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { isSupabaseConfigured } from '../composables/useSupabase'
import {
  authSession,
  authReady,
  authError,
  initAuth,
  signInWithEmail,
  signUpWithEmail,
  signInWithGitHub,
  signOut,
  userLabel,
} from '../composables/useAuth'
import { getSyncState, onSyncStateChange, syncNow, type SyncState } from '../composables/useCloudSync'
import SyncSettings from './SyncSettings.vue'

const emit = defineEmits<{ toast: [msg: string] }>()

const expanded = ref(false)
const mode = ref<'login' | 'register'>('login')
const email = ref('')
const password = ref('')
const loading = ref(false)
const syncState = ref<SyncState>(getSyncState())

const configured = computed(() => isSupabaseConfigured())
const loggedIn = computed(() => !!authSession.value)

let unsubSync: (() => void) | null = null

onMounted(async () => {
  await initAuth()
  unsubSync = onSyncStateChange((s) => {
    syncState.value = s
  })
})

onUnmounted(() => {
  unsubSync?.()
})

function statusLabel() {
  if (!configured.value) return '未配置登录'
  if (!loggedIn.value) return '未登录'
  if (syncState.value.status === 'syncing') return '同步中…'
  if (syncState.value.status === 'error') return '同步失败'
  return '已登录'
}

function statusClass() {
  if (!configured.value) return 'off'
  if (!loggedIn.value) return 'off'
  if (syncState.value.status === 'syncing') return 'syncing'
  if (syncState.value.status === 'error') return 'error'
  return 'on'
}

async function handleEmailSubmit() {
  loading.value = true
  const fn = mode.value === 'login' ? signInWithEmail : signUpWithEmail
  const result = await fn(email.value, password.value)
  loading.value = false
  if (result.ok) {
    emit('toast', 'message' in result ? (result.message as string) : '登录成功')
    if (mode.value === 'login') expanded.value = false
  } else {
    emit('toast', result.error || '操作失败')
  }
}

async function handleGitHub() {
  loading.value = true
  const result = await signInWithGitHub()
  loading.value = false
  if (!result.ok) emit('toast', result.error || 'GitHub 登录失败')
}

async function handleSync() {
  await syncNow()
  emit('toast', syncState.value.message || '同步完成')
}

async function handleLogout() {
  await signOut()
  emit('toast', '已退出登录')
}
</script>

<template>
  <div class="qb-auth-panel">
    <button type="button" class="qb-sync-toggle" @click="expanded = !expanded">
      <span class="qb-sync-dot" :class="statusClass()" />
      <span>账号 · {{ statusLabel() }}</span>
      <span v-if="loggedIn" class="qb-auth-user">{{ userLabel() }}</span>
      <span class="qb-sync-chevron">{{ expanded ? '▾' : '▸' }}</span>
    </button>

    <div v-if="expanded" class="qb-sync-body">
      <template v-if="configured && authReady">
        <template v-if="loggedIn">
          <p class="qb-sync-desc">
            已登录为 <strong>{{ userLabel() }}</strong>。题目会自动同步到云端，换设备登录同一账号即可查看。
          </p>
          <div class="qb-sync-actions">
            <button type="button" class="qb-btn primary sm" :disabled="loading" @click="handleSync">
              立即同步
            </button>
            <button type="button" class="qb-btn ghost sm" :disabled="loading" @click="handleLogout">
              退出登录
            </button>
          </div>
          <p v-if="syncState.message" class="qb-sync-msg" :class="syncState.status">
            {{ syncState.message }}
            <span v-if="syncState.lastSyncAt" class="qb-sync-time">
              · {{ new Date(syncState.lastSyncAt).toLocaleString() }}
            </span>
          </p>
        </template>

        <template v-else>
          <p class="qb-sync-desc">登录后「我的题库」自动跨设备同步，无需手动备份。</p>

          <div class="qb-auth-tabs">
            <button
              type="button"
              :class="['qb-tab', { active: mode === 'login' }]"
              @click="mode = 'login'"
            >
              登录
            </button>
            <button
              type="button"
              :class="['qb-tab', { active: mode === 'register' }]"
              @click="mode = 'register'"
            >
              注册
            </button>
          </div>

          <form class="qb-auth-form" @submit.prevent="handleEmailSubmit">
            <div class="qb-sync-field">
              <label>邮箱</label>
              <input v-model="email" type="email" class="qb-input" placeholder="you@example.com" required />
            </div>
            <div class="qb-sync-field">
              <label>密码</label>
              <input
                v-model="password"
                type="password"
                class="qb-input"
                placeholder="至少 6 位"
                minlength="6"
                required
              />
            </div>
            <div class="qb-sync-actions">
              <button type="submit" class="qb-btn primary sm" :disabled="loading">
                {{ mode === 'login' ? '邮箱登录' : '注册账号' }}
              </button>
            </div>
          </form>

          <div class="qb-auth-divider"><span>或</span></div>

          <button type="button" class="qb-btn ghost sm qb-github-btn" :disabled="loading" @click="handleGitHub">
            GitHub 登录
          </button>

          <p v-if="authError" class="qb-sync-msg error">{{ authError }}</p>
        </template>
      </template>

      <template v-else-if="!configured">
        <p class="qb-sync-desc">
          站点尚未配置云登录（Supabase）。你仍可使用下方 <strong>Gist 同步</strong>，或联系站长开启登录功能。
        </p>
        <SyncSettings @toast="emit('toast', $event)" />
      </template>

      <p v-else class="qb-sync-desc">正在加载登录状态…</p>
    </div>
  </div>
</template>

<style scoped>
.qb-auth-panel {
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

.qb-auth-user {
  font-size: 12px;
  font-weight: 500;
  color: var(--vp-c-text-3);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 180px;
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

.qb-auth-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.qb-auth-form {
  margin-bottom: 8px;
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

.qb-auth-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 14px 0;
  color: var(--vp-c-text-3);
  font-size: 12px;
}

.qb-auth-divider::before,
.qb-auth-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--vp-c-divider);
}

.qb-github-btn {
  width: 100%;
  justify-content: center;
}

.qb-sync-msg {
  margin: 12px 0 0;
  font-size: 12px;
  color: var(--vp-c-text-3);
}

.qb-sync-msg.error {
  color: #ef4444;
}

.qb-sync-time {
  color: var(--vp-c-text-3);
}
</style>
