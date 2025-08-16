import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
<<<<<<< HEAD
  server:{
    host:'0.0.0.0'
  }
=======
>>>>>>> adf7b333b19adacd3463ffad555704561dad05d4
});
