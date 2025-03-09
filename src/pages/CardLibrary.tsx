import React from 'react';
import Header from '@/components/Header';
import AnimatedBackground from '@/components/AnimatedBackground';
import CardSuggestion from '@/components/CardSuggestion';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { creditCards } from '@/lib/calculations';
import { Search } from 'lucide-react';

const CardLibrary = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterIssuer, setFilterIssuer] = React.useState('all');
  const [sortBy, setSortBy] = React.useState('name');
  
  // Get unique issuers
  const issuers = Array.from(new Set(creditCards.map(card => card.issuer)));
  
  // Filter and sort cards
  const filteredCards = creditCards.filter(card => {
    const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.issuer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIssuer = filterIssuer === 'all' || card.issuer === filterIssuer;
    return matchesSearch && matchesIssuer;
  }).sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'fee-low') return a.annualFee - b.annualFee;
    if (sortBy === 'fee-high') return b.annualFee - a.annualFee;
    return 0;
  });

  return (
    <div className="min-h-screen flex flex-col relative">
      <AnimatedBackground />
      <Header />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-16">
        <section className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="mb-5 px-3 py-1 bg-primary/10 text-primary border-primary/20">
            Card Library
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Explore Credit Cards
          </h1>
          <p className="text-lg text-muted-foreground">
            Browse our comprehensive collection of credit cards and find the one that suits your needs.
          </p>
        </section>

        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search cards..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={filterIssuer} onValueChange={setFilterIssuer}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by issuer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Issuers</SelectItem>
                {issuers.map(issuer => (
                  <SelectItem key={issuer} value={issuer}>{issuer}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name (A-Z)</SelectItem>
                <SelectItem value="fee-low">Annual Fee (Low to High)</SelectItem>
                <SelectItem value="fee-high">Annual Fee (High to Low)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6">
          {filteredCards.map((card) => (
            <CardSuggestion
              key={card.id}
              card={card}
              isCompact={false}
            />
          ))}
          
          {filteredCards.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                No cards found matching your criteria.
              </p>
            </div>
          )}
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

export default CardLibrary;