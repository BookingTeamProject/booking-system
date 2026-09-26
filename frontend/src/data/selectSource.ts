import type { DataMode, DataSources } from './contracts';

export function parseDataMode(value?: string): DataMode {
  if (!value || value === 'live') return 'live';
  if (value === 'demo') return 'demo';
  throw new Error('VITE_DATA_MODE must be demo or live.');
}

export function selectDataSource(mode: DataMode, factories: Record<DataMode, () => DataSources>): DataSources {
  return factories[mode]();
}
