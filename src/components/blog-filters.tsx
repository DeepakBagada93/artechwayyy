'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface BlogFiltersProps {
  allTags: string[];
}

export function BlogFilters({ allTags }: BlogFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSearch = searchParams.get('search') || '';
  const currentTag = searchParams.get('tag') || 'all';

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearch = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (newSearch) {
      params.set('search', newSearch);
    } else {
      params.delete('search');
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleTagChange = (newTag: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newTag !== 'all') {
      params.set('tag', newTag);
    } else {
      params.delete('tag');
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
      <div className="relative md:col-span-2">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search articles..."
          className="pl-10 h-12 text-base w-full"
          defaultValue={currentSearch}
          onChange={handleSearchChange}
        />
      </div>
      <div>
        <Select value={currentTag} onValueChange={handleTagChange}>
          <SelectTrigger className="h-12 text-base">
            <SelectValue placeholder="Filter by tag" />
          </SelectTrigger>
          <SelectContent>
            {allTags.map((tag) => (
              <SelectItem key={tag} value={tag}>
                {tag === 'all' ? 'All Topics' : tag}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
