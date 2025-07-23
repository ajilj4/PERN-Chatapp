import clsx from 'clsx';

export default function Card({
  children,
  className,
  padding = 'md',
  shadow = 'sm',
  rounded = 'lg',
  border = true,
  hover = false,
  ...props
}) {
  const baseClasses = 'bg-white';
  
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  };
  
  const shadows = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl'
  };
  
  const roundeds = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full'
  };
  
  const classes = clsx(
    baseClasses,
    paddings[padding],
    shadows[shadow],
    roundeds[rounded],
    border && 'border border-gray-200',
    hover && 'hover:shadow-md transition-shadow duration-200',
    className
  );
  
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}

// Card Header Component
export function CardHeader({ children, className, ...props }) {
  return (
    <div className={clsx('border-b border-gray-200 pb-4 mb-4', className)} {...props}>
      {children}
    </div>
  );
}

// Card Body Component
export function CardBody({ children, className, ...props }) {
  return (
    <div className={clsx('flex-1', className)} {...props}>
      {children}
    </div>
  );
}

// Card Footer Component
export function CardFooter({ children, className, ...props }) {
  return (
    <div className={clsx('border-t border-gray-200 pt-4 mt-4', className)} {...props}>
      {children}
    </div>
  );
}
