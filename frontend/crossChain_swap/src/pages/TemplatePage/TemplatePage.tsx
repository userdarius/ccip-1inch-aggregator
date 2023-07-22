import React, { useState } from "react";
import Modal from "../../components/Modal/Modal";

const TemplatePage = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="flex h-screen w-screen flex-col">
        <div className="flex flex-col items-center">
          <h1 className="p-10 text-center text-3xl">Tailwind Template </h1>
          <div
            onClick={() => setIsOpen(true)}
            className="w-50 bg-pink-200 hover:bg-pink-300 animate-bounce cursor-pointer rounded-md p-4 shadow-lg"
          >
            Open modal
          </div>
        </div>
      </div>

      <Modal showModal={isOpen} closeFunction={() => setIsOpen(false)}>
        <div className="text-black pt-6">Hello I am a modal</div>
      </Modal>
    </>
  );
};

export default TemplatePage;
