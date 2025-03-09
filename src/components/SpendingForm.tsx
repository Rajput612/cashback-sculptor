
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle, MinusCircle, DollarSign, ShoppingCart, CreditCard } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Spending, initializeEmptySpending, updateSpendingTotals } from '@/lib/calculations';

interface SpendingFormProps {
  className?: string;
  onSubmit: (spending: Spending) => void;
}

interface SpendingItemProps {
  name: string;
  amount: number;
  onNameChange: (value: string) => void;
  onAmountChange: (value: number) => void;
  onRemove: () => void;
}

const SpendingItem: React.FC<SpendingItemProps> = ({ 
  name, 
  amount, 
  onNameChange, 
  onAmountChange, 
  onRemove 
}) => {
  return (
    <div className="flex items-center gap-3 animate-scale-in">
      <Input
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="Name (e.g. Amazon, Groceries)"
        className="flex-1"
      />
      <div className="relative">
        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
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
  );
};

const SpendingForm: React.FC<SpendingFormProps> = ({ className, onSubmit }) => {
  const [spending, setSpending] = useState<Spending>(initializeEmptySpending());
  const [activeTab, setActiveTab] = useState('online');
  const [activeSubTab, setActiveSubTab] = useState('merchants');

  const addItem = (type: 'online' | 'offline', category: 'merchants' | 'categories' | 'brands') => {
    const newSpending = { ...spending };
    newSpending[type][category].push({ name: '', amount: 0 });
    setSpending(newSpending);
  };

  const updateItem = (
    type: 'online' | 'offline',
    category: 'merchants' | 'categories' | 'brands',
    index: number,
    field: 'name' | 'amount',
    value: string | number
  ) => {
    const newSpending = { ...spending };
    newSpending[type][category][index][field] = value;
    setSpending(updateSpendingTotals(newSpending));
  };

  const removeItem = (
    type: 'online' | 'offline',
    category: 'merchants' | 'categories' | 'brands',
    index: number
  ) => {
    const newSpending = { ...spending };
    newSpending[type][category].splice(index, 1);
    setSpending(updateSpendingTotals(newSpending));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(spending);
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
                <TabsTrigger value="merchants">Merchants</TabsTrigger>
                <TabsTrigger value="categories">Categories</TabsTrigger>
                <TabsTrigger value="brands">Brands</TabsTrigger>
              </TabsList>

              <TabsContent value="merchants" className="mt-4 space-y-4">
                <div className="space-y-3 stagger-animation">
                  {spending.online.merchants.map((item, index) => (
                    <SpendingItem
                      key={`online-merchant-${index}`}
                      name={item.name}
                      amount={item.amount}
                      onNameChange={(value) => updateItem('online', 'merchants', index, 'name', value)}
                      onAmountChange={(value) => updateItem('online', 'merchants', index, 'amount', value)}
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
                  <span>Add Merchant</span>
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

              <TabsContent value="brands" className="mt-4 space-y-4">
                <div className="space-y-3 stagger-animation">
                  {spending.online.brands.map((item, index) => (
                    <SpendingItem
                      key={`online-brand-${index}`}
                      name={item.name}
                      amount={item.amount}
                      onNameChange={(value) => updateItem('online', 'brands', index, 'name', value)}
                      onAmountChange={(value) => updateItem('online', 'brands', index, 'amount', value)}
                      onRemove={() => removeItem('online', 'brands', index)}
                    />
                  ))}
                </div>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => addItem('online', 'brands')}
                  className="flex items-center gap-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Add Brand</span>
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
                <TabsTrigger value="merchants">Merchants</TabsTrigger>
                <TabsTrigger value="categories">Categories</TabsTrigger>
                <TabsTrigger value="brands">Brands</TabsTrigger>
              </TabsList>

              <TabsContent value="merchants" className="mt-4 space-y-4">
                <div className="space-y-3 stagger-animation">
                  {spending.offline.merchants.map((item, index) => (
                    <SpendingItem
                      key={`offline-merchant-${index}`}
                      name={item.name}
                      amount={item.amount}
                      onNameChange={(value) => updateItem('offline', 'merchants', index, 'name', value)}
                      onAmountChange={(value) => updateItem('offline', 'merchants', index, 'amount', value)}
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
                  <span>Add Merchant</span>
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

              <TabsContent value="brands" className="mt-4 space-y-4">
                <div className="space-y-3 stagger-animation">
                  {spending.offline.brands.map((item, index) => (
                    <SpendingItem
                      key={`offline-brand-${index}`}
                      name={item.name}
                      amount={item.amount}
                      onNameChange={(value) => updateItem('offline', 'brands', index, 'name', value)}
                      onAmountChange={(value) => updateItem('offline', 'brands', index, 'amount', value)}
                      onRemove={() => removeItem('offline', 'brands', index)}
                    />
                  ))}
                </div>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => addItem('offline', 'brands')}
                  className="flex items-center gap-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Add Brand</span>
                </Button>
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>

      <div className="flex items-center justify-between px-4 py-3 bg-muted/40 rounded-lg">
        <div className="text-sm text-muted-foreground">Total Spending</div>
        <div className="font-medium">${spending.total.toLocaleString()}</div>
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
