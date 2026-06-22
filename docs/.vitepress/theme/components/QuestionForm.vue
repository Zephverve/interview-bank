<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { withBase } from 'vitepress'
import {
  getCategories,
  getQuestion,
  addQuestion,
  updateQuestion,
  addCategory,
} from '../composables/useQuestionStore'

const categories = ref(getCategories())
const editId = ref('')
const isEdit = ref(false)

const form = ref({
  categoryId: categories.value[0]?.id || 'general',
  title: '',
  question: '',
  conclusion: '',
  followups: '',
  answer: '',
  round: '一面',
  difficulty: '⭐⭐⭐',
  tags: '',
  point: '',
})

const newCategoryName = ref('')
const showNewCategory = ref(false)
const saved = ref(false)
const error = ref('')

const rounds = ['一面', '二面', '三面', 'HR面']
const difficulties = ['⭐', '⭐⭐', '⭐⭐⭐', '⭐⭐⭐⭐', '⭐⭐⭐⭐⭐']

onMounted(() => {
  const params = new URLSearchParams(window.location.search)
  const edit = params.get('edit')
  if (edit) {
    editId.value = edit
    isEdit.value = true
    const q = getQuestion(edit)
    if (q) {
      form.value = {
        categoryId: q.categoryId,
        title: q.title,
        question: q.question,
        conclusion: q.conclusion,
        followups: q.followups,
        answer: q.answer,
        round: q.round,
        difficulty: q.difficulty,
        tags: q.tags.join(', '),
        point: q.point,
      }
    }
  }
})

function handleAddCategory() {
  const name = newCategoryName.value.trim()
  if (!name) return
  const cat = addCategory(name)
  categories.value = getCategories()
  form.value.categoryId = cat.id
  newCategoryName.value = ''
  showNewCategory.value = false
}

function validate() {
  if (!form.value.title.trim()) return '请填写题目标题'
  if (!form.value.question.trim()) return '请填写题目内容'
  if (!form.value.answer.trim()) return '请填写完整答案'
  return ''
}

function submit() {
  error.value = validate()
  if (error.value) return

  const payload = {
    categoryId: form.value.categoryId,
    title: form.value.title.trim(),
    question: form.value.question.trim(),
    conclusion: form.value.conclusion.trim(),
    followups: form.value.followups.trim(),
    answer: form.value.answer.trim(),
    round: form.value.round,
    difficulty: form.value.difficulty,
    tags: form.value.tags
      .split(/[,，]/)
      .map((s) => s.trim())
      .filter(Boolean),
    point: form.value.point.trim(),
  }

  if (isEdit.value) {
    updateQuestion(editId.value, payload)
  } else {
    addQuestion(payload)
  }

  saved.value = true
  setTimeout(() => {
    window.location.href = withBase('/my')
  }, 800)
}

function resetForm() {
  form.value = {
    categoryId: categories.value[0]?.id || 'general',
    title: '',
    question: '',
    conclusion: '',
    followups: '',
    answer: '',
    round: '一面',
    difficulty: '⭐⭐⭐',
    tags: '',
    point: '',
  }
  error.value = ''
}
</script>

<template>
  <div class="qb-form-page">
    <div class="qb-form-header">
      <h2>{{ isEdit ? '编辑题目' : '添加新题目' }}</h2>
      <p>填写后自动保存；开启云同步后可跨设备查看</p>
    </div>

    <form class="qb-form" @submit.prevent="submit">
      <div class="qb-row">
        <label class="qb-label">分类</label>
        <div class="qb-field-group">
          <select v-model="form.categoryId" class="qb-select">
            <option v-for="c in categories" :key="c.id" :value="c.id">
              {{ c.icon }} {{ c.name }}
            </option>
          </select>
          <button type="button" class="qb-btn ghost" @click="showNewCategory = !showNewCategory">
            + 新分类
          </button>
        </div>
      </div>

      <div v-if="showNewCategory" class="qb-inline-add">
        <input v-model="newCategoryName" class="qb-input" placeholder="分类名称，如：Java" />
        <button type="button" class="qb-btn primary sm" @click="handleAddCategory">创建</button>
      </div>

      <div class="qb-row">
        <label class="qb-label">题目标题 <span class="req">*</span></label>
        <input v-model="form.title" class="qb-input" placeholder="简短标题，显示在目录中" />
      </div>

      <div class="qb-row">
        <label class="qb-label">题目内容 <span class="req">*</span></label>
        <textarea
          v-model="form.question"
          class="qb-textarea"
          rows="3"
          placeholder="面试官会问的完整问题"
        />
      </div>

      <div class="qb-row cols-2">
        <div>
          <label class="qb-label">轮次</label>
          <select v-model="form.round" class="qb-select full">
            <option v-for="r in rounds" :key="r" :value="r">{{ r }}</option>
          </select>
        </div>
        <div>
          <label class="qb-label">难度</label>
          <select v-model="form.difficulty" class="qb-select full">
            <option v-for="d in difficulties" :key="d" :value="d">{{ d }}</option>
          </select>
        </div>
      </div>

      <div class="qb-row cols-2">
        <div>
          <label class="qb-label">标签</label>
          <input v-model="form.tags" class="qb-input" placeholder="逗号分隔，如：RAG, Redis" />
        </div>
        <div>
          <label class="qb-label">考察点</label>
          <input v-model="form.point" class="qb-input" placeholder="如：缓存穿透" />
        </div>
      </div>

      <div class="qb-row">
        <label class="qb-label">15 秒结论句</label>
        <textarea
          v-model="form.conclusion"
          class="qb-textarea highlight"
          rows="2"
          placeholder="面试时先用一句话概括核心答案"
        />
      </div>

      <div class="qb-row">
        <label class="qb-label">追问方向</label>
        <input v-model="form.followups" class="qb-input" placeholder="面试官可能继续追问什么？" />
      </div>

      <div class="qb-row">
        <label class="qb-label">完整回答 <span class="req">*</span></label>
        <textarea
          v-model="form.answer"
          class="qb-textarea answer"
          rows="10"
          placeholder="口语化完整回答，可以直接背诵"
        />
      </div>

      <p v-if="error" class="qb-error">{{ error }}</p>
      <p v-if="saved" class="qb-success">✓ 保存成功，正在跳转…</p>

      <div class="qb-actions">
        <button type="submit" class="qb-btn primary lg">
          {{ isEdit ? '保存修改' : '添加题目' }}
        </button>
        <button v-if="!isEdit" type="button" class="qb-btn ghost" @click="resetForm">清空</button>
        <a :href="withBase('/my')" class="qb-btn ghost">返回我的题库</a>
      </div>
    </form>
  </div>
</template>
