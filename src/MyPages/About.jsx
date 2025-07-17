import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/all";
import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import aboutImage from "../../public/img/about.webp";
import stoneImage from "../../public/img/stones.webp";

gsap.registerPlugin(SplitText, ScrollTrigger);

const About = () => {
  const animatedWordsRef = useRef(null);
  const ref = useRef(null);
  const [isAnimatable, setIsAnimatable] = useState(true);
  const positionRef = useRef({
    corner1: { x: 0, y: 0 },
    corner2: { x: 0, y: 0 },
    corner3: { x: 0, y: 0 },
    corner4: { x: 0, y: 0 },
    cursor: { x: 0, y: 0 },
  });
  function lerp(old, target, t) {
    return old + (target - old) * t;
  }

  function handleMouseMove(e) {
    const defaultValue = 55,
      range = 5,
      followRange = 0,
      perspective = 3,
      centerRange = (100 - defaultValue - (range + followRange) / 2) / 2;
    const preAddedValue = {
      corner1: { x: 0, y: 0 },
      corner2: { x: -3, y: 3 },
      corner3: { x: 3, y: -3 },
      corner4: { x: 0, y: 0 },
    };
    const imageMove = 10;
    const reduceValue = 0.9;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const left = rect.left;
    const top = rect.top;
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    const p = positionRef.current;

    p.cursor.x = lerp(p.cursor.x, e.clientX || 0, 0.05);
    p.cursor.y = lerp(p.cursor.y, e.clientY || 0, 0.05);
    const x = p.cursor.x - (halfWidth + left);
    const y = p.cursor.y - (halfHeight + top);

    const xValue = -(x / halfWidth) * reduceValue;
    const yValue = -(y / halfHeight) * reduceValue;

    const xPerspective = -(x / halfWidth) * perspective;
    const yPerspective = -(y / halfHeight) * perspective;

    const moveXValue = -xValue * followRange + centerRange;
    const moveYValue = -yValue * followRange + centerRange;
    positionRef.current.corner1.x =
      range +
      (range * (yValue + xValue)) / 2 +
      moveXValue +
      (xPerspective > 0 ? xPerspective : 0) +
      preAddedValue.corner1.x;
    positionRef.current.corner1.y =
      range +
      (range * (yValue + xValue)) / 2 +
      moveYValue +
      (yPerspective > 0 ? yPerspective : 0) +
      preAddedValue.corner1.y;

    positionRef.current.corner2.x =
      defaultValue +
      (range * (xValue - yValue)) / 2 +
      moveXValue +
      (xPerspective < 0 ? xPerspective : 0) +
      preAddedValue.corner2.x;
    positionRef.current.corner2.y =
      range -
      (range * (xValue - yValue)) / 2 +
      moveYValue +
      (yPerspective > 0 ? yPerspective : 0) +
      preAddedValue.corner2.y;

    positionRef.current.corner3.x =
      defaultValue +
      (range * (xValue + yValue)) / 2 +
      moveXValue +
      (xPerspective < 0 ? xPerspective : 0) +
      preAddedValue.corner3.x;
    positionRef.current.corner3.y =
      defaultValue +
      (range * (xValue + yValue)) / 2 +
      moveYValue +
      (yPerspective < 0 ? yPerspective : 0) +
      preAddedValue.corner3.y;

    positionRef.current.corner4.x =
      range -
      (range * (yValue - xValue)) / 2 +
      moveXValue +
      (xPerspective > 0 ? xPerspective : 0) +
      preAddedValue.corner4.x;
    positionRef.current.corner4.y =
      defaultValue +
      (range * (yValue - xValue)) / 2 +
      moveYValue +
      (yPerspective < 0 ? yPerspective : 0) +
      preAddedValue.corner4.y;
    console.log("moving");

    // Use ref values for GSAP clip-path
    const clipPathValue = `polygon(${p.corner1.x}% ${p.corner1.y}%, ${p.corner2.x}% ${p.corner2.y}%, ${p.corner3.x}% ${p.corner3.y}%, ${p.corner4.x}% ${p.corner4.y}% )`;
    gsap.to(".clip_path", {
      clipPath: clipPathValue,
      duration: 0.5,
    });
    gsap.to(".about_image", {
      x: xValue * imageMove,
      y: yValue * imageMove,
    });
  }
  useEffect(() => {
    if (ref.current && isAnimatable) {
      ref.current.addEventListener("mousemove", handleMouseMove);
    }
    return () => {
      if (ref.current) {
        ref.current.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, [isAnimatable]);

  useGSAP(() => {
    if (animatedWordsRef.current) {
      animatedWordsRef.current.split = SplitText.create(
        animatedWordsRef.current,
        {
          type: "chars",
        }
      );
      if (animatedWordsRef.current?.split) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ".animated-word",
            start: "top bottom",
            toggleActions: "play none none reverse",
            markers: true,
          },
        });
        tl.from(".animated-word", {
          opacity: 0.5,
          x: "20px",
          y: "51px",
          z: "-60px",
          rotateY: -90,
          rotateX: -30,
          duration: 1,
          transformOrigin: "50% 50% -150px",
        });
        tl.from(
          animatedWordsRef.current.split.chars,
          {
            opacity: 0.5,
            duration: 0.5,
            ease: "power2.out",
            stagger: { amount: 0.8 },
            toggleActions: "play none none reverse",
          },
          "<"
        );
      }
    }
    if (ref.current) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".about_pin",
          start: "top top",
          end: "=+120%",
          pin: true,
          scrub: 1,
          onEnter: () => {
            setIsAnimatable(false);
          },
          onLeaveBack: () => {
            setIsAnimatable(true);
          },
        },
      });
      tl.to(ref.current, {
        width: "100% ",
        height: "100% ",
        scale: 1,
        duration: 2,
        delay: 1,
      });
      tl.to(
        ".clip_path",
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          duration: 1,
        },
        "<"
      );
    }
  }, []);

  /* transform: translate3d(10px, 51px, -60px) rotateY(60deg) rotateX(-40deg);
    transform-origin: 50% 50% -150px !important;
    will-change: opacity, transform; */
  return (
    <div className="pt-22 min-h-screen">
      <div>
        <div>
          <div className="text-center text-[11px] font-robert-general">
            <p>Welcome to Zentry</p>
          </div>
          <div
            ref={animatedWordsRef}
            className=" special-font animated-word font-anton text-center text-4xl uppercase md:text-[5rem]"
          >
            Discover the w<b>O</b>rld's <br />
            largest shared <b>A</b>dventure
          </div>
        </div>
        {/*  pinned content * main part of the about page *  */}
        <div className=" h-screen  mt-10 relative about_pin">
          {/*  animated iamge with cursor position */}
          <div
            ref={ref}
            className="absolute absolute-center w-[40rem] h-[60rem] overflow-hidden z-[10]"
          >
            {/*  stone image start */}
            <div className="absolute absolute-center z-10 w-screen h-screen">
              <img
                className="about_image size-full object-cover object-top"
                src={stoneImage}
                alt=""
              />
            </div>
            {/*  stone image end */}
            <div
              style={{
                clipPath: "polygon(25% 25%, 72% 28%, 78% 70%, 25% 75%)",
              }}
              className="clip_path absolute absolute-center z-4 size-full"
            >
              <img
                className="about_image object-cover size-full"
                src={aboutImage}
              />
            </div>
          </div>
          {/*  sub text  */}
          <div className="absolute bottom-0 text-center md:max-w-[34rem] left-1/2 w-full max-w-96 -translate-x-1/2 font-circular-web leading-5">
            <div className="text-gray-900 pb-1">
              The Metagame begins—your life, now an epic MMORPG
            </div>
            <div className="text-gray-500">
              Zentry is the unified play layer driving attention and
              contribution through cross-world AI gamification.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
