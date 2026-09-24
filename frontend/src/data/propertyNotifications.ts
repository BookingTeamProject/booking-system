import type { DataSources } from './contracts';

export function withPropertyNotifications(source: DataSources): DataSources {
  const listeners = new Set<() => void>();
  const changed = () => listeners.forEach(listener => listener());
  return {
    ...source,
    subscribeProperties: listener => { listeners.add(listener); return () => { listeners.delete(listener); }; },
    properties: {
      ...source.properties,
      create: async dto => { const result = await source.properties.create(dto); changed(); return result; },
      update: async (id, dto) => { const result = await source.properties.update(id, dto); changed(); return result; },
      delete: async id => { const result = await source.properties.delete(id); changed(); return result; },
    },
  };
}
