<template>
  <tr class="hover:cursor-pointer" @click="$emit('showData', data.issuanceID)">
    <td class="py-4 px-6">
      <div class="flex items-center gap-x-3">
        <span
          class="w-10 h-10 flex items-center justify-center rounded-full bg-[#D3E6F8]">
          <svg-icon name="id-card" class="!w-6 !h-6" />
        </span>
        {{ tableData.type?.label || 'N/A' }}
      </div>
    </td>
    <td class="py-4 px-6">
      {{ tableData.nameAndFamilyNameAtBirth || 'N/A' }}
    </td>
    <td v-if="isIssuer" class="py-4 px-6">
      {{ tableData.dateOfBirth || 'N/A' }}
    </td>
    <td v-if="isIssuer" class="py-4 px-6">
      {{ tableData.placeOfBirth || 'N/A' }}
    </td>
    <td v-if="!isIssuer" class="py-4 px-6">
      {{ tableData.startedAtTime || 'N/A' }}
    </td>
    <td v-if="!isIssuer" class="py-4 px-6">
      {{ tableData.dateAdded || 'N/A' }}
    </td>
    <td class="py-4 px-6">
      <Pill variant="pending">Pending</Pill>
    </td>
  </tr>
</template>

<script>
import Pill from './common/Pill.vue'
import { convertDocType } from '../utils'

export default {
  name: 'TableRow',

  components: { Pill },

  props: {
    type: {
      type: String,
    },
    data: {
      type: Object,
    },
    isIssuer: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      localType: this.type,
      tableData: {},
    }
  },

  methods: {},

  mounted() {
    if (!this.localType) return

    let rowData = this.data
    console.log(this.data)
    if (this.data.vc && this.data.vc === 'empty') {
      return
    }
    if (this.data.vc && this.data.vc !== 'empty') {
      console.log(111)
      rowData = JSON.parse(this.data.vc)?.credentials?.[0]
    }

    console.log('rowData', rowData)
    const { credentialSubject } = rowData.credentialData

    switch (this.localType) {
      case 'VerifiableId':
        this.tableData = credentialSubject

        break
      case 'VerifiableDiploma':
        this.tableData.fullName = `${credentialSubject?.givenNames} ${credentialSubject?.familyName}`

        this.tableData.endedAtTime = new Date(
          credentialSubject?.awardingOpportunity?.endedAtTime,
        ).toLocaleDateString()
        this.tableData.startedAtTime = new Date(
          credentialSubject?.awardingOpportunity?.startedAtTime,
        ).toLocaleDateString()

        break
      case 'VerifiableVaccinationCertificate':
        this.tableData.fullName = `${credentialSubject?.givenNames} ${credentialSubject?.familyName}`

        break
      case 'ProofOfResidence':
        this.tableData.fullName = `${credentialSubject?.firstNames} ${credentialSubject?.familyName}`
        break
      case 'ParticipantCredential':
        break
      case 'Europass':
        break
      case 'OpenBadgeCredential':
        break

      default:
        console.log('Not supported issueance type!!', this.type, this.data)
        break
    }

    this.tableData.type = convertDocType(rowData.type)
  },
}
</script>
