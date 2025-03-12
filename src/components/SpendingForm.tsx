
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
import SpendingFormItem from './SpendingFormItem';

interface SpendingFormProps {
  className?: string;
  onSubmit: (spending: Spending) => void;
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

  // Popular Indian apps 
  const popularApps = [
    'Amazon', 'Flipkart', 'Myntra', 'Swiggy', 'Zomato', 'BigBasket',
    'Grofers', 'Paytm', 'PhonePe', 'Google Pay', 'BookMyShow',
    'MakeMyTrip', 'Goibibo', 'Ola', 'Uber', 'Netflix', 'Hotstar',
    'BYJU\'S', 'Unacademy', 'PharmEasy', '1mg', 'Zerodha'
  ];

  // Popular merchants for offline
  const popularMerchants = [
    'Local Grocery Store', 'Supermarket', 'Restaurant', 'Petrol Pump', 
    'Movie Theater', 'Shopping Mall', 'Salon', 'Hospital', 'Pharmacy',
    'School/College', 'Gym', 'Clothing Store', 'Electronics Store'
  ];

  // Sub apps for master payment apps
  const subApps: Record<string, string[]> = {
    'Paytm': ['Paytm Mall', 'Paytm Movies', 'Bill Payments', 'Travel', 'Games', 'Food'],
    'PhonePe': ['Bill Payments', 'Travel', 'Food', 'Groceries', 'Entertainment'],
    'Google Pay': ['Bill Payments', 'Restaurants', 'Online Shopping'],
    'Amazon': ['Amazon Fresh', 'Amazon Prime', 'Amazon Fashion', 'Amazon Devices', 'Grocery', 'Electronics']
  };

  // Categories by app
  const categoriesByApp: Record<string, string[]> = {
    'Amazon': ['Electronics', 'Clothing', 'Books', 'Home', 'Grocery', 'Beauty', 'Toys'],
    'Flipkart': ['Electronics', 'Clothing', 'Home Appliances', 'Furniture', 'Beauty', 'Books'],
    'Myntra': ['Clothing', 'Footwear', 'Accessories', 'Beauty', 'Home'],
    'Swiggy': ['Food Delivery', 'Groceries', 'Meat', 'Medicine'],
    'Zomato': ['Food Delivery', 'Dining Out', 'Groceries'],
    'BigBasket': ['Groceries', 'Fresh Produce', 'Household'],
    'Paytm': ['Entertainment', 'Travel', 'Utilities', 'Financial Services'],
    'PhonePe': ['Utilities', 'Travel', 'Entertainment', 'Insurance'],
    'MakeMyTrip': ['Flights', 'Hotels', 'Holidays', 'Bus', 'Cabs'],
    'Ola': ['Ride', 'Food Delivery', 'Financial Services'],
    'Uber': ['Ride', 'Food Delivery', 'Rental']
  };

  // Popular Indian brands by category
  const brandsByCategory: Record<string, string[]> = {
    'Electronics': ['Samsung', 'Apple', 'Mi', 'OnePlus', 'Boat', 'LG', 'Sony', 'Philips', 'HP', 'Dell'],
    'Clothing': ['Myntra', 'H&M', 'Zara', 'Allen Solly', 'Van Heusen', 'Peter England', 'Louis Philippe'],
    'Footwear': ['Nike', 'Adidas', 'Puma', 'Sparx', 'Bata', 'Woodland', 'Red Tape'],
    'Groceries': ['Tata', 'Reliance', 'ITC', 'Amul', 'Patanjali', 'Nestle', 'Britannia'],
    'Entertainment': ['PVR', 'INOX', 'Netflix', 'Amazon Prime', 'Hotstar', 'JioSaavn', 'Gaana'],
    'Fuel': ['IOCL', 'BPCL', 'HPCL', 'Reliance Petroleum', 'Shell'],
    'Travel': ['MakeMyTrip', 'Goibibo', 'Yatra', 'IRCTC', 'Cleartrip', 'Ola', 'Uber'],
    'Shopping': ['Myntra', 'Flipkart', 'Amazon', 'Ajio', 'Nykaa', 'Tata Cliq'],
    'Dining': ['McDonald\'s', 'Domino\'s', 'KFC', 'Pizza Hut', 'Haldiram\'s', 'Burger King'],
    'Healthcare': ['Apollo', 'Practo', 'PharmEasy', '1mg', 'Netmeds'],
    'Education': ['BYJU\'S', 'Unacademy', 'Vedantu', 'upGrad', 'Coursera', 'Udemy']
  };

  const options = {
    apps: popularApps,
    subApps: subApps,
    categories: categoriesByApp,
    brands: brandsByCategory,
    merchants: popularMerchants
  };

  const addItem = (type: 'online' | 'offline', subType: 'merchants' | 'categories' | 'bills') => {
    const newSpending = { ...spending };
    newSpending[type][subType].push({ 
      name: '', 
      amount: 0
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
    
    // Type assertion to any because we're dynamically setting fields
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
      app: 'Amazon'
    });
    
    newSpending.online.merchants.push({ 
      name: 'Swiggy Food', 
      amount: 3000, 
      category: 'Dining',
      app: 'Swiggy'
    });
    
    newSpending.online.merchants.push({ 
      name: 'Zepto Groceries', 
      amount: 2000, 
      category: 'Groceries',
      app: 'BigBasket'
    });
    
    newSpending.online.merchants.push({ 
      name: 'Zomato Food', 
      amount: 2500, 
      category: 'Dining',
      app: 'Zomato'
    });
    
    setSpending(updateSpendingTotals(newSpending));
    toast.success("Added popular apps to your spending");
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
      category: 'Groceries',
      merchant: 'Local Grocery Store'
    });
    
    // Add dining
    newSpending.online.merchants.push({ 
      name: 'Zomato', 
      amount: 3000, 
      category: 'Dining',
      app: 'Zomato'
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
                    <SpendingFormItem
                      key={`online-merchant-${index}`}
                      item={item}
                      type="online"
                      index={index}
                      options={options}
                      onNameChange={(value) => updateItem('online', 'merchants', index, 'name', value)}
                      onAmountChange={(value) => updateItem('online', 'merchants', index, 'amount', value)}
                      onAppChange={(value) => updateItem('online', 'merchants', index, 'app', value)}
                      onSubAppChange={(value) => updateItem('online', 'merchants', index, 'subApp', value)}
                      onCategoryChange={(value) => updateItem('online', 'merchants', index, 'category', value)}
                      onBrandChange={(value) => updateItem('online', 'merchants', index, 'brand', value)}
                      onRemove={() => removeItem('online', 'merchants', index)}
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
                    <div key={`online-category-${index}`} className="flex flex-col gap-3 animate-scale-in bg-card/50 p-3 rounded-lg border border-transparent hover:border-muted-foreground/10">
                      <div className="flex items-center gap-3">
                        <Input
                          value={item.name}
                          onChange={(e) => updateItem('online', 'categories', index, 'name', e.target.value)}
                          placeholder="Category name"
                          className="flex-1"
                        />
                        <div className="relative">
                          <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input
                            type="number"
                            value={item.amount === 0 ? '' : item.amount}
                            onChange={(e) => updateItem('online', 'categories', index, 'amount', Number(e.target.value))}
                            placeholder="Amount"
                            className="pl-8 w-32"
                          />
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeItem('online', 'categories', index)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <MinusCircle className="h-5 w-5" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                    </div>
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
                    <div key={`online-bill-${index}`} className="flex flex-col gap-3 animate-scale-in bg-card/50 p-3 rounded-lg border border-transparent hover:border-muted-foreground/10">
                      <div className="flex items-center gap-3">
                        <Input
                          value={item.name}
                          onChange={(e) => updateItem('online', 'bills', index, 'name', e.target.value)}
                          placeholder="Bill name"
                          className="flex-1"
                        />
                        <div className="relative">
                          <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input
                            type="number"
                            value={item.amount === 0 ? '' : item.amount}
                            onChange={(e) => updateItem('online', 'bills', index, 'amount', Number(e.target.value))}
                            placeholder="Amount"
                            className="pl-8 w-32"
                          />
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeItem('online', 'bills', index)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <MinusCircle className="h-5 w-5" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                    </div>
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
                    <SpendingFormItem
                      key={`offline-merchant-${index}`}
                      item={item}
                      type="offline"
                      index={index}
                      options={options}
                      onNameChange={(value) => updateItem('offline', 'merchants', index, 'name', value)}
                      onAmountChange={(value) => updateItem('offline', 'merchants', index, 'amount', value)}
                      onMerchantChange={(value) => updateItem('offline', 'merchants', index, 'merchant', value)}
                      onCategoryChange={(value) => updateItem('offline', 'merchants', index, 'category', value)}
                      onBrandChange={(value) => updateItem('offline', 'merchants', index, 'brand', value)}
                      onRemove={() => removeItem('offline', 'merchants', index)}
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
                    <div key={`offline-category-${index}`} className="flex flex-col gap-3 animate-scale-in bg-card/50 p-3 rounded-lg border border-transparent hover:border-muted-foreground/10">
                      <div className="flex items-center gap-3">
                        <Input
                          value={item.name}
                          onChange={(e) => updateItem('offline', 'categories', index, 'name', e.target.value)}
                          placeholder="Category name"
                          className="flex-1"
                        />
                        <div className="relative">
                          <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input
                            type="number"
                            value={item.amount === 0 ? '' : item.amount}
                            onChange={(e) => updateItem('offline', 'categories', index, 'amount', Number(e.target.value))}
                            placeholder="Amount"
                            className="pl-8 w-32"
                          />
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeItem('offline', 'categories', index)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <MinusCircle className="h-5 w-5" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                    </div>
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
                    <div key={`offline-bill-${index}`} className="flex flex-col gap-3 animate-scale-in bg-card/50 p-3 rounded-lg border border-transparent hover:border-muted-foreground/10">
                      <div className="flex items-center gap-3">
                        <Input
                          value={item.name}
                          onChange={(e) => updateItem('offline', 'bills', index, 'name', e.target.value)}
                          placeholder="Bill name"
                          className="flex-1"
                        />
                        <div className="relative">
                          <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input
                            type="number"
                            value={item.amount === 0 ? '' : item.amount}
                            onChange={(e) => updateItem('offline', 'bills', index, 'amount', Number(e.target.value))}
                            placeholder="Amount"
                            className="pl-8 w-32"
                          />
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeItem('offline', 'bills', index)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <MinusCircle className="h-5 w-5" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                    </div>
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
                  merchant: 'Shopping Mall'
                });
                
                // Fuel
                newSpending.offline.merchants.push({ 
                  name: 'Petrol Pump', 
                  amount: 4000, 
                  category: 'Fuel',
                  brand: 'HPCL',
                  merchant: 'Petrol Pump'
                });
                
                // Dining
                newSpending.offline.merchants.push({ 
                  name: 'Restaurants', 
                  amount: 2500, 
                  category: 'Dining',
                  merchant: 'Restaurant'
                });
                
                setSpending(updateSpendingTotals(newSpending));
              }}
              className="flex items-center gap-2"
            >
              <Car className="h-4 w-4" />
              <span>Add Daily Expenses</span>
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>

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
