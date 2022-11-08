<template>
  <div>
    <section
      class="bg-white px-4 md:px-28 py-8 flex items-center justify-between mb-8">
      <h1 class="text-5xl font-medium text-dark">Dashboard</h1>
    </section>

    <section class="h-full px-4 md:px-28 pb-8 relative">
      <div
        class="flex items-center"
        v-for="issuable in issuables.credentials"
        :key="issuable.type">
        <TemplateCard :type="issuable.type" @create="showModal" />
      </div>

      <Modal
        v-show="isModalVisible"
        @close="isModalVisible = false"
        @submit="goToWallet(wallets[0])">
        <template #header>Request Document</template>
        <template #content>
          <form action="" class="flex flex-col gap-y-6">
            <div class="flex items-center space-x-8">
              <BaseInput
                label="Name"
                name="firstName"
                placeholder="Please enter your Name"
                v-model="formData.firstName"
                block />
              <BaseInput
                label="Family Name"
                name="familyName"
                placeholder="Please enter your Family Name"
                v-model="formData.familyName"
                block />
            </div>

            <BaseInput
              label="Name and Family Name at Birth"
              name="nameAndFamilyNameAtBirth"
              placeholder="Please enter your Full Name"
              v-model="formData.nameAndFamilyNameAtBirth"
              block />

            <div class="flex items-center space-x-8">
              <BaseInput
                label="Date of Birth"
                name="dateOfBirth"
                placeholder="Please enter your Date Of Birth"
                v-model="formData.dateOfBirth"
                block />
              <BaseInput
                label="Place of Birth"
                name="placeofBirth"
                placeholder="Please enter your Place of Birth"
                v-model="formData.placeOfBirth"
                block />
            </div>

            <BaseInput
              label="Current Address"
              name="currentAddress"
              placeholder="Please enter your Current Address"
              v-model="formData.currentAddress"
              block />

            <div class="flex items-center space-x-8">
              <BaseInput
                label="Gender"
                name="gender"
                placeholder="Please enter your Gender"
                v-model="formData.gender"
                block />

              <BaseInput
                label="Personal Identifier"
                name="personalIdentifier"
                placeholder="Please enter your Personal Identifier"
                v-model="formData.personalIdentifier"
                block />
            </div>
          </form>
        </template>
      </Modal>
    </section>
  </div>
</template>

<script>
import BaseInput from '../components/common/BaseInput.vue'
import TemplateCard from '../components/Card.vue'
import Modal from '../components/Modal.vue'

export default {
  layout: 'dashboard',
  // auth: true,

  components: {
    TemplateCard,
    BaseInput,
    Modal,
  },

  head() {
    return {
      title: 'My Credentials - EBSI Issuer',
    }
  },

  data() {
    return {
      isModalVisible: false,
      selectedTemplateType: '',

      formData: {
        firstName: '',
        familyName: '',
        nameAndFamilyNameAtBirth: '',
        dateOfBirth: '',
        placeOfBirth: '',
        gender: '',
        currentAddress: '',
        personalIdentifier: '',
      },

      checkedCredentials: ['VerifiableId'],
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
      {
        params: query,
      },
    )
    issuables.credentials = issuables.credentials.filter(
      (i) => i.type === 'VerifiableId',
    )
    console.log('issuables', issuables.credentials.length)
    return { wallets, issuables }
  },
  methods: {
    showModal(type) {
      this.isModalVisible = true
      this.selectedTemplateType = type
    },
    async goToWallet(walletId) {
      this.isModalVisible = false
      console.log('Selected issuables:', this.checkedCredentials)
      const selectedIssuables = {
        credentials: this.issuables.credentials.filter(
          (c) => this.checkedCredentials.findIndex((cc) => cc === c.type) >= 0,
        ),
      }
      selectedIssuables.credentials[0].credentialData.credentialSubject = {
        ...selectedIssuables.credentials[0].credentialData.credentialSubject,
        ...this.formData,
        currentAddress: [this.formData.currentAddress],
      }
      console.log('selectedIssuables', selectedIssuables)
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
