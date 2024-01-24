"use client";

interface props extends React.HTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: React.ReactNode;
}
const Button = (props: props) => {
  const { className, children, ...buttonProps } = props;
  return (
    <button className={`border border-red-500 ${className}`} {...buttonProps}>
      {props.children}
    </button>
  );
};

export default Button;
