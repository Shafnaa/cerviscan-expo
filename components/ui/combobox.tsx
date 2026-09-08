import { Search } from 'lucide-react-native';
import * as React from 'react';
import { TextInput, View } from 'react-native';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { Text } from '~/components/ui/text';
import { useColorScheme } from '~/lib/useColorScheme';

type ComboboxOption = {
  value: string;
  label: string;
};

type ComboboxProps = {
  items: ComboboxOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
};

const MUTED_FOREGROUND = {
  light: 'hsl(240 3.8% 46.1%)',
  dark: 'hsl(240 5% 64.9%)',
};

function Combobox({
  items,
  value,
  onValueChange,
  placeholder = 'Select an option',
  searchPlaceholder = 'Search...',
  emptyMessage = 'No results found.',
  disabled = false,
  className,
}: ComboboxProps) {
  const { colorScheme } = useColorScheme();
  const [search, setSearch] = React.useState('');

  const selected = items.find((item) => item.value === value);

  const filtered = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return items;
    }
    return items.filter((item) => item.label.toLowerCase().includes(query));
  }, [items, search]);

  return (
    <Select
      value={selected}
      onValueChange={(option) => {
        onValueChange?.(option?.value ?? '');
      }}
      onOpenChange={(open) => {
        if (open) {
          setSearch('');
        }
      }}
      disabled={disabled}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <View className="-mx-1 -mt-1 flex-row items-center gap-2 border-b border-border px-3 py-2">
          <Search size={16} color={MUTED_FOREGROUND[colorScheme]} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder={searchPlaceholder}
            placeholderTextColor={MUTED_FOREGROUND[colorScheme]}
            className="native:text-base flex-1 text-sm text-foreground"
          />
        </View>
        {filtered.length === 0 ? (
          <Text className="py-6 text-center text-sm text-muted-foreground">{emptyMessage}</Text>
        ) : (
          filtered.map((item) => (
            <SelectItem key={item.value} value={item.value} label={item.label} />
          ))
        )}
      </SelectContent>
    </Select>
  );
}

export { Combobox };
export type { ComboboxOption, ComboboxProps };
