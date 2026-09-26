import { createDemoDataSources } from '../data/demo';
import { createLiveDataSources, unavailableFinance } from '../data/live';
import { parseDataMode, selectDataSource } from '../data/selectSource';
import { storage } from '../services/storage.service';
import { withPropertyNotifications } from '../data/propertyNotifications';

// Composition root: choose/inject repositories here, never inside a page.
// Real financial operations are outside the diploma scope.
export const dataSources = withPropertyNotifications(selectDataSource(parseDataMode(import.meta.env.VITE_DATA_MODE), {
  demo: () => createDemoDataSources(localStorage, () => storage.user.get()),
  live: () => createLiveDataSources(unavailableFinance),
}));
