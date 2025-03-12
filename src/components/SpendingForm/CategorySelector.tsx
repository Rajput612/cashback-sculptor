
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PlusCircle, ChevronRight } from 'lucide-react';

interface CategorySelectorProps {
  level: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  onAddSubcategory: () => void;
  canAddMore: boolean;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  level,
  value,
  options,
  onChange,
  onAddSubcategory,
  canAddMore
}) => {
  return (
    <div className="flex items-center gap-2">
      <p className="text-sm text-muted-foreground w-24">{level}:</p>
      <div className="flex-1">
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger>
            <SelectValue placeholder={`Select ${level.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {canAddMore && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onAddSubcategory}
          className="text-muted-foreground hover:text-primary"
        >
          <PlusCircle className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
