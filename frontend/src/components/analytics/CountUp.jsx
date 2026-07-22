import { useEffect, useState } from "react";

export default function CountUp({ value, duration = 800, suffix = "" }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = null;
    const from = display;
    const to = value;

    function step(timestamp) {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplay(Math.round(from + (to - from) * eased));
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <span>
      {display}
      {suffix}
    </span>
  );
}
