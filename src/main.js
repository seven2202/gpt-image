import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import './style.css'

// 路由配置
const routes = [
  { path: '/', component: () => import('./components/ImageGenerator.vue') },
  { path: '/edit', component: () => import('./components/ImageEditor.vue') }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

const app = createApp(App)
app.use(router)
app.mount('#root')
