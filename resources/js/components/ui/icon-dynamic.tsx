import * as Icons from "lucide-react";
import { FC } from "react";

interface IconDynamicProps extends React.SVGProps<SVGSVGElement> {
  name: string;
}

const IconDynamic = ({ name, ...props }: IconDynamicProps) => {
  const convertedName = name
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');
  const LucideIcon = Icons[convertedName as keyof typeof Icons] as FC<React.SVGProps<SVGSVGElement>>;

  if (!LucideIcon) return null;

  return <LucideIcon {...props} />;
};

export default IconDynamic;