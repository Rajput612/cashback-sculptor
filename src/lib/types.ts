
// Basic spending categories and subcategories
export interface CategoryHierarchy {
  name: string;
  subcategories?: CategoryHierarchy[];
}

export interface SpendingItem {
  name: string;
  amount: number;
  category?: string;
  brand?: string;
  app?: string;
  subApp?: string;
  merchant?: string;
  subcategories?: {
    level: string;
    value: string;
  }[];
}

export interface SpendingSection {
  merchants: SpendingItem[];
  categories: SpendingItem[];
  bills: SpendingItem[];
  total: number;
}

export interface Spending {
  online: SpendingSection;
  offline: SpendingSection;
  total: number;
}

// Update CreditCard type to include missing properties
export interface CreditCard {
  id: string;
  name: string;
  issuer: string;
  image: string;
  type?: string;
  network?: string;
  annualFee: number;
  isCoBranded?: boolean;
  coPartner?: string;
  recommendedFor?: string[];
  cashbackRates: {
    category: string;
    rate: number;
    limit?: number;
  }[];
  signupBonus?: {
    amount: number;
    requirement: string;
  };
  benefits: string[];
  additionalDetails?: string;
  fuelSurchargeWaiver?: boolean;
  rewardsProgram?: {
    name: string;
    conversionRate?: string;
  };
  lounge?: {
    domestic?: number;
    international?: number;
  };
  feeWaiver?: string;
}
