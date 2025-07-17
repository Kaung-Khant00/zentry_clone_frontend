import { useState, useEffect, useRef } from "react";
import hero1 from "../../public/videos/hero-1.mp4";
import hero2 from "../../public/videos/hero-2.mp4";
import hero3 from "../../public/videos/hero-3.mp4";
import hero4 from "../../public/videos/hero-4.mp4";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { TiLocationArrow } from "react-icons/ti";

import Button from "../Components/Button";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const videos = [hero1, hero2, hero3, hero4];
  const [videoIndex, setvideoIndex] = useState(1);
  const [oldVideoIndex, setOldVideoIndex] = useState(0);
  const [isVideoChangable, setIsVideoChangable] = useState(true);
  const positionRef = useRef({
    corner1: { x: 0, y: 0 },
    corner2: { x: 0, y: 0 },
    corner3: { x: 0, y: 0 },
    corner4: { x: 0, y: 0 },
    cursor: { x: 0, y: 0 },
  });
  const ref = useRef(null);
  useGSAP(() => {
    gsap
      .timeline({
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "center top",
          scrub: 1,
          ease: "power2.out",
        },
      })
      .fromTo(
        ".hero",
        { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" },
        {
          clipPath: "polygon(14% 0, 68% 0, 94% 84%, 0 85%)",
        }
      )
      .to(".hero", {
        clipPath: "polygon(14% 0, 62% 0, 86% 80%, 1% 65%)",
      });
  }, []);
  const { contextSafe } = useGSAP({
    dependencies: [videoIndex],
    revertOnUpdate: true,
  });

  const animate = contextSafe(() => {
    gsap.to(".video_current", {
      width: "100dvw",
      height: "100dvh",
      scale: 1,
      duration: 1,
      ease: "power1.out",
    });
  });
  const nextVideoLoaded = contextSafe(() => {
    gsap.from(".video_next", {
      scale: 0,
      duration: 1.5,
      onComplete: () => {
        setOldVideoIndex(videoIndex);
        setIsVideoChangable(true);
      },
    });
  });
  function handleChangingVideo() {
    if (isVideoChangable) {
      setIsVideoChangable(false);
      setvideoIndex(videoIndex === videos.length - 1 ? 0 : videoIndex + 1);
    }
  }
  const handleMouseLeave = contextSafe(() => {
    gsap.to(".video_next", {
      clipPath: "polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)",
    });
  });
  useEffect(() => {
    function lerp(old, target, t) {
      return old + (target - old) * t;
    }

    function handleMouseMove(e) {
      const defaultValue = 42,
        range = 5,
        followRange = 30,
        perspective = 10,
        centerRange = (100 - defaultValue - (range + followRange) / 2) / 2;
      const reduceValue = 0.9;
      const rect = ref.current.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const left = rect.left;
      const top = rect.top;
      const halfWidth = width / 2;
      const halfHeight = height / 2;
      const p = positionRef.current;

      p.cursor.x = lerp(p.cursor.x, e.clientX, 0.05);
      p.cursor.y = lerp(p.cursor.y, e.clientY, 0.05);
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
        (xPerspective > 0 ? xPerspective : 0);
      positionRef.current.corner1.y =
        range +
        (range * (yValue + xValue)) / 2 +
        moveYValue +
        (yPerspective > 0 ? yPerspective : 0);

      positionRef.current.corner2.x =
        defaultValue +
        (range * (xValue - yValue)) / 2 +
        moveXValue +
        (xPerspective < 0 ? xPerspective : 0);
      positionRef.current.corner2.y =
        range -
        (range * (xValue - yValue)) / 2 +
        moveYValue +
        (yPerspective > 0 ? yPerspective : 0);

      positionRef.current.corner3.x =
        defaultValue +
        (range * (xValue + yValue)) / 2 +
        moveXValue +
        (xPerspective < 0 ? xPerspective : 0);
      positionRef.current.corner3.y =
        defaultValue +
        (range * (xValue + yValue)) / 2 +
        moveYValue +
        (yPerspective < 0 ? yPerspective : 0);

      positionRef.current.corner4.x =
        range -
        (range * (yValue - xValue)) / 2 +
        moveXValue +
        (xPerspective > 0 ? xPerspective : 0);
      positionRef.current.corner4.y =
        defaultValue +
        (range * (yValue - xValue)) / 2 +
        moveYValue +
        (yPerspective < 0 ? yPerspective : 0);

      // Use ref values for GSAP clip-path
      const clipPathValue = `polygon(${p.corner1.x}% ${p.corner1.y}%, ${p.corner2.x}% ${p.corner2.y}%, ${p.corner3.x}% ${p.corner3.y}%, ${p.corner4.x}% ${p.corner4.y}% )`;
      gsap.to(".video_next", {
        clipPath: clipPathValue,
        duration: 0.5,
      });
    }
    if (ref.current) {
      ref.current.addEventListener("mousemove", handleMouseMove);
    }
    return () => {
      if (ref.current) {
        ref.current.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, []);
  useEffect(() => {
    animate();
  }, [videoIndex]);

  return (
    <div>
      <div className="hero min-h-screen z-2">
        {/*  video container start */}
        <div>
          {/*  next video cover with specific width and height and show on click  */}
          <div
            ref={ref}
            onMouseLeave={handleMouseLeave}
            className=" w-[750px] h-[750px] absolute absolute-center group z-6"
          >
            <div
              className=" video_next z-6 video_cover w-[600px] h-[600px]  origin-center overflow-hidden absolute absolute-center "
              onLoadedMetadata={nextVideoLoaded}
              style={{
                clipPath: "polygon(20% 20%, 80% 20%, 80% 80%, 20% 80%)",
              }}
            >
              <div className="absolute w-screen h-screen absolute-center scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100  transition_all">
                <video
                  onClick={handleChangingVideo}
                  className="object-cover size-full"
                  src={
                    videos[
                      videoIndex === videos.length - 1 ? 0 : videoIndex + 1
                    ]
                  }
                ></video>
              </div>
            </div>
          </div>

          <div className="video_current z-2 video_cover size-40 overflow-hidden absolute absolute-center">
            <div
              onClick={handleChangingVideo}
              className="absolute w-screen h-screen absolute-center "
            >
              <video
                muted
                loop
                preload="auto"
                className="object-cover size-full"
                src={videos[videoIndex]}
              ></video>
            </div>
          </div>
          <div className="video_background size-full absolute absolute-center">
            <video
              loop
              className="object-cover size-full"
              src={videos[oldVideoIndex]}
            ></video>
          </div>
        </div>
        {/* video container end */}
        <div className="absolute top-0 left-0 min-h-screen w-screen z-5">
          <div className="absolute left-10 top-21 ">
            <h1 className="special-font text-blue-100 hero-heading !tracking-wide !font-anton">
              REDEFI<b>N</b>E
            </h1>
            <p className="text-blue-100 font-robert-regular my-2">
              Enter the Metagame <br /> Unleash the Play Economy
            </p>
            <Button
              title={"WATCH TRAILER"}
              LeftIcon={<TiLocationArrow size={20} className="rotate-45" />}
            />
          </div>
        </div>
        <h1 className=" absolute right-10 bottom-8 z-7 special-font text-blue-100 hero-heading !tracking-wide !font-anton ">
          G<b>A</b>MING
        </h1>
      </div>
      <h1 className="absolute left-10 top-21 -z-1 special-font text-black hero-heading !tracking-wide !font-anton">
        REDEFI<b>N</b>E
      </h1>
      <h1 className="absolute right-10 bottom-8 -z-1 special-font text-black hero-heading !tracking-wide !font-anton ">
        G<b>A</b>MING
      </h1>
    </div>
  );
};

export default Hero;
{
  /* current video that is playing after the click  */
}
