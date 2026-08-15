import React, { useRef } from 'react';
import { useSpring, animated } from '@react-spring/web';

const calc = (x, y, rect) => [
  -(y - rect.top - rect.height / 2) / 25,
  (x - rect.left - rect.width / 2) / 25,
  1.02,
];

const trans = (x, y, s) =>
  `perspective(1000px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`;

export function TiltCard({ children, className = '', onClick }) {
  const ref = useRef(null);
  const [props, set] = useSpring(() => ({
    xys: [0, 0, 1],
    config: { mass: 1.2, tension: 350, friction: 25 },
  }));

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    set({ xys: calc(e.clientX, e.clientY, rect) });
  };

  const handleMouseLeave = () => {
    set({ xys: [0, 0, 1] });
  };

  return (
    <animated.div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        transform: props.xys.to(trans),
      }}
    >
      {children}
    </animated.div>
  );
}

export default TiltCard;
