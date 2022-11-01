<template>
  <div>
    <section class="bg-white px-6 py-3 flex items-center justify-between">
      <nuxt-link to="/" class="text-xl font-medium text-dark">
        <svg-icon name="chevron-left" />
        <span>Back</span>
      </nuxt-link>
      <div class="flex items-center space-x-3">
        <BaseButton variant="primary" size="sm">Edit</BaseButton>
      </div>
    </section>

    <section class="h-full px-4 md:px-28 pb-8">asd</section>
  </div>
</template>

<script>
import BaseButton from '../components/common/BaseButton.vue'

export default {
  layout: 'editor',
  auth: false,

  components: {
    BaseButton,
  },

  head() {
    return {
      title: 'My Credentials - EBSI Issuer',
    }
  },

  data() {
    return {
      checkedCredentials: [],
      enableCredentialEditor: false,
      btnLoading: false,
    }
  },

  computed: {
    sessionId() {
      console.log('SESSION ID', this.$route.query)
      return this.$route.query.sessionId
    },
  },
  async asyncData({ $axios, query }) {
    const wallets = await $axios.$get('/issuer-api/wallets/list')
    console.log('These wallets:', JSON.stringify(wallets))

    const issuables = await $axios.$get(
      '/issuer-api/credentials/listIssuables',
      { params: query },
    )
    console.log('issuables', JSON.stringify(issuables))
    return { wallets, issuables }
  },
  methods: {
    reset() {
      this.enableCredentialEditor = false
      console.log(this.issuables[0])
    },
    enableInput() {
      this.enableCredentialEditor = true
      this.btnDisabled = false
    },
    disableInput() {
      this.enableCredentialEditor = false
      this.btnDisabled = true
    },
    async goToWallet(walletId) {
      this.btnLoading = true
      console.log('Selected issuables:', this.checkedCredentials)
      const selectedIssuables = {
        credentials: this.issuables.credentials.filter(
          (c) => this.checkedCredentials.findIndex((cc) => cc === c.type) >= 0,
        ),
      }
      console.log('Selected issuables:', JSON.stringify(selectedIssuables))
      const params =
        this.sessionId != null ? { sessionId: this.sessionId } : { walletId }
      const walletUrl = await this.$axios.$post(
        '/issuer-api/credentials/issuance/request',
        selectedIssuables,
        { params },
      )
      console.log('those params ', params)
      console.log(JSON.stringify(walletUrl))
      setTimeout(() => {
        window.location = walletUrl
      }, 2000)
    },
  },
}
</script>
