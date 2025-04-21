import React from 'react';

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  confirm?: () => boolean;
}

const Link: React.FC<LinkProps> = ({to, onClick, ...props}) => {
  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    if (onClick) {
      onClick(event);
    }

    if (!event.defaultPrevented) {
      event.preventDefault();
      //navigate(to);
    }
  };

  return (
    <a href={to} onClick={handleClick} {...props}>
      {props.children || 'Link'}
    </a>
  );
};

export default Link;
