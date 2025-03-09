import React, { useState } from 'react';
import Header from '@/components/Header';
import AnimatedBackground from '@/components/AnimatedBackground';
import SpendingForm from '@/components/SpendingForm';
import CardSuggestion from '@/components/CardSuggestion';
import Comparison from '@/components/Comparison';
import { 
  Spending, 
  CreditCard, 
  creditCards,
  getBestCardCombinations,
  initializeEmptySpending
} from '@/lib/calculations';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, TrendingUp, ArrowLeft, ArrowRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

const Index = () => {
  const [spending, setSpending] = useState<Spending | null>(null);
  const [recommendedCards, setRecommendedCards] = useState<CreditCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<CreditCard[]>([]);
  const [showIntro, setShowIntro] = useState(true);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const featuredCards = creditCards.filter(card => 
    ["hdfc-infinia", "sbi-elite", "icici-amazon", "axis-flipkart"].includes(card.id)
  );

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleSpendingSubmit = (spendingData: Spending) => {
    setSpending(spendingData);
    
    const bestCards = getBestCardCombinations(spendingData, 5);
    setRecommendedCards(bestCards);
    
    setSelectedCards(bestCards.slice(0, 2));
    
    setShowIntro(false);
    
    toast.success('We found the best credit cards for your spending!', {
      description: 'Based on your spending patterns, we recommend these cards.'
    });
    
    document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCardSelect = (card: CreditCard) => {
    if (selectedCards.some(c => c.id === card.id)) {
      setSelectedCards(selectedCards.filter(c => c.id !== card.id));
    } else {
      if (selectedCards.length < 3) {
        setSelectedCards([...selectedCards, card]);
      } else {
        toast.warning('You can compare up to 3 cards at a time', {
          description: 'Please remove a card before adding a new one.'
        });
      }
    }
  };

  const resetForm = () => {
    setSpending(null);
    setRecommendedCards([]);
    setSelectedCards([]);
    setShowIntro(true);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <AnimatedBackground />
      <Header />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 pb-20">
        <section className="py-16 text-center max-w-3xl mx-auto">
          <Badge className="mb-5 px-3 py-1 bg-primary/10 text-primary border-primary/20 animate-fade-in">
            Maximize Your Cash Back
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-slide-down">
            Find Your Perfect <span className="text-primary">Credit Card</span> Combination
          </h1>
          <p className="text-lg text-muted-foreground mb-10 animate-slide-down" style={{ animationDelay: '0.1s' }}>
            Tell us how you spend your money, and we'll recommend the perfect credit card combination
            to maximize your cash back and benefits.
          </p>
        </section>
        
        <section id="spending-form" className="py-12">
          <div className="max-w-3xl mx-auto">
            <div className="mb-10 text-center">
              <Badge className="mb-2 px-3 py-1 bg-primary/10 text-primary border-primary/20">
                Step 1
              </Badge>
              <h2 className="text-3xl font-bold mb-4">Tell Us How You Spend</h2>
              <p className="text-muted-foreground">
                Enter your monthly spending habits so we can find the best credit cards for you.
              </p>
            </div>
            
            <div className="bg-card shadow-soft rounded-xl p-6 md:p-8">
              <SpendingForm onSubmit={handleSpendingSubmit} />
            </div>
          </div>
        </section>
        
        <section id="featured-cards" className="py-12">
          <div className="mb-6 text-center">
            <Badge className="mb-2 px-3 py-1 bg-amber-500/20 text-amber-700 border-amber-200">
              <TrendingUp className="h-3 w-3 mr-1" /> Featured
            </Badge>
            <h2 className="text-2xl font-bold mb-2">Top Credit Cards</h2>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              Explore these popular credit cards with great rewards and benefits
            </p>
          </div>
          
          <div className="relative px-4">
            <div className="absolute top-1/2 -left-4 transform -translate-y-1/2 z-10">
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full shadow-md bg-background/90"
                onClick={() => handleScroll('left')}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </div>
            
            <ScrollArea className="w-full pb-4">
              <div 
                ref={scrollRef}
                className="flex space-x-4 pb-1 px-1"
              >
                {featuredCards.map((card) => (
                  <div key={`featured-${card.id}`} className="min-w-[220px] max-w-[220px] flex-shrink-0">
                    <CardSuggestion
                      card={card}
                      isPromotion={true}
                      isCompact={true}
                      onSelect={() => handleCardSelect(card)}
                      isSelected={selectedCards.some(c => c.id === card.id)}
                    />
                  </div>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
            
            <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full shadow-md bg-background/90"
                onClick={() => handleScroll('right')}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
        
        <Separator className="my-8" />
        
        {!showIntro && spending && recommendedCards.length > 0 && (
          <section id="results" className="py-12 min-h-screen">
            <div className="mb-10 text-center">
              <Badge className="mb-2 px-3 py-1 bg-primary/10 text-primary border-primary/20 animate-fade-in">
                Step 2
              </Badge>
              <h2 className="text-3xl font-bold mb-4 animate-slide-down">Your Recommended Cards</h2>
              <p className="text-muted-foreground animate-slide-down" style={{ animationDelay: '0.1s' }}>
                Based on your ₹{spending.total.toLocaleString()} monthly spending, these cards will give you the most value.
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-8 mb-12 stagger-animation">
              {recommendedCards.map((card) => (
                <CardSuggestion
                  key={card.id}
                  card={card}
                  spending={spending}
                  onSelect={() => handleCardSelect(card)}
                  isSelected={selectedCards.some(c => c.id === card.id)}
                />
              ))}
            </div>
            
            {selectedCards.length > 0 && (
              <div className="mb-12 animate-scale-in">
                <Comparison 
                  cards={selectedCards} 
                  spending={spending} 
                />
              </div>
            )}
            
            <div className="text-center">
              <Button variant="outline" onClick={resetForm}>
                Start Over
              </Button>
            </div>
          </section>
        )}
        
        {showIntro && (
          <section className="py-12">
            <div className="max-w-4xl mx-auto">
              <div className="mb-10 text-center">
                <Badge className="mb-2 px-3 py-1 bg-primary/10 text-primary border-primary/20">
                  How It Works
                </Badge>
                <h2 className="text-3xl font-bold mb-4">Maximize Your Benefits</h2>
                <p className="text-muted-foreground">
                  Credit+ helps you find the perfect combination of credit cards to maximize your cash back and benefits.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <div className="bg-card p-6 rounded-xl shadow-soft card-hover">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <span className="text-xl font-bold text-primary">1</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Enter Your Spending</h3>
                  <p className="text-muted-foreground">
                    Tell us how much you spend in different categories, both online and offline.
                  </p>
                </div>
                
                <div className="bg-card p-6 rounded-xl shadow-soft card-hover">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <span className="text-xl font-bold text-primary">2</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Get Recommendations</h3>
                  <p className="text-muted-foreground">
                    We'll analyze your spending patterns and recommend the best credit cards.
                  </p>
                </div>
                
                <div className="bg-card p-6 rounded-xl shadow-soft card-hover">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <span className="text-xl font-bold text-primary">3</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Compare and Decide</h3>
                  <p className="text-muted-foreground">
                    Compare cards side-by-side to see which combination gives you the most value.
                  </p>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-muted-foreground mb-6">
                  Ready to find your perfect credit card combination?
                </p>
                <a 
                  href="#spending-form" 
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                >
                  <span>Get Started Now</span>
                  <ChevronDown className="h-4 w-4" />
                </a>
              </div>
            </div>
          </section>
        )}
      </main>
      
      <footer className="py-8 border-t">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Credit+. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Credit+ is a tool to help you find the best credit cards based on your spending. We don't store your data.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
