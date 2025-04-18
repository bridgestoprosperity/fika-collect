import React from 'react';
import {useNavigation} from '../hooks/navigation';

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  confirm?: () => boolean;
}

const Link: React.FC<LinkProps> = ({
  to,
  confirm = () => false,
  onClick,
  ...props
}) => {
  const navigate = useNavigation();

  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    if (onClick) {
      onClick(event);
    }

    if (
      confirm() &&
      !window.confirm(
        'Are you sure you want to navigate away? Changes you made may not be saved.',
      )
    ) {
      event.preventDefault();
      return;
    }

    if (!event.defaultPrevented) {
      event.preventDefault();
      navigate(to);
    }
  };

  return (
    <a href={to} onClick={handleClick} {...props}>
      {props.children || 'Link'}
    </a>
  );
};

export default Link;
