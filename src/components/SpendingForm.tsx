
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
  Smartphone
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Spending, 
  SpendingItem as SpendingItemType,
  initializeEmptySpending, 
  updateSpendingTotals 
} from '@/lib/calculations';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  onNameChange: (value: string) => void;
  onAmountChange: (value: number) => void;
  onCategoryChange?: (value: string) => void;
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

const SpendingItem: React.FC<SpendingItemProps> = ({ 
  name, 
  amount, 
  category,
  brand,
  app,
  onNameChange, 
  onAmountChange,
  onCategoryChange,
  onBrandChange,
  onAppChange,
  onRemove,
  showCategory = false,
  showBrand = false,
  showApp = false,
  categoryOptions = [],
  brandOptions = [],
  appOptions = []
}) => {
  return (
    <div className="flex flex-col gap-3 animate-scale-in">
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
      
      {showCategory && onCategoryChange && (
        <div className="flex items-center gap-3 pl-4">
          <Select value={category} onValueChange={onCategoryChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      {showApp && onAppChange && (
        <div className="flex items-center gap-3 pl-4">
          <Select value={app} onValueChange={onAppChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select app/platform" />
            </SelectTrigger>
            <SelectContent>
              {appOptions.map((a) => (
                <SelectItem key={a} value={a}>
                  {a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      {showBrand && onBrandChange && (
        <div className="flex items-center gap-3 pl-8">
          <Select value={brand} onValueChange={onBrandChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select brand" />
            </SelectTrigger>
            <SelectContent>
              {brandOptions.map((b) => (
                <SelectItem key={b} value={b}>
                  {b}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

const SpendingForm: React.FC<SpendingFormProps> = ({ className, onSubmit }) => {
  const [spending, setSpending] = useState<Spending>(initializeEmptySpending());
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

  const addItem = (type: 'online' | 'offline', subType: 'merchants' | 'categories' | 'bills') => {
    const newSpending = { ...spending };
    newSpending[type][subType].push({ 
      name: '', 
      amount: 0,
      category: subType === 'merchants' ? commonCategories[0] : undefined,
      brand: undefined,
      app: undefined
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
    newSpending[type][subType][index][field] = value;
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
      app: 'Amazon'
    });
    
    newSpending.online.merchants.push({ 
      name: 'Swiggy Food', 
      amount: 3000, 
      category: 'Dining',
      brand: undefined,
      app: 'Swiggy'
    });
    
    newSpending.online.merchants.push({ 
      name: 'Zepto Groceries', 
      amount: 2000, 
      category: 'Groceries',
      brand: undefined,
      app: 'Zepto'
    });
    
    newSpending.online.merchants.push({ 
      name: 'Zomato Food', 
      amount: 2500, 
      category: 'Dining',
      brand: undefined,
      app: 'Zomato'
    });
    
    setSpending(updateSpendingTotals(newSpending));
  };

  const addCommonExpenses = () => {
    const newSpending = { ...spending };
    
    // Add rent
    newSpending.offline.bills.push({ name: 'Rent', amount: 20000, category: 'Housing' });
    
    // Add common bills
    newSpending.online.bills.push({ name: 'Electricity Bill', amount: 2000, category: 'Utilities' });
    newSpending.online.bills.push({ name: 'Mobile Recharge', amount: 500, category: 'Utilities' });
    newSpending.online.bills.push({ name: 'Internet Bill', amount: 1000, category: 'Utilities' });
    
    // Add common shopping
    newSpending.online.merchants.push({ 
      name: 'Amazon', 
      amount: 5000, 
      category: 'Shopping',
      brand: 'Amazon',
      app: 'Amazon'
    });
    
    // Add groceries
    newSpending.offline.merchants.push({ 
      name: 'Grocery Store', 
      amount: 8000, 
      category: 'Groceries' 
    });
    
    // Add dining
    newSpending.online.merchants.push({ 
      name: 'Zomato', 
      amount: 3000, 
      category: 'Dining',
      brand: undefined,
      app: 'Zomato'
    });
    
    setSpending(updateSpendingTotals(newSpending));
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
                <div className="space-y-3 stagger-animation">
                  {spending.online.merchants.map((item, index) => (
                    <SpendingItem
                      key={`online-merchant-${index}`}
                      name={item.name}
                      amount={item.amount}
                      category={item.category}
                      brand={item.brand}
                      app={item.app}
                      onNameChange={(value) => updateItem('online', 'merchants', index, 'name', value)}
                      onAmountChange={(value) => updateItem('online', 'merchants', index, 'amount', value)}
                      onCategoryChange={(value) => updateItem('online', 'merchants', index, 'category', value)}
                      onBrandChange={(value) => updateItem('online', 'merchants', index, 'brand', value)}
                      onAppChange={(value) => updateItem('online', 'merchants', index, 'app', value)}
                      onRemove={() => removeItem('online', 'merchants', index)}
                      showCategory={true}
                      categoryOptions={commonCategories}
                      showApp={!!item.category && appsByCategory[item.category]?.length > 0}
                      appOptions={item.category ? appsByCategory[item.category] || [] : []}
                      showBrand={!!item.category && brandsByCategory[item.category]?.length > 0}
                      brandOptions={item.category ? brandsByCategory[item.category] || [] : []}
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
                <div className="space-y-3 stagger-animation">
                  {spending.online.categories.map((item, index) => (
                    <SpendingItem
                      key={`online-category-${index}`}
                      name={item.name}
                      amount={item.amount}
                      onNameChange={(value) => updateItem('online', 'categories', index, 'name', value)}
                      onAmountChange={(value) => updateItem('online', 'categories', index, 'amount', value)}
                      onRemove={() => removeItem('online', 'categories', index)}
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
                <div className="space-y-3 stagger-animation">
                  {spending.online.bills.map((item, index) => (
                    <SpendingItem
                      key={`online-bill-${index}`}
                      name={item.name}
                      amount={item.amount}
                      onNameChange={(value) => updateItem('online', 'bills', index, 'name', value)}
                      onAmountChange={(value) => updateItem('online', 'bills', index, 'amount', value)}
                      onRemove={() => removeItem('online', 'bills', index)}
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
                <div className="space-y-3 stagger-animation">
                  {spending.offline.merchants.map((item, index) => (
                    <SpendingItem
                      key={`offline-merchant-${index}`}
                      name={item.name}
                      amount={item.amount}
                      category={item.category}
                      brand={item.brand}
                      onNameChange={(value) => updateItem('offline', 'merchants', index, 'name', value)}
                      onAmountChange={(value) => updateItem('offline', 'merchants', index, 'amount', value)}
                      onCategoryChange={(value) => updateItem('offline', 'merchants', index, 'category', value)}
                      onBrandChange={(value) => updateItem('offline', 'merchants', index, 'brand', value)}
                      onRemove={() => removeItem('offline', 'merchants', index)}
                      showCategory={true}
                      categoryOptions={commonCategories}
                      showBrand={!!item.category}
                      brandOptions={item.category ? brandsByCategory[item.category] || [] : []}
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
                <div className="space-y-3 stagger-animation">
                  {spending.offline.categories.map((item, index) => (
                    <SpendingItem
                      key={`offline-category-${index}`}
                      name={item.name}
                      amount={item.amount}
                      onNameChange={(value) => updateItem('offline', 'categories', index, 'name', value)}
                      onAmountChange={(value) => updateItem('offline', 'categories', index, 'amount', value)}
                      onRemove={() => removeItem('offline', 'categories', index)}
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
                <div className="space-y-3 stagger-animation">
                  {spending.offline.bills.map((item, index) => (
                    <SpendingItem
                      key={`offline-bill-${index}`}
                      name={item.name}
                      amount={item.amount}
                      onNameChange={(value) => updateItem('offline', 'bills', index, 'name', value)}
                      onAmountChange={(value) => updateItem('offline', 'bills', index, 'amount', value)}
                      onRemove={() => removeItem('offline', 'bills', index)}
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

      {/* Quick Add Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
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
            newSpending.offline.bills.push({ name: 'School/College Fees', amount: 25000, category: 'Education' });
            newSpending.online.merchants.push({ 
              name: 'BYJU\'S', 
              amount: 2000, 
              category: 'Education',
              brand: 'BYJU\'S',
              app: 'BYJU\'S'
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
            newSpending.online.bills.push({ name: 'Water Bill', amount: 500, category: 'Utilities' });
            newSpending.online.bills.push({ name: 'Gas Bill', amount: 800, category: 'Utilities' });
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
            newSpending.online.bills.push({ name: 'Home Loan EMI', amount: 15000, category: 'EMI Payments' });
            newSpending.online.bills.push({ name: 'Car Loan EMI', amount: 8000, category: 'EMI Payments' });
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
              brand: undefined
            });
            
            // Fuel
            newSpending.offline.merchants.push({ 
              name: 'Petrol Pump', 
              amount: 4000, 
              category: 'Fuel',
              brand: 'HPCL'
            });
            
            // Dining
            newSpending.offline.merchants.push({ 
              name: 'Restaurants', 
              amount: 2500, 
              category: 'Dining',
              brand: undefined
            });
            
            setSpending(updateSpendingTotals(newSpending));
          }}
          className="flex items-center gap-2"
        >
          <Car className="h-4 w-4" />
          <span>Add Daily Expenses</span>
        </Button>
      </div>

      <div className="flex items-center justify-between px-4 py-3 bg-muted/40 rounded-lg">
        <div className="text-sm text-muted-foreground">Total Monthly Spending</div>
        <div className="font-medium">₹{spending.total.toLocaleString()}</div>
      </div>

      <div className="pt-4">
        <Button 
          type="submit" 
          className="w-full"
          disabled={spending.total === 0}
        >
          Find Best Credit Cards
        </Button>
      </div>
    </form>
  );
};

export default SpendingForm;
