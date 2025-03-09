
import React from 'react';
import { cn } from '@/lib/utils';
import { CreditCard as CreditCardIcon, DollarSign, CreditCard, Award, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CreditCard as CardType, Spending, calculateCashback } from '@/lib/calculations';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

interface CardSuggestionProps {
  card: CardType;
  spending: Spending;
  className?: string;
  onSelect?: () => void;
  isSelected?: boolean;
}

const CardSuggestion: React.FC<CardSuggestionProps> = ({ 
  card, 
  spending, 
  className,
  onSelect,
  isSelected = false
}) => {
  const cashback = calculateCashback(card, spending);
  const netValue = cashback - card.annualFee;
  
  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-xl p-6 shadow-soft card-hover bg-card transition-all",
        isSelected && "ring-2 ring-primary",
        className
      )}
    >
      {isSelected && (
        <div className="absolute top-2 right-2">
          <Badge className="bg-primary">Selected</Badge>
        </div>
      )}
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3 flex flex-col items-center justify-center">
          <div className="w-full h-48 relative rounded-xl overflow-hidden shadow-md transform transition-transform hover:rotate-1 hover:scale-105">
            <img 
              src={card.image} 
              alt={`${card.issuer} ${card.name}`} 
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="mt-4 text-center">
            <h3 className="text-lg font-semibold">{card.issuer}</h3>
            <p className="text-xl font-bold">{card.name}</p>
          </div>
        </div>
        
        <div className="md:w-2/3 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-secondary/50 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <DollarSign className="h-4 w-4" />
                <span>Annual Cashback</span>
              </div>
              <div className="text-2xl font-bold text-primary">${cashback.toFixed(0)}</div>
            </div>
            <div className="p-4 bg-secondary/50 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <CreditCardIcon className="h-4 w-4" />
                <span>Annual Fee</span>
              </div>
              <div className="text-2xl font-bold">${card.annualFee}</div>
            </div>
          </div>
          
          <div className="p-4 bg-primary/5 rounded-lg">
            <div className="flex items-center gap-2 text-sm font-medium mb-1">
              <Award className="h-4 w-4 text-primary" />
              <span>Net Value</span>
            </div>
            <div className="text-3xl font-bold text-primary">${netValue.toFixed(0)}</div>
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <h4 className="font-medium">Cash Back Rates</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {card.cashbackRates.map((rate, index) => (
                <div key={`${card.id}-rate-${index}`} className="flex items-center gap-2">
                  <span className="inline-block w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-semibold">
                    {rate.rate}%
                  </span>
                  <span className="capitalize">{rate.category}</span>
                  {rate.limit && (
                    <span className="text-xs text-muted-foreground">
                      (up to ${rate.limit.toLocaleString()})
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {card.signupBonus && (
            <>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-primary" />
                  <h4 className="font-medium">Signup Bonus</h4>
                </div>
                <p className="text-sm">
                  <span className="font-medium">${card.signupBonus.amount}</span> - {card.signupBonus.requirement}
                </p>
              </div>
            </>
          )}
          
          <div className="pt-4">
            <Button 
              variant={isSelected ? "outline" : "default"} 
              onClick={onSelect} 
              className="w-full"
            >
              {isSelected ? "Remove from Comparison" : "Add to Comparison"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardSuggestion;
