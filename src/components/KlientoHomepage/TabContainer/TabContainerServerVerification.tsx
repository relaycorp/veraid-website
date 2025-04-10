import React from "react";
import TabContainer from "./TabContainer";
import type { Tab } from "./TabContainer";
import CodeBlock from "./CodeBlock";
import JavaScriptIcon from "../../../assets/icons/JavaScript.svg?react";
import GitHubIcon from "../../../assets/icons/github.svg?react";

const PARAGRAPH = "px-4 text-base leading-normal pb-4";
const CONTENT_CONTAINER = "text-left pt-4";

const TabContainerServerVerification: React.FC = () => {
  const tabs: Tab[] = [
    {
      label: "JavaScript",
      icon: <JavaScriptIcon />,
      content: (
        <div className={CONTENT_CONTAINER}>
          <p className={PARAGRAPH}>
            A JavaScript HTTP server could use the <code>TokenBundle</code> class from the{" "}
            <code>@veraid/kliento</code> library to verify a Kliento token bundle specified in the{" "}
            <code>Authorization</code> request header.
          </p>
          <CodeBlock
            language="javascript"
            code={`// Server side code
import { TokenBundle } from '@veraid/kliento';

// Replace with a unique identifier for your server
const AUDIENCE = 'https://api.example.com';

// Verify \`Authorization: Kliento <token>\` request header
async function verifyTokenBundle(authHeaderValue: string) {
    const tokenBundle = TokenBundle.deserialiseFromAuthHeader(authHeaderValue);
    return await tokenBundle.verify(AUDIENCE);
}`}
          />
        </div>
      ),
    },

    {
      label: "Others",
      content: (
        <div className={CONTENT_CONTAINER}>
          <p className={PARAGRAPH}>
            This is an example of a tab with regular HTML content. You can put any content here,
            including paragraphs, links, images, and more.
          </p>
          <p className={PARAGRAPH}>
            This is an example of a tab with regular HTML content. You can put any content here,
            including paragraphs, links, images, and more.
          </p>
        </div>
      ),
    },
  ];

  return <TabContainer tabs={tabs} />;
};

export default TabContainerServerVerification;
