
import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

export const UploadIcon: React.FC<IconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 16.5V9.75m0 0l-3.75 3.75M12 9.75l3.75 3.75M3 17.25V21h18v-3.75m-18 0V12a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 12v5.25"
    />
  </svg>
);


export const BananaIcon: React.FC<IconProps> = (props) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        {...props}
    >
        <path d="M16.8,4.12A7.83,7.83,0,0,0,10.6,3.18a7.83,7.83,0,0,0-7.25,5.1,10.15,10.15,0,0,0,1.44,9.69,8,8,0,0,0,9.7,1.44,8,8,0,0,0,4.88-7.28A10.2,10.2,0,0,0,16.8,4.12ZM18,12.13a6,6,0,0,1-3.66,5.46,6,6,0,0,1-7.28-1.08,8.14,8.14,0,0,1-1.15-7.75,5.85,5.85,0,0,1,5.45-3.67,5.8,5.8,0,0,1,6.33,5.91A8.19,8.19,0,0,1,18,12.13Z"/>
    </svg>
);
