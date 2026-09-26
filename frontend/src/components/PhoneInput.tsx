import { PHONE_COUNTRIES } from '../config/phoneCountries';

export function PhoneInput({ country, onCountry, value, onChange }: {
  country: string; onCountry: (country: string) => void; value: string; onChange: (value: string) => void;
}) {
  return <div className="phone-field">
    <label>Країна та код<select value={country} onChange={e => onCountry(e.target.value)} autoComplete="country">
      {PHONE_COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}{c.dial ? ` +${c.dial}` : ''}</option>)}
    </select></label>
    <label>Номер телефону<input type="tel" autoComplete="tel-national" inputMode="tel" value={value}
      onChange={e => onChange(e.target.value)} placeholder={country === 'OTHER' ? '+код та номер' : 'Номер без коду країни'} required maxLength={25} /></label>
  </div>;
}
