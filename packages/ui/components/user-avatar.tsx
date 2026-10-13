'use client';

import { useMemo } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Style, Avatar } from '@dicebear/core';
import openPeeps from '@dicebear/styles/open-peeps.json' with { type: 'json' };
import { cn } from '@rewardkit/lib/utils';
import { Avatar as CAvatar, AvatarFallback, AvatarImage } from './avatar';
import { getInitial } from '@rewardkit/lib/hashColor';

const style = new Style(openPeeps);

const avatarVariants = cva('shrink-0', {
    variants: {
        size: {
            xs: 'size-7.25',
            sm: 'size-8',
            md: 'size-10',
            lg: 'size-12',
            xl: 'size-18',
        },
    },
    defaultVariants: {
        size: 'sm',
    },
});

const fallbackVariants = cva('', {
    variants: {
        size: {
            xs: 'text-[10px]',
            sm: 'text-xs',
            md: 'text-sm',
            lg: 'text-base',
            xl: 'text-base'
        },
    },
    defaultVariants: {
        size: 'sm',
    },
});

// Pixel sizes matching the Tailwind classes above (used for DiceBear render size)
const SIZE_PX = { xs: 24, sm: 32, md: 40, lg: 48, xl: 62 } as const;

type UserAvatarProps = VariantProps<typeof avatarVariants> & {
    seed?: string;
    firstName?: string;
    className?: string;
};

export function UserAvatar({ seed = 'Alice', firstName, size, className }: UserAvatarProps) {
    const resolvedSize = size ?? 'sm';
    const px = SIZE_PX[resolvedSize];

    const dataUri = useMemo(
        () =>
            new Avatar(style, {
                seed,
                size: px * 2, 
                scale: 0.9,
                expressionVariant: ['calm', 'cheeky', 'contempt', 'smile'],
                accessoriesVariant: ['eyepatch', 'sunglasses', 'sunglasses2', 'glasses4'],
                backgroundColor: ['ece7de'],
                clothingColor: ['9aa88f', 'c08e77', '8fa3b8', 'd9cbb3', 'b09aa8', '7d8894'],
                headContrastColor: ['2c1b18', '724133', '4a312c', 'a55728', 'b58143', 'd6b370'],
                skinColor: ['ffdbb4', 'edb98a', 'd08b5b'],
                maskProbability: 0,
            }).toDataUri(),
        [seed, px],
    );

    return (
        <CAvatar className={cn(avatarVariants({ size: resolvedSize }), className)}>
            <AvatarImage src={dataUri} />
            <AvatarFallback className={fallbackVariants({ size: resolvedSize })}>
                {getInitial(firstName)}
            </AvatarFallback>
        </CAvatar>
    );
}