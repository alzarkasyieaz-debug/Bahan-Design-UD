/**
 * MAKLUMAT SUMBANGAN RASMI — seperti yang dibekalkan oleh penganjur.
 *
 * Medan wajib: fundName, accountHolder, bank, accountNo, contact. Jika mana-mana kosong (null),
 * kad CTA memaparkan kotak placeholder & cop "PLACEHOLDER — BELUM UNTUK SIARAN".
 * Medan pilihan: qr (imej dalam public/, cth. 'img/qr-sumbangan.png') dan link — disembunyikan jika null.
 */
export const DONATION = {
  fundName: 'Bantuan Banjir Parit' as string | null,
  accountHolder: 'Pusat Khidmat Masyarakat Ahli Parlimen Parit' as string | null,
  bank: 'Bank Islam' as string | null,
  accountNo: '08086010044018' as string | null,
  contact: 'Haji Zawawi Ghazali' as string | null,
  contactPhone: '017-542 9662' as string | null, // 0175429662
  qr: null as string | null,   // pilihan — tiada QR dibekalkan
  link: null as string | null, // pilihan — tiada pautan dibekalkan
};

const REQUIRED = ['fundName', 'accountHolder', 'bank', 'accountNo', 'contact'] as const;
export const isPlaceholder = REQUIRED.some((k) => DONATION[k] === null);
