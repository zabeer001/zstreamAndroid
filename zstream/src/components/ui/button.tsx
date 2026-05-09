import { createButton } from '@gluestack-ui/core/button/creator';
import { cn } from '@gluestack-ui/utils/nativewind-utils';
import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

type StyledProps<T extends React.ElementType> = React.ComponentPropsWithoutRef<T> & {
  className?: string;
  states?: unknown;
};

const ButtonRoot = React.forwardRef<React.ComponentRef<typeof Pressable>, StyledProps<typeof Pressable>>(
  ({ className, states: _states, ...props }, ref) => (
    <Pressable
      ref={ref}
      className={cn(
        'h-12 flex-row items-center justify-center gap-3 rounded-md border border-outline-200 bg-background-0 px-4 active:bg-background-50 disabled:opacity-50 dark:border-outline-800 dark:bg-background-900 dark:active:bg-background-800',
        className
      )}
      {...props}
    />
  )
);

ButtonRoot.displayName = 'ButtonRoot';

const ButtonTextRoot = React.forwardRef<React.ComponentRef<typeof Text>, StyledProps<typeof Text>>(
  ({ className, states: _states, ...props }, ref) => (
    <Text
      ref={ref}
      className={cn('text-sm font-bold text-typography-950 dark:text-typography-0', className)}
      {...props}
    />
  )
);

ButtonTextRoot.displayName = 'ButtonTextRoot';

const ButtonGroupRoot = React.forwardRef<React.ComponentRef<typeof View>, StyledProps<typeof View>>(
  ({ className, states: _states, ...props }, ref) => (
    <View ref={ref} className={cn('gap-3', className)} {...props} />
  )
);

ButtonGroupRoot.displayName = 'ButtonGroupRoot';

const ButtonSpinnerRoot = React.forwardRef<
  React.ComponentRef<typeof ActivityIndicator>,
  StyledProps<typeof ActivityIndicator>
>(({ states: _states, ...props }, ref) => <ActivityIndicator ref={ref} {...props} />);

ButtonSpinnerRoot.displayName = 'ButtonSpinnerRoot';

const ButtonIconRoot = React.forwardRef<React.ComponentRef<typeof View>, StyledProps<typeof View>>(
  ({ className, states: _states, ...props }, ref) => (
    <View ref={ref} className={cn('items-center justify-center', className)} {...props} />
  )
);

ButtonIconRoot.displayName = 'ButtonIconRoot';

export const Button = createButton({
  Root: ButtonRoot,
  Text: ButtonTextRoot,
  Group: ButtonGroupRoot,
  Spinner: ButtonSpinnerRoot,
  Icon: ButtonIconRoot,
});
