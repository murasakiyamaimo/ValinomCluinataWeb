import React, { ReactNode } from 'react';

interface ComingSoonOverlayProps {
    children: ReactNode;
    message?: string;
}

const HoverCard: React.FC<ComingSoonOverlayProps> = ({
                                                                 children,
                                                                 message = 'Coming Soon...',
                                                             }) => {
    return (
        <div className="relative group inline-block">
            {children}
            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md">
        <span className="text-white font-bold text-xs">
          {message}
        </span>
            </div>
        </div>
    );
};

export default HoverCard;