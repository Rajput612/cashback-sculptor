
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MinusCircle, IndianRupee, ChevronDown, ChevronRight, PlusCircle, ChevronsRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SpendingItem as SpendingItemType } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface SpendingFormItemProps {
  item: SpendingItemType;
  onNameChange: (value: string) => void;
  onAmountChange: (value: number) => void;
  onCategoryChange?: (value: string) => void;
  onBrandChange?: (value: string) => void;
  onAppChange?: (value: string) => void;
  onSubAppChange?: (value: string) => void;
  onMerchantChange?: (value: string) => void;
  onSubcategoryChange?: (subcategories: { level: string; value: string; amount: number }[]) => void;
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
  onSubcategoryChange,
  onRemove,
  type,
  index,
  options
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<{value: string, amount: number}[]>(
    item.category ? [{value: item.category, amount: 0}] : []
  );
  const [selectedBrands, setSelectedBrands] = useState<{value: string, amount: number}[]>(
    item.brand ? [{value: item.brand, amount: 0}] : []
  );
  const [selectedSubApps, setSelectedSubApps] = useState<{value: string, amount: number}[]>(
    item.subApp ? [{value: item.subApp, amount: 0}] : []
  );
  
  // State for hierarchical spending
  const [subcategories, setSubcategories] = useState<{level: string, value: string, amount: number}[]>(
    item.subcategories || []
  );

  const isOnline = type === 'online';
  
  const handleCategorySelect = (category: string) => {
    if (onCategoryChange) {
      if (category) {
        const newCategory = {value: category, amount: 0};
        setSelectedCategories([...selectedCategories, newCategory]);
        onCategoryChange(category);
        
        // Also update subcategories if onSubcategoryChange is provided
        if (onSubcategoryChange) {
          const newSubcategories = [...subcategories, {
            level: 'category',
            value: category,
            amount: 0
          }];
          setSubcategories(newSubcategories);
          onSubcategoryChange(newSubcategories);
        }
      }
    }
  };
  
  const handleBrandSelect = (brand: string) => {
    if (onBrandChange) {
      if (brand) {
        const newBrand = {value: brand, amount: 0};
        setSelectedBrands([...selectedBrands, newBrand]);
        onBrandChange(brand);
        
        // Also update subcategories if onSubcategoryChange is provided
        if (onSubcategoryChange) {
          const newSubcategories = [...subcategories, {
            level: 'brand',
            value: brand,
            amount: 0
          }];
          setSubcategories(newSubcategories);
          onSubcategoryChange(newSubcategories);
        }
      }
    }
  };
  
  const handleSubAppSelect = (subApp: string) => {
    if (onSubAppChange) {
      if (subApp) {
        const newSubApp = {value: subApp, amount: 0};
        setSelectedSubApps([...selectedSubApps, newSubApp]);
        onSubAppChange(subApp);
        
        // Also update subcategories if onSubcategoryChange is provided
        if (onSubcategoryChange) {
          const newSubcategories = [...subcategories, {
            level: 'subApp',
            value: subApp,
            amount: 0
          }];
          setSubcategories(newSubcategories);
          onSubcategoryChange(newSubcategories);
        }
      }
    }
  };
  
  const updateSubcategoryAmount = (level: string, value: string, amount: number) => {
    const newSubcategories = subcategories.map(sc => 
      sc.level === level && sc.value === value 
        ? { ...sc, amount } 
        : sc
    );
    setSubcategories(newSubcategories);
    if (onSubcategoryChange) {
      onSubcategoryChange(newSubcategories);
    }
    
    // Also update local state arrays for correct UI rendering
    if (level === 'category') {
      setSelectedCategories(selectedCategories.map(cat => 
        cat.value === value ? { ...cat, amount } : cat
      ));
    } else if (level === 'brand') {
      setSelectedBrands(selectedBrands.map(brand => 
        brand.value === value ? { ...brand, amount } : brand
      ));
    } else if (level === 'subApp') {
      setSelectedSubApps(selectedSubApps.map(subApp => 
        subApp.value === value ? { ...subApp, amount } : subApp
      ));
    }
  };
  
  const removeCategory = (category: string) => {
    setSelectedCategories(selectedCategories.filter(c => c.value !== category));
    setSubcategories(subcategories.filter(sc => !(sc.level === 'category' && sc.value === category)));
    if (onSubcategoryChange) {
      onSubcategoryChange(subcategories.filter(sc => !(sc.level === 'category' && sc.value === category)));
    }
  };
  
  const removeBrand = (brand: string) => {
    setSelectedBrands(selectedBrands.filter(b => b.value !== brand));
    setSubcategories(subcategories.filter(sc => !(sc.level === 'brand' && sc.value === brand)));
    if (onSubcategoryChange) {
      onSubcategoryChange(subcategories.filter(sc => !(sc.level === 'brand' && sc.value === brand)));
    }
  };
  
  const removeSubApp = (subApp: string) => {
    setSelectedSubApps(selectedSubApps.filter(s => s.value !== subApp));
    setSubcategories(subcategories.filter(sc => !(sc.level === 'subApp' && sc.value === subApp)));
    if (onSubcategoryChange) {
      onSubcategoryChange(subcategories.filter(sc => !(sc.level === 'subApp' && sc.value === subApp)));
    }
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
                  
                  {/* Display selected sub apps as badges with amounts */}
                  {selectedSubApps.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedSubApps.map(subApp => (
                        <Collapsible key={subApp.value} className="w-full md:w-auto">
                          <div className="flex flex-wrap gap-1 items-center">
                            <Badge variant="secondary" className="flex items-center gap-1">
                              {subApp.value}
                              <CollapsibleTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-4 w-4 p-0 hover:bg-transparent"
                                >
                                  <ChevronDown className="h-3 w-3" />
                                </Button>
                              </CollapsibleTrigger>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 p-0 hover:bg-transparent"
                                onClick={() => removeSubApp(subApp.value)}
                              >
                                <MinusCircle className="h-3 w-3" />
                              </Button>
                            </Badge>
                          </div>
                          <CollapsibleContent className="mt-1 space-y-1">
                            <div className="flex items-center gap-2 pl-2">
                              <IndianRupee className="h-3 w-3 text-muted-foreground" />
                              <Input
                                type="number"
                                value={subcategories.find(sc => sc.level === 'subApp' && sc.value === subApp.value)?.amount || 0}
                                onChange={(e) => updateSubcategoryAmount('subApp', subApp.value, Number(e.target.value))}
                                placeholder="Amount"
                                className="h-7 text-xs"
                              />
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
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
                  
                  {/* Display selected categories as badges with amounts */}
                  {selectedCategories.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedCategories.map(category => (
                        <Collapsible key={category.value} className="w-full md:w-auto">
                          <div className="flex flex-wrap gap-1 items-center">
                            <Badge variant="secondary" className="flex items-center gap-1">
                              {category.value}
                              <CollapsibleTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-4 w-4 p-0 hover:bg-transparent"
                                >
                                  <ChevronDown className="h-3 w-3" />
                                </Button>
                              </CollapsibleTrigger>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 p-0 hover:bg-transparent"
                                onClick={() => removeCategory(category.value)}
                              >
                                <MinusCircle className="h-3 w-3" />
                              </Button>
                            </Badge>
                          </div>
                          <CollapsibleContent className="mt-1 space-y-1">
                            <div className="flex items-center gap-2 pl-2">
                              <IndianRupee className="h-3 w-3 text-muted-foreground" />
                              <Input
                                type="number"
                                value={subcategories.find(sc => sc.level === 'category' && sc.value === category.value)?.amount || 0}
                                onChange={(e) => updateSubcategoryAmount('category', category.value, Number(e.target.value))}
                                placeholder="Amount"
                                className="h-7 text-xs"
                              />
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
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
                        .flatMap(category => options.brands[category.value] || [])
                        .filter((brand, index, self) => self.indexOf(brand) === index) // Remove duplicates
                        .map((brand) => (
                          <SelectItem key={brand} value={brand}>
                            {brand}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  
                  {/* Display selected brands as badges with amounts */}
                  {selectedBrands.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedBrands.map(brand => (
                        <Collapsible key={brand.value} className="w-full md:w-auto">
                          <div className="flex flex-wrap gap-1 items-center">
                            <Badge variant="secondary" className="flex items-center gap-1">
                              {brand.value}
                              <CollapsibleTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-4 w-4 p-0 hover:bg-transparent"
                                >
                                  <ChevronDown className="h-3 w-3" />
                                </Button>
                              </CollapsibleTrigger>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 p-0 hover:bg-transparent"
                                onClick={() => removeBrand(brand.value)}
                              >
                                <MinusCircle className="h-3 w-3" />
                              </Button>
                            </Badge>
                          </div>
                          <CollapsibleContent className="mt-1 space-y-1">
                            <div className="flex items-center gap-2 pl-2">
                              <IndianRupee className="h-3 w-3 text-muted-foreground" />
                              <Input
                                type="number"
                                value={subcategories.find(sc => sc.level === 'brand' && sc.value === brand.value)?.amount || 0}
                                onChange={(e) => updateSubcategoryAmount('brand', brand.value, Number(e.target.value))}
                                placeholder="Amount"
                                className="h-7 text-xs"
                              />
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
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
                  
                  {/* Display selected categories as badges with amounts */}
                  {selectedCategories.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedCategories.map(category => (
                        <Collapsible key={category.value} className="w-full md:w-auto">
                          <div className="flex flex-wrap gap-1 items-center">
                            <Badge variant="secondary" className="flex items-center gap-1">
                              {category.value}
                              <CollapsibleTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-4 w-4 p-0 hover:bg-transparent"
                                >
                                  <ChevronDown className="h-3 w-3" />
                                </Button>
                              </CollapsibleTrigger>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 p-0 hover:bg-transparent"
                                onClick={() => removeCategory(category.value)}
                              >
                                <MinusCircle className="h-3 w-3" />
                              </Button>
                            </Badge>
                          </div>
                          <CollapsibleContent className="mt-1 space-y-1">
                            <div className="flex items-center gap-2 pl-2">
                              <IndianRupee className="h-3 w-3 text-muted-foreground" />
                              <Input
                                type="number"
                                value={subcategories.find(sc => sc.level === 'category' && sc.value === category.value)?.amount || 0}
                                onChange={(e) => updateSubcategoryAmount('category', category.value, Number(e.target.value))}
                                placeholder="Amount"
                                className="h-7 text-xs"
                              />
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
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
                        .flatMap(category => options.brands[category.value] || [])
                        .filter((brand, index, self) => self.indexOf(brand) === index) // Remove duplicates
                        .map((brand) => (
                          <SelectItem key={brand} value={brand}>
                            {brand}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  
                  {/* Display selected brands as badges with amounts */}
                  {selectedBrands.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedBrands.map(brand => (
                        <Collapsible key={brand.value} className="w-full md:w-auto">
                          <div className="flex flex-wrap gap-1 items-center">
                            <Badge variant="secondary" className="flex items-center gap-1">
                              {brand.value}
                              <CollapsibleTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-4 w-4 p-0 hover:bg-transparent"
                                >
                                  <ChevronDown className="h-3 w-3" />
                                </Button>
                              </CollapsibleTrigger>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 p-0 hover:bg-transparent"
                                onClick={() => removeBrand(brand.value)}
                              >
                                <MinusCircle className="h-3 w-3" />
                              </Button>
                            </Badge>
                          </div>
                          <CollapsibleContent className="mt-1 space-y-1">
                            <div className="flex items-center gap-2 pl-2">
                              <IndianRupee className="h-3 w-3 text-muted-foreground" />
                              <Input
                                type="number"
                                value={subcategories.find(sc => sc.level === 'brand' && sc.value === brand.value)?.amount || 0}
                                onChange={(e) => updateSubcategoryAmount('brand', brand.value, Number(e.target.value))}
                                placeholder="Amount"
                                className="h-7 text-xs"
                              />
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
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

  // Format the hierarchy for display
  const formatHierarchy = () => {
    if (subcategories.length === 0) return null;
    
    return (
      <div className="mt-3 pl-2 text-xs text-muted-foreground">
        <div className="flex items-center">
          <ChevronsRight className="h-3 w-3 mr-1" />
          <span className="font-medium">Breakdown:</span>
        </div>
        <div className="ml-2 space-y-1 mt-1">
          {subcategories.filter(sc => sc.amount > 0).map((sc, i) => (
            <div key={i} className="flex items-center justify-between">
              <span>{sc.value}</span>
              <span>₹{sc.amount.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    );
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
      
      {formatHierarchy()}
    </div>
  );
};

export default SpendingFormItem;
