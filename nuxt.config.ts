// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    '@nuxtjs/supabase',
    '@nuxtjs/color-mode',
  ],
  supabase: {
    redirect: true,
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.BASE_URL ?? 'http://localhost:3000',
    }
  }
})