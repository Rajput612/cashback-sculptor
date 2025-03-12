import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  PlusCircle, 
  MinusCircle, 
  IndianRupee, 
  ShoppingCart, 
  CreditCard, 
  Home, 
  BookOpen, 
  Droplet,
  Landmark,
  ShoppingBag,
  Utensils,
  Car,
  Smartphone,
  ChevronRight,
  ChevronDown,
  Check
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Spending, 
  updateSpendingTotals 
} from '@/lib/calculations';
import { SpendingItem as SpendingItemType } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from 'sonner';
import { CategorySelector } from './CategorySelector';

interface SpendingFormProps {
  className?: string;
  onSubmit: (spending: Spending) => void;
}

interface SpendingItemProps {
  name: string;
  amount: number;
  category?: string;
  brand?: string;
  app?: string;
  subcategories?: {
    level: string;
    value: string;
  }[];
  onNameChange: (value: string) => void;
  onAmountChange: (value: number) => void;
  onCategoryChange?: (value: string) => void;
  onSubcategoryChange?: (index: number, value: string) => void;
  onAddSubcategory?: () => void;
  onBrandChange?: (value: string) => void;
  onAppChange?: (value: string) => void;
  onRemove: () => void;
  showCategory?: boolean;
  showBrand?: boolean;
  showApp?: boolean;
  categoryOptions?: string[];
  brandOptions?: string[];
  appOptions?: string[];
}

// Basic spending categories and subcategories
export interface CategoryHierarchy {
  name: string;
  subcategories?: CategoryHierarchy[];
}

// Helper function to initialize empty spending
const initializeEmptySpending = (): Spending => {
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
};

const predefinedCategories: CategoryHierarchy[] = [
  {
    name: 'Shopping',
    subcategories: [
      {
        name: 'Fashion',
        subcategories: [
          {
            name: 'Clothing',
            subcategories: [
              { name: 'Casual Wear' },
              { name: 'Formal Wear' },
              { name: 'Sportswear' }
            ]
          },
          {
            name: 'Footwear',
            subcategories: [
              { name: 'Casual Shoes' },
              { name: 'Formal Shoes' },
              { name: 'Sports Shoes' }
            ]
          },
          { name: 'Accessories' }
        ]
      },
      {
        name: 'Electronics',
        subcategories: [
          { name: 'Smartphones' },
          { name: 'Laptops' },
          { name: 'Accessories' }
        ]
      }
    ]
  },
  {
    name: 'Food & Dining',
    subcategories: [
      { name: 'Restaurants' },
      { name: 'Food Delivery' },
      { name: 'Groceries' }
    ]
  },
  // Add more categories as needed
];

// Add this to your SpendingForm component
const SpendingItem: React.FC<SpendingItemProps> = ({
  name,
  amount,
  category,
  subcategories = [],
  onNameChange,
  onAmountChange,
  onCategoryChange,
  onSubcategoryChange,
  onAddSubcategory,
  onRemove,
  showCategory = false,
  categoryOptions = []
}) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="flex flex-col gap-3 animate-scale-in bg-card/50 p-3 rounded-lg border border-transparent hover:border-muted-foreground/10">
      <div className="flex items-center gap-3">
        <Input
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Name (e.g. Amazon, Rent)"
          className="flex-1"
        />
        <div className="relative">
          <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="number"
            value={amount === 0 ? '' : amount}
            onChange={(e) => onAmountChange(Number(e.target.value))}
            placeholder="Amount"
            className="pl-8 w-32"
          />
        </div>
        
        {(showCategory) && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="px-2"
          >
            {showDetails ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        )}
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onRemove}
          className="text-muted-foreground hover:text-destructive"
        >
          <MinusCircle className="h-5 w-5" />
          <span className="sr-only">Remove</span>
        </Button>
      </div>

      {showDetails && (
        <div className="space-y-3 pl-4 pt-1 animate-slide-down">
          {showCategory && (
            <div className="space-y-2">
              <CategorySelector
                level="Category"
                value={category || ''}
                options={categoryOptions}
                onChange={(value) => onCategoryChange?.(value)}
                onAddSubcategory={() => onAddSubcategory?.()}
                canAddMore={subcategories.length < 4}
              />
              
              {subcategories.map((subcat, index) => {
                const parentCategory = index === 0 ? category : subcategories[index - 1].value;
                const options = getSubcategoryOptions(predefinedCategories, [
                  parentCategory,
                  ...subcategories.slice(0, index).map(sc => sc.value),
                ]);
                
                return (
                  <CategorySelector
                    key={index}
                    level={`Level ${index + 2}`}
                    value={subcat.value}
                    options={options}
                    onChange={(value) => onSubcategoryChange?.(index, value)}
                    onAddSubcategory={() => onAddSubcategory?.()}
                    canAddMore={index < 3}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Helper function to get subcategory options
const getSubcategoryOptions = (categories: CategoryHierarchy[], path: string[]): string[] => {
  if (path.length === 0) return categories.map(c => c.name);
  
  let current: CategoryHierarchy[] | undefined = categories;
  for (const p of path) {
    const next = current?.find(c => c.name === p)?.subcategories;
    if (!next) return [];
    current = next;
  }
  
  return current?.map(c => c.name) || [];
};

// Update your SpendingForm component state
const SpendingForm: React.FC<SpendingFormProps> = ({ className, onSubmit }) => {
  const [spending, setSpending] = useState<Spending>(() => ({
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
  }));
  const [activeTab, setActiveTab] = useState('online');
  const [activeSubTab, setActiveSubTab] = useState('merchants');

  // Common categories for Indian context
  const commonCategories = [
    'Groceries', 'Dining', 'Entertainment', 'Fuel', 'Travel', 
    'Shopping', 'Electronics', 'Utilities', 'Education', 'Healthcare',
    'Rent', 'EMI Payments', 'Insurance', 'Investments', 'Subscriptions'
  ];

  // Popular Indian apps by category
  const appsByCategory: Record<string, string[]> = {
    'Shopping': ['Amazon', 'Flipkart', 'Myntra', 'Ajio', 'Tata Cliq', 'Nykaa', 'Meesho'],
    'Groceries': ['BigBasket', 'Grofers', 'JioMart', 'Zepto', 'Dunzo', 'Swiggy Instamart', 'Blinkit'],
    'Dining': ['Zomato', 'Swiggy', 'EatSure', 'EazyDiner', 'Dineout'],
    'Travel': ['MakeMyTrip', 'Goibibo', 'Yatra', 'IRCTC', 'Cleartrip', 'Ola', 'Uber', 'Rapido'],
    'Entertainment': ['BookMyShow', 'Netflix', 'Amazon Prime', 'Hotstar', 'JioSaavn', 'Gaana', 'Spotify'],
    'Payments': ['Paytm', 'Google Pay', 'PhonePe', 'Amazon Pay', 'CRED', 'BHIM'],
    'Electronics': ['Croma', 'Reliance Digital', 'Vijay Sales', 'Amazon'],
    'Utilities': ['Paytm', 'PhonePe', 'Google Pay', 'BBPS', 'MobiKwik'],
    'Education': ['BYJU\'S', 'Unacademy', 'Vedantu', 'upGrad', 'Coursera', 'Udemy'],
    'Healthcare': ['Apollo 24|7', 'Practo', 'PharmEasy', '1mg', 'Netmeds', 'Tata 1mg'],
    'Investments': ['Zerodha', 'Groww', 'Upstox', 'Paytm Money', 'ICICI Direct'],
    'Subscriptions': ['Netflix', 'Amazon Prime', 'Hotstar', 'Spotify', 'YouTube Premium']
  };

  // Popular Indian brands by category
  const brandsByCategory: Record<string, string[]> = {
    'Groceries': ['Big Basket', 'Grofers', 'DMart', 'Reliance Fresh', 'Nature\'s Basket'],
    'Dining': ['McDonald\'s', 'Domino\'s', 'KFC', 'Pizza Hut', 'Haldiram\'s', 'Burger King'],
    'Entertainment': ['PVR', 'INOX', 'Netflix', 'Amazon Prime', 'Hotstar', 'JioSaavn', 'Gaana'],
    'Fuel': ['IOCL', 'BPCL', 'HPCL', 'Reliance Petroleum', 'Shell'],
    'Travel': ['MakeMyTrip', 'Goibibo', 'Yatra', 'IRCTC', 'Cleartrip', 'Ola', 'Uber'],
    'Shopping': ['Myntra', 'Flipkart', 'Amazon', 'Ajio', 'Nykaa', 'Tata Cliq'],
    'Electronics': ['Croma', 'Reliance Digital', 'Vijay Sales', 'Amazon'],
    'Utilities': ['Electricity Board', 'Water Board', 'Gas Connection', 'Mobile Recharge', 'Broadband'],
    'Education': ['BYJU\'S', 'Unacademy', 'Vedantu', 'upGrad', 'School/College Fees'],
    'Healthcare': ['Apollo', 'Practo', 'PharmEasy', '1mg', 'Netmeds'],
    'Investments': ['Zerodha', 'Groww', 'Upstox', 'Paytm Money', 'ICICI Direct'],
    'Subscriptions': ['Netflix', 'Amazon Prime', 'Hotstar', 'Spotify', 'YouTube Premium']
  };

  // Add these handlers to your SpendingForm component
  const handleSubcategoryChange = (
    type: 'online' | 'offline',
    subType: 'merchants' | 'categories' | 'bills',
    itemIndex: number,
    subcatIndex: number,
    value: string
  ) => {
    const newSpending = { ...spending };
    if (!newSpending[type][subType][itemIndex].subcategories) {
      newSpending[type][subType][itemIndex].subcategories = [];
    }
    if (!newSpending[type][subType][itemIndex].subcategories) {
        newSpending[type][subType][itemIndex].subcategories = [];
    }
    
    // Ensure subcategories array is properly initialized
    if (!Array.isArray(newSpending[type][subType][itemIndex].subcategories)) {
        newSpending[type][subType][itemIndex].subcategories = [];
    }

    // Ensure the subcategory at subcatIndex exists before modifying it
    if (!newSpending[type][subType][itemIndex].subcategories![subcatIndex]) {
        newSpending[type][subType][itemIndex].subcategories![subcatIndex] = { level: `Level ${subcatIndex + 2}`, value: '' };
    }
    newSpending[type][subType][itemIndex].subcategories![subcatIndex].value = value;
    setSpending(updateSpendingTotals(newSpending));
  };

  const handleAddSubcategory = (
    type: 'online' | 'offline',
    subType: 'merchants' | 'categories' | 'bills',
    itemIndex: number
  ) => {
    const newSpending = { ...spending };
    if (!newSpending[type][subType][itemIndex].subcategories) {
      newSpending[type][subType][itemIndex].subcategories = [];
    }
    newSpending[type][subType][itemIndex].subcategories!.push({
      level: `Level ${newSpending[type][subType][itemIndex].subcategories!.length + 2}`,
      value: ''
    });
    setSpending(newSpending);
  };

  // Update your existing addItem function
  const addItem = (type: 'online' | 'offline', subType: 'merchants' | 'categories' | 'bills') => {
    const newSpending = { ...spending };
    newSpending[type][subType].push({
      name: '',
      amount: 0,
      category: undefined,
      brand: undefined,
      app: undefined,
      subcategories: []
    });
    setSpending(newSpending);
  };

  const updateItem = (
    type: 'online' | 'offline',
    subType: 'merchants' | 'categories' | 'bills',
    index: number,
    field: keyof SpendingItemType,
    value: string | number
  ) => {
    const newSpending = { ...spending };
    
    // Type assertion to any because SpendingItem has been updated in types.ts
    (newSpending[type][subType][index] as any)[field] = value;
    
    setSpending(updateSpendingTotals(newSpending));
  };

  const removeItem = (
    type: 'online' | 'offline',
    subType: 'merchants' | 'categories' | 'bills',
    index: number
  ) => {
    const newSpending = { ...spending };
    newSpending[type][subType].splice(index, 1);
    setSpending(updateSpendingTotals(newSpending));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (spending.total === 0) {
      toast.warning("Please add some spending information first");
      return;
    }
    
    onSubmit(spending);
  };

  // Quick add functions for different spending categories
  const addPopularApps = () => {
    const newSpending = { ...spending };
    
    // Add common online apps
    newSpending.online.merchants.push({ 
      name: 'Amazon Shopping', 
      amount: 5000, 
      category: 'Shopping',
      brand: 'Amazon',
      app: 'Amazon',
      subcategories: []
    });
    
    newSpending.online.merchants.push({ 
      name: 'Swiggy Food', 
      amount: 3000, 
      category: 'Dining',
      brand: undefined,
      app: 'Swiggy',
      subcategories: []
    });
    
    newSpending.online.merchants.push({ 
      name: 'Zepto Groceries', 
      amount: 2000, 
      category: 'Groceries',
      brand: undefined,
      app: 'Zepto',
      subcategories: []
    });
    
    newSpending.online.merchants.push({ 
      name: 'Zomato Food', 
      amount: 2500, 
      category: 'Dining',
      brand: undefined,
      app: 'Zomato',
      subcategories: []
    });
    
    setSpending(updateSpendingTotals(newSpending));
    toast.success("Added popular apps to your spending");
  };

  const addCommonExpenses = () => {
    const newSpending = { ...spending };
    
    // Add rent
    newSpending.offline.bills.push({ name: 'Rent', amount: 20000, category: 'Housing', subcategories: [] });
    
    // Add common bills
    newSpending.online.bills.push({ name: 'Electricity Bill', amount: 2000, category: 'Utilities', subcategories: [] });
    newSpending.online.bills.push({ name: 'Mobile Recharge', amount: 500, category: 'Utilities', subcategories: [] });
    newSpending.online.bills.push({ name: 'Internet Bill', amount: 1000, category: 'Utilities', subcategories: [] });
    
    // Add common shopping
    newSpending.online.merchants.push({ 
      name: 'Amazon', 
      amount: 5000, 
      category: 'Shopping',
      brand: 'Amazon',
      app: 'Amazon',
      subcategories: []
    });
    
    // Add groceries
    newSpending.offline.merchants.push({ 
      name: 'Grocery Store', 
      amount: 8000, 
      category: 'Groceries',
      subcategories: []
    });
    
    // Add dining
    newSpending.online.merchants.push({ 
      name: 'Zomato', 
      amount: 3000, 
      category: 'Dining',
      brand: undefined,
      app: 'Zomato',
      subcategories: []
    });
    
    setSpending(updateSpendingTotals(newSpending));
    toast.success("Added common expenses to your spending");
  };

  return (
    <form onSubmit={handleSubmit} className={cn("w-full space-y-6", className)}>
      <div className="space-y-4">
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="online" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              <span>Online Spending</span>
            </TabsTrigger>
            <TabsTrigger value="offline" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span>Offline Spending</span>
            </TabsTrigger>
          </TabsList>

          {/* Online Spending Content */}
          <TabsContent value="online" className="mt-6 space-y-6 animate-fade-in">
            <Tabs 
              value={activeSubTab} 
              onValueChange={setActiveSubTab} 
              className="w-full"
            >
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="merchants">Apps/Websites</TabsTrigger>
                <TabsTrigger value="categories">Categories</TabsTrigger>
                <TabsTrigger value="bills">Bills & Payments</TabsTrigger>
              </TabsList>

              <TabsContent value="merchants" className="mt-4 space-y-4">
                <div className="space-y-3">
                  {spending.online.merchants.map((item, index) => (
                    <SpendingItem
                      key={`online-merchant-${index}`}
                      name={item.name}
                      amount={item.amount}
                      category={item.category}
                      subcategories={item.subcategories}
                      brand={item.brand}
                      app={(item as any).app}
                      onNameChange={(value) => updateItem('online', 'merchants', index, 'name', value)}
                      onAmountChange={(value) => updateItem('online', 'merchants', index, 'amount', value)}
                      onCategoryChange={(value) => updateItem('online', 'merchants', index, 'category', value)}
                      onSubcategoryChange={(subcatIndex, value) => handleSubcategoryChange('online', 'merchants', index, subcatIndex, value)}
                      onAddSubcategory={() => handleAddSubcategory('online', 'merchants', index)}
                      onBrandChange={(value) => updateItem('online', 'merchants', index, 'brand', value)}
                      onAppChange={(value) => updateItem('online', 'merchants', index, 'app', value)}
                      onRemove={() => removeItem('online', 'merchants', index)}
                      showCategory={true}
                      categoryOptions={commonCategories}
                    />
                  ))}
                </div>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => addItem('online', 'merchants')}
                  className="flex items-center gap-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Add App/Website</span>
                </Button>
              </TabsContent>

              <TabsContent value="categories" className="mt-4 space-y-4">
                <div className="space-y-3">
                  {spending.online.categories.map((item, index) => (
                    <SpendingItem
                      key={`online-category-${index}`}
                      name={item.name}
                      amount={item.amount}
                      category={item.category}
                      subcategories={item.subcategories}
                      onNameChange={(value) => updateItem('online', 'categories', index, 'name', value)}
                      onAmountChange={(value) => updateItem('online', 'categories', index, 'amount', value)}
                      onCategoryChange={(value) => updateItem('online', 'categories', index, 'category', value)}
                      onSubcategoryChange={(subcatIndex, value) => handleSubcategoryChange('online', 'categories', index, subcatIndex, value)}
                      onAddSubcategory={() => handleAddSubcategory('online', 'categories', index)}
                      onRemove={() => removeItem('online', 'categories', index)}
                      showCategory={true}
                      categoryOptions={commonCategories}
                    />
                  ))}
                </div>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => addItem('online', 'categories')}
                  className="flex items-center gap-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Add Category</span>
                </Button>
              </TabsContent>

              <TabsContent value="bills" className="mt-4 space-y-4">
                <div className="space-y-3">
                  {spending.online.bills.map((item, index) => (
                    <SpendingItem
                      key={`online-bill-${index}`}
                      name={item.name}
                      amount={item.amount}
                      category={item.category}
                      subcategories={item.subcategories}
                      onNameChange={(value) => updateItem('online', 'bills', index, 'name', value)}
                      onAmountChange={(value) => updateItem('online', 'bills', index, 'amount', value)}
                      onCategoryChange={(value) => updateItem('online', 'bills', index, 'category', value)}
                      onSubcategoryChange={(subcatIndex, value) => handleSubcategoryChange('online', 'bills', index, subcatIndex, value)}
                      onAddSubcategory={() => handleAddSubcategory('online', 'bills', index)}
                      onRemove={() => removeItem('online', 'bills', index)}
                      showCategory={true}
                      categoryOptions={commonCategories}
                    />
                  ))}
                </div>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => addItem('online', 'bills')}
                  className="flex items-center gap-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Add Bill/Payment</span>
                </Button>
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Offline Spending Content */}
          <TabsContent value="offline" className="mt-6 space-y-6 animate-fade-in">
            <Tabs 
              value={activeSubTab} 
              onValueChange={setActiveSubTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="merchants">Stores/Shops</TabsTrigger>
                <TabsTrigger value="categories">Categories</TabsTrigger>
                <TabsTrigger value="bills">Bills & Payments</TabsTrigger>
              </TabsList>

              <TabsContent value="merchants" className="mt-4 space-y-4">
                <div className="space-y-3">
                  {spending.offline.merchants.map((item, index) => (
                    <SpendingItem
                      key={`offline-merchant-${index}`}
                      name={item.name}
                      amount={item.amount}
                      category={item.category}
                      subcategories={item.subcategories}
                      brand={item.brand}
                      onNameChange={(value) => updateItem('offline', 'merchants', index, 'name', value)}
                      onAmountChange={(value) => updateItem('offline', 'merchants', index, 'amount', value)}
                      onCategoryChange={(value) => updateItem('offline', 'merchants', index, 'category', value)}
                      onSubcategoryChange={(subcatIndex, value) => handleSubcategoryChange('offline', 'merchants', index, subcatIndex, value)}
                      onAddSubcategory={() => handleAddSubcategory('offline', 'merchants', index)}
                      onBrandChange={(value) => updateItem('offline', 'merchants', index, 'brand', value)}
                      onRemove={() => removeItem('offline', 'merchants', index)}
                      showCategory={true}
                      categoryOptions={commonCategories}
                    />
                  ))}
                </div>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => addItem('offline', 'merchants')}
                  className="flex items-center gap-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Add Store/Shop</span>
                </Button>
              </TabsContent>

              <TabsContent value="categories" className="mt-4 space-y-4">
                <div className="space-y-3">
                  {spending.offline.categories.map((item, index) => (
                    <SpendingItem
                      key={`offline-category-${index}`}
                      name={item.name}
                      amount={item.amount}
                      category={item.category}
                      subcategories={item.subcategories}
                      onNameChange={(value) => updateItem('offline', 'categories', index, 'name', value)}
                      onAmountChange={(value) => updateItem('offline', 'categories', index, 'amount', value)}
                      onCategoryChange={(value) => updateItem('offline', 'categories', index, 'category', value)}
                      onSubcategoryChange={(subcatIndex, value) => handleSubcategoryChange('offline', 'categories', index, subcatIndex, value)}
                      onAddSubcategory={() => handleAddSubcategory('offline', 'categories', index)}
                      onRemove={() => removeItem('offline', 'categories', index)}
                      showCategory={true}
                      categoryOptions={commonCategories}
                    />
                  ))}
                </div>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => addItem('offline', 'categories')}
                  className="flex items-center gap-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Add Category</span>
                </Button>
              </TabsContent>

              <TabsContent value="bills" className="mt-4 space-y-4">
                <div className="space-y-3">
                  {spending.offline.bills.map((item, index) => (
                    <SpendingItem
                      key={`offline-bill-${index}`}
                      name={item.name}
                      amount={item.amount}
                      category={item.category}
                      subcategories={item.subcategories}
                      onNameChange={(value) => updateItem('offline', 'bills', index, 'name', value)}
                      onAmountChange={(value) => updateItem('offline', 'bills', index, 'amount', value)}
                      onCategoryChange={(value) => updateItem('offline', 'bills', index, 'category', value)}
                      onSubcategoryChange={(subcatIndex, value) => handleSubcategoryChange('offline', 'bills', index, subcatIndex, value)}
                      onAddSubcategory={() => handleAddSubcategory('offline', 'bills', index)}
                      onRemove={() => removeItem('offline', 'bills', index)}
                      showCategory={true}
                      categoryOptions={commonCategories}
                    />
                  ))}
                </div>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => addItem('offline', 'bills')}
                  className="flex items-center gap-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Add Bill/Payment</span>
                </Button>
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>

      {/* Quick Add Buttons - Modified to be in a collapsible section */}
      <Collapsible className="mb-4">
        <CollapsibleTrigger asChild>
          <Button variant="outline" type="button" className="flex w-full items-center justify-between">
            <span className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              <span>Quick Add Templates</span>
            </span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button 
              type="button" 
              variant="secondary" 
              size="sm" 
              onClick={addCommonExpenses}
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              <span>Add Common Expenses</span>
            </Button>
            
            <Button 
              type="button" 
              variant="secondary" 
              size="sm" 
              onClick={addPopularApps}
              className="flex items-center gap-2"
            >
              <Smartphone className="h-4 w-4" />
              <span>Add Popular Apps</span>
            </Button>
            
            <Button 
              type="button" 
              variant="secondary" 
              size="sm" 
              onClick={() => {
                // Add education expenses
                const newSpending = { ...spending };
                newSpending.offline.bills.push({ name: 'School/College Fees', amount: 25000, category: 'Education', subcategories: [] });
                newSpending.online.merchants.push({ 
                  name: 'BYJU\'S', 
                  amount: 2000, 
                  category: 'Education',
                  brand: 'BYJU\'S',
                  app: 'BYJU\'S',
                  subcategories: []
                });
                setSpending(updateSpendingTotals(newSpending));
              }}
              className="flex items-center gap-2"
            >
              <BookOpen className="h-4 w-4" />
              <span>Add Education Expenses</span>
            </Button>
            
            <Button 
              type="button" 
              variant="secondary" 
              size="sm" 
              onClick={() => {
                // Add utility bills
                const newSpending = { ...spending };
                newSpending.online.bills.push({ name: 'Water Bill', amount: 500, category: 'Utilities', subcategories: [] });
                newSpending.online.bills.push({ name: 'Gas Bill', amount: 800, category: 'Utilities', subcategories: [] });
                setSpending(updateSpendingTotals(newSpending));
              }}
              className="flex items-center gap-2"
            >
              <Droplet className="h-4 w-4" />
              <span>Add Utility Bills</span>
            </Button>
            
            <Button 
              type="button" 
              variant="secondary" 
              size="sm" 
              onClick={() => {
                // Add EMI payments
                const newSpending = { ...spending };
                newSpending.online.bills.push({ name: 'Home Loan EMI', amount: 15000, category: 'EMI Payments', subcategories: [] });
                newSpending.online.bills.push({ name: 'Car Loan EMI', amount: 8000, category: 'EMI Payments', subcategories: [] });
                setSpending(updateSpendingTotals(newSpending));
              }}
              className="flex items-center gap-2"
            >
              <Landmark className="h-4 w-4" />
              <span>Add EMI Payments</span>
            </Button>
            
            <Button 
              type="button" 
              variant="secondary" 
              size="sm" 
              onClick={() => {
                // Add daily expenses
                const newSpending = { ...spending };
                
                // Shopping
                newSpending.offline.merchants.push({ 
                  name: 'Department Store', 
                  amount: 3000, 
                  category: 'Shopping',
                  brand: undefined,
                  subcategories: []
                });
