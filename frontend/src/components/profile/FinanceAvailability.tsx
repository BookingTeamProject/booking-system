export function FinanceUnavailable() {
  return <section style={{ padding: 32, background: 'white', borderRadius: 20, color: '#6E473B' }}>
    <h2>Бронювання без онлайн-оплати</h2>
    <p>Реальні платежі та виплати не входять до цього проєкту. Фінансовий розділ доступний лише в демонстраційному режимі; бронювання не списують кошти.</p>
  </section>;
}

export function DemoFinanceNotice() {
  return <p role="status" style={{ padding: 16, background: '#fff3cd', borderRadius: 12, color: '#664d03' }}>
    Демонстраційний режим: баланс і операції тестові. Кошти не списуються та не виплачуються. Не вводьте реквізити справжньої картки.
  </p>;
}
