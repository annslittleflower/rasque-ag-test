import { ComponentPropsWithoutRef } from 'react';

type ButtonProps = ComponentPropsWithoutRef<'button'>;

const Button = ({
  children,
  className,
  type = 'button',
  ...rest
}: ButtonProps) => (
  <button
    className={className}
    type={type || 'button'}
    {...rest}
  >
    {children}
  </button>
);

export default Button;