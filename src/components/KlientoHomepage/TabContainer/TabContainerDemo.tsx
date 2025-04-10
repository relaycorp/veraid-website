import React from "react";
import TabContainer from "./TabContainer";
import type { Tab } from "./TabContainer";
import CodeBlock from "./CodeBlock";
import JavaScriptIcon from "../../../assets/icons/JavaScript.svg?react";
import GitHubIcon from "../../../assets/icons/github.svg?react";

const PARAGRAPH = "px-4 text-base leading-normal pb-4";
const CONTENT_CONTAINER = "text-left pt-4";

const TabContainerDemo: React.FC = () => {
  const tabs: Tab[] = [
    {
      label: "JavaScript",
      icon: <JavaScriptIcon />,
      content: (
        <CodeBlock
          language="javascript"
          code={`import { initExchangerFromEnv } from '@veraid/authority-credentials';

// Replace with the actual URL for exchanging credentials
const EXCHANGE_ENDPOINT = new URL('https://veraid-authority.example/credentials/123');

// Replace 'GITHUB' with the exchanger you want
const exchanger = initExchangerFromEnv('GITHUB');

// Make requests that use the Kliento token bundle
export async function authFetch(request: Request) {
  const { credential: tokenBundle } = await exchanger.exchange(EXCHANGE_ENDPOINT);
  const headers = { 'Authorization': \`Kliento \${tokenBundle.toString('base64')}\` }
  return fetch(request, { headers })
}`}
        />
      ),
    },

    {
      label: "GitHub Action",
      icon: <GitHubIcon />,
      content: (
        <div className={CONTENT_CONTAINER}>
          <p className={PARAGRAPH}>
            Use the action CheVeraId/authority-credentials-action to get a Kliento token bundle from
            a GitHub workflow:
            <a
              href="https://github.com/CheVeraId/authority-credentials-action"
              target="_blank"
              rel="noopener noreferrer"
            >
              CheVeraId/authority-credentials-action
            </a>
          </p>
          <CodeBlock
            language="yaml"
            code={`jobs:
  authentication:
    runs-on: ubuntu-latest

    steps:
      - name: Get Kliento token bundle
        id: token-bundle
        uses: CheVeraId/authority-credentials-action@v1
        with:
          exchange-endpoint: https://veraid-authority.example/credentials/123
      - name: Use token bundle
        run: curl -H "Authorization: Kliento \${TOKEN_BUNDLE}" https://api.example.com
        environment:
          TOKEN_BUNDLE: \${{ steps.token-bundle.outputs.credential }}`}
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

export default TabContainerDemo;
