import React, { useState } from 'react';
import { useSettings } from '../../../context/SettingsContext';

interface PropertyStatRow {
  name: string;
  views: number;
  bookings: number;
  cr: string;
  revenue: number;
}

const PROPERTY_PERFORMANCE_DATA: PropertyStatRow[] = [
  {
    name: "Колиба 'Два Потоки', Яремче",
    views: 1240,
    bookings: 18,
    cr: '1.45%',
    revenue: 43200,
  },
  {
    name: "Chalet 'Eco-Smerika', Микуличин",
    views: 980,
    bookings: 14,
    cr: '1.42%',
    revenue: 52400,
  },
  {
    name: "Будинок на дереві 'Пташине Гніздо'",
    views: 1560,
    bookings: 22,
    cr: '1.41%',
    revenue: 61600,
  },
];

// Матриця карти попиту (Heatmap) з Figma: 0 = білий, 1 = 15%, 2 = 50%, 3 = 100% (#DC9666)
const HEATMAP_MATRIX = [
  // Пн
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  // Вт
  [1, 3, 2, 0, 1, 3, 2, 0, 1, 3, 2, 0, 1, 3, 2, 0, 1, 3, 2, 0],
  // Ср
  [3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0],
  // Чт
  [2, 3, 1, 0, 2, 3, 1, 0, 2, 3, 1, 0, 2, 3, 1, 0, 2, 3, 1, 0],
  // Пт
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  // Сб
  [1, 3, 2, 0, 1, 3, 2, 0, 1, 3, 2, 0, 1, 3, 2, 0, 1, 3, 2, 0],
  // Нд
  [3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0],
];

export const AnalyticsTab: React.FC = () => {
  const { formatPrice } = useSettings();
  const [period] = useState('Останні 30 днів');

  const getHeatmapColor = (lvl: number) => {
    switch (lvl) {
      case 3:
        return '#DC9666';
      case 2:
        return 'rgba(220, 150, 102, 0.50)';
      case 1:
        return 'rgba(220, 150, 102, 0.15)';
      default:
        return '#FFFFFF';
    }
  };

  return (
    <div style={styles.container}>
      {/* Шапка */}
      <header style={styles.header}>
        <div style={styles.titlesCol}>
          <h1 style={styles.mainTitle}>Аналітика та Ефективність</h1>
          <p style={styles.subtitle}>
            Аналізуйте відвідуваність сторінок, оцінки гостей та ключові показники успіху вашого бізнесу
          </p>
        </div>
        <div style={styles.periodPill}>{period}</div>
      </header>

      {/* Ряд: Рейтинг + Географія */}
      <div style={styles.metricsGrid}>
        {/* Картка 1: Рейтинг та розподіл зірок */}
        <div style={styles.sectionCard}>
          <h2 style={styles.cardTitleAlegreya}>Рейтинг та відгуки гостей</h2>

          <div style={styles.ratingBreakdownRow}>
            {/* Оцінка з зірками */}
            <div style={styles.scoreSummaryCol}>
              <div style={styles.bigScoreText}>4.8</div>
              <div style={styles.starsGroup}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <StarMiniIcon key={i} />
                ))}
              </div>
              <div style={styles.reviewsDesc}>На основі 54 відгуків</div>
            </div>

            {/* Бари розподілу */}
            <div style={styles.barsCol}>
              {[
                { score: '5 зірок', pct: 84, width: '84%' },
                { score: '4 зірки', pct: 12, width: '12%' },
                { score: '3 зірки', pct: 4, width: '4%' },
                { score: '2 зірки', pct: 0, width: '0%' },
                { score: '1 зірка', pct: 0, width: '0%' },
              ].map((row) => (
                <div key={row.score} style={styles.distRow}>
                  <span style={styles.distLabel}>{row.score}</span>
                  <div style={styles.barTrack}>
                    <div style={{ ...styles.barFill, width: row.width }} />
                  </div>
                  <span style={styles.distPercent}>{row.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Картка 2: Географія та демографія гостей */}
        <div style={styles.sectionCard}>
          <h2 style={styles.cardTitleAlegreya}>Географія та демографія гостей</h2>

          <div style={styles.demographicsCol}>
            {[
              { reg: 'Київ та область', count: '29 бронювань (54%)', w: '54%' },
              { reg: 'Львів та західні обл.', count: '14 бронювань (26%)', w: '26%' },
              { reg: 'Дніпро та Одеса', count: '8 бронювань (15%)', w: '15%' },
              { reg: 'Іноземні гості', count: '3 бронювання (5%)', w: '5%' },
            ].map((d) => (
              <div key={d.reg} style={styles.demItem}>
                <div style={styles.demMetaRow}>
                  <span style={styles.demReg}>{d.reg}</span>
                  <span style={styles.demCount}>{d.count}</span>
                </div>
                <div style={styles.demBarTrack}>
                  <div style={{ ...styles.demBarFill, width: d.w }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Секція: Карта попиту дат бронювання (Heatmap з Figma) */}
      <div style={styles.sectionCard}>
        <h2 style={styles.cardTitleAlegreya}>Популярність дат бронювання (Карта попиту)</h2>
        <div style={styles.demandDesc}>
          Графік показує концентрацію бронювань за днями тижня та годинами пікових переглядів.
        </div>

        <div style={styles.calendarGrid}>
          {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'].map((dayName, rIdx) => (
            <div key={dayName} style={styles.gridRow}>
              <div style={styles.dayLabel}>{dayName}</div>
              <div style={styles.cellsRow}>
                {HEATMAP_MATRIX[rIdx].map((val, cIdx) => (
                  <div
                    key={cIdx}
                    style={{
                      ...styles.heatCell,
                      backgroundColor: getHeatmapColor(val),
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Легенда кольорів з Figma */}
        <div style={styles.legendRow}>
          <span style={styles.legendTitle}>Рівень попиту:</span>
          <div style={styles.legendItem}>
            <div style={{ ...styles.legendSquare, backgroundColor: '#FFFFFF' }} />
            <span>Вільні дні</span>
          </div>
          <div style={styles.legendItem}>
            <div style={{ ...styles.legendSquare, backgroundColor: 'rgba(220, 150, 102, 0.15)' }} />
            <span>Поодинокі запити</span>
          </div>
          <div style={styles.legendItem}>
            <div style={{ ...styles.legendSquare, backgroundColor: 'rgba(220, 150, 102, 0.50)' }} />
            <span>Середній попит</span>
          </div>
          <div style={styles.legendItem}>
            <div style={{ ...styles.legendSquare, backgroundColor: '#DC9666' }} />
            <span>Заброньовано (Пік)</span>
          </div>
        </div>
      </div>

      {/* Секція: Ефективність за об'єктами */}
      <div style={styles.sectionCard}>
        <h2 style={styles.cardTitleAlegreya}>Ефективність за об&apos;єктами</h2>

        <div style={styles.propTableHead}>
          <div style={{ flex: 1 }}>Помешкання</div>
          <div style={{ width: '140px', textAlign: 'right' }}>Перегляди сторінки</div>
          <div style={{ width: '120px', textAlign: 'right' }}>Бронювання</div>
          <div style={{ width: '120px', textAlign: 'right' }}>Конверсія</div>
          <div style={{ width: '160px', textAlign: 'right' }}>Генерація доходу</div>
        </div>

        <div style={styles.propTableBody}>
          {PROPERTY_PERFORMANCE_DATA.map((item, idx) => (
            <div key={idx} style={styles.propTableRow}>
              <div style={{ flex: 1, color: '#291C0E', fontSize: '14px', fontWeight: 700 }}>{item.name}</div>
              <div style={{ width: '140px', textAlign: 'right', color: '#A78D78', fontSize: '13px' }}>
                {item.views.toLocaleString()}
              </div>
              <div style={{ width: '120px', textAlign: 'right', color: '#A78D78', fontSize: '13px' }}>{item.bookings}</div>
              <div style={{ width: '120px', textAlign: 'right', color: '#DC9666', fontSize: '13px', fontWeight: 700 }}>
                {item.cr}
              </div>
              <div style={{ width: '160px', textAlign: 'right', color: '#291C0E', fontSize: '14px', fontWeight: 700 }}>
                {formatPrice(item.revenue)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Зірочка рейтингу з Figma
const StarMiniIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path
      d="M7 1.17L8.8 4.82L12.83 5.41L9.91 8.25L10.6 12.26L7 10.37L3.4 12.26L4.09 8.25L1.17 5.41L5.2 4.82L7 1.17Z"
      stroke="#DC9666"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ======================== СТИЛІ FIGMA ========================
const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    width: '100%',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
  },
  titlesCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  mainTitle: {
    fontSize: '36px',
    fontFamily: "'Alegreya', Georgia, serif",
    fontWeight: 700,
    color: '#291C0E',
    margin: 0,
  },
  subtitle: {
    fontSize: '16px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 400,
    color: '#6E473B',
    margin: 0,
  },
  periodPill: {
    padding: '10px 16px',
    backgroundColor: '#FFFFFF',
    borderRadius: '100px',
    border: '1px solid #D7C7B1',
    color: '#291C0E',
    fontSize: '13px',
    fontWeight: 700,
  },
  metricsGrid: {
    display: 'flex',
    gap: '30px',
    flexWrap: 'wrap',
  },
  sectionCard: {
    flex: '1 1 440px',
    padding: '24px',
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    border: '2px solid #D7C7B1',
    boxShadow: '0px 10px 24px -10px rgba(0, 0, 0, 0.07)',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  cardTitleAlegreya: {
    color: '#291C0E',
    fontSize: '20px',
    fontFamily: "'Alegreya', Georgia, serif",
    fontWeight: 700,
    margin: 0,
  },
  ratingBreakdownRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '32px',
    flexWrap: 'wrap',
  },
  scoreSummaryCol: {
    width: '120px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
  },
  bigScoreText: {
    color: '#291C0E',
    fontSize: '48px',
    fontFamily: "'Alegreya', Georgia, serif",
    fontWeight: 700,
  },
  starsGroup: {
    display: 'flex',
    gap: '4px',
  },
  reviewsDesc: {
    color: '#6E473B',
    fontSize: '11px',
    textAlign: 'center',
  },
  barsCol: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  distRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  distLabel: {
    width: '60px',
    color: '#A78D78',
    fontSize: '12px',
  },
  barTrack: {
    flex: 1,
    height: '8px',
    backgroundColor: 'rgba(220, 150, 102, 0.15)',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#DC9666',
    borderRadius: '4px',
  },
  distPercent: {
    width: '30px',
    color: '#291C0E',
    fontSize: '11px',
    fontWeight: 600,
    textAlign: 'right',
  },
  demographicsCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  demItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  demMetaRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  demReg: {
    color: '#291C0E',
    fontSize: '13px',
    fontWeight: 700,
  },
  demCount: {
    color: '#A78D78',
    fontSize: '12px',
  },
  demBarTrack: {
    width: '100%',
    height: '6px',
    backgroundColor: 'rgba(220, 150, 102, 0.15)',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  demBarFill: {
    height: '100%',
    backgroundColor: '#DC9666',
    borderRadius: '3px',
  },
  demandDesc: {
    color: '#A78D78',
    fontSize: '13px',
    lineHeight: 1.5,
  },
  calendarGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    overflowX: 'auto',
    paddingBottom: '8px',
  },
  gridRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  dayLabel: {
    width: '30px',
    color: '#A78D78',
    fontSize: '12px',
    fontWeight: 700,
  },
  cellsRow: {
    display: 'flex',
    gap: '6px',
  },
  heatCell: {
    width: '40px',
    height: '24px',
    borderRadius: '4px',
    border: '1px solid #D7C7B1',
    boxSizing: 'border-box',
    flexShrink: 0,
  },
  legendRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
    marginTop: '8px',
  },
  legendTitle: {
    color: '#6E473B',
    fontSize: '11px',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '11px',
    color: '#A78D78',
  },
  legendSquare: {
    width: '16px',
    height: '12px',
    borderRadius: '2px',
    border: '1px solid #D7C7B1',
  },
  propTableHead: {
    display: 'flex',
    padding: '12px 16px',
    backgroundColor: 'rgba(220, 150, 102, 0.15)',
    borderRadius: '8px',
    color: '#A78D78',
    fontSize: '12px',
    fontWeight: 700,
  },
  propTableBody: {
    display: 'flex',
    flexDirection: 'column',
  },
  propTableRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px',
    borderBottom: '1px solid #D7C7B1',
  },
};