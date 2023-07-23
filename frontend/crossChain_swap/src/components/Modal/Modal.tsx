import React, { ReactNode, useEffect, useRef } from "react";

type ModalProps = {
  showModal: boolean;
  children: ReactNode;
  closeFunction: () => void;
};

const Modal: React.FC<ModalProps> = ({
  showModal,
  children,
  closeFunction,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      closeFunction();
    }
  };

  useEffect(() => {
    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal]);

  if (!showModal) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div ref={modalRef} className="relative rounded-lg bg-white p-6">
        <button
          className="right-2·top-0 absolute p-2 text-black"
          onClick={closeFunction}
        >
          X
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
