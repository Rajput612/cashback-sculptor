
import React from 'react';
import { cn } from '@/lib/utils';
import { CreditCard as CreditCardIcon, IndianRupee, CreditCard, Award, Info, Gift, Zap, Plane } from 'lucide-react';
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
      
      {card.isCoBranded && (
        <div className="absolute top-2 left-2">
          <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5">
            Co-branded with {card.coPartner}
          </Badge>
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
                <IndianRupee className="h-4 w-4" />
                <span>Annual Cashback</span>
              </div>
              <div className="text-2xl font-bold text-primary">₹{(cashback * 12).toFixed(0)}</div>
              <div className="text-xs text-muted-foreground">₹{cashback.toFixed(0)} monthly</div>
            </div>
            <div className="p-4 bg-secondary/50 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <CreditCardIcon className="h-4 w-4" />
                <span>Annual Fee</span>
              </div>
              <div className="text-2xl font-bold">₹{card.annualFee}</div>
              {card.feeWaiver && (
                <div className="text-xs text-muted-foreground">{card.feeWaiver}</div>
              )}
            </div>
          </div>
          
          <div className="p-4 bg-primary/5 rounded-lg">
            <div className="flex items-center gap-2 text-sm font-medium mb-1">
              <Award className="h-4 w-4 text-primary" />
              <span>Net Annual Value</span>
            </div>
            <div className="text-3xl font-bold text-primary">₹{(netValue * 12).toFixed(0)}</div>
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <h4 className="font-medium">Rewards & Cashback</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {card.cashbackRates.map((rate, index) => (
                <div key={`${card.id}-rate-${index}`} className="flex items-center gap-2">
                  <span className="inline-block w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-semibold">
                    {rate.rate}%
                  </span>
                  <span className="capitalize">{rate.category}</span>
                  {rate.limit && (
                    <span className="text-xs text-muted-foreground">
                      (up to ₹{rate.limit.toLocaleString()})
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
                  <Gift className="h-4 w-4 text-primary" />
                  <h4 className="font-medium">Welcome Bonus</h4>
                </div>
                <p className="text-sm">
                  <span className="font-medium">₹{card.signupBonus.amount}</span> - {card.signupBonus.requirement}
                </p>
              </div>
            </>
          )}
          
          <Separator />
          <div className="space-y-3">
            <h4 className="font-medium">Key Benefits</h4>
            <div className="grid grid-cols-1 gap-2">
              {card.lounge && (card.lounge.domestic || card.lounge.international) && (
                <div className="flex items-center gap-2">
                  <Plane className="h-4 w-4 text-primary" />
                  <span className="text-sm">
                    Airport Lounge Access: 
                    {card.lounge.domestic ? ` ${card.lounge.domestic} domestic` : ""}
                    {card.lounge.domestic && card.lounge.international ? " and" : ""}
                    {card.lounge.international ? ` ${card.lounge.international} international` : ""}
                    {" visits per year"}
                  </span>
                </div>
              )}
              
              {card.fuelSurchargeWaiver && (
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  <span className="text-sm">Fuel surcharge waiver</span>
                </div>
              )}
              
              {card.benefits.slice(0, 3).map((benefit, index) => (
                <div key={`${card.id}-benefit-${index}`} className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-primary" />
                  <span className="text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
          
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
