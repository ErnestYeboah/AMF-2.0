import { memo, useEffect, useRef } from "react";

const VideoBackground = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current as HTMLVideoElement;
    video.play().catch(() => console.log("Autoplay prevented"));
  }, []);

  return (
    <div className="background_video_wrapper">
      <video
        ref={videoRef}
        src="/assests/clothing.mp4"
        autoPlay
        muted
        loop
        className="video_div"
      ></video>
      <div className="video_text space-y-2">
        <h2>A COLLECTION OF UNIQUE CLOTHES FOR YOU</h2>
        <p>
          You can have anything you want in life if you dress for it ~Edith Head
        </p>
        <button>Shop Now</button>
      </div>
    </div>
  );
};

export default memo(VideoBackground);
