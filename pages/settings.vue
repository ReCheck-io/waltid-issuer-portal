<template>
  <div>
    <section
      class="bg-white px-4 md:px-28 py-8 flex items-center justify-between mb-14">
      <h1 class="text-5xl font-medium text-dark">Settings</h1>
    </section>

    <section class="h-full px-4 md:px-28 pb-8">
      <div
        class="w-full max-w-3xl mx-auto p-6 space-y-8 bg-white rounded-[9px]">
        <h2 class="font-medium text-gray-dark uppercase">
          Personal Information
        </h2>
        <div class="flex items-center space-x-8">
          <BaseInput
            name="firstName"
            label="Name"
            v-model="firstName"
            disabled
            block />
          <BaseInput
            name="familyName"
            label="Family Name"
            v-model="familyName"
            disabled
            block />
        </div>
        <BaseInput
          type="email"
          name="email"
          label="Email"
          v-model="email"
          disabled
          block />
      </div>
    </section>
  </div>
</template>

<script>
import BaseInput from '../components/common/BaseInput.vue'

export default {
  layout: 'dashboard',
  auth: false,

  components: {
    BaseInput,
  },

  head() {
    return {
      title: 'Settings - EBSI Issuer',
    }
  },

  data() {
    return {
      firstName: '',
      familyName: '',
      email: '',
    }
  },

  async asyncData({ $axios }) {
    const userInfo = await $axios.$get('/api/auth/userInfo')
    console.log('userInfo', userInfo)
    console.log(this)

    return {}
  },
  methods: {},
}
</script>
