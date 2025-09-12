import React from 'react';

interface StepProps {
  isActive?: boolean;
  isCompleted?: boolean;
  stepNumber?: number;
  onClick?: () => void;
}

export const Step: React.FC<StepProps> = ({
  isActive = false,
  isCompleted = false,
  stepNumber,
  onClick,
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  // Completed step - green with checkmark
  if (isCompleted) {
    return (
      <div
        onClick={handleClick}
        style={{ cursor: onClick ? 'pointer' : 'default' }}
      >
        <svg
          width="25"
          height="24"
          viewBox="0 0 25 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0.166504 12C0.166504 5.37258 5.53909 0 12.1665 0C18.7939 0 24.1665 5.37258 24.1665 12C24.1665 18.6274 18.7939 24 12.1665 24C5.53909 24 0.166504 18.6274 0.166504 12Z"
            fill="#0a4ea2"
          />
          <path
            d="M8.16602 12L11.166 15L16.166 9"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }

  // Active step - blue with white center
  if (isActive) {
    return (
      <div
        onClick={handleClick}
        style={{ cursor: onClick ? 'pointer' : 'default' }}
      >
        <svg
          width="25"
          height="24"
          viewBox="0 0 25 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0.166504 12C0.166504 5.37258 5.53909 0 12.1665 0C18.7939 0 24.1665 5.37258 24.1665 12C24.1665 18.6274 18.7939 24 12.1665 24C5.53909 24 0.166504 18.6274 0.166504 12Z"
            fill="#015EBE"
          />
          {stepNumber ? (
            <text
              x="12.1665"
              y="16"
              textAnchor="middle"
              fill="white"
              fontSize="12"
              fontWeight="600"
            >
              {stepNumber}
            </text>
          ) : (
            <circle cx="12.1665" cy="12" r="4" fill="white" />
          )}
        </svg>
      </div>
    );
  }

  // Default step - gray outline
  return (
    <div
      onClick={handleClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <svg
        width="25"
        height="24"
        viewBox="0 0 25 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12.5 0.75C18.7132 0.75 23.75 5.7868 23.75 12C23.75 18.2132 18.7132 23.25 12.5 23.25C6.2868 23.25 1.25 18.2132 1.25 12C1.25 5.7868 6.2868 0.75 12.5 0.75Z"
          stroke="#E2E8F0"
          strokeWidth="1.5"
        />
        {stepNumber ? (
          <text
            x="12.5"
            y="16"
            textAnchor="middle"
            fill="#94A3B8"
            fontSize="12"
            fontWeight="500"
          >
            {stepNumber}
          </text>
        ) : (
          <circle cx="12.5" cy="12" r="4" fill="#CBD5E1" />
        )}
      </svg>
    </div>
  );
};
