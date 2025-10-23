import Featured from "./Featured";
import "./home.css";
import TrendingProducts from "./TrendingProducts";
import VideoBackground from "./VideoBackground";

const Homepage = () => {
  return (
    <div>
      <VideoBackground />
      <Featured />
      <TrendingProducts />
    </div>
  );
};

export default Homepage;
