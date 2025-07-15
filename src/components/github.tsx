import { SiAppwrite, SiGithub, SiJira } from "react-icons/si";

const Github = () => {
  return (
    <div className="absolute flex w-full items-start justify-center">
      <SiGithub className="text-[80px] opacity-0 hover:opacity-10" />
      <SiJira className="text-[80px] opacity-0 hover:opacity-10" />
      <SiAppwrite className="text-[80px] opacity-0 hover:opacity-10" />
    </div>
  );
};

export default Github;
