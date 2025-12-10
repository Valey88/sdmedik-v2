import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Regions } from "@/constants/regions";
import { MapPin } from "lucide-react";

interface RegionSelectorProps {
  selectedRegion: string;
  onRegionChange: (value: string) => void;
}

export default function RegionSelector({
  selectedRegion,
  onRegionChange,
}: RegionSelectorProps) {
  // Находим имя выбранного региона для отображения
  const regionName = Regions.find((r) => r.value === selectedRegion)?.name;

  return (
    <div>
      <label className="text-xs text-slate-500 mb-1.5 flex items-center gap-1 font-medium">
        <MapPin className="w-3 h-3 text-[#00B3A4]" /> Регион получения
      </label>
      <Select value={selectedRegion} onValueChange={onRegionChange}>
        <SelectTrigger className="w-full h-10 bg-white border-slate-200 focus:ring-[#00B3A4] text-sm">
          <SelectValue placeholder="Выберите регион">
            {regionName || "Выберите регион"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {Regions.map((region) => (
            <SelectItem key={region.value} value={region.value}>
              {region.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
