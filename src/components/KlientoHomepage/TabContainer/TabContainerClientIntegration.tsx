import React from "react";
import TabContainer from "./TabContainer";
import type { Tab } from "./TabContainer";
import CodeBlock from "./CodeBlock";
import JavaScriptIcon from "../../../assets/icons/JavaScript.svg?react";
import GitHubIcon from "../../../assets/icons/github.svg?react";

const PARAGRAPH = "px-4 text-xs sm:text-sm lg:text-base leading-normal pb-4";
const CONTENT_CONTAINER = "text-left pt-4 bg-black";

const TabContainerClientIntegration: React.FC = () => {
  const tabs: Tab[] = [
    {
      label: "JavaScript",
      icon: <JavaScriptIcon />,
      content: (
        <>
          <div className={CONTENT_CONTAINER}>
            <p className={PARAGRAPH}>
              JS clients can use{" "}
              <a
                href="https://github.com/CheVeraId/authority-credentials-js"
                className="text-indigo-400!"
              >
                <code>@veraid/authority-credentials</code>
              </a>{" "}
              to automate the provisioning of token bundles. For example, the{" "}
              <code>authFetch()</code> function below shows how to use this library to make
              authenticated requests.
            </p>
          </div>
          <CodeBlock
            language="javascript"
            code={`import { initExchangerFromEnv } from '@veraid/authority-credentials';

// Replace with the actual URL for exchanging credentials
const EXCHANGE_ENDPOINT = new URL('https://veraid-authority.example/creds/123');

// Replace 'GITHUB' with the exchanger you want
const exchanger = initExchangerFromEnv('GITHUB');

// Make requests that use the Kliento token bundle
export async function authFetch(request: Request) {
  const { credential: tokenBundle } = await exchanger.exchange(EXCHANGE_ENDPOINT);
  const headers = { 'Authorization': \`Kliento \${tokenBundle.toString('base64')}\` }
  return fetch(request, { headers })
}`}
          />
        </>
      ),
    },

    {
      label: "GitHub",
      icon: <GitHubIcon />,
      content: (
        <>
          <div className={CONTENT_CONTAINER}>
            <p className={PARAGRAPH}>
              Use{" "}
              <a
                href="https://github.com/marketplace/actions/exchange-github-jwts-for-veraid-credentials"
                className="text-indigo-400!"
              >
                <code>CheVeraId/authority-credentials-action</code>
              </a>{" "}
              to get a Kliento token bundle. For example, this is how you can use it to make an
              authenticated request:
            </p>
          </div>
          <CodeBlock
            language="yaml"
            code={`jobs:
  authentication:
    runs-on: ubuntu-latest
    permissions:
      id-token: write
    steps:
      - name: Get Kliento token bundle
        id: token-bundle
        uses: CheVeraId/authority-credentials-action@v1
        with:
          exchange-endpoint: https://veraid-authority.example/creds/123
      - name: Use token bundle
        run: curl -H "Authorization: Kliento \${TOKEN_BUNDLE}" https://api.example.com
        environment:
          TOKEN_BUNDLE: \${{ steps.token-bundle.outputs.credential }}`}
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
              VeraId Authority uses OpenID Connect Discovery to authenticate{" "}
              <a
                href="https://docs.relaycorp.tech/veraid-authority/credentials"
                className="text-indigo-400!"
              >
                clients requesting credentials
              </a>
              , so you can integrate Amazon Cognito, Azure, GCP, Kubernetes, and many more. You
              simply have to send your workload identity's JWT to obtain a token bundle:
            </p>
          </div>
          <CodeBlock
            language="http"
            code={`GET /creds/123 HTTP/1.1
HOST: veraid-authority.example
Authorization: Bearer <JWT>`}
          />
        </>
      ),
    },
  ];

  return <TabContainer tabs={tabs} />;
};

export default TabContainerClientIntegration;
