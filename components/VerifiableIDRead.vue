<template>
    <div>
        <!-- VerifiableIdRead -->
      <div v-if="issuable.credentials[0].type == 'VerifiableId'">
        <div class="row _forms mb-3">
          <div class="col-11">
            <div class="right-inner-addon input-container">
              <i class="bi bi-card-text"> Name</i>
              <input :disabled="!enableEditor" type="text" :class="enableEditor ? 'form-control border-primary' : 'form-control'" :placeholder="$t('CREDENTIAL.FIRST_NAME')" aria-label="First name" v-model="issuable.credentials[0].credentialData.credentialSubject.firstName">
            </div>
          </div>
        </div>
        <div class="row _forms mb-3">
          <div class="col-11">
            <div class="right-inner-addon input-container">
              <i class="bi bi-card-text"> Family name</i>
              <input :disabled="!enableEditor" type="text" :class="enableEditor ? 'form-control border-primary' : 'form-control'" :placeholder="$t('CREDENTIAL.LAST_NAME')" aria-label="Family name" v-model="issuable.credentials[0].credentialData.credentialSubject.familyName">
            </div>
          </div>
        </div>
         <div class="row _forms mb-3">
          <div class="col-11">
            <div class="right-inner-addon input-container">
              <i class="bi bi-card-text"> Name and family name at birth</i>
              <input :disabled="!enableEditor" type="text" :class="enableEditor ? 'form-control border-primary' : 'form-control'" :placeholder="$t('CREDENTIAL.NAME_AND_FAMILY_NAME_AT_BIRTH')" aria-label="Name and family name at birth" v-model="issuable.credentials[0].credentialData.credentialSubject.nameAndFamilyNameAtBirth">
            </div>
          </div>
        </div>
        <div class="row _forms mb-3">
          <div class="col-11">
            <div class="right-inner-addon input-container">
              <i class="bi bi-people"> Gender</i>
              <input :disabled="!enableEditor" type="text" :class="enableEditor ? 'form-control border-primary' : 'form-control'" :placeholder="$t('CREDENTIAL.GENDER')" aria-label="Gender" v-model="issuable.credentials[0].credentialData.credentialSubject.gender">
            </div>
          </div>
        </div>
        <div class="row _forms mb-3">
          <div class="col-11">
            <div class="right-inner-addon input-container">
              <i class="bi bi-calendar2-event"> Date of birth</i>
              <input :disabled="!enableEditor" type="text" :class="enableEditor ? 'form-control border-primary' : 'form-control'" :placeholder="$t('CREDENTIAL.DATE_OF_BIRTH')" aria-label="DateOfBirth" v-model="issuable.credentials[0].credentialData.credentialSubject.dateOfBirth">
            </div>
          </div>
        </div>
        <div class="row _forms mb-3">
          <div class="col-11">
            <div class="right-inner-addon input-container">
              <i class="bi bi-map"> Nationality</i>
              <input :disabled="!enableEditor" type="text" :class="enableEditor ? 'form-control border-primary' : 'form-control'" :placeholder="$t('CREDENTIAL.NATIONALITY')" aria-label="Nationality" v-model="issuable.credentials[0].credentialData.credentialSubject.nationality">
            </div>
          </div>
        </div>
        <div class="row _forms mb-3">
          <div class="col-11">
            <div class="right-inner-addon input-container">
              <i class="bi bi-geo-alt"> Place of Birth</i>
              <input :disabled="!enableEditor" type="text" :class="enableEditor ? 'form-control border-primary' : 'form-control'" :placeholder="$t('CREDENTIAL.PLACE_OF_BIRTH')" aria-label="PlaceOfBirth" v-model="issuable.credentials[0].credentialData.credentialSubject.placeOfBirth">
            </div>
          </div>
        </div>
        <div class="row _forms mb-3">
          <div class="col-11">
            <div class="right-inner-addon input-container">
              <i class="bi bi-credit-card-2-front"> ID</i>
              <input :disabled="!enableEditor" type="text" :class="enableEditor ? 'form-control border-primary' : 'form-control'" :placeholder="$t('CREDENTIAL.PERSONAL_IDENTIFIER')" aria-label="PersonalIdentifier" v-model="issuable.credentials[0].credentialData.credentialSubject.personalIdentifier">
            </div>
          </div>
        </div>
      </div>
    </div>
</template>
<script>
export default {
  name: "VerifiableIDRead",
  props: {
    issuable: {},
    enableEditor: false
  }
}
</script>
