'use client';

import Icon from "@/src/components/ui/Icon/Icon";
import React from 'react';

export type ButtonVariant = 'orange' | 'main-light' | 'main-green-dark';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    withArrow?: boolean;
};

export default function Button({
   variant = 'orange',
   withArrow = false,
   className = '',
   children,
   ...props
}: ButtonProps) {
    return (
        <button
            className={`button button--${variant} ${className}`}
            {...props}
        >
            <span className="button__text">{children}</span>
            {withArrow && (
                <span className="button__arrow">
                    <Icon name="arrow-long" />
                </span>
            )}
        </button>
    );
}
