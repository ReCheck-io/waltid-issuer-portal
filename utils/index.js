/* eslint-disable import/prefer-default-export */

export const convertDocType = (type) => {
  let str = ''

  switch (type) {
    case 'VerifiableId':
      str = 'ID Card'
      break
    case 'VerifiableDiploma':
      str = 'Diploma'
      break
    case 'VerifiableVaccinationCertificate':
      str = 'Vaccination Certificate'
      break
    case 'ProofOfResidence':
      str = 'Proof Of Residence'
      break
    case 'ParticipantCredential':
      str = 'Participant Credential'
      break
    case 'Europass':
      str = 'Europass'
      break
    case 'OpenBadgeCredential':
      str = 'Open Badge Credential'
      break
    default:
      return 'N/A'
  }

  return str
}
