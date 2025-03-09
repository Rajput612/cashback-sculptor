
// Types extracted from calculations.ts
export interface SpendingItem {
  name: string;
  amount: number;
  category?: string;
  brand?: string;
  app?: string;
}

export interface SpendingSection {
  merchants: SpendingItem[];
  categories: SpendingItem[];
  bills: SpendingItem[];
}

export interface Spending {
  online: SpendingSection;
  offline: SpendingSection;
  total: number;
}
