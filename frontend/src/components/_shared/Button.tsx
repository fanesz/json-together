"use client";

import { useRouter } from "next/navigation";

interface props extends React.HTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: React.ReactNode;
  to?: string;
}
const Button = (props: props) => {
  const { className, children, to, ...buttonProps } = props;
  const router = useRouter();

  const handleRedirect = () => {
    if (to) {
      router.push(to);
    }
  }

  return (
    <button
      className={`border border-red-500 ${className}`}
      onClick={handleRedirect}
      {...buttonProps}
    >
      {props.children}
    </button>
  );
};

export default Button;
