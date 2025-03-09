import React from 'react';
import Header from '@/components/Header';
import AnimatedBackground from '@/components/AnimatedBackground';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Wallet, CreditCard, TrendingUp, Gift } from 'lucide-react';

const HowItWorks = () => {
  return (
    <div className="min-h-screen flex flex-col relative">
      <AnimatedBackground />
      <Header />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-16">
        <section className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="mb-5 px-3 py-1 bg-primary/10 text-primary border-primary/20">
            How Credit+ Works
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Find Your Perfect Credit Card Match
          </h1>
          <p className="text-lg text-muted-foreground">
            Credit+ uses advanced algorithms to analyze your spending patterns and recommend the best credit card combinations for maximum rewards.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <div className="space-y-8">
            <div className="bg-card p-6 rounded-xl shadow-soft">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Enter Your Spending</h3>
              <p className="text-muted-foreground">
                Tell us about your monthly spending habits across different categories like dining, travel, shopping, and more.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-xl shadow-soft">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Get Personalized Recommendations</h3>
              <p className="text-muted-foreground">
                Our algorithm analyzes your spending patterns to recommend credit cards that maximize your rewards.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-xl shadow-soft">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Compare and Choose</h3>
              <p className="text-muted-foreground">
                Compare different card combinations side by side to see potential rewards and benefits.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-xl shadow-soft">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Gift className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">4. Maximize Your Benefits</h3>
              <p className="text-muted-foreground">
                Start earning more rewards by using your optimal credit card combination.
              </p>
            </div>
          </div>
          
          <div className="bg-card p-8 rounded-xl shadow-soft">
            <h3 className="text-2xl font-bold mb-6">Why Use Credit+?</h3>
            
            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Smart Analysis</h4>
                <p className="text-muted-foreground">
                  Our advanced algorithm considers your unique spending patterns to find the perfect card combination.
                </p>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold">Comprehensive Database</h4>
                <p className="text-muted-foreground">
                  We maintain an up-to-date database of credit cards with detailed information about rewards and benefits.
                </p>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold">Easy Comparison</h4>
                <p className="text-muted-foreground">
                  Compare different cards side by side to make informed decisions about which cards to apply for.
                </p>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold">Privacy First</h4>
                <p className="text-muted-foreground">
                  We don't store your personal information. Your data is only used to generate recommendations.
                </p>
              </div>
            </div>
            
            <div className="mt-8">
              <Link to="/">
                <Button className="w-full">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="py-8 border-t">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Credit+. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HowItWorks;