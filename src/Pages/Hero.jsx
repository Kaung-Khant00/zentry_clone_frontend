import { useState, useEffect, useRef } from "react";
import hero1 from "../../public/videos/hero-1.mp4";
import hero2 from "../../public/videos/hero-2.mp4";
import hero3 from "../../public/videos/hero-3.mp4";
import hero4 from "../../public/videos/hero-4.mp4";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const Hero = () => {
  const videos = [hero1, hero2, hero3, hero4];
  const [oldVideoIndex, setOldVideoIndex] = useState(0);
  const [videoIndex, setvideoIndex] = useState(0);
  const [isVideoChangable, setIsVideoChangable] = useState(true);
  const currentVideoRef = useRef(null);

  const { contextSafe } = useGSAP({
    dependencies: [videoIndex],
    revertOnUpdate: true,
  });

  const animate = contextSafe(() => {
    gsap.to(".video_current", {
      duration: 1,
      width: "100%",
      height: "100%",
      scale: 1,
      ease: "power1.inOut",
    });
    const tl = gsap.timeline();
    tl.to(".video_mini", {
      duration: 0.4,
      opacity: 0,
    }).from(".video_mini", {
      opacity: 1,
      duration: 1,
      scale: 0,
      onComplete: () => {
        setIsVideoChangable(true);
        setOldVideoIndex(videoIndex);
      },
    });
  });

  function handleChangingVideo() {
    if (isVideoChangable) {
      const el = document.querySelector(".video_pre");
      if (el) {
        gsap.set(el, { visibility: "visible" });
      }
      setvideoIndex(videoIndex === videos.length - 1 ? 0 : videoIndex + 1);
      setIsVideoChangable(false);
    }
  }

  // Run animation and ensure video auto plays when videoIndex changes
  useEffect(() => {
    animate();
    if (currentVideoRef.current) {
      currentVideoRef.current.play();
    }
  }, [videoIndex]);

  return (
    <div>
      <div>
        <div>
          <div
            onClick={handleChangingVideo}
            className="video_mini z-5 size-52 absolute absolute-center cursor-pointer rounded-lg group"
          >
            <video
              className=" object-cover border-2 size-full rounded-lg opacity-0  group-hover:opacity-100 scale-50 group-hover:scale-100 transition ease-in-out duration-500"
              src={
                videos[videoIndex === videos.length - 1 ? 0 : videoIndex + 1]
              }
            ></video>
          </div>
          <div className="video_current z-2  size-52 absolute absolute-center cursor-pointer rounded-lg group">
            <video
              ref={currentVideoRef}
              autoPlay
              loop
              muted
              className="object-cover size-full"
              src={videos[videoIndex]}
            ></video>
          </div>
          <div className="video_pre z-1 absolute left-0 top-0 size-full invisible">
            <video
              autoPlay
              loop
              src={videos[oldVideoIndex]}
              className="object-cover size-full "
            ></video>
          </div>
        </div>
        <div className="absolute size-full inset-0 z-4">
          <h1 className="special-font"></h1>
        </div>
      </div>
    </div>
  );
};

export default Hero;
