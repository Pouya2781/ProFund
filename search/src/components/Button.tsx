import { ReactNode } from "react";

interface Props {
    children: ReactNode;
    color?: "primary" | "secondary" | "danger" | "success";
    onClick: () => void;
    className: string;
}

const Button = ({ className, children, onClick, color = "primary" }: Props) => {
  return (
    <button onClick={onClick} type="button" className={"btn btn-" + color + " " + className}>{children}</button>
  )
}

export default Button