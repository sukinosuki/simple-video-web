import { ViteSSG } from 'vite-ssg'
import { setupLayouts } from 'virtual:generated-layouts'
// import Previewer from 'virtual:vue-component-preview'
// import { createVuetify } from 'vuetify'
import Varlet from '@varlet/ui'
import App from './App.vue'
import type { UserModule } from './types'
import generatedRoutes from '~pages'
import '@unocss/reset/tailwind.css'
import './styles/main.scss'
import 'uno.css'
import '@varlet/ui/es/snackbar/style'
// import '@varlet/ui/es/style'
// import 'vuetify/styles'

// const vuetify = createVuetify({
//   components,
//   directives,
// })

const routes = setupLayouts(generatedRoutes)

// https://github.com/antfu/vite-ssg
export const createApp = ViteSSG(
  App,
  { routes, base: import.meta.env.BASE_URL },
  (ctx) => {
    ctx.app.use(Varlet)

    // install all modules under `modules/`
    Object.values(import.meta.glob<{ install: UserModule }>('./modules/*.ts', { eager: true }))
      .forEach(i => i.install?.(ctx))
    // ctx.app.use(Previewer)
  },
)
