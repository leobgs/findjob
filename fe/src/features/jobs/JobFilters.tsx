import React, { useState, useEffect } from 'react';
import { Search, MapPin, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { JobType } from '@/types';

interface JobFiltersProps {
  search?: string;
  jobType?: JobType;
  location?: string;
  onFilterChange: (filters: {
    search?: string;
    jobType?: JobType;
    location?: string;
    page: number;
  }) => void;
}

export const JobFilters: React.FC<JobFiltersProps> = ({
  search = '',
  jobType,
  location = '',
  onFilterChange,
}) => {
  const [searchInput, setSearchInput] = useState(search);
  const [locationInput, setLocationInput] = useState(location);
  const [selectedJobType, setSelectedJobType] = useState<JobType | undefined>(
    jobType
  );

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  useEffect(() => {
    setLocationInput(location);
  }, [location]);

  useEffect(() => {
    setSelectedJobType(jobType);
  }, [jobType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({
      search: searchInput.trim() || undefined,
      location: locationInput.trim() || undefined,
      jobType: selectedJobType,
      page: 1,
    });
  };

  const handleReset = () => {
    setSearchInput('');
    setLocationInput('');
    setSelectedJobType(undefined);
    onFilterChange({
      search: undefined,
      location: undefined,
      jobType: undefined,
      page: 1,
    });
  };

  const hasActiveFilters = !!search || !!jobType || !!location;

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 rounded-xl border border-border bg-card p-4 shadow-sm"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12">
        {/* Keyword Search */}
        <div className="relative sm:col-span-2 lg:col-span-4">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Cari posisi pekerjaan..."
            className="pl-9"
          />
        </div>

        {/* Location Search */}
        <div className="relative sm:col-span-1 lg:col-span-3">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            placeholder="Kota / Lokasi / Remote"
            className="pl-9"
          />
        </div>

        {/* Job Type Dropdown */}
        <div className="sm:col-span-1 lg:col-span-3">
          <Select
            value={selectedJobType || ''}
            onChange={(e) =>
              setSelectedJobType(
                e.target.value ? (e.target.value as JobType) : undefined
              )
            }
          >
            <option value="">Semua Tipe Pekerjaan</option>
            <option value="FULL_TIME">Full Time</option>
            <option value="PART_TIME">Part Time</option>
            <option value="CONTRACT">Kontrak</option>
            <option value="INTERNSHIP">Magang</option>
            <option value="FREELANCE">Freelance</option>
          </Select>
        </div>

        {/* Actions */}
        <div className="flex gap-2 sm:col-span-2 lg:col-span-2">
          <Button type="submit" className="flex-1 gap-1.5">
            <Filter className="h-4 w-4" />
            Terapkan
          </Button>

          {hasActiveFilters && (
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="px-3"
              title="Reset Filter"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </form>
  );
};

