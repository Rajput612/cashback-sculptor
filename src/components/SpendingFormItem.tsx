
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MinusCircle, IndianRupee, ChevronDown, ChevronRight, PlusCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SpendingItem as SpendingItemType } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

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
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    item.category ? [item.category] : []
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    item.brand ? [item.brand] : []
  );
  const [selectedSubApps, setSelectedSubApps] = useState<string[]>(
    item.subApp ? [item.subApp] : []
  );

  const isOnline = type === 'online';
  
  const handleCategorySelect = (category: string) => {
    if (onCategoryChange) {
      if (category) {
        setSelectedCategories([...selectedCategories, category]);
        onCategoryChange(category);
      }
    }
  };
  
  const handleBrandSelect = (brand: string) => {
    if (onBrandChange) {
      if (brand) {
        setSelectedBrands([...selectedBrands, brand]);
        onBrandChange(brand);
      }
    }
  };
  
  const handleSubAppSelect = (subApp: string) => {
    if (onSubAppChange) {
      if (subApp) {
        setSelectedSubApps([...selectedSubApps, subApp]);
        onSubAppChange(subApp);
      }
    }
  };
  
  const removeCategory = (category: string) => {
    setSelectedCategories(selectedCategories.filter(c => c !== category));
  };
  
  const removeBrand = (brand: string) => {
    setSelectedBrands(selectedBrands.filter(b => b !== brand));
  };
  
  const removeSubApp = (subApp: string) => {
    setSelectedSubApps(selectedSubApps.filter(s => s !== subApp));
  };
  
  const renderDetailsContent = () => {
    if (isOnline) {
      return (
        <div className="space-y-3 pl-2 md:pl-4 pt-1 animate-slide-down">
          {/* Sub Apps Selection */}
          {item.app && options.subApps[item.app]?.length > 0 && onSubAppChange && (
            <div className="space-y-2">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                <p className="text-sm text-muted-foreground w-full md:w-24">Sub App:</p>
                <div className="flex-1 flex flex-col">
                  <Select onValueChange={handleSubAppSelect}>
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
                  
                  {/* Display selected sub apps as badges */}
                  {selectedSubApps.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedSubApps.map(subApp => (
                        <Badge key={subApp} variant="secondary" className="flex items-center gap-1">
                          {subApp}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 p-0 hover:bg-transparent"
                            onClick={() => removeSubApp(subApp)}
                          >
                            <MinusCircle className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Categories Selection */}
          {onCategoryChange && (
            <div className="space-y-2">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                <p className="text-sm text-muted-foreground w-full md:w-24">Category:</p>
                <div className="flex-1 flex flex-col">
                  <Select onValueChange={handleCategorySelect}>
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
                  
                  {/* Display selected categories as badges */}
                  {selectedCategories.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedCategories.map(category => (
                        <Badge key={category} variant="secondary" className="flex items-center gap-1">
                          {category}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 p-0 hover:bg-transparent"
                            onClick={() => removeCategory(category)}
                          >
                            <MinusCircle className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Brands Selection */}
          {selectedCategories.length > 0 && onBrandChange && (
            <div className="space-y-2">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                <p className="text-sm text-muted-foreground w-full md:w-24">Brand:</p>
                <div className="flex-1 flex flex-col">
                  <Select onValueChange={handleBrandSelect}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedCategories
                        .flatMap(category => options.brands[category] || [])
                        .filter((brand, index, self) => self.indexOf(brand) === index) // Remove duplicates
                        .map((brand) => (
                          <SelectItem key={brand} value={brand}>
                            {brand}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  
                  {/* Display selected brands as badges */}
                  {selectedBrands.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedBrands.map(brand => (
                        <Badge key={brand} variant="secondary" className="flex items-center gap-1">
                          {brand}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 p-0 hover:bg-transparent"
                            onClick={() => removeBrand(brand)}
                          >
                            <MinusCircle className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      );
    } else {
      // Offline spending
      return (
        <div className="space-y-3 pl-2 md:pl-4 pt-1 animate-slide-down">
          {/* Categories Selection */}
          {onCategoryChange && (
            <div className="space-y-2">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                <p className="text-sm text-muted-foreground w-full md:w-24">Category:</p>
                <div className="flex-1 flex flex-col">
                  <Select onValueChange={handleCategorySelect}>
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
                  
                  {/* Display selected categories as badges */}
                  {selectedCategories.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedCategories.map(category => (
                        <Badge key={category} variant="secondary" className="flex items-center gap-1">
                          {category}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 p-0 hover:bg-transparent"
                            onClick={() => removeCategory(category)}
                          >
                            <MinusCircle className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Brands Selection */}
          {selectedCategories.length > 0 && onBrandChange && (
            <div className="space-y-2">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                <p className="text-sm text-muted-foreground w-full md:w-24">Brand:</p>
                <div className="flex-1 flex flex-col">
                  <Select onValueChange={handleBrandSelect}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedCategories
                        .flatMap(category => options.brands[category] || [])
                        .filter((brand, index, self) => self.indexOf(brand) === index) // Remove duplicates
                        .map((brand) => (
                          <SelectItem key={brand} value={brand}>
                            {brand}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  
                  {/* Display selected brands as badges */}
                  {selectedBrands.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedBrands.map(brand => (
                        <Badge key={brand} variant="secondary" className="flex items-center gap-1">
                          {brand}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 p-0 hover:bg-transparent"
                            onClick={() => removeBrand(brand)}
                          >
                            <MinusCircle className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
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
