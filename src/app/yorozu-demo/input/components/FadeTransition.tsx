"use client";

import { useEffect, useState } from "react";

type FadeTransitionProps = {
  show: boolean;
  children: React.ReactNode;
  className?: string;
};

export const FadeTransition = ({
  show,
  children,
  className,
}: FadeTransitionProps) => {
  const [shouldRender, setShouldRender] = useState(show);
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    let firstFrame: number | null = null;
    let secondFrame: number | null = null;
    let timeout: number | null = null;

    if (show) {
      firstFrame = window.requestAnimationFrame(() => {
        setShouldRender(true);
        secondFrame = window.requestAnimationFrame(() => {
          setVisible(true);
        });
      });
    } else {
      secondFrame = window.requestAnimationFrame(() => {
        setVisible(false);
      });
      timeout = window.setTimeout(() => setShouldRender(false), 200);
    }

    return () => {
      if (firstFrame !== null) {
        window.cancelAnimationFrame(firstFrame);
      }
      if (secondFrame !== null) {
        window.cancelAnimationFrame(secondFrame);
      }
      if (timeout !== null) {
        window.clearTimeout(timeout);
      }
    };
  }, [show]);

  if (!shouldRender) {
    return null;
  }

  return (
    <div
      className={`transition-opacity duration-200 ${
        visible ? "opacity-100" : "opacity-0"
      } ${className ?? ""}`}
    >
      {children}
    </div>
  );
};
