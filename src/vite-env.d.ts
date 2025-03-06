/// <reference types="vite/client" />

declare module "*.svg?react" {
  import React from "react";
  const Component: React.FC<React.SVGProps<SVGSVGElement>>;
  export default Component;
}

declare module "*.svg" {
  import React from "react";
  const Component: React.FC<React.SVGProps<SVGSVGElement>>;
  export default Component;
}
