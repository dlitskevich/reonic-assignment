import { ReactNode } from "react";
import { CloseIcon } from "./icons/CloseIcon";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const Sidebar = ({ isOpen, onClose, children }: SidebarProps) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar - Always rendered for smooth transitions, but hidden from assistive tech when closed on mobile */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-white shadow-xl z-50
          transform transition-transform duration-300 ease-in-out
          w-80 overflow-y-auto
          lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        aria-hidden={isOpen ? false : true}
        aria-label="Parameters sidebar"
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-10">
          <h2 className="text-lg font-semibold text-gray-800">Parameters</h2>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close sidebar"
          >
            <CloseIcon />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </aside>
    </>
  );
};
