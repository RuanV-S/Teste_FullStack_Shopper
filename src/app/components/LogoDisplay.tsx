import Image from "next/image";

const LogoDisplay = ({ width = 150, height = 150 }) => {
  return (
    <Image
      alt="logo"
      width={width}
      height={height}
      src="/assets/image/logo.png"
    />
  );
};

export default LogoDisplay;
