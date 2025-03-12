
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MinusCircle, IndianRupee, ChevronDown, ChevronRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SpendingItem as SpendingItemType } from '@/lib/types';

interface SpendingFormItemProps {
  item: SpendingItemType;
  onNameChange: (value: string) => void;
  onAmountChange: (value: number) => void;
  onCategoryChange?: (value: string) => void;
  onBrandChange?: (value: string) => void;
  onAppChange?: (value: string) => void;
  onSubAppChange?: (value: string) => void;
  onMerchantChange?: (value: string) => void;
  onRemove: () => void;
  type: 'online' | 'offline';
  index: number;
  options: {
    apps: string[];
    subApps: Record<string, string[]>;
    categories: Record<string, string[]>;
    brands: Record<string, string[]>;
    merchants: string[];
  };
}

const SpendingFormItem: React.FC<SpendingFormItemProps> = ({
  item,
  onNameChange,
  onAmountChange,
  onCategoryChange,
  onBrandChange,
  onAppChange,
  onSubAppChange,
  onMerchantChange,
  onRemove,
  type,
  index,
  options
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const isOnline = type === 'online';
  
  const renderDetailsContent = () => {
    if (isOnline) {
      return (
        <div className="space-y-3 pl-2 md:pl-4 pt-1 animate-slide-down">
          {item.app && options.subApps[item.app]?.length > 0 && onSubAppChange && (
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
              <p className="text-sm text-muted-foreground w-full md:w-24">Sub App:</p>
              <Select value={item.subApp} onValueChange={onSubAppChange}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select sub app" />
                </SelectTrigger>
                <SelectContent>
                  {options.subApps[item.app].map((subApp) => (
                    <SelectItem key={subApp} value={subApp}>
                      {subApp}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {onCategoryChange && (
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
              <p className="text-sm text-muted-foreground w-full md:w-24">Category:</p>
              <Select value={item.category} onValueChange={onCategoryChange}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {(item.app ? 
                    options.categories[item.app] || [] : 
                    Object.values(options.categories).flat()
                  ).map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {item.category && options.brands[item.category]?.length > 0 && onBrandChange && (
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
              <p className="text-sm text-muted-foreground w-full md:w-24">Brand:</p>
              <Select value={item.brand} onValueChange={onBrandChange}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent>
                  {options.brands[item.category].map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      );
    } else {
      // Offline spending
      return (
        <div className="space-y-3 pl-2 md:pl-4 pt-1 animate-slide-down">
          {onCategoryChange && (
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
              <p className="text-sm text-muted-foreground w-full md:w-24">Category:</p>
              <Select value={item.category} onValueChange={onCategoryChange}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(options.categories).flat().map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {item.category && options.brands[item.category]?.length > 0 && onBrandChange && (
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
              <p className="text-sm text-muted-foreground w-full md:w-24">Brand:</p>
              <Select value={item.brand} onValueChange={onBrandChange}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent>
                  {options.brands[item.category].map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col gap-3 animate-scale-in bg-card/50 p-3 rounded-lg border border-transparent hover:border-muted-foreground/10">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
        {isOnline ? (
          <Select value={item.name} onValueChange={(value) => {
            onNameChange(value);
            // Also set the app value to be the same if it exists
            if (onAppChange) {
              onAppChange(value);
            }
          }}>
            <SelectTrigger className="flex-1 w-full">
              <SelectValue placeholder={`Select App/Website (e.g. Amazon, Netflix)`} />
            </SelectTrigger>
            <SelectContent>
              {options.apps.map((app) => (
                <SelectItem key={app} value={app}>
                  {app}
                </SelectItem>
              ))}
              <SelectItem value="other">Other (Custom)</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <Select value={item.name} onValueChange={(value) => {
            onNameChange(value);
            // Also set the merchant value to be the same if it exists
            if (onMerchantChange) {
              onMerchantChange(value);
            }
          }}>
            <SelectTrigger className="flex-1 w-full">
              <SelectValue placeholder={`Select Store/Shop (e.g. Local Store, Restaurant)`} />
            </SelectTrigger>
            <SelectContent>
              {options.merchants.map((merchant) => (
                <SelectItem key={merchant} value={merchant}>
                  {merchant}
                </SelectItem>
              ))}
              <SelectItem value="other">Other (Custom)</SelectItem>
            </SelectContent>
          </Select>
        )}
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:flex-initial">
            <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="number"
              value={item.amount === 0 ? '' : item.amount}
              onChange={(e) => onAmountChange(Number(e.target.value))}
              placeholder="Amount"
              className="pl-8 w-full md:w-32"
            />
          </div>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="px-2"
          >
            {showDetails ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
          
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
      </div>
      
      {showDetails && renderDetailsContent()}
    </div>
  );
};

export default SpendingFormItem;
