import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useRef } from "react";

const Button = ({ title, LeftIcon, RightIcon }) => {
  const buttonRef = useRef(null);
  const split1Ref = useRef(null);
  const split2Ref = useRef(null);

  useGSAP(() => {
    if (split1Ref.current) {
      split1Ref.current.split = SplitText.create(split1Ref.current, {
        type: "chars",
      });
    }
    if (split2Ref.current) {
      split2Ref.current.split = SplitText.create(split2Ref.current, {
        type: "chars",
      });
    }
    return () => {
      if (split1Ref.current && split1Ref.current.split) {
        split1Ref.current.split.revert();
      }
      if (split2Ref.current && split2Ref.current.split) {
        split2Ref.current.split.revert();
      }
    };
  }, []);

  const animateButton = (status) => {
    const refs = [split1Ref, split2Ref];
    refs.forEach((ref) => {
      if (!ref.current || !ref.current.split) return;
      const chars = ref.current.split.chars;
      if (status === "enter") {
        gsap.to(chars, {
          yPercent: -100,
          ease: "power2.out",
          stagger: { amount: 0.05 },
        });
      } else if (status === "leave") {
        gsap.to(chars, {
          yPercent: 0,
          ease: "power2.out",
          stagger: { amount: 0.05 },
        });
      }
    });
  };

  return (
    <button
      ref={buttonRef}
      onMouseEnter={() => animateButton("enter")}
      onMouseLeave={() => animateButton("leave")}
      className="rounded-full z-[15] absolute transition-all bg-yellow flex font-general font-semibold text-xs overflow-hidden w-fit items-center p-3"
      style={{
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
      }}
    >
      <div className="flex items-center">
        {LeftIcon}
        <div className="relative overflow-hidden">
          <div ref={split1Ref} className="animated_word">
            {title}
          </div>
          <div ref={split2Ref} className="absolute top-full animated_word">
            {title}
          </div>
        </div>
        {RightIcon}
      </div>
    </button>
  );
};

export default Button;
