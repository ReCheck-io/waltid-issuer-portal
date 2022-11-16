<!-- eslint-disable import/no-relative-packages -->
<template>
  <div>
    <section
      class="bg-white px-4 md:px-28 py-8 flex items-center justify-between mb-8">
      <h1 class="text-5xl font-medium text-dark">Document Requests (Issuer)</h1>
    </section>

    <section class="h-full px-4 md:px-28 pb-8">
      <p class="font-medium text-gray-dark mb-8">
        Added {{ issuables.length }} Credentials
      </p>

      <div class="overflow-x-auto relative">
        <table class="w-full text-sm text-left text-gray-500">
          <thead
            class="text-gray-base uppercase bg-white border-b-[7px] border-light">
            <th scope="col" class="p-6 text-sm font-medium">Type</th>
            <th scope="col" class="p-6 text-sm font-medium">Name</th>
            <th scope="col" class="p-6 text-sm font-medium">Date Of Birth</th>
            <th scope="col" class="p-6 text-sm font-medium">Place Of Birth</th>
            <th scope="col" class="p-6 text-sm font-medium">Status</th>
          </thead>
          <tbody
            class="mt-10"
            v-for="issuable in issuables"
            :key="issuable.issuanceID">
            <TableRow
              class="bg-white text-gray-dark border-b-2 text-base font-medium"
              type="VerifiableId"
              :data="issuable"
              :isIssuer="isIssuer"
              @showData="showModal" />
          </tbody>
        </table>
      </div>

      <Modal v-show="isModalVisible" @close="isModalVisible = false">
        <template #header>Review Document</template>
        <template #content>
          <form class="flex flex-col gap-y-6">
            <div class="flex items-center space-x-8">
              <BaseInput
                label="Name"
                name="firstName"
                placeholder="Please enter your Name"
                v-model="formData.firstName"
                block
                :disabled="isIssuer" />
              <BaseInput
                label="Family Name"
                name="familyName"
                placeholder="Please enter your Family Name"
                v-model="formData.familyName"
                block
                :disabled="isIssuer" />
            </div>

            <BaseInput
              label="Name and Family Name at Birth"
              name="nameAndFamilyNameAtBirth"
              placeholder="Please enter your Full Name"
              v-model="formData.nameAndFamilyNameAtBirth"
              block
              :disabled="isIssuer" />

            <div class="flex items-center space-x-8">
              <BaseInput
                label="Date of Birth"
                name="dateOfBirth"
                placeholder="Please enter your Date Of Birth"
                v-model="formData.dateOfBirth"
                block
                :disabled="isIssuer" />
              <BaseInput
                label="Place of Birth"
                name="placeofBirth"
                placeholder="Please enter your Place of Birth"
                v-model="formData.placeOfBirth"
                block
                :disabled="isIssuer" />
            </div>

            <BaseInput
              label="Current Address"
              name="currentAddress"
              placeholder="Please enter your Current Address"
              v-model="formData.currentAddress"
              block
              :disabled="isIssuer" />

            <div class="flex items-center space-x-8">
              <BaseInput
                label="Gender"
                name="gender"
                placeholder="Please enter your Gender"
                v-model="formData.gender"
                block
                :disabled="isIssuer" />
              <BaseInput
                label="Personal Identifier"
                name="personalIdentifier"
                placeholder="Please enter your Personal Identifier"
                v-model="formData.personalIdentifier"
                block
                :disabled="isIssuer" />
            </div>
          </form>
        </template>
        <template #footer>
          <BaseButton variant="clear" @click="pushForDelete">
            Reject
          </BaseButton>
          <BaseButton variant="primary" @click="pushForApprovement">
            Confirm
          </BaseButton>
        </template>
      </Modal>
    </section>
  </div>
</template>

<script>
import BaseButton from '../components/common/BaseButton.vue'
import BaseInput from '../components/common/BaseInput.vue'
import Modal from '../components/Modal.vue'

export default {
  name: 'IssuerPage',
  layout: 'dashboard',

  auth: false,

  components: { BaseButton, BaseInput, Modal },

  data() {
    return {
      isIssuer: true,
      isModalVisible: false,
      formData: {
        firstName: '',
        familyName: '',
        nameAndFamilyNameAtBirth: '',
        dateOfBirth: '',
        placeOfBirth: '',
        gender: '',
        currentAddress: [''],
        personalIdentifier: '',
      },

      checkedIssuances: [],
      checkedSessionID: [],
      enableCredentialEditor: false,
      btnLoading: false,
    }
  },

  head() {
    return {
      title: 'My Credentials (Issuer) - EBSI Issuer',
    }
  },

  computed: {
    sessionId() {
      console.log('what is in the query ', this.$route.query)
      console.log('SESSION ID', this.$route.query)
      return this.$route.query.sessionId
    },
  },
  async asyncData({ $axios, query }) {
    const wallets = await $axios.$get('/issuer-api/wallets/list')
    console.log(`These wallets ${JSON.stringify(wallets)}`)
    let issuables = await $axios.$get(
      '/issuer-api/credentials/listIssuablesForApprovement',
      { params: query },
    )
    // console.log(issuables[0].id);
    console.log('these issuables ', issuables)
    issuables = issuables.filter((i) => i.vc !== 'empty')
    return { wallets, issuables }
  },
  methods: {
    showModal(id) {
      this.checkedIssuances = []
      this.checkedIssuances.push(id)

      this.formData = JSON.parse(
        this.issuables.find((i) => i.issuanceID === id)?.vc || '{}',
      )?.credentials?.[0]?.credentialData?.credentialSubject

      this.isModalVisible = true
    },
    pushForApprovement() {
      this.isModalVisible = false
      const requests = this.getCorrespondingIDObject()

      for (let i = 0; i < requests.length; i++) {
        this.$axios
          .$post('/api/wallet/siopv2/requestedIssuablesForApprovement', {
            issuanceID: requests[i].issuanceID,
            id: requests[i].id,
            sessionID: requests[i].sessionID,
          })
          .then(function (response) {
            console.log(response)
          })
          .catch(function (error) {
            console.log(error)
          })
        this.issuables.splice(requests[i].issuanceID)
      }
      setTimeout(() => {
        this.$nuxt.refresh()
      }, 2000)
    },
    pushForDelete() {
      this.isModalVisible = false
      const requests = this.getCorrespondingIDObject()

      for (let i = 0; i < requests.length; i++) {
        this.$axios
          .$post('/api/wallet/siopv2/requestedIssuableRejected', {
            issuanceID: requests[i].issuanceID,
            id: requests[i].id,
            sessionID: requests[i].sessionID,
          })
          .then(function (response) {
            console.log(response)
          })
          .catch(function (error) {
            console.log(error)
          })
        this.issuables.splice(requests[i].issuanceID)
      }
      setTimeout(() => {
        this.$nuxt.refresh()
      }, 2000)
    },
    getCorrespondingIDObject() {
      const issuableRequests = []
      for (let i = 0; i < this.checkedIssuances.length; i++) {
        for (let j = 0; j < this.issuables.length; j++) {
          if (this.issuables[j].issuanceID === this.checkedIssuances[i]) {
            issuableRequests.push(this.issuables[j])
          }
        }
      }
      return issuableRequests
    },
    async goToWallet(walletId) {
      this.btnLoading = true
      console.log('Selected issuables:', this.checkedIssuances)
      const selectedIssuables = {
        credentials: this.issuables.credentials.filter(
          (c) => this.checkedIssuances.findIndex((cc) => cc === c.type) >= 0,
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
      console.log(JSON.stringify(walletUrl))
      setTimeout(() => {
        window.location = walletUrl
      }, 2000)
    },
    tester() {
      console.warn(this.issuables.credentials)
    },
  },
}
</script>
