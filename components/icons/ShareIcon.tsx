import React from 'react';

const ShareIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
      d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.195.025.39.042.583.042h6.417c.193 0 .388-.017.583-.042m-7.583 2.186c-.195-.025-.39-.042-.583-.042H4.75c-.193 0-.388.017-.583.042m7.583-2.186c.195-.025.39-.042.583-.042h6.417c.193 0 .388-.017.583-.042m0 0a2.25 2.25 0 100-2.186m0 2.186c-.195.025-.39.042-.583.042h-6.417c-.193 0-.388-.017-.583-.042m0 0a2.25 2.25 0 100 2.186"
    />
  </svg>
);

export default ShareIcon;