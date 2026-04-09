import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative base works for GitHub Pages project sites (user.github.io/repo/)
// and user/org sites (user.github.io) without path changes.
export default defineConfig({
  plugins: [react()],
  base: './',
})
