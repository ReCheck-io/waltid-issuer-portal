<template>
  <tr>
    <td class="py-4 px-6">{{ tableData.type }}</td>
    <td class="py-4 px-6">
      {{ tableData.fullName || 'N/A' }}
    </td>
    <td class="py-4 px-6">
      {{ tableData.endedAtTime || 'N/A' }}
    </td>
    <td class="py-4 px-6">
      {{ tableData.startedAtTime || 'N/A' }}
    </td>
    <td class="py-4 px-6">{{ tableData.dateAdded || 'N/A' }}</td>
    <td class="py-4 px-6">
      <Pill variant="pending">Pending</Pill>
    </td>
    <td class="py-4 px-6">
      <div class="space-x-3">
        <button
          type="button"
          class="text-gray-dark"
          @click="pushToCredentialPage()">
          <svg-icon name="eye" class="!w-5 !h-5" />
        </button>
        <button type="button" class="text-gray-dark">
          <svg-icon name="vertical-dots" class="!w-4 !h-4" />
        </button>
      </div>
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
  },

  data() {
    return {
      localType: this.type,
      tableData: { type: '', fullName: '', endedAtTime: '', startedAtTime: '' },
    }
  },

  methods: {
    pushToCredentialPage() {
      this.$router.push('/credential')
    },
  },

  mounted() {
    if (!this.localType) return

    const { credentialSubject } = this.data.credentialData

    this.tableData = {
      type: convertDocType(this.localType),
    }

    switch (this.localType) {
      case 'VerifiableId':
        this.tableData.fullName = credentialSubject?.nameAndFamilyNameAtBirth

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
  },
}
</script>
