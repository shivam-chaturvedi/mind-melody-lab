import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface InstrumentCardProps {
  emoji: string;
  name: string;
  isSelected: boolean;
  onClick: () => void;
}

export const InstrumentCard = ({ emoji, name, isSelected, onClick }: InstrumentCardProps) => {
  return (
    <Card
      onClick={onClick}
      className={cn(
        "cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-lg",
        isSelected
          ? "ring-4 ring-secondary shadow-xl bg-gradient-to-br from-secondary/10 to-primary/10"
          : "hover:ring-2 hover:ring-secondary/50 bg-card"
      )}
    >
      <CardContent className="p-6 text-center">
        <div className={cn(
          "text-5xl mb-3 transition-transform duration-300",
          isSelected ? "scale-110" : ""
        )}>
          {emoji}
        </div>
        <p className="text-sm font-medium text-foreground">{name}</p>
      </CardContent>
    </Card>
  );
};
