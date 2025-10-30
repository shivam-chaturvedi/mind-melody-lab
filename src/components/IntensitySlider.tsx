import { Slider } from '@/components/ui/slider';

interface IntensitySliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

const labels = ['Very Low', 'Low', 'Moderate', 'High', 'Very High'];

export const IntensitySlider = ({ label, value, onChange }: IntensitySliderProps) => {
  return (
    <div className="space-y-3 animate-fade-in">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-foreground">{label}</label>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gradient-primary text-primary-foreground">
          {labels[value]}
        </span>
      </div>
      <Slider
        value={[value]}
        onValueChange={([newValue]) => onChange(newValue)}
        min={0}
        max={4}
        step={1}
        className="cursor-pointer"
      />
      <div className="flex justify-between text-xs text-muted-foreground px-1">
        <span>0</span>
        <span>1</span>
        <span>2</span>
        <span>3</span>
        <span>4</span>
      </div>
    </div>
  );
};
