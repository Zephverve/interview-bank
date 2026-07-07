import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import './custom.css'
import QuestionForm from './components/QuestionForm.vue'
import MyQuestionBank from './components/MyQuestionBank.vue'
import HomeUserBank from './components/HomeUserBank.vue'
import PdfViewer from './components/PdfViewer.vue'
import { initAuth } from './composables/useAuth'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('QuestionForm', QuestionForm)
    app.component('MyQuestionBank', MyQuestionBank)
    app.component('HomeUserBank', HomeUserBank)
    app.component('PdfViewer', PdfViewer)
    if (typeof window !== 'undefined') {
      initAuth()
    }
  },
}
