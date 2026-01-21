import { Machine } from '@/types';
import { MapPin, Thermometer, Box } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface MachineCardProps {
  machine: Machine;
  index?: number;
}

export function MachineCard({ machine, index = 0 }: MachineCardProps) {
  const statusConfig = {
    online: { class: 'status-online', label: 'Online' },
    offline: { class: 'status-offline', label: 'Offline' },
    'low-stock': { class: 'status-low-stock', label: 'Low Stock' },
  };

  const status = statusConfig[machine.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
    >
      <Link to={`/machine/${machine.id}`}>
        <div className="glass-card rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
          {/* Image */}
          <div className="relative h-32 overflow-hidden">
            <img
              src={machine.image}
              alt={machine.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            
            {/* Status Badge */}
            <div className="absolute top-3 right-3 flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm">
              <div className={cn("status-dot", status.class)} />
              <span className="text-xs font-medium text-foreground">{status.label}</span>
            </div>

            {/* Distance Badge */}
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
              <MapPin className="w-3 h-3" />
              {machine.distance} km
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="font-semibold text-foreground truncate mb-1">
              {machine.name}
            </h3>
            <p className="text-sm text-muted-foreground truncate mb-3">
              {machine.location}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Thermometer className="w-3.5 h-3.5 text-primary" />
                  {machine.temperature}°C
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Box className="w-3.5 h-3.5 text-secondary" />
                  {machine.availableItems} items
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
