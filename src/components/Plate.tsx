import type { ReactNode } from "react";

type PlateProps = {
  id: string;
  index: number;
  children: ReactNode;
  className?: string;
};

export function Plate({ id, index, children, className }: PlateProps) {
  return (
    <section
      className={className ? `plate ${className}` : "plate"}
      id={id}
      data-plate={index}
      aria-labelledby={`${id}-heading`}
    >
      <div className="plate__frame">{children}</div>
    </section>
  );
}
