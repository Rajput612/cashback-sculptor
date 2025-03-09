import React from 'react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { CreditCard as CreditCardIcon, IndianRupee, Award, Info, Gift, Zap, Plane, Star, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CreditCard as CardType, Spending, calculateCashback } from '@/lib/calculations';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

const defaultCardImages = {
  'hdfc': 'https://www.hdfcbank.com/content/api/contentstream-id/723fb80a-2dde-42a3-9793-7ae1be57c87f/f15c5193-7933-4b56-a98b-a1132dfbac81/Personal/Pay/Cards/Credit-Cards/Credit-Cards/Regalia/regalia-gold-card.png',
  'sbi': 'https://www.sbicard.com/creditcards/resources/img/prime-card.png',
  'icici': 'https://www.icicibank.com/content/dam/icicibank/managed-assets/images/credit-card/best-of-icici-bank-credit-cards-big-picture.png',
  'axis': 'https://www.axisbank.com/images/default-source/progress-with-us_new/ace-credit-card.jpg',
  'kotak': 'https://www.kotak.com/content/dam/Kotak/product_card_images/811-dreamdifferent-creditcard-updated-card.png',
  'amex': 'https://www.americanexpress.com/content/dam/amex/in/homepage/img/platinum_reserve_card.png'
};

interface CardSuggestionProps {
  card: CardType;
  spending?: Spending;
  className?: string;
  onSelect?: () => void;
  isSelected?: boolean;
  isPromotion?: boolean;
  isCompact?: boolean;
}

const CardSuggestion: React.FC<CardSuggestionProps> = ({ 
  card, 
  spending, 
  className,
  onSelect,
  isSelected = false,
  isPromotion = false,
  isCompact = false
}) => {
  const cashback = spending ? calculateCashback(card, spending) : 0;
  const netValue = spending ? cashback - card.annualFee : 0;
  
  const cardImage = card.image || defaultCardImages[card.issuer.toLowerCase()] || defaultCardImages['hdfc'];
  
  if (isCompact) {
    return (
      <div 
        className={cn(
          "relative overflow-hidden rounded-xl p-4 shadow-soft card-hover bg-card transition-all h-full flex flex-col",
          isSelected && "ring-2 ring-primary",
          isPromotion && "border border-amber-300/30 bg-amber-50/10",
          className
        )}
      >
        {isPromotion && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-amber-500/90 hover:bg-amber-500/80">
              <Star className="h-3 w-3 mr-1 fill-current" /> Featured
            </Badge>
          </div>
        )}
        
        <div className="flex-grow flex flex-col items-center">
          <div className="w-full max-w-[180px] h-28 relative rounded-lg overflow-hidden shadow-md mb-3 bg-gradient-to-br from-gray-100 to-gray-200">
            <img 
              src={cardImage} 
              alt={`${card.issuer} ${card.name}`} 
              className="w-full h-full object-contain p-2"
              loading="lazy"
            />
          </div>
          <div className="text-center mb-3">
            <h3 className="text-sm font-semibold">{card.issuer}</h3>
            <p className="text-base font-bold">{card.name}</p>
          </div>
          
          <div className="w-full p-2 bg-secondary/30 rounded-lg mb-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <CreditCardIcon className="h-3 w-3" />
              <span>Annual Fee</span>
            </div>
            <div className="text-base font-bold">₹{card.annualFee}</div>
          </div>
          
          <div className="w-full space-y-2 mb-3">
            <div className="text-xs font-medium">Top Rewards:</div>
            {card.cashbackRates.slice(0, 2).map((rate, index) => (
              <div key={`${card.id}-compact-rate-${index}`} className="flex items-center gap-2">
                <span className="inline-block w-5 h-5 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-semibold">
                  {rate.rate}%
                </span>
                <span className="text-xs capitalize">{rate.category}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex gap-2 mt-auto">
          {onSelect && (
            <Button 
              variant={isSelected ? "outline" : "default"} 
              onClick={onSelect} 
              className="flex-1 text-xs py-1 h-auto"
              size="sm"
            >
              {isSelected ? "Remove" : "Compare"}
            </Button>
          )}
          
          <Link to={`/card/${card.id}`} className="block">
            <Button 
              variant="outline"
              size="sm"
              className="text-xs py-1 h-auto"
            >
              <ExternalLink className="h-3 w-3 mr-1" /> Details
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-xl p-6 shadow-soft card-hover bg-card transition-all",
        isSelected && "ring-2 ring-primary",
        isPromotion && "border border-amber-300/30 bg-amber-50/10",
        className
      )}
    >
      {isSelected && (
        <div className="absolute top-2 right-2">
          <Badge className="bg-primary">Selected</Badge>
        </div>
      )}
      
      {isPromotion && (
        <div className="absolute top-2 right-2">
          <Badge className="bg-amber-500/90 hover:bg-amber-500/80">
            <Star className="h-3 w-3 mr-1 fill-current" /> Featured
          </Badge>
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
          <div className="w-full h-48 relative rounded-xl overflow-hidden shadow-md transform transition-transform hover:rotate-1 hover:scale-105 bg-gradient-to-br from-gray-100 to-gray-200">
            <img 
              src={cardImage} 
              alt={`${card.issuer} ${card.name}`} 
              className="w-full h-full object-contain p-4"
              loading="lazy"
            />
          </div>
          <div className="mt-4 text-center">
            <h3 className="text-lg font-semibold">{card.issuer}</h3>
            <p className="text-xl font-bold">{card.name}</p>
            
            <Link to={`/card/${card.id}`} className="inline-block mt-2">
              <Button 
                variant="outline"
                size="sm"
                className="text-xs"
              >
                <ExternalLink className="h-3 w-3 mr-1" /> View Details
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="md:w-2/3 space-y-4">
          {spending ? (
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
          ) : (
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
          )}
          
          {spending && (
            <div className="p-4 bg-primary/5 rounded-lg">
              <div className="flex items-center gap-2 text-sm font-medium mb-1">
                <Award className="h-4 w-4 text-primary" />
                <span>Net Annual Value</span>
              </div>
              <div className="text-3xl font-bold text-primary">₹{(netValue * 12).toFixed(0)}</div>
            </div>
          )}
          
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
          
          {onSelect && (
            <div className="pt-4">
              <Button 
                variant={isSelected ? "outline" : "default"} 
                onClick={onSelect} 
                className="w-full"
              >
                {isSelected ? "Remove from Comparison" : "Add to Comparison"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardSuggestion;
