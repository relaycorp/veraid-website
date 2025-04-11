import React from "react";
import TabContainer from "./TabContainer";
import type { Tab } from "./TabContainer";
import CodeBlock from "./CodeBlock";
import JavaScriptIcon from "../../../assets/icons/JavaScript.svg?react";

const PARAGRAPH = "px-4 text-xs lg:text-base leading-normal pb-4";
const CONTENT_CONTAINER = "text-left pt-4 bg-black";

const TabContainerServerVerification: React.FC = () => {
  const tabs: Tab[] = [
    {
      label: "JavaScript",
      icon: <JavaScriptIcon />,
      content: (
        <>
          <div className={CONTENT_CONTAINER}>
            <p className={PARAGRAPH}>
              JavaScript servers use{" "}
              <a href="https://www.npmjs.com/package/@veraid/kliento" class="text-indigo-400!">
                <code>@veraid/kliento</code>
              </a>{" "}
              to verify Kliento token bundles. For example, here is how an HTTP server would verify
              a Kliento token bundles:
            </p>
          </div>
          <CodeBlock
            language="javascript"
            code={`import { TokenBundle } from '@veraid/kliento';

// Replace with a unique identifier for your server
const AUDIENCE = 'https://api.example.com';

// Verify \`Authorization: Kliento <token>\` request header
async function verifyTokenBundle(authHeaderValue: string) {
    const tokenBundle = TokenBundle.deserialiseFromAuthHeader(authHeaderValue);
    return await tokenBundle.verify(AUDIENCE);
}`}
          />
        </>
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
