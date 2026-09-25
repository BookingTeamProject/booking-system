export const PHONE_COUNTRIES = [
  { code: 'UA', name: 'Україна', dial: '380', min: 9, max: 9 },
  { code: 'PL', name: 'Польща', dial: '48', min: 9, max: 9 },
  { code: 'DE', name: 'Німеччина', dial: '49', min: 7, max: 11 },
  { code: 'CZ', name: 'Чехія', dial: '420', min: 9, max: 9 },
  { code: 'SK', name: 'Словаччина', dial: '421', min: 9, max: 9 },
  { code: 'RO', name: 'Румунія', dial: '40', min: 9, max: 9 },
  { code: 'HU', name: 'Угорщина', dial: '36', min: 8, max: 9 },
  { code: 'MD', name: 'Молдова', dial: '373', min: 8, max: 8 },
  { code: 'GB', name: 'Велика Британія', dial: '44', min: 9, max: 10 },
  { code: 'FR', name: 'Франція', dial: '33', min: 9, max: 9 },
  { code: 'IT', name: 'Італія', dial: '39', min: 6, max: 11 },
  { code: 'ES', name: 'Іспанія', dial: '34', min: 9, max: 9 },
  { code: 'US', name: 'США / Канада', dial: '1', min: 10, max: 10 },
  { code: 'OTHER', name: 'Інша країна', dial: '', min: 7, max: 15 },
] as const;

export function internationalPhone(countryCode: string, value: string): string {
  const country = PHONE_COUNTRIES.find(c => c.code === countryCode);
  if (!country) throw new Error('Оберіть країну.');
  const cleaned = value.trim().replace(/[\s()-]/g, '');
  if (!/^\+?\d+$/.test(cleaned)) throw new Error('Вкажіть номер телефону цифрами.');
  const international = cleaned.startsWith('+') || cleaned.startsWith('00');
  let digits = cleaned.replace(/^\+|^00/, '');
  if (!country.dial) {
    if (!international || !/^[1-9]\d{6,14}$/.test(digits)) throw new Error('Вкажіть повний міжнародний номер з +кодом країни.');
    return `+${digits}`;
  }
  if (international) {
    if (!digits.startsWith(country.dial)) throw new Error('Код номера не відповідає обраній країні.');
    digits = digits.slice(country.dial.length);
  } else if (country.code !== 'IT') digits = digits.replace(/^0/, '');
  if (digits.length < country.min || digits.length > country.max) throw new Error('Перевірте довжину номера для обраної країни.');
  return `+${country.dial}${digits}`;
}
