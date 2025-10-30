import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface IssueCardProps {
  emoji: string;
  title: string;
  isSelected: boolean;
  onClick: () => void;
}

export const IssueCard = ({ emoji, title, isSelected, onClick }: IssueCardProps) => {
  return (
    <Card
      onClick={onClick}
      className={cn(
        "cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-xl",
        isSelected 
          ? "ring-4 ring-primary shadow-xl bg-gradient-to-br from-primary/5 to-secondary/5" 
          : "hover:ring-2 hover:ring-primary/50 bg-card"
      )}
    >
      <CardContent className="p-8 text-center">
        <div className={cn(
          "text-7xl mb-4 transition-transform duration-300",
          isSelected ? "scale-125" : "group-hover:scale-110"
        )}>
          {emoji}
        </div>
        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
      </CardContent>
    </Card>
  );
};
