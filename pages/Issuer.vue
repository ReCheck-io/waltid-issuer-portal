<template>
  <div>
    <header>
      <div id="navbarHeader" class="collapse bg-dark">
        <div class="container">
          <div class="row">
            <div class="col-sm-8 col-md-7 py-4">
              <h4 class="text-white">About walt.id</h4>
              <p class="text-muted">
                <b>walt.id</b> is a European company that develops Self-
                Sovereign Identity (SSI) solutions for governments and
                businesses across industries. We offer an easy and fast way to
                adopt SSI - particularly Europe’s new decentralized digital
                identity ecosystem - based on robust open source products. To
                ensure client’s success our industry-leading experts provide
                holistic services ranging from conception and project planning
                over the implementation of proof-of-concepts and production
                system to enterprise support and managed cloud services..
              </p>
            </div>
            <div class="col-sm-4 offset-md-1 py-4">
              <h4 class="text-white">Coordinates</h4>
              <ul class="list-unstyled">
                <li>
                  <a href="https://walt.id" class="text-white"
                    >web: https://walt.id</a
                  >
                </li>
                <li>
                  <a href="https://docs.walt.id" class="text-white"
                    >docs: https://docs.walt.id</a
                  >
                </li>
                <li>
                  <a href="https://github.com/walt-id" class="text-white"
                    >src: https://github.com/walt-id</a
                  >
                </li>
                <li>
                  <a href="mailto:office@walt.id" class="text-white"
                    >mail: office@walt.id</a
                  >
                </li>
                <button @click="$auth.logout()">
                  <span class="font-normal text-sm mt-0/5">Logout</span>
                </button>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="navbar navbar-dark bg-dark shadow-sm">
        <div class="container">
          <a href="#" class="navbar-brand d-flex align-items-center">
            <img
              class="me-3"
              src="/waltid-white-logo.png"
              alt=""
              width="50px"
            />
            <strong>walt.id</strong>
          </a>
          <ul class="nav navbar-nav navbar-right">
            <li>
              <a
                href="#"
                v-for="locale in availableLocales"
                :key="locale.code"
                @click.prevent.stop="$i18n.setLocale(locale.code)"
              >
                <img
                  :src="locale.flag"
                  width="20px"
                  height="15px"
                  :alt="locale.iso"
                  class="me-2 border border-white"
                />
              </a>
              <button
                class="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarHeader"
                aria-controls="navbarHeader"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span class="navbar-toggler-icon" />
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
    <main>
      <section class="py-5 text-center container">
        <div class="row py-lg-5">
          <div class="col-lg-6 col-md-8 mx-auto">
            <h1 class="fw-normal">Issuer view</h1>
            <p class="lead text-muted fw-normal mb-4">
              Select the credentials that you want to approve.
            </p>
             <div v-if="issuables.length == 0">
              <p>Currently there are no request for confirmation. {{issuables.length}}</p>
            </div>
            <form v-else>
              <div
                class="
                  d-flex
                  flex-column
                  align-items-md-center align-items-sm-start
                  text-start
                "
              >
                <div
                  class="form-check col-md-9 col-sm-12 mb-3"
                  v-for="issuable in issuables"
                  :key="issuable.issuanceID"
                >
                  <input
                    class="form-check-input me-4"
                    type="checkbox"
                    :id="'issuable-' + issuable.id"
                    :name="'issuable-' + issuable.id"
                    :value="issuable.issuanceID"
                    v-model="checkedIssuances"
                  />
                  <label class="form-check-label"
                    >Verifiable ID for {{ $t(issuable.id) }} with issuance id: {{ issuable.issuanceID }} </label
                  >
                </div>
                <p>This {{issuables.length}}</p>
              </div>
            </form>
           
            <button
              v-if="issuables.length > 0"
              class="btn btn-primary py-2 px-5 _cbtn"
              @click="pushForApprovement"
            >
              <img v-if="btnLoading" src="loader.gif" width="20px" /><span
                v-else
                >{{ $t("CONFIRM") }}</span
              >
               </button>
              <button
              v-if="issuables.length > 0"
              class="btn btn-danger py-2 px-5 _cbtn"
              @click="pushForDelete"
            >
              <img v-if="btnLoading" src="loader.gif" width="20px" /><span
                v-else
                >{{ $t("REJECT") }}</span
              >
            </button>
          </div>
        </div>
      </section>
    </main>
    <footer class="fixed-bottom footer mt-auto py-3 bg-light">
      <div class="container">
        <span class="text-muted">{{ $config.copyright }}</span>
      </div>
    </footer>
  </div>
</template>

<script>
import CredentialEditor from "../components/CredentialEditor.vue";
export default {
  components: { CredentialEditor },
  data() {
    return {
      checkedIssuances: [],
      checkedSessionID: [],
      enableCredentialEditor: false,
      btnLoading: false,
    };
  },
  computed: {
    availableLocales() {
      console.log("locales", this.$i18n.locales);
      return this.$i18n.locales.filter((i) => i.code !== this.$i18n.locale);
    },
    sessionId() {
      console.log("what is in the query ", this.$route.query);
      console.log("SESSION ID", this.$route.query);
      return this.$route.query.sessionId;
    },
  },
  async asyncData({ $axios, query }) {
    const wallets = await $axios.$get("/issuer-api/wallets/list");
    console.log("These wallets " + JSON.stringify(wallets));
    const issuables = await $axios.$get(
      "/issuer-api/credentials/listIssuablesForApprovement",
      { params: query }
    );
    // console.log(issuables[0].id);
    console.log("these issuables ", issuables);
    return { wallets, issuables };
  },
  methods: {
    reset() {
      this.enableCredentialEditor = false;
      console.log(this.issuables[0]);
    },
    logout() {
      this.$auth.logout();
    },
    enableInput() {
      this.enableCredentialEditor = true;
      this.btnDisabled = false;
    },
    disableInput() {
      this.enableCredentialEditor = false;
      this.btnDisabled = true;
    },
    pushForApprovement() {
      let requests = this.getCorrespondingIDObject();
      
      for(let i =0;i<requests.length;i++){
         this.$axios
        .$post("/api/wallet/siopv2/requestedIssuablesForApprovement", {
        issuanceID: requests[i].issuanceID,
        id: requests[i].id,
        sessionID: requests[i].sessionID,
        })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        }); 
      this.issuables.splice(requests[i].issuanceID)
      }
      setTimeout(() => {  this.$nuxt.refresh(); }, 2000);
      
    },
    pushForDelete() {
      let requests = this.getCorrespondingIDObject();
      
      for(let i =0;i<requests.length;i++){
         this.$axios
        .$post("/api/wallet/siopv2/requestedIssuableRejected", {
        issuanceID: requests[i].issuanceID,
        id: requests[i].id,
        sessionID: requests[i].sessionID,
        })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        }); 
      this.issuables.splice(requests[i].issuanceID)
      }
      setTimeout(() => {  this.$nuxt.refresh(); }, 2000);
      
    },
    getCorrespondingIDObject() {
      let issuableRequests = [];
      for (let i = 0; i < this.checkedIssuances.length; i++) {
        for (let j = 0; j < this.issuables.length; j++) {
          if (this.issuables[j].issuanceID == this.checkedIssuances[i]) {
            issuableRequests.push(this.issuables[j]);
          }
        }
      }
      return issuableRequests;
    },
    async goToWallet(walletId) {
      this.btnLoading = true;
      console.log("Selected issuables:", this.checkedIssuances);
      let selectedIssuables = {
        credentials: this.issuables.credentials.filter(
          (c) => this.checkedIssuances.findIndex((cc) => cc == c.type) >= 0
        ),
      };
      console.log("Selected issuables:", JSON.stringify(selectedIssuables));
      const params =
        this.sessionId != null
          ? { sessionId: this.sessionId }
          : { walletId: walletId };
      const walletUrl = await this.$axios.$post(
        "/issuer-api/credentials/issuance/request",
        selectedIssuables,
        { params: params }
      );
      console.log(JSON.stringify(walletUrl));
      setTimeout(() => {
        window.location = walletUrl;
      }, 2000);
    },
    tester() {
      console.warn(this.issuables.credentials);
    },
  },
};
</script>

<style scoped>
label {
  font-size: 20px;
  margin-top: -3px;
  font-weight: 600;
}
.rebbutton{
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