import type { ReactNode } from "react";

type PlateProps = {
  id: string;
  index: number;
  kicker: string;
  children: ReactNode;
};

export function Plate({ id, index, kicker, children }: PlateProps) {
  const n = String(index).padStart(2, "0");
  return (
    <section
      className="plate"
      id={id}
      data-plate={index}
      aria-labelledby={`${id}-heading`}
    >
      <div className="plate__frame">
        <p className="plate__kicker">
          <span className="plate__num">{n}</span>
          {kicker}
        </p>
        {children}
      </div>
    </section>
  );
}
