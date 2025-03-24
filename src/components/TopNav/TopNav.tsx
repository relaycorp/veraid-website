import { useState } from "react";
import { PrimaryNav } from "./PrimaryNav";
import { SecondaryNav } from "./SecondaryNav";

export default function TopNav() {
  const [showSecondaryNav, setShowSecondaryNav] = useState(false);
  const [activeSecondarySection, setActiveSecondarySection] = useState<string | null>(null);

  const handleKlientoClick = () => {
    setShowSecondaryNav(true);
    setActiveSecondarySection("overview");
  };

  return (
    <>
      <PrimaryNav onKlientoClick={handleKlientoClick} />

      {showSecondaryNav && (
        <SecondaryNav
          activeSection={activeSecondarySection}
          setActiveSection={setActiveSecondarySection}
        />
      )}
    </>
  );
}
