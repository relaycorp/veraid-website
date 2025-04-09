import React from "react";
import GithubIcon from "../../../assets/icons/github.svg?raw";
import AzureIcon from "../../../assets/icons/azure.svg?raw";
import GcpIcon from "../../../assets/icons/gcp.svg?raw";
import JavaScriptIcon from "../../../assets/icons/JavaScript.svg?raw";
import ArrowIcon from "../../../assets/icons/arrow.svg?raw";
import KubernetesIcon from "../../../assets/icons/kubernetes.svg?raw";
import AwsIcon from "../../../assets/icons/aws.svg?raw";
import VercelIcon from "../../../assets/icons/vercel.svg?raw";
import GitlabIcon from "../../../assets/icons/gitlab.svg?raw";
interface CarouselItemProps {
  workloadIdentity: string;
  veraidIdentity: string;
  icon?: string;
}

const iconMap: Record<string, string> = {
  github: GithubIcon,
  azure: AzureIcon,
  gcp: GcpIcon,
  javascript: JavaScriptIcon,
  kubernetes: KubernetesIcon,
  aws: AwsIcon,
  vercel: VercelIcon,
  gitlab: GitlabIcon,
};

const CarouselItem: React.FC<CarouselItemProps> = ({ workloadIdentity, veraidIdentity, icon }) => {
  const iconSvg = icon ? iconMap[icon] : null;

  return (
    <div className="flex flex-col items-center font-jetBrainsMono">
      <div className="bg-neutral-900 rounded p-3">
        <div className="flex items-center gap-2">
          {/* Left box */}
          <div className="bg-neutral-800 rounded px-4 py-2 flex items-center border border-neutral-700">
            {iconSvg && (
              <div
                className="h-6 w-6 text-white mr-2 flex items-center"
                dangerouslySetInnerHTML={{ __html: iconSvg }}
              />
            )}
            <span className="text-white font-jetBrainsMono text-sm">{workloadIdentity}</span>
          </div>

          {/* Arrow */}
          <div className="h-5 w-5 text-white" dangerouslySetInnerHTML={{ __html: ArrowIcon }} />

          {/* Right box*/}
          <div className="bg-neutral-800 rounded px-4 py-2.5 flex items-center border border-neutral-700">
            <span className="text-white font-jetBrainsMono text-sm">{veraidIdentity}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarouselItem;
