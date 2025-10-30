import { cn } from '@/lib/utils';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressIndicator = ({ currentStep, totalSteps }: ProgressIndicatorProps) => {
  return (
    <div className="flex items-center justify-center gap-3 mb-8">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div
          key={i}
          className={cn(
            "h-2 rounded-full transition-all duration-500",
            i + 1 === currentStep
              ? "w-12 bg-gradient-primary shadow-lg"
              : i + 1 < currentStep
              ? "w-8 bg-primary"
              : "w-8 bg-muted"
          )}
        />
      ))}
    </div>
  );
};
