/**
 * MAKLUMAT SUMBANGAN RASMI — ISI HANYA DENGAN MAKLUMAT YANG DISAHKAN OLEH PENGANJUR.
 *
 * Selagi mana-mana medan bernilai null, kad CTA akan memaparkan kotak placeholder
 * berlabel dan cop "PLACEHOLDER — BELUM UNTUK SIARAN". Jangan siarkan video dalam keadaan itu.
 *
 * Kod QR: letakkan imej rasmi di public/img/qr-sumbangan.png dan tetapkan qr: 'img/qr-sumbangan.png'.
 */
export const DONATION = {
  fundName: null as string | null,      // [NAMA TABUNG SUMBANGAN RASMI]
  accountHolder: null as string | null, // [NAMA PEMEGANG AKAUN]
  bank: null as string | null,          // cth. 'Bank Islam'
  accountNo: null as string | null,     // [NOMBOR AKAUN BANK RASMI]
  qr: null as string | null,            // [KOD QR SUMBANGAN] — laluan dalam public/
  link: null as string | null,          // [PAUTAN SUMBANGAN RASMI]
  contact: null as string | null,       // [MAKLUMAT HUBUNGAN]
};

export const isPlaceholder = Object.values(DONATION).some((v) => v === null);

/** Label kecil di babak pembukaan — menyatakan footaj adalah rakaman sebenar. Tambah tarikh jika disahkan. */
export const SOURCE_TAG = 'Rakaman sebenar · Parlimen Parit';
