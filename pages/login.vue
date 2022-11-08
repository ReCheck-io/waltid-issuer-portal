<template>
  <div class="w-full min-h-screen flex relative">
    <div
      class="left-side py-8 px-10 w-full max-w-full lg:max-w-[52%] bg-white flex flex-col justify-between">
      <div class="mt-36 mb-20 md:px-8 xl:px-28 flex flex-col gap-6">
        <div class="mb-8">
          <h1 class="mb-3 text-[40px] font-medium text-dark leading-[48px]">
            Welcome Back
          </h1>
          <p class="text-base font-medium text-gray-base leading-[19px]">
            Enter your credentials to access your account.
          </p>
        </div>

        <BaseButton variant="clear" disabled>
          {{ $t('LOG_IN_WITH_WALLET') }}
        </BaseButton>

        <div
          class="my-6 h-3 border-b-[1px] border-gray-light text-base text-center">
          <span class="bg-white font-medium text-gray-base px-3">or</span>
        </div>

        <form @submit="login" class="flex flex-col gap-6">
          <BaseInput
            name="email"
            type="email"
            :label="$t('EMAIL')"
            autoComplete="off"
            placeholder="Enter your email address"
            v-model="email" />
          <BaseInput
            name="password"
            type="password"
            :label="$t('PASSWORD')"
            placeholder="Enter your password"
            v-model="password" />
          <BaseCheckbox
            v-model="issuer"
            :inputValue="true"
            id="isIssuer"
            label="as Issuer"
            class="my-2" />

          <BaseButton variant="primary" type="submit">
            {{ $t('LOG_IN') }}
          </BaseButton>

          <p class="font-medium text-gray-dark">
            Not a member?
            <a href="/register" class="text-primary">
              {{ $t('CREATE_ACCOUNT') }}
            </a>
          </p>
        </form>
      </div>
      <footer class="md-h:pb-8 text-center">
        <p class="text-gray-base">
          Copyright {{ currenYear }} &copy; EBSI Inc.
        </p>
        <a href="/" class="text-gray-dark">Privacy Policy</a>
      </footer>
    </div>
    <div
      class="right side py-8 px-10 w-full max-w-[48%] bg-light hidden lg:flex relative justify-end">
      <img
        alt="Laptop Illustration"
        src="~assets/images/laptop-mockup.png"
        class="absolute right-0 bottom-0"
        width="750px"
        height="750px" />
    </div>
  </div>
</template>

<script>
import BaseCheckbox from '../components/common/BaseCheckbox.vue'
import BaseButton from '../components/common/BaseButton.vue'
import BaseInput from '../components/common/BaseInput.vue'

export default {
  name: 'LoginPage',
  layout: 'auth',

  components: { BaseButton, BaseInput, BaseCheckbox },

  head() {
    return {
      title: 'Login - EBSI Issuer',
    }
  },

  data() {
    return {
      email: '',
      password: '',
      issuer: false,

      error: null,

      currenYear: new Date().getFullYear(),
    }
  },
  methods: {
    async login(event) {
      event.preventDefault()

      console.log('coming here ? ', this.issuer)

      if (this.issuer) {
        this.$router.push('/issuer')
      }

      try {
        console.log(this.email, this.password)
        const loginResponse = await this.$auth.loginWith('local', {
          data: {
            id: this.email,
            password: this.password,
          },
        })
        this.$auth.setUser(loginResponse.data)
      } catch (e) {
        this.error = e.response.data.message
      }
    },
  },
}
</script>
