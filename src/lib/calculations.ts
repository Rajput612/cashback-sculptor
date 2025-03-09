
interface SpendingCategory {
  name: string;
  amount: number;
}

export interface Spending {
  online: {
    merchants: SpendingCategory[];
    categories: SpendingCategory[];
    brands: SpendingCategory[];
    total: number;
  };
  offline: {
    merchants: SpendingCategory[];
    categories: SpendingCategory[];
    brands: SpendingCategory[];
    total: number;
  };
  total: number;
}

export interface CreditCard {
  id: string;
  name: string;
  issuer: string;
  image: string;
  annualFee: number;
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
}

// Sample credit card data
export const creditCards: CreditCard[] = [
  {
    id: "chase-freedom-unlimited",
    name: "Freedom Unlimited",
    issuer: "Chase",
    image: "https://i.ibb.co/VD7Tk46/card1.png",
    annualFee: 0,
    cashbackRates: [
      { category: "general", rate: 1.5 },
      { category: "dining", rate: 3 },
      { category: "drugstores", rate: 3 },
      { category: "travel", rate: 5, limit: 1500 }
    ],
    signupBonus: {
      amount: 200,
      requirement: "Spend $500 in the first 3 months"
    },
    benefits: [
      "No minimum to redeem for cash back",
      "No annual fee",
      "Zero Liability Protection"
    ]
  },
  {
    id: "citi-double-cash",
    name: "Double Cash Card",
    issuer: "Citi",
    image: "https://i.ibb.co/JmgK0HJ/card2.png",
    annualFee: 0,
    cashbackRates: [
      { category: "general", rate: 2 }
    ],
    benefits: [
      "Unlimited 2% cash back on all purchases",
      "No categories to track",
      "No annual fee"
    ]
  },
  {
    id: "amex-blue-cash-preferred",
    name: "Blue Cash Preferred",
    issuer: "American Express",
    image: "https://i.ibb.co/TWwnQPt/card3.png",
    annualFee: 95,
    cashbackRates: [
      { category: "groceries", rate: 6, limit: 6000 },
      { category: "streaming", rate: 6 },
      { category: "transit", rate: 3 },
      { category: "gas", rate: 3 },
      { category: "general", rate: 1 }
    ],
    signupBonus: {
      amount: 350,
      requirement: "Spend $3,000 in the first 6 months"
    },
    benefits: [
      "Return Protection",
      "Purchase Protection",
      "Car Rental Loss & Damage Insurance"
    ]
  },
  {
    id: "discover-it-cash",
    name: "Discover it Cash Back",
    issuer: "Discover",
    image: "https://i.ibb.co/TTtsFXM/card4.png",
    annualFee: 0,
    cashbackRates: [
      { category: "rotating-categories", rate: 5, limit: 1500 },
      { category: "general", rate: 1 }
    ],
    benefits: [
      "Cashback Match for the first year",
      "No annual fee",
      "Free FICO® Credit Score"
    ],
    additionalDetails: "5% cash back on rotating categories each quarter (up to $1,500)"
  },
  {
    id: "capital-one-savor",
    name: "Savor Rewards",
    issuer: "Capital One",
    image: "https://i.ibb.co/5FXcyBc/card5.png",
    annualFee: 95,
    cashbackRates: [
      { category: "dining", rate: 4 },
      { category: "entertainment", rate: 4 },
      { category: "groceries", rate: 3 },
      { category: "general", rate: 1 }
    ],
    signupBonus: {
      amount: 300,
      requirement: "Spend $3,000 in the first 3 months"
    },
    benefits: [
      "No foreign transaction fees",
      "Extended Warranty",
      "Travel Accident Insurance"
    ]
  }
];

// Map spending categories to credit card categories
const categoryMapping: Record<string, string[]> = {
  "groceries": ["groceries", "supermarkets", "food"],
  "dining": ["restaurants", "dining", "food delivery"],
  "entertainment": ["entertainment", "movies", "streaming"],
  "travel": ["travel", "flights", "hotels", "transportation"],
  "gas": ["gas", "fuel", "automotive"],
  "shopping": ["retail", "clothing", "department stores"],
  "online": ["ecommerce", "internet purchases"],
  "drugstores": ["pharmacy", "health", "drugstores"],
  "utilities": ["bills", "utilities", "services"],
  "transit": ["public transportation", "commuting"]
};

// Function to match user spending category to credit card category
export function matchCategory(userCategory: string): string {
  userCategory = userCategory.toLowerCase();
  
  for (const [cardCategory, keywords] of Object.entries(categoryMapping)) {
    if (keywords.some(keyword => userCategory.includes(keyword))) {
      return cardCategory;
    }
  }
  
  return "general";
}

// Calculate total cashback for a card based on spending
export function calculateCashback(card: CreditCard, spending: Spending): number {
  let totalCashback = 0;
  
  // Process online merchant spending
  spending.online.merchants.forEach(merchant => {
    const category = matchCategory(merchant.name);
    const rate = card.cashbackRates.find(r => r.category === category)?.rate || 
                 card.cashbackRates.find(r => r.category === "general")?.rate || 1;
    
    totalCashback += (merchant.amount * rate) / 100;
  });
  
  // Process online category spending
  spending.online.categories.forEach(category => {
    const mappedCategory = matchCategory(category.name);
    const rate = card.cashbackRates.find(r => r.category === mappedCategory)?.rate || 
                 card.cashbackRates.find(r => r.category === "general")?.rate || 1;
    
    totalCashback += (category.amount * rate) / 100;
  });
  
  // Process online brand spending
  spending.online.brands.forEach(brand => {
    const category = matchCategory(brand.name);
    const rate = card.cashbackRates.find(r => r.category === category)?.rate || 
                 card.cashbackRates.find(r => r.category === "general")?.rate || 1;
    
    totalCashback += (brand.amount * rate) / 100;
  });
  
  // Process offline merchant spending
  spending.offline.merchants.forEach(merchant => {
    const category = matchCategory(merchant.name);
    const rate = card.cashbackRates.find(r => r.category === category)?.rate || 
                 card.cashbackRates.find(r => r.category === "general")?.rate || 1;
    
    totalCashback += (merchant.amount * rate) / 100;
  });
  
  // Process offline category spending
  spending.offline.categories.forEach(category => {
    const mappedCategory = matchCategory(category.name);
    const rate = card.cashbackRates.find(r => r.category === mappedCategory)?.rate || 
                 card.cashbackRates.find(r => r.category === "general")?.rate || 1;
    
    totalCashback += (category.amount * rate) / 100;
  });
  
  // Process offline brand spending
  spending.offline.brands.forEach(brand => {
    const category = matchCategory(brand.name);
    const rate = card.cashbackRates.find(r => r.category === category)?.rate || 
                 card.cashbackRates.find(r => r.category === "general")?.rate || 1;
    
    totalCashback += (brand.amount * rate) / 100;
  });
  
  // Consider any remaining spending as general
  const accountedSpending = [
    ...spending.online.merchants, 
    ...spending.online.categories, 
    ...spending.online.brands,
    ...spending.offline.merchants, 
    ...spending.offline.categories, 
    ...spending.offline.brands
  ].reduce((sum, item) => sum + item.amount, 0);
  
  const generalSpending = spending.total - accountedSpending;
  if (generalSpending > 0) {
    const generalRate = card.cashbackRates.find(r => r.category === "general")?.rate || 1;
    totalCashback += (generalSpending * generalRate) / 100;
  }
  
  return totalCashback;
}

// Get the best card combinations based on spending
export function getBestCardCombinations(spending: Spending, numberOfCards: number = 2): CreditCard[] {
  // Calculate cashback for each card
  const cardsWithCashback = creditCards.map(card => ({
    card,
    cashback: calculateCashback(card, spending),
    annualFee: card.annualFee,
    netValue: calculateCashback(card, spending) - card.annualFee
  }));
  
  // Sort by net value (cashback minus annual fee)
  cardsWithCashback.sort((a, b) => b.netValue - a.netValue);
  
  // Return the top N cards
  return cardsWithCashback.slice(0, numberOfCards).map(item => item.card);
}

// Initialize empty spending object
export function initializeEmptySpending(): Spending {
  return {
    online: {
      merchants: [],
      categories: [],
      brands: [],
      total: 0
    },
    offline: {
      merchants: [],
      categories: [],
      brands: [],
      total: 0
    },
    total: 0
  };
}

// Update spending totals
export function updateSpendingTotals(spending: Spending): Spending {
  // Calculate online total
  spending.online.total = [
    ...spending.online.merchants,
    ...spending.online.categories,
    ...spending.online.brands
  ].reduce((sum, item) => sum + item.amount, 0);
  
  // Calculate offline total
  spending.offline.total = [
    ...spending.offline.merchants,
    ...spending.offline.categories,
    ...spending.offline.brands
  ].reduce((sum, item) => sum + item.amount, 0);
  
  // Calculate overall total
  spending.total = spending.online.total + spending.offline.total;
  
  return spending;
}
