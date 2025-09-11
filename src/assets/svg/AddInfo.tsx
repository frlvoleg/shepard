import * as React from 'react';
const AddInfo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={30} height={30} fill="none">
    <circle cx={15} cy={15} r={13} fill="#DDDAD3" opacity={0.75} />
    <g filter="url(#a)">
      <circle cx={15} cy={15} r={5} fill="#fff" />
    </g>
    <defs>
      <filter
        id="a"
        width={30}
        height={30}
        x={0}
        y={0}
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          result="hardAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset />
        <feGaussianBlur stdDeviation={5} />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix values="0 0 0 0 0.141176 0 0 0 0 0.121569 0 0 0 0 0.129412 0 0 0 0.8 0" />
        <feBlend
          in2="BackgroundImageFix"
          result="effect1_dropShadow_419_3663"
        />
        <feBlend
          in="SourceGraphic"
          in2="effect1_dropShadow_419_3663"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);
export default AddInfo;
