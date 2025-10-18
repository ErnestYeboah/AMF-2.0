import { memo } from "react";

const Logo = () => {
  return (
    <figure className="logo mb-[var(--gap)]">
      <img src="/assests/amaeton.jpg" alt="" />
    </figure>
  );
};

export default memo(Logo);
