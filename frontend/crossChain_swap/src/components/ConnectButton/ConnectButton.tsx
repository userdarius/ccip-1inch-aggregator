/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext, useState } from "react";
import { ReactComponent as Arrow } from "../../assets/icons/ArrowWhiteAccount.svg";
import { ReactComponent as Profile } from "../../assets/icons/profile.svg";
import { ReactComponent as Validate } from "../../assets/icons/Validate.svg";
import ModalConnexion from "../Modals/ModalConnexion/ModalConnexion";
import { useAccount } from "wagmi";
import { MainContext } from "../../context/Main.context";

const ConnectButton = () => {
  const { isConnected, address } = useAccount();
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const { showModalConnexion, setShowModalConnexion } = useContext(MainContext);

  return (
    <div className="flex gap-2">
      {isConnected && (
        <div
          className="center gap-[6px] rounded-lg border-[0.5px] border-solid border-white bg-darkgreen p-2"
          onClick={() => {
            showPopup ? setShowPopup(false) : setShowPopup(true);
          }}
        >
          <div className="relative mr-[6px]">
            <Validate className="absolute bottom-[-2px] right-[-6px] " />
            <Profile />
          </div>
          <span className="text-white">
            {address?.slice(0, 6) + "..." + address?.slice(38)}
          </span>
          <Arrow
            className={` hover:cursor-pointer ${showPopup && "rotate-180"}`}
            onClick={() => {
              showPopup ? setShowPopup(false) : setShowPopup(true);
            }}
          />
        </div>
      )}

      {!isConnected && (
        <div className="text-green-400 col-span-1 flex w-full items-center justify-end gap-[8px] font-semibold  ">
          <button
            className="  rounded-lg bg-white px-5 py-2 font-semibold text-black"
            onClick={() => {
              {
                !isConnected && setShowModalConnexion(true);
              }
            }}
          >
            {!isConnected && "Login"}
          </button>
        </div>
      )}
      <ModalConnexion
        isOpen={showModalConnexion}
        setIsOpen={setShowModalConnexion}
      />
    </div>
  );
};

export default ConnectButton;
