import * as SelectPrimitive from '@rn-primitives/select';
import { Check, ChevronDown, ChevronUp } from 'lucide-react-native';
import * as React from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';

import { TextClassContext } from '~/components/ui/text';
import { NAV_THEME } from '~/lib/constants';
import { useColorScheme } from '~/lib/useColorScheme';
import { cn } from '~/lib/utils';

const MUTED_FOREGROUND = {
  light: 'hsl(240 3.8% 46.1%)',
  dark: 'hsl(240 5% 64.9%)',
};

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

function SelectValue({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Value>) {
  const { value } = SelectPrimitive.useRootContext();
  return (
    <SelectPrimitive.Value
      className={cn(
        'native:text-base text-sm text-foreground',
        !value && 'text-muted-foreground',
        className
      )}
      {...props}
    />
  );
}

function SelectTrigger({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & {
  children?: React.ReactNode;
}) {
  const { colorScheme } = useColorScheme();
  return (
    <SelectPrimitive.Trigger
      className={cn(
        'native:h-12 flex h-10 flex-row items-center justify-between gap-2 rounded-md border border-input bg-background px-3 py-2 web:w-fit web:whitespace-nowrap web:ring-offset-background web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2',
        props.disabled && 'opacity-50 web:cursor-not-allowed',
        className
      )}
      {...props}>
      {children}
      <ChevronDown size={16} color={MUTED_FOREGROUND[colorScheme]} />
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className,
  children,
  position = 'popper',
  portalHost,
  insets,
  sideOffset = 4,
  ...props
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content> & {
  portalHost?: string;
}) {
  const { triggerPosition } = SelectPrimitive.useRootContext();
  return (
    <SelectPrimitive.Portal hostName={portalHost}>
      <SelectPrimitive.Overlay style={Platform.OS !== 'web' ? StyleSheet.absoluteFill : undefined}>
        <TextClassContext.Provider value="native:text-popover-foreground">
          <SelectPrimitive.Content
            sideOffset={sideOffset}
            insets={insets}
            position={position}
            className={cn(
              'relative z-50 rounded-md border border-border bg-popover shadow-md shadow-black/5',
              Platform.OS === 'web' &&
                'animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 min-w-[8rem] overflow-hidden',
              className
            )}
            style={Platform.select({ native: { minWidth: triggerPosition?.width } })}
            {...props}>
            <SelectScrollUpButton />
            <SelectPrimitive.Viewport
              className={cn(
                position === 'popper' &&
                  Platform.select({
                    web: 'min-w-[var(--radix-select-trigger-width)]',
                  })
              )}>
              <ScrollView
                className="p-1"
                style={{ maxHeight: 288 }}
                nestedScrollEnabled
                keyboardShouldPersistTaps="handled">
                {children}
              </ScrollView>
            </SelectPrimitive.Viewport>
            <SelectScrollDownButton />
          </SelectPrimitive.Content>
        </TextClassContext.Provider>
      </SelectPrimitive.Overlay>
    </SelectPrimitive.Portal>
  );
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> & {
  children?: React.ReactNode;
}) {
  const { colorScheme } = useColorScheme();
  return (
    <SelectPrimitive.Item
      className={cn(
        'native:py-1.5 relative flex w-full flex-row items-center rounded-sm py-2 pl-2 pr-8 active:bg-accent',
        Platform.OS === 'web' &&
          'cursor-default outline-none focus:bg-accent focus:text-accent-foreground',
        props.disabled && 'opacity-50 web:pointer-events-none',
        className
      )}
      {...props}>
      <SelectPrimitive.ItemText className="native:text-base text-sm text-foreground web:select-none" />
      {children}
      <View className="absolute right-2 flex h-4 w-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check size={16} strokeWidth={3} color={NAV_THEME[colorScheme].text} />
        </SelectPrimitive.ItemIndicator>
      </View>
    </SelectPrimitive.Item>
  );
}

function SelectLabel({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      className={cn('native:py-1.5 px-2 py-2 text-xs text-muted-foreground', className)}
      {...props}
    />
  );
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator className={cn('-mx-1 my-1 h-px bg-border', className)} {...props} />
  );
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  const { colorScheme } = useColorScheme();
  if (Platform.OS !== 'web') {
    return null;
  }
  return (
    <SelectPrimitive.ScrollUpButton
      className={cn('flex cursor-default items-center justify-center py-1', className)}
      {...props}>
      <ChevronUp size={16} color={MUTED_FOREGROUND[colorScheme]} />
    </SelectPrimitive.ScrollUpButton>
  );
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  const { colorScheme } = useColorScheme();
  if (Platform.OS !== 'web') {
    return null;
  }
  return (
    <SelectPrimitive.ScrollDownButton
      className={cn('flex cursor-default items-center justify-center py-1', className)}
      {...props}>
      <ChevronDown size={16} color={MUTED_FOREGROUND[colorScheme]} />
    </SelectPrimitive.ScrollDownButton>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
