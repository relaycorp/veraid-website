import ChevronIcon from "../../assets/icons/chevron.svg?react";
import MenuIcon from "../../assets/icons/menu.svg?react";
import CloseIcon from "../../assets/icons/close.svg?react";

interface MobileMenuToggleProps {
  isOpen: boolean;
  onClick: () => void;
  label?: string;
  showChevron?: boolean;
}

export function MobileMenuToggle({
  isOpen,
  onClick,
  label,
  showChevron = false,
}: MobileMenuToggleProps) {
  const toggleIconClass = "w-5 h-5";

  return (
    <button className="md:hidden text-white flex items-center space-x-1 text-xs" onClick={onClick}>
      {label && <span>{label}</span>}

      {showChevron ? (
        <ChevronIcon className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      ) : isOpen ? (
        <CloseIcon className={toggleIconClass} />
      ) : (
        <MenuIcon className={toggleIconClass} />
      )}
    </button>
  );
}
