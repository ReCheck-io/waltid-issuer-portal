export default {
  head: {
    title: 'EBSI Issuer',
    htmlAttrs: { lang: 'en' },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/png', href: '/ebsi-logo.svg' }],
  },

  css: ['~/assets/scss/fonts.scss', '~/assets/scss/main.scss'],

  components: true,

  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },

  buildModules: ['@nuxt/postcss8'],
  modules: [
    '@nuxtjs/svg-sprite',
    '@nuxtjs/auth-next',
    '@nuxtjs/axios',
    '@nuxtjs/i18n',
  ],

  svgSprite: {
    input: '~/assets/svg/',
    output: '~/assets/svg/gen',
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    proxy: true,
  },

  proxy: {
    '/issuer-api/':
      process.env.NODE_ENV === 'production'
        ? 'https://wallet.waltid.org'
        : 'http://localhost:8080/',
    '/onboarding-api/':
      process.env.NODE_ENV === 'production'
        ? 'https://wallet.waltid.org'
        : 'http://localhost:8080/',
    '/api/':
      process.env.NODE_ENV === 'production'
        ? 'https://wallet.waltid.org'
        : 'http://localhost:8080/',
  },

  auth: {
    strategies: {
      local: {
        token: {
          property: 'token',
          global: true,
          required: true,
          type: 'Bearer',
        },
        user: false,
      },
      localOnboarding: {
        scheme: 'local',
        token: {
          property: 'token',
          global: true,
          required: true,
          type: 'Bearer',
        },
        user: false,
        endpoints: {
          login: {
            url: 'onboarding-api/auth/userToken',
            method: 'get',
          },
          user: {
            url: 'api/auth/userInfo',
            method: 'get',
          },
          logout: false,
        },
      },
    },
    // redirect: {
    //   logout: '/logout',
    //   login: '/login',
    //   register: '/register',
    //   home: '/Credentials',
    // },
    cookie: false,
  },

  i18n: {
    /* module options */
    langDir: '~/locales/',
    locales: [
      { code: 'en', iso: 'en-US', file: 'en.js', flag: 'flag-en.svg' },
      { code: 'de', iso: 'de-DE', file: 'de.js', flag: 'flag-de.svg' },
      { code: 'fr', iso: 'fr-FR', file: 'fr.js', flag: 'flag-fr.svg' },
    ],
    defaultLocale: 'en',
    strategy: 'no_prefix',
    vueI18n: {
      fallbackLocale: 'en',
    },
  },

  router: {
    middleware: ['auth'],
  },

  publicRuntimeConfig: {
    copyright: process.env.COPYRIGHT || 'powered by ReCheck',
    salt: process.env.SALT,
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    babel: {
      compact: true,
    },
    postcss: {
      plugins: {
        'postcss-import': {},
        'tailwindcss/nesting': {},
        tailwindcss: {},
        autoprefixer: {},
      },
    },
  },

  ssr: false,
  server: {
    port: 8000,
  },
}
