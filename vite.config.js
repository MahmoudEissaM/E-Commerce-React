import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 8080, // تغيير البورت ليكون 8080 لـ Azure
    host: true, // يضمن إن السيرفر يشتغل بشكل صحيح على Azure
  }
})
