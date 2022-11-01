<!-- eslint-disable import/no-relative-packages -->
<template>
  <div>
    <section
      class="bg-white px-4 md:px-28 py-8 flex items-center justify-between mb-14">
      <h1 class="text-5xl font-medium text-dark">My Credentials (Issuer)</h1>
      <BaseButton variant="primary">
        <span>Add New</span>
        <slot name="append">
          <svg-icon name="plus" class="!w-5 !h-5 ml-2" />
        </slot>
      </BaseButton>
    </section>

    <section class="h-full px-4 md:px-28 pb-8">
      <p class="font-medium text-gray-dark mb-9">
        Added {{ issuables.length }} Credentials
      </p>

      <div class="overflow-x-auto relative">
        <table class="w-full text-sm text-left text-gray-500">
          <thead
            class="text-gray-base uppercase bg-white border-b-[7px] border-light">
            <th scope="col" class="p-6 text-sm font-medium">Type</th>
            <th scope="col" class="p-6 text-sm font-medium">Name</th>
            <th scope="col" class="p-6 text-sm font-medium">Expiration Date</th>
            <th scope="col" class="p-6 text-sm font-medium">Issure Date</th>
            <th scope="col" class="p-6 text-sm font-medium">Date added</th>
            <th scope="col" class="p-6 text-sm font-medium">Status</th>
            <th scope="col" class="p-6 text-sm font-medium"></th>
          </thead>
          <tbody
            class="mt-10"
            v-for="issuable in issuables"
            :key="issuable.issuanceID">
            <TableRow
              class="bg-white text-gray-dark border-b-2 text-base font-medium"
              :type="issuable.type"
              :data="issuable" />
          </tbody>
        </table>
      </div>
    </section>

    <section class="py-5 text-center">
      <div class="row py-lg-5">
        <div class="col-lg-6 col-md-8 mx-auto">
          <form>
            <div
              class="d-flex flex-column align-items-md-center align-items-sm-start text-start">
              <div
                class="form-check col-md-9 col-sm-12 mb-3"
                v-for="issuable in issuables"
                :key="issuable.issuanceID">
                <input
                  class="form-check-input me-4"
                  type="checkbox"
                  :id="'issuable-' + issuable.id"
                  :name="'issuable-' + issuable.id"
                  :value="issuable.issuanceID"
                  v-model="checkedIssuances" />
                <label class="form-check-label"
                  >Verifiable ID for {{ $t(issuable.id) }} with issuance id:
                  {{ issuable.issuanceID }}
                </label>
                <button
                  type="button"
                  data-bs-toggle="modal"
                  :data-bs-target="'#credentilModalVerifiableIdRead'"
                  class="text-primary _view-btn mb-2">
                  <i class="bi bi-box-arrow-up-right p-1"></i>
                </button>
                <!--Credendtial Modal -->
                <div
                  class="modal fade"
                  :id="'credentilModalVerifiableIdRead'"
                  tabindex="-1"
                  :aria-labelledby="'credentilModalVerifiableIdRead'"
                  aria-hidden="true">
                  <div class="modal-dialog">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">
                          {{ 'Credentail Data' }}
                        </h5>
                      </div>
                      <VerifiableIDRead
                        :issuable="JSON.parse(issuable.vc)"
                        :enableEditor="enableCredentialEditor"
                        class="modal-body" />
                      <div class="modal-footer">
                        <button
                          type="button"
                          class="btn btn-primary"
                          data-bs-dismiss="modal"
                          @click="reset">
                          {{ $t('CLOSE') }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- <p>This {{ issuables.length }}</p> -->
            </div>
          </form>

          <button
            v-if="issuables.length > 0"
            class="btn btn-primary py-2 px-5 _cbtn"
            @click="pushForApprovement">
            <img v-if="btnLoading" src="loader.gif" width="20px" /><span
              v-else
              >{{ $t('CONFIRM') }}</span
            >
          </button>
          <button
            v-if="issuables.length > 0"
            class="btn btn-danger py-2 px-5 _cbtn"
            @click="pushForDelete">
            <img v-if="btnLoading" src="loader.gif" width="20px" /><span
              v-else
              >{{ $t('REJECT') }}</span
            >
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
// import VerifiableID from 'waltid-web-wallet/components/credentials/VerifiableID.vue'
// import CredentialEditor from '../components/CredentialEditor.vue'
import BaseButton from '../components/common/BaseButton.vue'

export default {
  layout: 'dashboard',
  // auth: false,

  components: { BaseButton },

  data() {
    return {
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
    availableLocales() {
      console.log('locales', this.$i18n.locales)
      return this.$i18n.locales.filter((i) => i.code !== this.$i18n.locale)
    },
    sessionId() {
      console.log('what is in the query ', this.$route.query)
      console.log('SESSION ID', this.$route.query)
      return this.$route.query.sessionId
    },
  },
  async asyncData({ $axios, query }) {
    const wallets = await $axios.$get('/issuer-api/wallets/list')
    console.log(`These wallets ${JSON.stringify(wallets)}`)
    const issuables = await $axios.$get(
      '/issuer-api/credentials/listIssuablesForApprovement',
      { params: query },
    )
    // console.log(issuables[0].id);
    console.log('these issuables ', issuables)
    return { wallets, issuables }
  },
  methods: {
    reset() {
      this.enableCredentialEditor = false
      console.log(this.issuables[0])
    },
    logout() {
      this.$auth.logout()
    },
    enableInput() {
      this.enableCredentialEditor = true
      this.btnDisabled = false
    },
    disableInput() {
      this.enableCredentialEditor = false
      this.btnDisabled = true
    },
    pushForApprovement() {
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

<style scoped>
label {
  font-size: 20px;
  margin-top: -3px;
  font-weight: 600;
}
.rebbutton {
  color: red;
}
button._view-btn {
  background-color: transparent;
  border: none;
  padding: 0;
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}
.left-inner-addon {
  position: relative;
}
.left-inner-addon input {
  padding-left: 35px !important;
}
.left-inner-addon i {
  position: absolute;
  padding: 17px 15px;
  pointer-events: none;
}
.right-inner-addon {
  position: relative;
}
.right-inner-addon input {
  padding-right: 35px !important;
}
.right-inner-addon i {
  position: absolute;
  right: 0px;
  padding: 17px 15px;
  pointer-events: none;
}
.left-and-right-inner-addon {
  position: relative;
}
.left-and-right-inner-addon input {
  padding-right: 35px !important;
  padding-left: 35px !important;
}
.left-and-right-inner-addon i.right {
  position: absolute;
  right: 0px;
  padding: 17px 15px;
  pointer-events: none;
}
.right-inner-addon-b {
  position: relative;
}
.right-inner-addon-b input {
  padding-right: 35px !important;
}
.right-inner-addon-b i {
  position: absolute;
  right: 0px;
  padding: 17px 15px;
  pointer-events: none;
}
._forms input {
  width: 100%;
  padding: 1em !important;
  margin: 0em !important;
  box-sizing: border-box;
}
._edit-btn button {
  background-color: transparent;
  border: none;
}
._cbtn {
  width: 165px;
  height: 45px;
}
._cbtn img {
  margin-top: -3px;
}
@media only screen and (max-width: 600px) {
  label {
    font-size: 14px;
    margin-top: -3px;
    font-weight: 600;
  }
  button._view-btn {
    background-color: transparent;
    border: none;
    padding: 0;
    margin: 0;
    font-size: 13px;
    font-weight: 600;
  }
}
</style>
