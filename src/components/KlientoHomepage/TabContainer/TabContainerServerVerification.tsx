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
              JavaScript servers can use{" "}
              <a href="https://www.npmjs.com/package/@veraid/kliento" className="text-indigo-400!">
                <code>@veraid/kliento</code>
              </a>
              . For example, an HTTP server would verify token bundles as follows:
            </p>
          </div>
          <CodeBlock
            language="javascript"
            code={`import { TokenBundle } from '@veraid/kliento';

// Replace with a unique identifier for your server
const AUDIENCE = 'https://api.example.com';

// Verify "Authorization: Kliento <token-bundle>" request header
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
        <>
          <div className={CONTENT_CONTAINER}>
            <p className={PARAGRAPH}>
              If your server language is unsupported or you wish to offload verification to another
              process, you can deploy{" "}
              <a
                href="https://github.com/CheVeraId/kliento-verifier-js"
                className="text-indigo-400!"
              >
                Kliento Verifier
              </a>{" "}
              to a{" "}
              <a
                href="https://github.com/CheVeraId/kliento-verifier-docker/pkgs/container/kliento-verifier"
                className="text-indigo-400!"
              >
                Docker container
              </a>
              , AWS Lambda, Cloudflare Workers, etc. You'll then be able to verify token bundles as
              follows:
            </p>
          </div>
          <CodeBlock
            language="http"
            code={`POST /?audience=https%3A%2F%2Fapi.example.com HTTP/1.1
Host: kliento-verifier.local

<token-bundle>
`}
          />
        </>
      ),
    },
  ];

  return <TabContainer tabs={tabs} />;
};

export default TabContainerServerVerification;
