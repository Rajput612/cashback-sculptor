
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import AnimatedBackground from '@/components/AnimatedBackground';
import { Button } from '@/components/ui/button';
import { creditCards } from '@/lib/calculations';
import { 
  CheckCircle, 
  ArrowLeft, 
  CreditCard, 
  Gift, 
  Star, 
  ShieldCheck, 
  BadgePercent, 
  Award, 
  Plane 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

const CardDetails = () => {
  const { cardId } = useParams<{ cardId: string }>();
  const card = creditCards.find(c => c.id === cardId);
  
  // Default images for common banks
  const defaultCardImages = {
    'hdfc': 'https://www.hdfcbank.com/content/api/contentstream-id/723fb80a-2dde-42a3-9793-7ae1be57c87f/f15c5193-7933-4b56-a98b-a1132dfbac81/Personal/Pay/Cards/Credit-Cards/Credit-Cards/Regalia/regalia-gold-card.png',
    'sbi': 'https://www.sbicard.com/creditcards/resources/img/prime-card.png',
    'icici': 'https://www.icicibank.com/content/dam/icicibank/managed-assets/images/credit-card/best-of-icici-bank-credit-cards-big-picture.png',
    'axis': 'https://www.axisbank.com/images/default-source/progress-with-us_new/ace-credit-card.jpg',
    'kotak': 'https://www.kotak.com/content/dam/Kotak/product_card_images/811-dreamdifferent-creditcard-updated-card.png',
    'amex': 'https://www.americanexpress.com/content/dam/amex/in/homepage/img/platinum_reserve_card.png'
  };
  
  if (!card) {
    return (
      <div className="min-h-screen flex flex-col relative">
        <AnimatedBackground />
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Card Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The card you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }
  
  // Determine card image based on issuer or use default image
  const cardImage = card.image || defaultCardImages[card.issuer.toLowerCase()] || defaultCardImages['hdfc'];
  
  return (
    <div className="min-h-screen flex flex-col relative">
      <AnimatedBackground />
      <Header />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-12">
        <div className="mb-6">
          <Link to="/">
            <Button variant="ghost" className="pl-0">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Cards
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Card Details Left Column */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-card rounded-xl p-6 shadow-soft relative overflow-hidden">
              {card.isCoBranded && (
                <Badge className="absolute top-4 right-4 bg-primary/10 text-primary">
                  Co-branded
                </Badge>
              )}
              
              <div className="flex flex-col items-center">
                <div className="w-full max-w-[300px] h-48 relative rounded-xl overflow-hidden shadow-md bg-gradient-to-br from-gray-100 to-gray-200 mb-6">
                  <img 
                    src={cardImage} 
                    alt={`${card.issuer} ${card.name}`} 
                    className="w-full h-full object-contain p-4"
                    loading="lazy"
                  />
                </div>
                
                <h1 className="text-2xl font-bold text-center">{card.name}</h1>
                <p className="text-lg font-medium text-muted-foreground mb-4">{card.issuer}</p>
                
                <div className="w-full bg-secondary/50 p-4 rounded-lg mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-muted-foreground">Annual Fee</span>
                    <span className="font-medium">₹{card.annualFee}</span>
                  </div>
                  {card.feeWaiver && (
                    <div className="text-xs text-primary">{card.feeWaiver}</div>
                  )}
                </div>
                
                {card.signupBonus && (
                  <div className="w-full bg-primary/10 p-4 rounded-lg mb-4">
                    <div className="flex items-start gap-2">
                      <Gift className="h-5 w-5 text-primary shrink-0 mt-1" />
                      <div>
                        <div className="text-sm font-medium">Welcome Bonus</div>
                        <div className="font-bold text-lg">₹{card.signupBonus.amount}</div>
                        <div className="text-xs text-muted-foreground">{card.signupBonus.requirement}</div>
                      </div>
                    </div>
                  </div>
                )}
                
                {card.lounge && (card.lounge.domestic || card.lounge.international) && (
                  <div className="w-full p-4 rounded-lg border border-muted">
                    <div className="flex items-start gap-2">
                      <Plane className="h-5 w-5 text-primary shrink-0 mt-1" />
                      <div>
                        <div className="text-sm font-medium">Airport Lounge Access</div>
                        {card.lounge.domestic && (
                          <div className="text-sm">
                            {card.lounge.domestic} domestic visits per year
                          </div>
                        )}
                        {card.lounge.international && (
                          <div className="text-sm">
                            {card.lounge.international} international visits per year
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-card rounded-xl p-6 shadow-soft">
              <h2 className="font-bold mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Card Overview
              </h2>
              
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span>
                    <span className="font-medium">Type:</span> {card.type || "Credit Card"}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span>
                    <span className="font-medium">Network:</span> {card.network || "Visa/Mastercard"}
                  </span>
                </li>
                {card.fuelSurchargeWaiver && (
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span>Fuel surcharge waiver</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
          
          {/* Card Details Right Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-xl p-6 shadow-soft">
              <h2 className="font-bold mb-4 flex items-center gap-2">
                <BadgePercent className="h-5 w-5 text-primary" />
                Rewards & Cashback
              </h2>
              
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-4">
                  {card.cashbackRates.map((rate, index) => (
                    <div 
                      key={`rate-${index}`} 
                      className="p-4 rounded-lg border border-muted flex items-start gap-3"
                    >
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-primary font-bold">{rate.rate}%</span>
                      </div>
                      <div>
                        <h3 className="font-medium capitalize">{rate.category}</h3>
                        <p className="text-sm text-muted-foreground">
                          Earn {rate.rate}% cashback on all {rate.category.toLowerCase()} purchases
                          {rate.limit ? ` (up to ₹${rate.limit.toLocaleString()} per year)` : ''}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
            
            <div className="bg-card rounded-xl p-6 shadow-soft">
              <h2 className="font-bold mb-4 flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                Key Benefits
              </h2>
              
              <div className="space-y-4">
                {card.benefits.map((benefit, index) => (
                  <div key={`benefit-${index}`} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <p>{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-card rounded-xl p-6 shadow-soft">
              <h2 className="font-bold mb-4 flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Recommended For
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {card.recommendedFor ? (
                  card.recommendedFor.map((recommendation, index) => (
                    <div 
                      key={`recommendation-${index}`} 
                      className="p-3 rounded-lg bg-secondary/30 flex items-start gap-2"
                    >
                      <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                      <p className="text-sm">{recommendation}</p>
                    </div>
                  ))
                ) : (
                  ['Everyday Spending', 'Shopping Rewards', 'Travel Benefits'].map((item, idx) => (
                    <div 
                      key={idx} 
                      className="p-3 rounded-lg bg-secondary/30 flex items-start gap-2"
                    >
                      <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                      <p className="text-sm">{item}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            <div className="bg-card rounded-xl p-6 shadow-soft">
              <h2 className="font-bold mb-4 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Required Documents
              </h2>
              
              <div className="space-y-3">
                <p className="text-sm">To apply for this card, you'll need:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm">ID Proof (Aadhaar, PAN, Passport)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm">Address Proof</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm">Income Proof (Last 3 months salary slips or ITR)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm">2 Passport size photographs</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="py-8 border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Credit+. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Disclaimer: Card details are for informational purposes only.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CardDetails;
