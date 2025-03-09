import React from 'react';
import Header from '@/components/Header';
import AnimatedBackground from '@/components/AnimatedBackground';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Users2, Target, Shield, ArrowRight, Mail } from 'lucide-react';

const AboutUs = () => {
  return (
    <div className="min-h-screen flex flex-col relative">
      <AnimatedBackground />
      <Header />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-16">
        <section className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="mb-5 px-3 py-1 bg-primary/10 text-primary border-primary/20">
            About Us
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            We Help You Make Smarter Financial Decisions
          </h1>
          <p className="text-lg text-muted-foreground">
            Credit+ is dedicated to helping you maximize your credit card rewards through personalized recommendations and expert insights.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <div className="space-y-8">
            <div className="bg-card p-8 rounded-xl shadow-soft">
              <h2 className="text-2xl font-bold mb-6">Our Mission</h2>
              <p className="text-muted-foreground mb-6">
                We believe everyone should get the most value from their credit cards. Our mission is to simplify the process of finding the right credit cards by providing personalized recommendations based on your unique spending patterns.
              </p>
              
              <div className="grid grid-cols-1 gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <Users2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">User-Focused</h3>
                    <p className="text-sm text-muted-foreground">
                      We put our users first, ensuring our recommendations are tailored to their needs.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Data-Driven</h3>
                    <p className="text-sm text-muted-foreground">
                      Our recommendations are based on real spending patterns and card benefits.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Transparent</h3>
                    <p className="text-sm text-muted-foreground">
                      We're committed to providing clear, unbiased information about credit cards.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-card p-8 rounded-xl shadow-soft">
              <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
              <p className="text-muted-foreground mb-6">
                Have questions or feedback? We'd love to hear from you.
              </p>
              
              <div className="flex items-center gap-3">
                <Button className="w-full">
                  <Mail className="mr-2 h-4 w-4" />
                  Get in Touch
                </Button>
              </div>
            </div>
          </div>
          
          <div className="space-y-8">
            <div className="bg-card p-8 rounded-xl shadow-soft">
              <h2 className="text-2xl font-bold mb-6">Why Choose Credit+?</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Expert Analysis</h3>
                  <p className="text-muted-foreground">
                    Our team of financial experts continuously analyzes credit card offerings to provide you with the most up-to-date recommendations.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Personalized Approach</h3>
                  <p className="text-muted-foreground">
                    We understand that everyone's spending habits are different, which is why our recommendations are tailored to your unique situation.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Privacy First</h3>
                  <p className="text-muted-foreground">
                    Your privacy is important to us. We never store your personal financial information.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Always Free</h3>
                  <p className="text-muted-foreground">
                    Our service is completely free to use. We're committed to helping you make better financial decisions.
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

export default AboutUs;