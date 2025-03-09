
export interface SpendingItem {
  name: string;
  amount: number;
  category?: string;
  brand?: string;
}

export interface Spending {
  online: {
    merchants: SpendingItem[];
    categories: SpendingItem[];
    bills: SpendingItem[];
    total: number;
  };
  offline: {
    merchants: SpendingItem[];
    categories: SpendingItem[];
    bills: SpendingItem[];
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
  isCoBranded?: boolean;
  coPartner?: string;
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

// Sample Indian credit card data
export const creditCards: CreditCard[] = [
  {
    id: "hdfc-regalia",
    name: "Regalia Credit Card",
    issuer: "HDFC Bank",
    image: "https://i.ibb.co/VD7Tk46/card1.png",
    annualFee: 2500,
    cashbackRates: [
      { category: "dining", rate: 5 },
      { category: "travel", rate: 5 },
      { category: "shopping", rate: 5 },
      { category: "general", rate: 1 }
    ],
    signupBonus: {
      amount: 2000,
      requirement: "On spending ₹10,000 within 90 days"
    },
    benefits: [
      "Complimentary airport lounge access - 12 per year",
      "1% fuel surcharge waiver",
      "Annual fee waiver on spending ₹5 lakh",
      "2X rewards on weekend dining"
    ],
    fuelSurchargeWaiver: true,
    rewardsProgram: {
      name: "HDFC Rewards Points",
      conversionRate: "1 point = ₹0.30"
    },
    lounge: {
      domestic: 12,
      international: 6
    },
    feeWaiver: "Annual fee waiver on spending ₹5 lakh"
  },
  {
    id: "icici-amazon",
    name: "Amazon Pay ICICI Credit Card",
    issuer: "ICICI Bank",
    image: "https://i.ibb.co/JmgK0HJ/card2.png",
    annualFee: 0,
    isCoBranded: true,
    coPartner: "Amazon",
    cashbackRates: [
      { category: "amazon", rate: 5 },
      { category: "utilities", rate: 2 },
      { category: "fuel", rate: 2 },
      { category: "groceries", rate: 2 },
      { category: "general", rate: 1 }
    ],
    benefits: [
      "No joining fee",
      "No annual fee",
      "Amazon Prime membership worth ₹1,499 for first year",
      "Additional offers on Amazon.in"
    ],
    fuelSurchargeWaiver: true
  },
  {
    id: "sbi-elite",
    name: "SBI Card ELITE",
    issuer: "SBI Card",
    image: "https://i.ibb.co/TWwnQPt/card3.png",
    annualFee: 4999,
    cashbackRates: [
      { category: "dining", rate: 5 },
      { category: "groceries", rate: 5 },
      { category: "entertainment", rate: 5 },
      { category: "general", rate: 1 }
    ],
    signupBonus: {
      amount: 5000,
      requirement: "On spending ₹20,000 within 90 days"
    },
    benefits: [
      "Complimentary Priority Pass membership",
      "Complimentary domestic airport lounge access",
      "1% fuel surcharge waiver",
      "Milestone benefits"
    ],
    fuelSurchargeWaiver: true,
    rewardsProgram: {
      name: "SBI Card Rewards Points",
      conversionRate: "1 point = ₹0.25"
    },
    lounge: {
      domestic: 8,
      international: 6
    },
    feeWaiver: "Annual fee waiver on spending ₹10 lakh"
  },
  {
    id: "axis-flipkart",
    name: "Flipkart Axis Bank Credit Card",
    issuer: "Axis Bank",
    image: "https://i.ibb.co/TTtsFXM/card4.png",
    annualFee: 500,
    isCoBranded: true,
    coPartner: "Flipkart",
    cashbackRates: [
      { category: "flipkart", rate: 5 },
      { category: "myntra", rate: 4 },
      { category: "groceries", rate: 4 },
      { category: "travel", rate: 4 },
      { category: "dining", rate: 4 },
      { category: "general", rate: 1.5 }
    ],
    benefits: [
      "Welcome benefits worth ₹1,000 on Flipkart, Myntra and Cleartrip",
      "4 complimentary domestic airport lounge access",
      "1% fuel surcharge waiver",
      "EMI offers on Flipkart"
    ],
    fuelSurchargeWaiver: true,
    lounge: {
      domestic: 4
    }
  },
  {
    id: "onecard",
    name: "OneCard Credit Card",
    issuer: "FPL Technologies",
    image: "https://i.ibb.co/5FXcyBc/card5.png",
    annualFee: 0,
    cashbackRates: [
      { category: "dining", rate: 5 },
      { category: "travel", rate: 5 },
      { category: "entertainment", rate: 5 },
      { category: "groceries", rate: 5 },
      { category: "general", rate: 1 }
    ],
    benefits: [
      "No joining fee",
      "No annual fee",
      "No forex markup",
      "5X rewards on top spending categories each month",
      "Full control via mobile app"
    ]
  },
  {
    id: "indusind-iconia",
    name: "Iconia Amex Credit Card",
    issuer: "IndusInd Bank",
    image: "https://i.ibb.co/VD7Tk46/card1.png",
    annualFee: 10000,
    cashbackRates: [
      { category: "dining", rate: 4 },
      { category: "travel", rate: 4 },
      { category: "shopping", rate: 4 },
      { category: "general", rate: 2 }
    ],
    signupBonus: {
      amount: 10000,
      requirement: "On spending ₹30,000 within 90 days"
    },
    benefits: [
      "Complimentary airport lounge access - 16 per year",
      "1% fuel surcharge waiver",
      "Golf privileges at select courses",
      "Concierge services"
    ],
    rewardsProgram: {
      name: "Indus Rewards Points",
      conversionRate: "1 point = ₹0.50"
    },
    lounge: {
      domestic: 8,
      international: 8
    }
  },
  {
    id: "yesbank-premia",
    name: "Yes Premia Credit Card",
    issuer: "Yes Bank",
    image: "https://i.ibb.co/JmgK0HJ/card2.png",
    annualFee: 3999,
    cashbackRates: [
      { category: "dining", rate: 12, limit: 10000 },
      { category: "travel", rate: 12, limit: 10000 },
      { category: "shopping", rate: 6, limit: 10000 },
      { category: "general", rate: 3 }
    ],
    benefits: [
      "Complimentary airport lounge access - 8 per year",
      "1% fuel surcharge waiver",
      "Movie ticket offers",
      "Milestone benefits"
    ],
    fuelSurchargeWaiver: true,
    lounge: {
      domestic: 8
    },
    feeWaiver: "Annual fee waiver on spending ₹5 lakh"
  },
  {
    id: "rbl-shoprite",
    name: "RBL ShopRite Credit Card",
    issuer: "RBL Bank",
    image: "https://i.ibb.co/TWwnQPt/card3.png",
    annualFee: 0,
    cashbackRates: [
      { category: "groceries", rate: 5, limit: 5000 },
      { category: "utilities", rate: 5, limit: 5000 },
      { category: "dining", rate: 1.5 },
      { category: "general", rate: 1 }
    ],
    benefits: [
      "No joining fee",
      "No annual fee",
      "5% cashback on all supermarket purchases",
      "Fuel surcharge waiver up to ₹100 per month"
    ],
    fuelSurchargeWaiver: true
  },
  {
    id: "kotak-royale",
    name: "Kotak Royale Signature",
    issuer: "Kotak Mahindra Bank",
    image: "https://i.ibb.co/TTtsFXM/card4.png",
    annualFee: 999,
    cashbackRates: [
      { category: "dining", rate: 4 },
      { category: "travel", rate: 4 },
      { category: "shopping", rate: 4 },
      { category: "general", rate: 2 }
    ],
    benefits: [
      "4 complimentary domestic airport lounge access",
      "1:1 rewards redemption for air miles",
      "1% fuel surcharge waiver",
      "Buy 1 Get 1 movie ticket on BookMyShow"
    ],
    fuelSurchargeWaiver: true,
    lounge: {
      domestic: 4
    },
    feeWaiver: "Annual fee waiver on spending ₹1 lakh"
  },
  {
    id: "citi-premiermiles",
    name: "Citi PremierMiles Card",
    issuer: "Citibank",
    image: "https://i.ibb.co/5FXcyBc/card5.png",
    annualFee: 3000,
    cashbackRates: [
      { category: "travel", rate: 10 },
      { category: "dining", rate: 5 },
      { category: "online", rate: 5 },
      { category: "general", rate: 3 }
    ],
    signupBonus: {
      amount: 5000,
      requirement: "On spending ₹15,000 within 60 days"
    },
    benefits: [
      "10X reward points on airline transactions",
      "Complimentary airport lounge access - 6 per year",
      "1% fuel surcharge waiver",
      "Air miles transfer to multiple airline partners"
    ],
    fuelSurchargeWaiver: true,
    rewardsProgram: {
      name: "Citi Miles",
      conversionRate: "1 mile = approx ₹0.40"
    },
    lounge: {
      domestic: 6
    }
  }
];

// Map spending categories to credit card categories
const categoryMapping: Record<string, string[]> = {
  // General categories
  "groceries": ["groceries", "supermarkets", "food", "big basket", "grofers", "dmart", "reliance fresh", "nature's basket"],
  "dining": ["restaurants", "dining", "food delivery", "zomato", "swiggy", "eazydiner", "dineout"],
  "entertainment": ["entertainment", "movies", "streaming", "bookmyshow", "netflix", "amazon prime", "hotstar", "jiosaavn", "gaana"],
  "travel": ["travel", "flights", "hotels", "transportation", "makemytrip", "goibibo", "yatra", "irctc", "cleartrip", "ola", "uber"],
  "fuel": ["gas", "fuel", "automotive", "petrol", "diesel", "iocl", "bpcl", "hpcl", "reliance petroleum", "shell"],
  "shopping": ["retail", "clothing", "department stores", "myntra", "flipkart", "amazon", "ajio", "nykaa", "tata cliq"],
  "electronics": ["electronics", "gadgets", "croma", "reliance digital", "vijay sales"],
  "utilities": ["bills", "utilities", "services", "electricity", "water", "gas", "mobile recharge", "broadband"],
  "education": ["education", "tuition", "school fees", "college fees", "byju's", "unacademy", "vedantu", "upgrad"],
  "healthcare": ["healthcare", "medicine", "hospital", "apollo", "practo", "pharmeasy", "1mg", "netmeds"],
  "rent": ["rent", "housing", "accommodation"],
  "emi": ["emi", "loan payments", "home loan", "car loan"],
  "insurance": ["insurance", "life insurance", "health insurance", "car insurance"],
  "investments": ["investments", "mutual funds", "stocks", "shares", "zerodha", "groww", "upstox", "paytm money"],
  
  // Co-branded specific categories
  "amazon": ["amazon", "amazon.in", "amazon pay"],
  "flipkart": ["flipkart", "flipkart.com"],
  "myntra": ["myntra", "myntra.com"]
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
  
  // Process all spending categories
  const processSpendingItem = (item: SpendingItem) => {
    // If there's a category assigned to this spending item, use it
    const spendingCategory = item.category ? 
                            matchCategory(item.category) : 
                            matchCategory(item.name);
    
    // If this is a merchant with a brand and it matches a co-branded card
    if (item.brand && card.isCoBranded && card.coPartner) {
      if (item.brand.toLowerCase().includes(card.coPartner.toLowerCase())) {
        // Get co-branded rate if it exists
        const coBrandedRate = card.cashbackRates.find(r => r.category.toLowerCase() === card.coPartner?.toLowerCase())?.rate;
        if (coBrandedRate) {
          totalCashback += (item.amount * coBrandedRate) / 100;
          return;
        }
      }
    }
    
    // Use matching category or fall back to general
    const rate = card.cashbackRates.find(r => r.category === spendingCategory)?.rate || 
                 card.cashbackRates.find(r => r.category === "general")?.rate || 1;
    
    totalCashback += (item.amount * rate) / 100;
  };
  
  // Process all spending items
  [...spending.online.merchants, 
   ...spending.online.categories, 
   ...spending.online.bills,
   ...spending.offline.merchants, 
   ...spending.offline.categories, 
   ...spending.offline.bills
  ].forEach(processSpendingItem);
  
  // Consider any remaining spending as general
  const accountedSpending = [
    ...spending.online.merchants, 
    ...spending.online.categories, 
    ...spending.online.bills,
    ...spending.offline.merchants, 
    ...spending.offline.categories, 
    ...spending.offline.bills
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
      bills: [],
      total: 0
    },
    offline: {
      merchants: [],
      categories: [],
      bills: [],
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
    ...spending.online.bills
  ].reduce((sum, item) => sum + item.amount, 0);
  
  // Calculate offline total
  spending.offline.total = [
    ...spending.offline.merchants,
    ...spending.offline.categories,
    ...spending.offline.bills
  ].reduce((sum, item) => sum + item.amount, 0);
  
  // Calculate overall total
  spending.total = spending.online.total + spending.offline.total;
  
  return spending;
}
