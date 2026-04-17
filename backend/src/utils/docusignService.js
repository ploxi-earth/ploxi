function normalizeAgreementStatus(agreement) {
  if (!agreement) return 'not_sent';
  if (agreement.signed || agreement.signed_at) return 'signed';
  if (agreement.viewed || agreement.viewed_at) return 'viewed';
  return 'sent';
}

module.exports = {
  normalizeAgreementStatus,
};
