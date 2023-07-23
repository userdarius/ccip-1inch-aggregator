import React, { useEffect, useMemo, useState } from "react";
import { ReactComponent as Swap } from "../../assets/icons/swap.svg";
import { ReactComponent as VaultsLogo } from "../../assets/icons/Frame.svg";
import { ReactComponent as OptiLogo } from "../../assets/logos/optimism-logo.svg";
import { useNavigate } from "react-router-dom";
import Dropdown from "../Dropdown/Dropdown";
import { useAccount } from "wagmi";

const Header = () => {
  const navigate = useNavigate();
  const [selectedPart, setSelectedPart] = useState<0 | 1 | 2 | 3>(0);
  const { isConnected } = useAccount();
  const pathName = useMemo(() => {
    return location.pathname;
  }, [location.pathname]);

  useEffect(() => {
    if (pathName === "/Swap") {
      setSelectedPart(0);
    }
    if (pathName === "/Vaults") {
      setSelectedPart(1);
    }
  }, [pathName]);

  useEffect(() => {
    if (!isConnected) {
      navigate("/Swap");
    }
  }, [isConnected]);

  return (
    <div className="grid h-16 grid-cols-3 border-b-[0.5px] border-b-borderBottomConnectedCard bg-darkgreen px-6">
      <div
        className="col-span-1 flex items-center gap-2 text-xl font-extrabold text-white hover:cursor-pointer"
        onClick={() => {
          navigate("/Swap");
        }}
      >
        POSEIDON
      </div>

      <div className="flex items-center justify-center gap-[12px] space-x-2">
        <div
          className={`flex h-[100%] items-center gap-[8px] hover:cursor-pointer ${
            selectedPart === 0 && " border-b-[3px] border-b-pink "
          } `}
          onClick={() => {
            navigate("/Swap");
            setSelectedPart(0);
          }}
        >
          <Swap stroke={selectedPart === 0 ? "#EF2A89" : "white"} />
          <div className={`${selectedPart === 0 ? "text-pink" : "text-white"}`}>
            Swap
          </div>
        </div>

        {isConnected && (
          <div
            className={`flex h-[100%] items-center gap-[8px] hover:cursor-pointer ${
              selectedPart === 1 && "border-b-[3px] border-b-pink"
            }`}
            onClick={() => {
              navigate("/Vaults");
              setSelectedPart(1);
            }}
          >
            <VaultsLogo stroke={selectedPart === 1 ? "#EF2A89" : "white"} />
            <div
              className={`${selectedPart === 1 ? "text-pink" : "text-white"}`}
            >
              Vaults
            </div>
          </div>
        )}
      </div>

      <div className="col-span-1 flex items-center justify-end gap-[8px]  ">
        <div className="rounded-lg border bg-bgCardNavbar p-2   ">
          <OptiLogo />
        </div>
        <Dropdown />
      </div>
    </div>
  );
};

export default Header;
