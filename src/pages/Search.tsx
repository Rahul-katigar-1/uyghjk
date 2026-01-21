import { useState } from 'react';
import { Search as SearchIcon, MapPin, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MachineCard } from '@/components/MachineCard';
import { mockMachines } from '@/data/mockData';

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const statusFilters = [
    { id: null, label: 'All' },
    { id: 'online', label: 'Online' },
    { id: 'low-stock', label: 'Low Stock' },
    { id: 'offline', label: 'Offline' },
  ];

  const filteredMachines = mockMachines.filter((machine) => {
    const matchesSearch =
      machine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      machine.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      machine.address.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === null || machine.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50 px-4 py-4 safe-top">
        <h1 className="text-xl font-bold text-foreground mb-4">Search Machines</h1>

        {/* Search Bar */}
        <div className="relative mb-4">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10 h-11 rounded-xl bg-muted/50 border-0 focus-visible:ring-2 focus-visible:ring-primary"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 rounded-lg"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </Button>
        </div>

        {/* Status Filters */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {statusFilters.map((filter) => (
            <Button
              key={filter.id || 'all'}
              variant={statusFilter === filter.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(filter.id)}
              className={`rounded-full whitespace-nowrap ${
                statusFilter === filter.id
                  ? 'bg-gradient-primary text-white border-0'
                  : 'hover:bg-muted'
              }`}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="px-4 py-5">
        {/* Results Count */}
        <p className="text-sm text-muted-foreground mb-4">
          {filteredMachines.length} machine{filteredMachines.length !== 1 ? 's' : ''} found
        </p>

        {/* Results */}
        {filteredMachines.length > 0 ? (
          <div className="space-y-4">
            {filteredMachines.map((machine, index) => (
              <MachineCard key={machine.id} machine={machine} index={index} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <MapPin className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">No machines found</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
