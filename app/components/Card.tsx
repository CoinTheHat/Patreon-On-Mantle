import React from 'react';

export default function Card({ children, className = '', padding = 'lg', style = {}, ...props }: any) {
    const paddingMap: any = {
        none: '0',
        sm: '16px',
        md: '24px',
        lg: '32px'
    };

    return (
        <div
            className={`card-surface ${className}`}
            style={{
                padding: paddingMap[padding],
                position: 'relative',
                overflow: 'hidden',
                ...style
            }}
            {...props}
        >
            {children}
        </div>
    );
}
