import { useState, useEffect, useRef } from "react";
import hero1 from "../../public/videos/hero-1.mp4";
import hero2 from "../../public/videos/hero-2.mp4";
import hero3 from "../../public/videos/hero-3.mp4";
import hero4 from "../../public/videos/hero-4.mp4";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const Hero = () => {
  const videos = [hero1, hero2, hero3, hero4];
  const [videoIndex, setvideoIndex] = useState(1);
  const [oldVideoIndex, setOldVideoIndex] = useState(0);
  const [isVideoChangable, setIsVideoChangable] = useState(true);
  const ref = useRef(null);

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
    gsap.from(".video_next", {
      scale: 0,
      duration: 1.5,
      onComplete: () => {
        setOldVideoIndex(videoIndex);
        setIsVideoChangable(true);
      },
    });
    gsap.from(".black_border", {
      scale: 0,
      duration: 1.5,
    });
  });

  function handleChangingVideo() {
    if (isVideoChangable) {
      setIsVideoChangable(false);
      setvideoIndex(videoIndex === videos.length - 1 ? 0 : videoIndex + 1);
    }
  }
  useEffect(() => {
    function handleMouseMove(e) {
      const defaultValue = 80;
      const reduceValue = 0.5;
      const rect = ref.current.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const left = rect.left;
      const top = rect.top;
      const halfWidth = width / 2;
      const halfHeight = height / 2;
      const x = e.clientX - (halfWidth + left);
      const y = e.clientY - (halfHeight + top);
      console.log(x, y);

      const xValue = (x / halfWidth) * reduceValue;
      const yValue = (y / halfHeight) * reduceValue;

      /*  corner 1  */
      const corner1x =
        100 - defaultValue + ((100 - defaultValue) * (yValue + xValue)) / 2;
      const corner1y =
        100 - defaultValue + ((100 - defaultValue) * (yValue + xValue)) / 2;

      /*  corner 3 */
      const corner3x =
        defaultValue + ((100 - defaultValue) * (xValue + yValue)) / 2;
      const corner3y =
        defaultValue + ((100 - defaultValue) * (xValue + yValue)) / 2;

      /*  corner 2 */
      const corner2x =
        defaultValue + ((100 - defaultValue) * (xValue - yValue)) / 2;
      const corner2y =
        100 - defaultValue - ((100 - defaultValue) * (xValue - yValue)) / 2;

      /*  corner 4 */
      const corner4x =
        100 - defaultValue - ((100 - defaultValue) * (yValue - xValue)) / 2;
      const corner4y =
        defaultValue + ((100 - defaultValue) * (yValue - xValue)) / 2;
      gsap.to(".video_next", {
        clipPath: `polygon(${corner1x}% ${corner1y}%, ${corner2x}% ${corner2y}%, ${corner3x}% ${corner3y}%, ${corner4x}% ${corner4y}% )`,
      });
      gsap.to(".black_border", {
        clipPath: `polygon(${corner1x}% ${corner1y}%, ${corner2x}% ${corner2y}%, ${corner3x}% ${corner3y}%, ${corner4x}% ${corner4y}% )`,
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
  });
  useEffect(() => {
    animate();
  }, [videoIndex]);

  return (
    <div>
      <div>
        <div>
          {/*  next video cover with specific width and height and show on click  */}
          <div className="size-80 z-3 absolute absolute-center group">
            <div
              className=" black_border absolute absolute-center origin-center w-[330px] h-[330px] "
              style={{
                clipPath: "polygon(20% 20%, 80% 20%, 80% 80%, 20% 80%)",
              }}
            >
              <div className="scale-50 opacity-0 bg-black  group-hover:scale-100 group-hover:opacity-100 transition_all size-full"></div>
            </div>
            <div
              ref={ref}
              className="video_next z-3 video_cover size-80 origin-center overflow-hidden absolute absolute-center "
              style={{
                clipPath: "polygon(20% 20%, 80% 20%, 80% 80%, 20% 80%)",
              }}
            >
              <div
                onClick={handleChangingVideo}
                className="absolute w-screen h-screen absolute-center scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100  transition_all"
              >
                <video
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
                autoPlay
                muted
                className="object-cover size-full"
                src={videos[videoIndex]}
              ></video>
            </div>
          </div>
          <div className="video_background size-full absolute absolute-center">
            <video
              autoPlay
              className="object-cover size-full"
              src={videos[oldVideoIndex]}
            ></video>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
{
  /* current video that is playing after the click  */
}
