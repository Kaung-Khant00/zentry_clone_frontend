import gsap from "gsap";
import React, { useEffect, useRef } from "react";

const HoverCard = ({ children }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      function handleMouseMove(e) {
        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const halfWidth = width / 2;
        const halfHeight = height / 2;
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Calculate rotation degrees based on mouse position
        const rotateY = (x - halfWidth) / halfWidth; // max 10deg
        const rotateX = -((y - halfHeight) / halfHeight); // max 10deg

        ref.current.style.transform = ` rotate3d(${rotateX}, ${rotateY}, 0, 25deg) `;
      }
      ref.current.addEventListener("mousemove", handleMouseMove);
    }
  });

  return (
    <div ref={ref} className=" perspective(400px) size-52 overflow-hidden">
      {children}
    </div>
  );
};

export default HoverCard;
