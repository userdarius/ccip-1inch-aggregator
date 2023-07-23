import { Dialog, Transition } from "@headlessui/react";
import { FC, Fragment, useEffect } from "react";
import { ReactComponent as Cross } from "../../../assets/icons/Cross.svg";
import { ReactComponent as MetaMaskLogo } from "../../../assets/logos/wallet/metamask.svg";
import { ReactComponent as CoinbaseLogo } from "../../../assets/logos/wallet/coinbase.svg";
import { ReactComponent as WalletConnectLogo } from "../../../assets/logos/wallet/walletconnect.svg";
import { ReactComponent as MagicLogo } from "../../../assets/logos/wallet/1-Icon_Magic_Color.svg";

import { optimism } from "viem/chains";
import { useAccount, useConnect } from "wagmi";

type ModalConnexionProps = {
  isOpen: boolean;
  setIsOpen: Function;
};

const ModalConnexion: FC<ModalConnexionProps> = ({ isOpen, setIsOpen }) => {
  const { connect, connectors, isLoading, pendingConnector } = useConnect({
    chainId: optimism.id,
  });
  const { isConnected } = useAccount();
  function closeModal() {
    setIsOpen(false);
  }

  useEffect(() => {
    if (isConnected) setIsOpen(false);
  }, [isConnected]);

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto bg-gray800 bg-opacity-30">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="min-h-[280px] w-full max-w-md transform overflow-hidden rounded-3xl bg-[#161618] px-8 py-4 text-left align-middle font-bold shadow-xl transition-all">
                  <div className=" flex items-center justify-between text-2xl text-white">
                    <div>Choose Your wallet</div>
                    <Cross
                      stroke="white"
                      height="16"
                      width="16"
                      onClick={() => {
                        closeModal();
                      }}
                      className=" cursor-pointer"
                    />
                  </div>
                  <div className="my-5 flex flex-col gap-3 text-xl text-white">
                    {connectors.map((connector) => (
                      <button
                        disabled={!connector.ready}
                        key={connector.id}
                        onClick={() => connect({ connector })}
                        className=" flex h-[50px] items-center gap-2 rounded-lg  bg-[#232326] pl-3 hover:cursor-pointer"
                      >
                        {connector.name === "MetaMask" ? (
                          <MetaMaskLogo />
                        ) : connector.name === "Coinbase Wallet" ? (
                          <CoinbaseLogo />
                        ) : connector.name === "WalletConnect" ? (
                          <WalletConnectLogo />
                        ) : (
                          <MagicLogo />
                        )}
                        {connector.name}
                        {!connector.ready && " (unsupported)"}
                        {isLoading &&
                          connector.id === pendingConnector?.id &&
                          " (connecting)"}
                      </button>
                    ))}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default ModalConnexion;
