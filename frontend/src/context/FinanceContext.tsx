import React, { createContext, useContext, useState, useMemo } from 'react';
import { storage } from '../services/storage.service';
import type { FinancialTransaction, PayoutSettings } from '../data/mockData';

interface FinanceKPI {
  totalRevenue: number;
  monthRevenue: number;
  totalCommission: number;
  pendingPayouts: number;
}

interface FinanceContextType {
  balance: number;
  expectedPayout: number;
  transactions: FinancialTransaction[];
  payoutSettings: PayoutSettings;
  kpi: FinanceKPI;
  withdrawFunds: (amount: number) => boolean;
  addTransaction: (tx: Omit<FinancialTransaction, 'id' | 'date'>) => void;
  updatePayoutSettings: (newSettings: Partial<PayoutSettings>) => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [balance, setBalance] = useState<number>(() => storage.finance.getBalance());
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(() => storage.finance.getTransactions());
  const [payoutSettings, setPayoutSettings] = useState<PayoutSettings>(() => storage.finance.getPayoutSettings());

  // Автоматичний розрахунок показників KPI
  const kpi = useMemo<FinanceKPI>(() => {
    const incomeTxs = transactions.filter((t) => t.type === 'income');
    const totalRev = incomeTxs.reduce((sum, t) => sum + t.amount, 0);
    const totalComm = incomeTxs.reduce((sum, t) => sum + t.commission, 0);
    const pending = transactions
      .filter((t) => t.status === 'Очікується')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalRevenue: totalRev > 0 ? totalRev : 342800,
      monthRevenue: 26900,
      totalCommission: totalComm > 0 ? totalComm : 3228,
      pendingPayouts: pending > 0 ? pending : 5600,
    };
  }, [transactions]);

  // Функція виведення коштів
  const withdrawFunds = (amount: number): boolean => {
    if (amount <= 0 || amount > balance) return false;

    const newBalance = balance - amount;
    setBalance(newBalance);
    storage.finance.setBalance(newBalance);

    const newTx: FinancialTransaction = {
      id: `tx-out-${Date.now()}`,
      date: new Date().toLocaleDateString('uk-UA', { day: '2-digit', month: 'short', year: 'numeric' }),
      title: `Виведення коштів на IBAN ${payoutSettings.iban.slice(-8)}`,
      amount: -amount,
      commission: 0,
      type: 'payout',
      status: 'Успішно',
    };

    const updatedTxs = [newTx, ...transactions];
    setTransactions(updatedTxs);
    storage.finance.setTransactions(updatedTxs);
    return true;
  };

  const addTransaction = (tx: Omit<FinancialTransaction, 'id' | 'date'>) => {
    const newTx: FinancialTransaction = {
      id: `tx-${Date.now()}`,
      date: new Date().toLocaleDateString('uk-UA', { day: '2-digit', month: 'short', year: 'numeric' }),
      ...tx,
    };
    const updatedTxs = [newTx, ...transactions];
    setTransactions(updatedTxs);
    storage.finance.setTransactions(updatedTxs);
  };

  const updatePayoutSettings = (newSettings: Partial<PayoutSettings>) => {
    const updated = { ...payoutSettings, ...newSettings };
    setPayoutSettings(updated);
    storage.finance.setPayoutSettings(updated);
  };

  return (
    <FinanceContext.Provider
      value={{
        balance,
        expectedPayout: 3500,
        transactions,
        payoutSettings,
        kpi,
        withdrawFunds,
        addTransaction,
        updatePayoutSettings,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) throw new Error('useFinance must be used within a FinanceProvider');
  return context;
};