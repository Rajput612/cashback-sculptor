
import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle } from 'lucide-react';
import { CreditCard, Spending, calculateCashback } from '@/lib/calculations';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ComparisonProps {
  cards: CreditCard[];
  spending: Spending;
  className?: string;
}

const Comparison: React.FC<ComparisonProps> = ({ cards, spending, className }) => {
  if (cards.length === 0) {
    return null;
  }

  // Calculate cashback for each card
  const cardsWithCashback = cards.map(card => ({
    ...card,
    cashback: calculateCashback(card, spending),
    netValue: calculateCashback(card, spending) - card.annualFee
  }));

  // Calculate total cashback across all cards
  const totalCashback = cardsWithCashback.reduce((sum, card) => sum + card.cashback, 0);
  const totalAnnualFees = cardsWithCashback.reduce((sum, card) => sum + card.annualFee, 0);
  const totalNetValue = totalCashback - totalAnnualFees;

  // Get all unique categories across all cards
  const allCategories = new Set<string>();
  cards.forEach(card => {
    card.cashbackRates.forEach(rate => {
      allCategories.add(rate.category);
    });
  });
  
  return (
    <div className={cn("rounded-xl overflow-hidden shadow-soft bg-card", className)}>
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold">Your Optimal Card Combination</h2>
        <p className="text-muted-foreground">
          Use these cards together to maximize your cashback
        </p>
      </div>
      
      <div className="p-6 border-b">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 bg-secondary/50 rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-1">Total Annual Cashback</p>
            <p className="text-3xl font-bold text-primary">₹{totalCashback.toFixed(0)}</p>
          </div>
          <div className="p-5 bg-secondary/50 rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-1">Total Annual Fees</p>
            <p className="text-3xl font-bold">₹{totalAnnualFees}</p>
          </div>
          <div className="p-5 bg-primary/10 rounded-lg text-center">
            <p className="text-sm font-medium mb-1">Net Value</p>
            <p className="text-3xl font-bold text-primary">₹{totalNetValue.toFixed(0)}</p>
          </div>
        </div>
      </div>
      
      <ScrollArea className="h-[400px]">
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 pr-6 font-medium">Feature</th>
                  {cardsWithCashback.map(card => (
                    <th key={`header-${card.id}`} className="text-left py-3 px-4 font-medium">
                      {card.issuer} {card.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 pr-6 font-medium">Annual Fee</td>
                  {cardsWithCashback.map(card => (
                    <td key={`fee-${card.id}`} className="py-3 px-4">
                      ₹{card.annualFee}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-3 pr-6 font-medium">Annual Cashback</td>
                  {cardsWithCashback.map(card => (
                    <td key={`cashback-${card.id}`} className="py-3 px-4 text-primary font-medium">
                      ₹{card.cashback.toFixed(0)}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-3 pr-6 font-medium">Net Value</td>
                  {cardsWithCashback.map(card => (
                    <td key={`net-${card.id}`} className="py-3 px-4 text-primary font-medium">
                      ₹{card.netValue.toFixed(0)}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-3 pr-6 font-medium">Signup Bonus</td>
                  {cardsWithCashback.map(card => (
                    <td key={`signup-${card.id}`} className="py-3 px-4">
                      {card.signupBonus ? (
                        <div>
                          <div className="font-medium">₹{card.signupBonus.amount}</div>
                          <div className="text-xs text-muted-foreground">{card.signupBonus.requirement}</div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">None</span>
                      )}
                    </td>
                  ))}
                </tr>
                {/* Cashback rates by category */}
                <tr className="border-b bg-muted/30">
                  <td colSpan={cardsWithCashback.length + 1} className="py-3 px-4 font-medium">
                    Cashback Rates by Category
                  </td>
                </tr>
                {Array.from(allCategories).map(category => (
                  <tr key={`category-${category}`} className="border-b">
                    <td className="py-3 pr-6 font-medium capitalize">{category}</td>
                    {cardsWithCashback.map(card => {
                      const rate = card.cashbackRates.find(r => r.category === category);
                      return (
                        <td key={`${card.id}-${category}`} className="py-3 px-4">
                          {rate ? (
                            <div className="flex items-center gap-1">
                              <span className="font-medium">{rate.rate}%</span>
                              {rate.limit && (
                                <span className="text-xs text-muted-foreground">
                                  (up to ₹{rate.limit.toLocaleString()})
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
                {/* Benefits */}
                <tr className="border-b bg-muted/30">
                  <td colSpan={cardsWithCashback.length + 1} className="py-3 px-4 font-medium">
                    Benefits
                  </td>
                </tr>
                {cards.map(card => 
                  card.benefits.map((benefit, idx) => (
                    <tr key={`benefit-${card.id}-${idx}`} className="border-b">
                      {idx === 0 ? (
                        <td rowSpan={card.benefits.length} className="py-3 pr-6 font-medium">
                          {card.issuer} {card.name}
                        </td>
                      ) : null}
                      {cardsWithCashback.map(c => (
                        <td key={`${c.id}-benefit-${idx}`} className="py-3 px-4">
                          {c.id === card.id ? (
                            <div className="flex items-start gap-2">
                              <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                              <span>{benefit}</span>
                            </div>
                          ) : (
                            <div className="flex items-start gap-2">
                              <XCircle className="h-5 w-5 text-muted-foreground shrink-0 opacity-40 mt-0.5" />
                              <span className="text-muted-foreground">Not available</span>
                            </div>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default Comparison;
