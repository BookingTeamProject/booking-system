import React, { useState } from 'react';
import { useFinance } from '../../../context/FinanceContext';
import { useSettings } from '../../../context/SettingsContext';

export const FinanceTab: React.FC = () => {
  const { kpi, transactions } = useFinance();
  const { formatPrice } = useSettings();
  const [currentPeriod] = useState('Цей місяць (Січень 2026)');

  const handleExportCsv = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,Дата,Гість,Помешкання,Комісія,Сума,Статус\n' +
      transactions
        .map((t) => `${t.date},"${t.guestName || ''}","${t.propertyName || t.title}",${t.commission},${t.amount},${t.status}`)
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `financial_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.titlesCol}>
          <h1 style={styles.mainTitle}>Фінансова аналітика</h1>
          <p style={styles.subtitle}>Відстежуйте ваші доходи, комісійні збори та історію виплат</p>
        </div>

        <div style={styles.actionsRow}>
          <div style={styles.periodBadge}>{currentPeriod}</div>
          <button type="button" onClick={handleExportCsv} style={styles.exportBtn}>
            <UploadCloudIcon />
            <span>Експорт CSV</span>
          </button>
        </div>
      </header>

      {/* 4 Картки KPI з живими розрахунками з FinanceContext */}
      <div style={styles.kpiGrid}>
        <div style={styles.kpiCard}>
          <div style={styles.kpiLabel}>Загальний дохід</div>
          <div style={styles.kpiVal}>{formatPrice(kpi.totalRevenue)}</div>
          <div style={styles.kpiChangePositive}>↑ +14.2% за 30 днів</div>
        </div>

        <div style={styles.kpiCard}>
          <div style={styles.kpiLabel}>Дохід за місяць</div>
          <div style={styles.kpiVal}>{formatPrice(kpi.monthRevenue)}</div>
          <div style={styles.kpiChangePositive}>↑ Всі об&apos;єкти активні</div>
        </div>

        <div style={styles.kpiCard}>
          <div style={styles.kpiLabel}>Сплачена комісія (12%)</div>
          <div style={styles.kpiVal}>{formatPrice(kpi.totalCommission)}</div>
          <div style={styles.kpiChangeNeutral}>Автоматично утримано</div>
        </div>

        <div style={styles.kpiCard}>
          <div style={styles.kpiLabel}>Очікувані виплати</div>
          <div style={{ ...styles.kpiVal, color: '#DC9666' }}>{formatPrice(kpi.pendingPayouts)}</div>
          <div style={styles.kpiChangeNeutral}>Виплата запланована на 29.01</div>
        </div>
      </div>

      {/* Графіки */}
      <div style={styles.chartsRow}>
        <div style={styles.sectionCard}>
          <h2 style={styles.cardTitleAlegreya}>Доходи за останні 6 місяців</h2>
          <div style={styles.barChartWrapper}>
            {[
              { m: 'Сер', h: 68 },
              { m: 'Вер', h: 84 },
              { m: 'Жов', h: 56 },
              { m: 'Лис', h: 78 },
              { m: 'Гру', h: 110 },
              { m: 'Січ', h: 54 },
            ].map((bar) => (
              <div key={bar.m} style={styles.barColumn}>
                <div style={{ ...styles.barTrack, height: `${bar.h}px` }} />
                <span style={styles.barMonthLabel}>{bar.m}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.sectionCard}>
          <h2 style={styles.cardTitleAlegreya}>Тренд завантаженості (Бронювання)</h2>
          <div style={styles.trendGraphContainer}>
            <div style={styles.trendPlotArea}>
              <div style={{ ...styles.gridLineH, top: '35px' }} />
              <div style={{ ...styles.gridLineH, top: '70px' }} />
              <div style={{ ...styles.gridLineH, top: '105px' }} />
              <div style={styles.peakBadge}>Пік завантаження (92%)</div>
              <svg width="100%" height="100%" viewBox="0 0 500 120" preserveAspectRatio="none" style={{ position: 'absolute', top: 0, left: 0 }}>
                <path d="M0,90 Q125,100 250,25 T500,60" fill="none" stroke="#DC9666" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>
            <div style={styles.xAxisRow}>
              <span>Тиждень 1</span>
              <span>Тиждень 2</span>
              <span>Тиждень 3</span>
              <span>Тиждень 4</span>
            </div>
          </div>
        </div>
      </div>

      {/* Таблиця транзакцій хоста */}
      <div style={styles.sectionCard}>
        <h2 style={styles.cardTitleAlegreya}>Останні фінансові операції</h2>

        <div style={styles.tableHeaderRow}>
          <div style={{ width: '120px' }}>Дата</div>
          <div style={{ width: '160px' }}>Гість</div>
          <div style={{ flex: 1 }}>Помешкання</div>
          <div style={{ width: '140px', textAlign: 'right' }}>Комісія (12%)</div>
          <div style={{ width: '140px', textAlign: 'right' }}>Сума виплати</div>
          <div style={{ width: '140px', textAlign: 'right' }}>Статус</div>
        </div>

        <div style={styles.tableRowsStack}>
          {transactions.map((row) => (
            <div key={row.id} style={styles.tableBodyRow}>
              <div style={{ width: '120px', color: '#291C0E', fontSize: '13px' }}>{row.date}</div>
              <div style={{ width: '160px', color: '#291C0E', fontSize: '13px', fontWeight: 700 }}>{row.guestName || 'Мандрівник'}</div>
              <div style={{ flex: 1, color: '#6E473B', fontSize: '13px' }}>{row.propertyName || row.title}</div>
              <div style={{ width: '140px', textAlign: 'right', color: '#C62828', fontSize: '13px', fontWeight: 600 }}>
                {row.commission > 0 ? `-${formatPrice(row.commission)}` : '—'}
              </div>
              <div style={{ width: '140px', textAlign: 'right', color: '#291C0E', fontSize: '14px', fontWeight: 700 }}>
                {formatPrice(row.amount)}
              </div>
              <div style={{ width: '140px', display: 'flex', justifyContent: 'flex-end' }}>
                <span style={row.status === 'Виплачено' || row.status === 'Успішно' ? styles.statusPaidBadge : styles.statusPendingBadge}>
                  {row.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ======================== SVG ІКОНКА ========================
const UploadCloudIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M16 16l-4-4-4 4M12 12v9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" stroke="white" strokeWidth="2" strokeLinecap="round" />
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
  actionsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  periodBadge: {
    padding: '10px 16px',
    backgroundColor: '#FFFFFF',
    borderRadius: '100px',
    border: '1px solid #D7C7B1',
    color: '#DC9666',
    fontSize: '13px',
    fontWeight: 700,
  },
  exportBtn: {
    padding: '10px 16px',
    backgroundColor: '#DC9666',
    borderRadius: '100px',
    border: 'none',
    color: '#FFFFFF',
    fontSize: '13px',
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0px 10px 24px -8px rgba(194, 65, 12, 0.20)',
  },
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
  },
  kpiCard: {
    padding: '20px',
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    border: '2px solid #D7C7B1',
    boxShadow: '0px 10px 24px -10px rgba(0, 0, 0, 0.07)',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  kpiLabel: {
    color: '#6E473B',
    fontSize: '13px',
  },
  kpiVal: {
    color: '#291C0E',
    fontSize: '28px',
    fontFamily: "'Alegreya', Georgia, serif",
    fontWeight: 700,
  },
  kpiChangePositive: {
    color: '#2E7D32',
    fontSize: '11px',
    fontWeight: 600,
  },
  kpiChangeNeutral: {
    color: '#A78D78',
    fontSize: '11px',
  },
  chartsRow: {
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
    gap: '20px',
  },
  cardTitleAlegreya: {
    color: '#291C0E',
    fontSize: '20px',
    fontFamily: "'Alegreya', Georgia, serif",
    fontWeight: 700,
    margin: 0,
  },
  barChartWrapper: {
    height: '160px',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    padding: '0 16px',
  },
  barColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  barTrack: {
    width: '32px',
    backgroundColor: '#DC9666',
    borderTopLeftRadius: '6px',
    borderTopRightRadius: '6px',
  },
  barMonthLabel: {
    color: '#6E473B',
    fontSize: '12px',
  },
  trendGraphContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  trendPlotArea: {
    height: '140px',
    position: 'relative',
  },
  gridLineH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: '1px',
    backgroundColor: '#D7C7B1',
  },
  peakBadge: {
    position: 'absolute',
    left: '50%',
    top: '12px',
    transform: 'translateX(-50%)',
    padding: '4px 10px',
    backgroundColor: 'rgba(46, 125, 50, 0.15)',
    borderRadius: '8px',
    color: '#2E7D32',
    fontSize: '10px',
    fontWeight: 700,
    zIndex: 2,
  },
  xAxisRow: {
    display: 'flex',
    justifyContent: 'space-between',
    color: '#6E473B',
    fontSize: '11px',
  },
  tableHeaderRow: {
    display: 'flex',
    padding: '12px 16px',
    backgroundColor: 'rgba(220, 150, 102, 0.15)',
    borderRadius: '8px',
    color: '#6E473B',
    fontSize: '12px',
    fontWeight: 700,
  },
  tableRowsStack: {
    display: 'flex',
    flexDirection: 'column',
  },
  tableBodyRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px',
    borderBottom: '1px solid #D7C7B1',
  },
  statusPaidBadge: {
    padding: '4px 10px',
    backgroundColor: 'rgba(46, 125, 50, 0.15)',
    borderRadius: '6px',
    color: '#2E7D32',
    fontSize: '11px',
    fontWeight: 700,
  },
  statusPendingBadge: {
    padding: '4px 10px',
    backgroundColor: 'rgba(220, 150, 102, 0.15)',
    borderRadius: '6px',
    color: '#DC9666',
    fontSize: '11px',
    fontWeight: 700,
  },
};