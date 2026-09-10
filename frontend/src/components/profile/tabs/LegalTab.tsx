import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

type LegalDocId = 'privacy' | 'terms' | 'cancellation' | 'consent' | 'cookies' | 'contact';

export const LegalTab: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSub = (searchParams.get('sub') as LegalDocId) || 'privacy';

  const setDoc = (id: LegalDocId) => {
    setSearchParams({ tab: 'legal', sub: id });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Стан для згоди на обробку даних (Чекбокси з Figma)
  const [consentOptions, setConsentOptions] = useState({
    service: true, // обов'язковий
    quality: true,
    marketing: false,
    analytics: true,
    thirdParties: false,
  });

  // Стан для Cookie (Тоггли з Figma)
  const [cookiesSettings, setCookiesSettings] = useState({
    necessary: true, // завжди активні
    functional: true,
    analytics: true,
    marketing: false,
  });

  // Стан для форми зворотного зв'язку
  const [contactName, setContactName] = useState('Олександр Шевченко');
  const [contactEmail, setContactEmail] = useState('alex@example.com');
  const [contactSubject, setContactSubject] = useState('Питання щодо бронювання житла');
  const [contactMessage, setContactMessage] = useState(
    "Вітаю! Хотів дізнатися деталі щодо раннього заїзду в апартаменти 'Leopolis Aura' у Львові. Дякую!"
  );
  const [formSent, setFormSent] = useState(false);

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
    setTimeout(() => setFormSent(false), 4000);
  };

  return (
    <div style={styles.container}>
      {/* ========================================================================= */}
      {/* 1. ЛІВА ЧАСТИНА: ОСНОВНЕ ТІЛО ОБРАНОГО ДОКУМЕНТУ З FIGMA */}
      {/* ========================================================================= */}
      <main style={styles.documentMainCard}>
        {/* 1. ПОЛІТИКА КОНФІДЕНЦІЙНОСТІ */}
        {activeSub === 'privacy' && (
          <div style={styles.docInnerWrap}>
            <header style={styles.titleBlock}>
              <h1 style={styles.h1Alegreya}>Політика конфіденційності</h1>
              <div style={styles.updateRow}>
                <div style={styles.dotIndicator} />
                <span style={styles.updateText}>Останнє оновлення: 15 січня 2026</span>
              </div>
            </header>

            <section style={styles.sectionBlock}>
              <h2 style={styles.h2Alegreya}>1. Загальні положення</h2>
              <p style={styles.paragraph}>
                Ця Політика конфіденційності регулює порядок збору, використання, зберігання та захисту персональних
                даних користувачів платформи «Trails UA». Ми поважаємо ваше право на приватність і прагнемо забезпечити
                максимальну прозорість під час обробки вашої інформації. Користуючись нашою платформою, ви погоджуєтесь із
                правилами, описаними в цьому документі.
              </p>
            </section>

            <section style={styles.sectionBlock}>
              <h2 style={styles.h2Alegreya}>2. Які дані ми збираємо</h2>
              <p style={styles.paragraph}>
                Ми збираємо лише ті дані, які необхідні для забезпечення якісного сервісу бронювання маршрутів та садиб:
              </p>
              <div style={styles.bulletsStack}>
                <div style={styles.bulletRow}>
                  <span style={styles.bulletDot}>•</span>
                  <div style={styles.bulletText}>
                    <strong>Персональні ідентифікаційні дані:</strong> ім&apos;я, прізвище, контактний номер телефону та адреса електронної пошти.
                  </div>
                </div>
                <div style={styles.bulletRow}>
                  <span style={styles.bulletDot}>•</span>
                  <div style={styles.bulletText}>
                    <strong>Інформація про бронювання:</strong> обрані котеджі, дати запланованого відпочинку, деталі проживання в садибах.
                  </div>
                </div>
                <div style={styles.bulletRow}>
                  <span style={styles.bulletDot}>•</span>
                  <div style={styles.bulletText}>
                    <strong>Технічні дані:</strong> IP-адреса, файли cookie, тип пристрою, операційна система та поведінкові фактори використання сайту.
                  </div>
                </div>
                <div style={styles.bulletRow}>
                  <span style={styles.bulletDot}>•</span>
                  <div style={styles.bulletText}>
                    <strong>Фінансові дані:</strong> платіжні реквізити (обробляються виключно сертифікованими платіжними провайдерами).
                  </div>
                </div>
              </div>
            </section>

            <section style={styles.sectionBlock}>
              <h2 style={styles.h2Alegreya}>3. Як ми використовуємо ваші дані</h2>
              <p style={styles.paragraph}>Зібрана інформація використовується виключно в законних та безпечних цілях:</p>
              <div style={styles.bulletsStack}>
                <div style={styles.bulletRow}>
                  <span style={styles.bulletDot}>•</span>
                  <div style={styles.bulletText}>
                    <strong>Підтвердження бронювання:</strong> створення та обробка замовлень на шале, глемпінги та приватні котеджі.
                  </div>
                </div>
                <div style={styles.bulletRow}>
                  <span style={styles.bulletDot}>•</span>
                  <div style={styles.bulletText}>
                    <strong>Комунікація:</strong> надсилання сповіщень про статус замовлення, повідомлення від господарів та екстрені оновлення погоди в горах.
                  </div>
                </div>
                <div style={styles.bulletRow}>
                  <span style={styles.bulletDot}>•</span>
                  <div style={styles.bulletText}>
                    <strong>Покращення платформи:</strong> аналітика роботи сайту, оптимізація швидкості та розробка нового функціоналу.
                  </div>
                </div>
                <div style={styles.bulletRow}>
                  <span style={styles.bulletDot}>•</span>
                  <div style={styles.bulletText}>
                    <strong>Безпека:</strong> виявлення та запобігання шахрайству, кібератакам та іншим несанкціонованим діям.
                  </div>
                </div>
              </div>
            </section>

            <section style={styles.sectionBlock}>
              <h2 style={styles.h2Alegreya}>4. Зберігання та захист даних</h2>
              <p style={styles.paragraph}>
                Ми використовуємо передові технології шифрування (зокрема SSL) для передачі ваших даних та сучасні хмарні
                сховища із обмеженим доступом. TRAILS UA ніколи не передає та не продає дані користувачів третім особам для маркетингових цілей.
              </p>
            </section>

            <section style={styles.sectionBlock}>
              <h2 style={styles.h2Alegreya}>5. Права користувачів</h2>
              <p style={styles.paragraph}>Відповідно до Закону України «Про захист персональних даних», ви маєте повні права суб&apos;єкта даних:</p>
              <div style={styles.bulletsStack}>
                <div style={styles.bulletRow}>
                  <span style={styles.bulletDot}>•</span>
                  <div style={styles.bulletText}><strong>Право на доступ:</strong> отримання підтвердження про обробку ваших даних та їх копію.</div>
                </div>
                <div style={styles.bulletRow}>
                  <span style={styles.bulletDot}>•</span>
                  <div style={styles.bulletText}><strong>Право на виправлення:</strong> запит на оновлення некоректної інформації про себе.</div>
                </div>
                <div style={styles.bulletRow}>
                  <span style={styles.bulletDot}>•</span>
                  <div style={styles.bulletText}><strong>Право на видалення:</strong> вимога повного видалення профілю та всіх даних.</div>
                </div>
              </div>
            </section>

            <div style={styles.darkContactFrame}>
              <div style={styles.darkFrameHeading}>7. Контакти для зв&apos;язку</div>
              <div style={styles.darkFrameText}>
                Якщо у вас виникли будь-які запитання щодо захисту персональних даних, звертайтеся до нашої служби безпеки:
              </div>
              <div style={{ marginTop: '8px' }}>
                <div style={styles.darkFrameHighlight}>Email: privacy@trails.ua</div>
                <div style={styles.darkFrameHighlight}>Адреса: м. Київ, вул. Карпатська, 12, TRAILS UA Legal Dept.</div>
              </div>
            </div>
          </div>
        )}

        {/* 2. УМОВИ КОРИСТУВАННЯ */}
        {activeSub === 'terms' && (
          <div style={styles.docInnerWrap}>
            <header style={styles.titleBlock}>
              <h1 style={styles.h1Alegreya}>Умови користування</h1>
              <div style={styles.updateRow}>
                <div style={styles.dotIndicator} />
                <span style={styles.updateText}>Останнє оновлення: 15 січня 2026</span>
              </div>
            </header>

            {[
              { num: '1. Прийняття умов', text: 'Створюючи акаунт або бронюючи послуги на платформі trails.ua, ви підтверджуєте, що ознайомилися та приймаєте ці Умови.' },
              { num: '2. Опис послуг', text: 'Trails UA надає зручний інтерфейс для пошуку, бронювання та оренди автентичних котеджів, садиб, купольних глемпінгів та шале по всій Україні.' },
              { num: '3. Реєстрація та акаунт', text: 'Для здійснення бронювання користувач зобов\'язаний вказати достовірні особисті дані. Ви несете відповідальність за безпеку вашого пароля.' },
              { num: '4. Правила бронювання', text: 'Бронювання житла здійснюється в режимі реального часу. Підтвердженням є отримання ваучера та відображення замовлення в кабінеті.' },
              { num: '5. Оплата та повернення коштів', text: 'Усі платежі здійснюються безготівковим розрахунком через сертифіковані банківські шлюзи.' },
              { num: '6. Правила для орендарів', text: 'Гості зобов\'язуються дбайливо ставитися до майна, дотримуватися правил пожежної безпеки та правил тиші.' },
              { num: '7. Правила для орендодавців', text: 'Власники гарантують достовірність фотографій, актуальність цін та підготовку помешкання до заїзду.' },
              { num: '8. Заборонені дії', text: 'Суворо заборонено шахрайство, розповсюдження спаму та неправдиві бронювання.' },
              { num: '9. Відповідальність', text: 'Trails UA забезпечує стабільність платформи та арбітраж суперечок між гостями та господарями.' },
              { num: '10. Зміни до умов', text: 'Актуальна редакція умов завжди доступна на цій сторінці.' },
            ].map((section) => (
              <section key={section.num} style={styles.sectionBlock}>
                <h2 style={styles.h2Alegreya}>{section.num}</h2>
                <p style={styles.paragraph}>{section.text}</p>
              </section>
            ))}
          </div>
        )}

        {/* 3. ПОЛІТИКА СКАСУВАННЯ */}
        {activeSub === 'cancellation' && (
          <div style={styles.docInnerWrap}>
            <header style={styles.titleBlock}>
              <h1 style={styles.h1Alegreya}>Політика скасування</h1>
              <div style={styles.updateRow}>
                <div style={styles.dotIndicator} />
                <span style={styles.updateText}>Останнє оновлення: 15 січня 2026</span>
              </div>
            </header>

            <section style={styles.sectionBlock}>
              <h2 style={styles.h2Alegreya}>1. Загальні правила скасування</h2>
              <p style={styles.paragraph}>
                Ми розуміємо, що плани можуть змінюватися. На платформі TRAILS UA діє три типи умов скасування бронювання:
                Гнучкі, Помірні та Жорсткі. Тип завжди вказується на сторінці помешкання перед бронюванням.
              </p>
            </section>

            {/* Таблиця 1: Гнучке скасування (Flexible) */}
            <section style={styles.sectionBlock}>
              <h2 style={styles.h2Alegreya}>2. Гнучке скасування (Flexible)</h2>
              <div style={styles.cancellationTableCard}>
                <div style={styles.tableCardHeaderBrown}>Таблиця умов гнучкого скасування</div>
                <div style={styles.tableHeaderTerracotta}>
                  <div style={{ flex: 1 }}>Термін скасування</div>
                  <div style={{ width: '240px' }}>Умови повернення</div>
                  <div style={{ width: '160px' }}>Сума повернення</div>
                </div>
                <div style={styles.tableRowWhite}>
                  <div style={{ flex: 1, fontWeight: 500 }}>Більше ніж за 7 днів до заїзду</div>
                  <div style={{ width: '240px' }}>Повне повернення коштів</div>
                  <div style={{ width: '160px', fontWeight: 700 }}>100%</div>
                </div>
                <div style={styles.tableRowWhite}>
                  <div style={{ flex: 1, fontWeight: 500 }}>Від 3 до 7 днів до заїзду</div>
                  <div style={{ width: '240px' }}>Часткове повернення з утриманням збору</div>
                  <div style={{ width: '160px', fontWeight: 700 }}>50%</div>
                </div>
                <div style={styles.tableRowWhite}>
                  <div style={{ flex: 1, fontWeight: 500 }}>Менше ніж за 3 дні до заїзду</div>
                  <div style={{ width: '240px' }}>Кошти не повертаються</div>
                  <div style={{ width: '160px', fontWeight: 700, color: '#C62828' }}>0%</div>
                </div>
              </div>
            </section>

            {/* Таблиця 2: Помірне скасування (Moderate) */}
            <section style={styles.sectionBlock}>
              <h2 style={styles.h2Alegreya}>3. Помірне скасування (Moderate)</h2>
              <div style={styles.cancellationTableCard}>
                <div style={styles.tableCardHeaderBrown}>Таблиця умов помірного скасування</div>
                <div style={styles.tableHeaderTerracotta}>
                  <div style={{ flex: 1 }}>Термін скасування</div>
                  <div style={{ width: '240px' }}>Умови повернення</div>
                  <div style={{ width: '160px' }}>Сума повернення</div>
                </div>
                <div style={styles.tableRowWhite}>
                  <div style={{ flex: 1, fontWeight: 500 }}>Більше ніж за 14 днів до заїзду</div>
                  <div style={{ width: '240px' }}>Повне повернення коштів</div>
                  <div style={{ width: '160px', fontWeight: 700 }}>100%</div>
                </div>
                <div style={styles.tableRowWhite}>
                  <div style={{ flex: 1, fontWeight: 500 }}>Від 7 до 14 днів до заїзду</div>
                  <div style={{ width: '240px' }}>Повернення половини вартості</div>
                  <div style={{ width: '160px', fontWeight: 700 }}>50%</div>
                </div>
                <div style={styles.tableRowWhite}>
                  <div style={{ flex: 1, fontWeight: 500 }}>Менше ніж за 7 днів до заїзду</div>
                  <div style={{ width: '240px' }}>Кошти не повертаються</div>
                  <div style={{ width: '160px', fontWeight: 700, color: '#C62828' }}>0%</div>
                </div>
              </div>
            </section>

            {/* Таблиця 3: Жорстке скасування (Strict) */}
            <section style={styles.sectionBlock}>
              <h2 style={styles.h2Alegreya}>4. Жорстке скасування (Strict)</h2>
              <div style={styles.cancellationTableCard}>
                <div style={styles.tableCardHeaderBrown}>Таблиця умов жорсткого скасування</div>
                <div style={styles.tableHeaderTerracotta}>
                  <div style={{ flex: 1 }}>Термін скасування</div>
                  <div style={{ width: '240px' }}>Умови повернення</div>
                  <div style={{ width: '160px' }}>Сума повернення</div>
                </div>
                <div style={styles.tableRowWhite}>
                  <div style={{ flex: 1, fontWeight: 500 }}>Більше ніж за 30 днів до заїзду</div>
                  <div style={{ width: '240px' }}>Повернення за вирахуванням 10% комісії</div>
                  <div style={{ width: '160px', fontWeight: 700 }}>90%</div>
                </div>
                <div style={styles.tableRowWhite}>
                  <div style={{ flex: 1, fontWeight: 500 }}>Від 14 до 30 днів до заїзду</div>
                  <div style={{ width: '240px' }}>Повернення половини вартості</div>
                  <div style={{ width: '160px', fontWeight: 700 }}>50%</div>
                </div>
                <div style={styles.tableRowWhite}>
                  <div style={{ flex: 1, fontWeight: 500 }}>Менше ніж за 14 днів до заїзду</div>
                  <div style={{ width: '240px' }}>Кошти не повертаються</div>
                  <div style={{ width: '160px', fontWeight: 700, color: '#C62828' }}>0%</div>
                </div>
              </div>
            </section>

            <div style={styles.darkContactFrame}>
              <div style={styles.darkFrameHeading}>7. Служба підтримки та скасувань</div>
              <div style={styles.darkFrameText}>
                У разі екстрених скасувань або питань щодо повернення коштів звертайтеся до нашої команди:
              </div>
              <div style={{ marginTop: '8px' }}>
                <div style={styles.darkFrameHighlight}>Email: refund@trails.ua (з поміткою «Скасування та повернення»)</div>
              </div>
            </div>
          </div>
        )}

        {/* 4. ЗГОДА НА ОБРОБКУ ПЕРСОНАЛЬНИХ ДАНИХ */}
        {activeSub === 'consent' && (
          <div style={styles.docInnerWrap}>
            <div style={styles.kickerRow}>
              <CircleXIcon />
              <span style={styles.kickerText}>Конфіденційність &amp; Правові відносини</span>
            </div>

            <h1 style={styles.h1Alegreya}>Згода на обробку персональних даних</h1>
            <div style={{ color: '#A78D78', fontSize: '15px' }}>Останнє оновлення: 15 лютого 2026 року</div>

            <p style={styles.paragraph}>
              Для того, щоб забезпечити вам бездоганний сервіс бронювання садиб та котеджів в Україні, Trails UA просить
              вашої добровільної згоди на обробку деяких ваших даних відповідно до Закону України та європейського регламенту GDPR.
            </p>

            <div style={styles.checkboxesSectionStack}>
              {/* Чекбокс 1: Обов'язковий */}
              <div style={styles.consentRowHighlight}>
                <div style={styles.checkedSquareSolid}>
                  <WhiteCheckIcon />
                </div>
                <div style={styles.consentTextCol}>
                  <div style={styles.labelRowWithBadge}>
                    <span style={styles.consentRowTitle}>Надання послуг бронювання та супроводу</span>
                    <span style={styles.requiredBadge}>Обов&apos;язково</span>
                  </div>
                  <div style={styles.consentRowDesc}>
                    Необхідно для оформлення заявок на садиби, взаємодії з господарями та оперативного інформування про стан вашого замовлення.
                  </div>
                </div>
              </div>

              {/* Чекбокс 2 */}
              <div
                onClick={() => setConsentOptions({ ...consentOptions, quality: !consentOptions.quality })}
                style={styles.consentRowInteractive}
              >
                <div style={consentOptions.quality ? styles.checkedSquareBorderActive : styles.checkedSquareBorderInactive}>
                  {consentOptions.quality && <CheckSmallIcon />}
                </div>
                <div style={styles.consentTextCol}>
                  <div style={styles.consentRowTitle}>Покращення якості сервісу</div>
                  <div style={styles.consentRowDesc}>
                    Аналіз ваших уподобань щодо локацій та типів житла задля індивідуального налаштування кабінету мандрівника.
                  </div>
                </div>
              </div>

              {/* Чекбокс 3 */}
              <div
                onClick={() => setConsentOptions({ ...consentOptions, marketing: !consentOptions.marketing })}
                style={styles.consentRowInteractive}
              >
                <div style={consentOptions.marketing ? styles.checkedSquareBorderActive : styles.checkedSquareBorderInactive}>
                  {consentOptions.marketing && <CheckSmallIcon />}
                </div>
                <div style={styles.consentTextCol}>
                  <div style={styles.consentRowTitle}>Маркетингові комунікації та спецпропозиції</div>
                  <div style={styles.consentRowDesc}>
                    Отримання ексклюзивних промокодів на відпочинок, анонсів нових котеджів та корисних дайджестів.
                  </div>
                </div>
              </div>

              {/* Чекбокс 4 */}
              <div
                onClick={() => setConsentOptions({ ...consentOptions, analytics: !consentOptions.analytics })}
                style={styles.consentRowInteractive}
              >
                <div style={consentOptions.analytics ? styles.checkedSquareBorderActive : styles.checkedSquareBorderInactive}>
                  {consentOptions.analytics && <CheckSmallIcon />}
                </div>
                <div style={styles.consentTextCol}>
                  <div style={styles.consentRowTitle}>Аналітика використання та збір статистики</div>
                  <div style={styles.consentRowDesc}>
                    Анонімне використання даних для оцінки завантаженості котеджів та оптимізації швидкодії інтерфейсу.
                  </div>
                </div>
              </div>
            </div>

            <div style={styles.consentFooterRow}>
              <button
                type="button"
                onClick={() => alert('Запит на відкликання згоди та видалення даних сформовано.')}
                style={styles.revokeConsentLink}
              >
                Відкликати згоду та видалити дані
              </button>

              <button
                type="button"
                onClick={() => alert('Налаштування згоди успішно збережено!')}
                style={styles.btnSaveConsent}
              >
                <WhiteCheckIcon />
                <span>Зберегти налаштування</span>
              </button>
            </div>
          </div>
        )}

        {/* 5. ПОЛІТИКА ВИКОРИСТАННЯ ФАЙЛІВ COOKIE */}
        {activeSub === 'cookies' && (
          <div style={styles.docInnerWrap}>
            <div style={styles.kickerRow}>
              <CircleXIcon />
              <span style={styles.kickerText}>Прозорість технологій</span>
            </div>

            <h1 style={styles.h1Alegreya}>Політика використання файлів cookie</h1>
            <div style={{ color: '#A78D78', fontSize: '15px' }}>Ми дбаємо про ваш комфорт та чесність взаємодії</div>

            <section style={styles.sectionBlock}>
              <h3 style={styles.h2Alegreya}>Що таке файли cookie?</h3>
              <p style={styles.paragraph}>
                Файли cookie — це невеликі текстові файли, які зберігаються на вашому пристрої під час відвідування нашого сайту.
                Вони допомагають системі запам&apos;ятовувати ваші дії та налаштування (як-от дати в календарі, обрані еко-садиби, фільтри цін тощо).
              </p>
            </section>

            {/* Тоггли категорій cookie */}
            <div style={styles.cookieToggleStack}>
              <div style={styles.cookieRowItem}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={styles.cookieTitle}>Необхідні файли cookie</span>
                    <span style={styles.alwaysActiveBadge}>Завжди активні</span>
                  </div>
                  <div style={styles.cookieDesc}>
                    Обов&apos;язкові для функціонування сайту: авторизація, збереження у вибране та безпечні платежі.
                  </div>
                </div>
                <div style={styles.toggleLockedOn}><div style={styles.knob} /></div>
              </div>

              <div style={styles.cookieRowItem}>
                <div style={{ flex: 1 }}>
                  <span style={styles.cookieTitle}>Функціональні налаштування</span>
                  <div style={styles.cookieDesc}>
                    Дозволяють зберегти ваші уподобання (обрана мова, регіони пошуку в Карпатах), полегшуючи наступні сесії.
                  </div>
                </div>
                <div
                  onClick={() => setCookiesSettings({ ...cookiesSettings, functional: !cookiesSettings.functional })}
                  style={cookiesSettings.functional ? styles.toggleOn : styles.toggleOff}
                >
                  <div style={styles.knob} />
                </div>
              </div>

              <div style={styles.cookieRowItem}>
                <div style={{ flex: 1 }}>
                  <span style={styles.cookieTitle}>Аналітичні вимірювання</span>
                  <div style={styles.cookieDesc}>
                    Допомагають нам зрозуміти, якими сторінками ви цікавитеся найбільше та де виникають технічні труднощі.
                  </div>
                </div>
                <div
                  onClick={() => setCookiesSettings({ ...cookiesSettings, analytics: !cookiesSettings.analytics })}
                  style={cookiesSettings.analytics ? styles.toggleOn : styles.toggleOff}
                >
                  <div style={styles.knob} />
                </div>
              </div>

              <div style={styles.cookieRowItem}>
                <div style={{ flex: 1 }}>
                  <span style={styles.cookieTitle}>Маркетингові та реклама</span>
                  <div style={styles.cookieDesc}>
                    Використовуються для демонстрації персоналізованих акцій на відпочинок на основі історії переглядів.
                  </div>
                </div>
                <div
                  onClick={() => setCookiesSettings({ ...cookiesSettings, marketing: !cookiesSettings.marketing })}
                  style={cookiesSettings.marketing ? styles.toggleOn : styles.toggleOff}
                >
                  <div style={styles.knob} />
                </div>
              </div>
            </div>

            {/* Технічна таблиця файлів */}
            <div style={styles.sectionBlock}>
              <h3 style={styles.h2Alegreya}>Технічний перелік файлів, що використовуються</h3>
              <div style={styles.cancellationTableCard}>
                <div style={styles.tableHeaderTerracotta}>
                  <div style={{ width: '160px' }}>Назва</div>
                  <div style={{ width: '180px' }}>Постачальник</div>
                  <div style={{ flex: 1 }}>Призначення</div>
                  <div style={{ width: '140px' }}>Термін дії</div>
                </div>
                {[
                  { name: 'ts_session_id', prov: 'Trails UA (Власний)', desc: 'Зберігає інформацію про поточну сесію та стан бронювання', exp: 'Кінець сесії' },
                  { name: '_ga_analytics', prov: 'Google Analytics', desc: 'Відстежує кількість відвідувачів та переглянуті сторінки', exp: '2 роки' },
                  { name: 'cookie_pref_consent', prov: 'Trails UA (Власний)', desc: 'Зберігає ваші персональні налаштування використання файлів cookie', exp: '1 рік' },
                  { name: 'ads_retarg_fb', prov: 'Meta/Facebook', desc: 'Допомагає показувати вам релевантні пропозиції турів у соцмережах', exp: '3 місяці' },
                ].map((row) => (
                  <div key={row.name} style={styles.tableRowWhite}>
                    <div style={{ width: '160px', fontWeight: 700, color: '#6E473B' }}>{row.name}</div>
                    <div style={{ width: '180px' }}>{row.prov}</div>
                    <div style={{ flex: 1 }}>{row.desc}</div>
                    <div style={{ width: '140px' }}>{row.exp}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Дії для Cookie */}
            <div style={styles.cookieActionsRow}>
              <button
                type="button"
                onClick={() => {
                  setCookiesSettings({ necessary: true, functional: false, analytics: false, marketing: false });
                  alert('Усі необов\'язкові cookie відхилено.');
                }}
                style={styles.revokeConsentLink}
              >
                Відхилити всі необов&apos;язкові
              </button>

              <div style={{ display: 'flex', gap: '14px' }}>
                <button
                  type="button"
                  onClick={() => alert('Вибір збережено!')}
                  style={styles.btnOutlineTerracotta}
                >
                  Зберегти вибір
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCookiesSettings({ necessary: true, functional: true, analytics: true, marketing: true });
                    alert('Усі файли cookie прийнято!');
                  }}
                  style={styles.btnSolidTerracotta}
                >
                  <WhiteCheckIcon />
                  <span>Прийняти всі</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 6. КОНТАКТИ ТА ПІДТРИМКА */}
        {activeSub === 'contact' && (
          <div style={styles.docInnerWrap}>
            <header style={styles.titleBlock}>
              <h1 style={styles.h1Alegreya}>Зв&apos;яжіться з нами</h1>
              <div style={{ color: '#A78D78', fontSize: '15px' }}>
                Маєте питання щодо бронювання чи співпраці? Наша команда завжди готова допомогти.
              </div>
            </header>

            {formSent && (
              <div style={styles.successBanner}>
                ✓ Ваше повідомлення успішно надіслано! Ми зв&apos;яжемося з вами найближчим часом.
              </div>
            )}

            <div style={styles.contactTwoColsRow}>
              {/* Ліва колонка */}
              <div style={styles.contactInfoCol}>
                <div style={styles.twoByTwoCardsGrid}>
                  <div style={styles.contactMiniCard}>
                    <span style={styles.miniIcon}>📍</span>
                    <strong style={styles.miniCardTitle}>Адреса офісу</strong>
                    <div style={styles.miniCardSub}>вул. Володимирська, 42, Київ, Україна, 01001</div>
                  </div>

                  <div style={styles.contactMiniCard}>
                    <span style={styles.miniIcon}>📞</span>
                    <strong style={styles.miniCardTitle}>Контактні телефони</strong>
                    <div style={styles.miniCardSub}>+38 (044) 123-45-67<br />+38 (093) 987-65-43</div>
                  </div>

                  <div style={styles.contactMiniCard}>
                    <span style={styles.miniIcon}>✉️</span>
                    <strong style={styles.miniCardTitle}>Електронна пошта</strong>
                    <div style={styles.miniCardSub}>support@trailsua.com<br />partners@trailsua.com</div>
                  </div>

                  <div style={styles.contactMiniCard}>
                    <span style={styles.miniIcon}>⏰</span>
                    <strong style={styles.miniCardTitle}>Графік роботи</strong>
                    <div style={styles.miniCardSub}>Пн - Пт: 09:00 - 19:00<br />Сб - Нд: 10:00 - 16:00</div>
                  </div>
                </div>

                <div style={styles.mapContainer}>
                  <div style={styles.mapOfficeBadge}>Офіс TrailsUA на карті</div>
                </div>
              </div>

              {/* Права колонка: Форма */}
              <form onSubmit={handleSendFeedback} style={styles.contactFormBox}>
                <h2 style={{ ...styles.h2Alegreya, fontSize: '26px' }}>Надіслати повідомлення</h2>

                <div>
                  <label style={styles.formFieldLabel}>Ваше ім&apos;я</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    style={styles.formInputBox}
                  />
                </div>

                <div>
                  <label style={styles.formFieldLabel}>Електронна адреса</label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    style={styles.formInputBox}
                  />
                </div>

                <div>
                  <label style={styles.formFieldLabel}>Тема звернення</label>
                  <select
                    value={contactSubject}
                    onChange={(e) => setContactSubject(e.target.value)}
                    style={styles.formInputBox}
                  >
                    <option value="Питання щодо бронювання житла">Питання щодо бронювання житла</option>
                    <option value="Співпраця та реєстрація житла">Співпраця та реєстрація житла</option>
                    <option value="Технічна підтримка">Технічна підтримка</option>
                    <option value="Фінансові питання та повернення">Фінансові питання та повернення</option>
                  </select>
                </div>

                <div>
                  <label style={styles.formFieldLabel}>Повідомлення</label>
                  <textarea
                    rows={4}
                    required
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    style={{ ...styles.formInputBox, height: '110px' }}
                  />
                </div>

                <button type="submit" style={styles.btnSendMessagePill}>
                  Надіслати повідомлення
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* 2. ПРАВА ЧАСТИНА: САЙДБАР "ЗМІСТ ДОКУМЕНТУ" (TOC LINKS З FIGMA) */}
      {/* ========================================================================= */}
      <aside style={styles.tocSidebar}>
        <div style={styles.tocHeading}>Зміст документу</div>
        <nav style={styles.tocList}>
          {[
            { id: 'privacy', label: '1. Політика конфіденційності' },
            { id: 'terms', label: '2. Умови користування' },
            { id: 'cancellation', label: '3. Політика скасування' },
            { id: 'consent', label: '4. Обробка персональних даних' },
            { id: 'cookies', label: '5. Файли cookie' },
            { id: 'contact', label: '6. Контакти та підтримка' },
          ].map((item) => {
            const isActive = activeSub === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setDoc(item.id as LegalDocId)}
                style={{
                  ...styles.tocItem,
                  borderLeft: isActive ? '2px #DC9666 solid' : '2px #A78D78 solid',
                  color: isActive ? '#DC9666' : '#A78D78',
                  fontWeight: isActive ? 700 : 500,
                }}
              >
                {item.label}
              </div>
            );
          })}
        </nav>
      </aside>
    </div>
  );
};

// ======================== SVG ІКОНКИ ========================
const CircleXIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="7" cy="7" r="6" stroke="#DC9666" strokeWidth="1.5" />
    <path d="M5 5l4 4M9 5l-4 4" stroke="#DC9666" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const WhiteCheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const CheckSmallIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#DC9666" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// ======================== СТИЛІ FIGMA ========================
const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    gap: '30px',
    alignItems: 'flex-start',
    width: '100%',
  },
  documentMainCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    border: '1px solid #D7C7B1',
    padding: '44px 50px',
    boxShadow: '0px 12px 40px rgba(27, 67, 50, 0.05)',
    boxSizing: 'border-box',
    minWidth: 0,
  },
  tocSidebar: {
    width: '262px',
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    border: '2px solid #D7C7B1',
    padding: '24px 16px',
    boxShadow: '0px 10px 24px -10px rgba(0, 0, 0, 0.07)',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    flexShrink: 0,
    position: 'sticky',
    top: '24px',
  },
  tocHeading: {
    fontSize: '15px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    textTransform: 'uppercase',
    color: '#291C0E',
    textAlign: 'center',
  },
  tocList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  tocItem: {
    paddingLeft: '12px',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  docInnerWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
  },
  titleBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    paddingBottom: '24px',
    borderBottom: '2px solid #D7C7B1',
  },
  h1Alegreya: {
    fontSize: '36px',
    fontFamily: "'Alegreya', Georgia, serif",
    fontWeight: 800,
    color: '#291C0E',
    margin: 0,
  },
  updateRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  dotIndicator: {
    width: '6px',
    height: '6px',
    borderRadius: '3px',
    backgroundColor: '#DC9666',
  },
  updateText: {
    color: '#A78D78',
    fontSize: '15px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  sectionBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  h2Alegreya: {
    fontSize: '22px',
    fontFamily: "'Alegreya', Georgia, serif",
    fontWeight: 700,
    color: '#291C0E',
    margin: 0,
  },
  paragraph: {
    fontSize: '15px',
    fontFamily: "'Iosevka Charon', sans-serif",
    color: '#6E473B',
    lineHeight: '25px',
    margin: 0,
  },
  bulletsStack: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    paddingLeft: '12px',
  },
  bulletRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
  },
  bulletDot: {
    color: '#DC9666',
    fontSize: '16px',
    lineHeight: '22px',
  },
  bulletText: {
    flex: 1,
    color: '#6E473B',
    fontSize: '15px',
    fontFamily: "'Iosevka Charon', sans-serif",
    lineHeight: '24px',
  },
  darkContactFrame: {
    padding: '24px',
    backgroundColor: '#6E473B',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  darkFrameHeading: {
    color: '#DC9666',
    fontSize: '20px',
    fontFamily: "'Alegreya', Georgia, serif",
    fontWeight: 700,
  },
  darkFrameText: {
    color: '#E1D4C2',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    lineHeight: '22px',
  },
  darkFrameHighlight: {
    color: '#E1D4C2',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  cancellationTableCard: {
    borderRadius: '10px',
    overflow: 'hidden',
    border: '1px solid #D7C7B1',
    display: 'flex',
    flexDirection: 'column',
  },
  tableCardHeaderBrown: {
    padding: '12px 16px',
    backgroundColor: '#6E473B',
    color: '#DC9666',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  tableHeaderTerracotta: {
    padding: '14px 16px',
    backgroundColor: 'rgba(220, 150, 102, 0.2)',
    borderBottom: '1px solid #D7C7B1',
    display: 'flex',
    color: '#6E473B',
    fontSize: '13px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  tableRowWhite: {
    padding: '14px 16px',
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid #D7C7B1',
    display: 'flex',
    alignItems: 'center',
    color: '#6E473B',
    fontSize: '13px',
    fontFamily: "'Iosevka Charon', sans-serif",
  },
  kickerRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  kickerText: {
    color: '#DC9666',
    fontSize: '12px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  checkboxesSectionStack: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  consentRowHighlight: {
    padding: '20px',
    backgroundColor: 'rgba(220, 150, 102, 0.15)',
    borderRadius: '12px',
    border: '1px solid #D7C7B1',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
  },
  consentRowInteractive: {
    padding: '20px',
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    border: '1px solid #D7C7B1',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
    cursor: 'pointer',
  },
  checkedSquareSolid: {
    width: '24px',
    height: '24px',
    backgroundColor: '#DC9666',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  checkedSquareBorderActive: {
    width: '24px',
    height: '24px',
    borderRadius: '6px',
    border: '2px solid #DC9666',
    backgroundColor: 'rgba(220, 150, 102, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  checkedSquareBorderInactive: {
    width: '24px',
    height: '24px',
    borderRadius: '6px',
    border: '2px solid #A78D78',
    backgroundColor: '#FFFFFF',
    flexShrink: 0,
  },
  consentTextCol: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  labelRowWithBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  consentRowTitle: {
    fontSize: '16px',
    fontFamily: "'Alegreya', Georgia, serif",
    fontWeight: 700,
    color: '#291C0E',
  },
  requiredBadge: {
    padding: '3px 8px',
    backgroundColor: '#DC9666',
    color: '#FFFFFF',
    borderRadius: '6px',
    fontSize: '11px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  consentRowDesc: {
    color: '#6E473B',
    fontSize: '13px',
    fontFamily: "'Iosevka Charon', sans-serif",
    lineHeight: '20px',
  },
  consentFooterRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '20px',
    borderTop: '1px solid #DC9666',
  },
  revokeConsentLink: {
    background: 'none',
    border: 'none',
    color: '#C62828',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    textDecoration: 'underline',
    cursor: 'pointer',
    padding: 0,
  },
  btnSaveConsent: {
    padding: '14px 28px',
    backgroundColor: '#DC9666',
    color: '#FFFFFF',
    borderRadius: '12px',
    border: 'none',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  cookieToggleStack: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  cookieRowItem: {
    padding: '20px',
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    border: '1px solid #D7C7B1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '20px',
  },
  cookieTitle: {
    fontSize: '17px',
    fontFamily: "'Alegreya', Georgia, serif",
    fontWeight: 800,
    color: '#6E473B',
  },
  alwaysActiveBadge: {
    padding: '3px 8px',
    backgroundColor: '#DC9666',
    color: '#FFFFFF',
    borderRadius: '6px',
    fontSize: '10px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  cookieDesc: {
    color: '#A78D78',
    fontSize: '13px',
    fontFamily: "'Iosevka Charon', sans-serif",
    lineHeight: '20px',
    marginTop: '4px',
  },
  toggleLockedOn: {
    width: '44px',
    height: '24px',
    padding: '2px',
    borderRadius: '12px',
    backgroundColor: '#DC9666',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    boxSizing: 'border-box',
    opacity: 0.8,
  },
  toggleOn: {
    width: '44px',
    height: '24px',
    padding: '2px',
    borderRadius: '12px',
    backgroundColor: '#DC9666',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    cursor: 'pointer',
    boxSizing: 'border-box',
    transition: 'all 0.2s',
  },
  toggleOff: {
    width: '44px',
    height: '24px',
    padding: '2px',
    borderRadius: '12px',
    backgroundColor: '#BEB5A9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    cursor: 'pointer',
    boxSizing: 'border-box',
    transition: 'all 0.2s',
  },
  knob: {
    width: '20px',
    height: '20px',
    borderRadius: '10px',
    backgroundColor: '#FFFFFF',
  },
  cookieActionsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '20px',
    borderTop: '1px solid #D7C7B1',
  },
  btnOutlineTerracotta: {
    padding: '12px 24px',
    borderRadius: '10px',
    border: '1.5px solid #DC9666',
    backgroundColor: '#FFFFFF',
    color: '#DC9666',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    cursor: 'pointer',
  },
  btnSolidTerracotta: {
    padding: '12px 24px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: '#DC9666',
    color: '#FFFFFF',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  contactTwoColsRow: {
    display: 'flex',
    gap: '30px',
    alignItems: 'flex-start',
    width: '100%',
  },
  contactInfoCol: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  twoByTwoCardsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  contactMiniCard: {
    padding: '18px',
    backgroundColor: '#FFFFFF',
    borderRadius: '18px',
    border: '1px solid #D7C7B1',
    boxShadow: '0px 10px 24px -10px rgba(0, 0, 0, 0.07)',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  miniIcon: {
    fontSize: '20px',
  },
  miniCardTitle: {
    fontSize: '14px',
    color: '#6E473B',
    fontFamily: "'Iosevka Charon', sans-serif",
  },
  miniCardSub: {
    color: '#A78D78',
    fontSize: '13px',
    fontFamily: "'Iosevka Charon', sans-serif",
    lineHeight: '18px',
  },
  mapContainer: {
    width: '100%',
    height: '240px',
    borderRadius: '18px',
    border: '1px solid #D7C7B1',
    backgroundImage: 'url(https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    padding: '16px',
    display: 'flex',
    alignItems: 'flex-end',
    boxSizing: 'border-box',
  },
  mapOfficeBadge: {
    padding: '8px 16px',
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    border: '1px solid #D7C7B1',
    color: '#6E473B',
    fontSize: '12px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  contactFormBox: {
    flex: 1,
    padding: '28px',
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    border: '1px solid #D7C7B1',
    boxShadow: '0px 10px 24px -10px rgba(0, 0, 0, 0.07)',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    boxSizing: 'border-box',
  },
  formFieldLabel: {
    color: '#DC9666',
    fontSize: '12px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    marginBottom: '4px',
    display: 'block',
  },
  formInputBox: {
    width: '100%',
    padding: '12px 14px',
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    border: '1px solid #D7C7B1',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    color: '#291C0E',
    outline: 'none',
    boxSizing: 'border-box',
  },
  btnSendMessagePill: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#DC9666',
    borderRadius: '100px',
    border: 'none',
    color: '#FFFFFF',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0px 10px 24px -8px rgba(194, 65, 12, 0.20)',
    marginTop: '6px',
  },
  successBanner: {
    padding: '14px 18px',
    backgroundColor: 'rgba(46, 125, 50, 0.15)',
    color: '#2E7D32',
    borderRadius: '12px',
    border: '1px solid #2E7D32',
    fontSize: '14px',
    fontWeight: 600,
  },
};