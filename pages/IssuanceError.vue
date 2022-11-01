<template>
  <div>
    <header>
      <div id="navbarHeader" class="collapse bg-dark">
        <div class="container">
          <div class="row">
            <div class="col-sm-8 col-md-7 py-4">
              <h4 class="text-white">About walt.id</h4>
              <p class="text-muted">
                <b>walt.id</b>
              </p>
            </div>
            <div class="col-sm-4 offset-md-1 py-4"></div>
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
              width="50px" />
            <strong>walt.id</strong>
          </a>
          <ul class="nav navbar-nav navbar-right">
            <li>
              <a
                href="#"
                v-for="locale in availableLocales"
                :key="locale.code"
                @click.prevent.stop="$i18n.setLocale(locale.code)">
                <img
                  :src="locale.flag"
                  width="20px"
                  height="15px"
                  :alt="locale.iso"
                  class="me-2 border border-white" />
              </a>
              <button
                class="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarHeader"
                aria-controls="navbarHeader"
                aria-expanded="false"
                aria-label="Toggle navigation">
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
            <h1 class="fw-normal">
              {{ $t('ERROR_ISSUING') }}
            </h1>
            <p class="lead text-muted fw-normal mb-4">
              {{ errorMsg }}
            </p>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
export default {
  name: 'IssuanceError',
  auth: false,
  computed: {
    errorMsg() {
      return this.$route.query.message
    },
  },
}
</script>

<style scoped></style>
