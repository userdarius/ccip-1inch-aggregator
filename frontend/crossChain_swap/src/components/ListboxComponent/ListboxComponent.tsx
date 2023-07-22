import { FC, Fragment, useContext, useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ReactComponent as Arrow } from "../../assets/icons/ArrowBlack.svg";
import { ReactComponent as CheckPink } from "../../assets/icons/CheckPink.svg";
import { Token } from "../../utils/types/swap.types";
import { ApiContext } from "../../context/Api.context";

type ListboxComponentProps = {
  list: Token[];
  width?: number;
  fromListBox?: boolean;
};

const ListboxComponent: FC<ListboxComponentProps> = ({
  list,
  width,
  fromListBox,
}) => {
  const [selectedToken, setSelectedToken] = useState<Token>(list[0]);
  const { tokenSelected, setTokenSelected, tokenDesired, setTokenDesired } =
    useContext(ApiContext);

  useEffect(() => {
    const tokenFrom = list.find((token) => token.name === tokenSelected);
    const tokenTo = list.find((token) => token.name === tokenDesired);
    if (fromListBox) {
      tokenFrom && setSelectedToken(tokenFrom);
    } else {
      tokenTo && setSelectedToken(tokenTo);
    }
  }, [list]);

  useEffect(() => {
    if (fromListBox) {
      setTokenSelected(selectedToken.name);
    }
    if (!fromListBox) {
      setTokenDesired(selectedToken.name);
    }
  }, [selectedToken, tokenSelected, tokenDesired, setTokenDesired]);

  return (
    <div className={`w-[${width ? width : "128"}px]`}>
      <Listbox value={selectedToken} onChange={setSelectedToken}>
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full cursor-default rounded-lg border bg-white py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 sm:text-sm">
            <span className="block flex flex-row items-center gap-[6px] truncate">
              <selectedToken.svgLogo />
              <div>{selectedToken.name}</div>
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <Arrow />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options
              className={` absolute mt-1 max-h-60 w-[100%]
              overflow-auto  rounded-md bg-white text-base shadow-lg ring-black ring-opacity-5 focus:outline-none sm:text-sm`}
            >
              {list.map((token: Token, personIdx) => (
                <Listbox.Option
                  key={personIdx}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? "bg-[#E4E4E6] text-amber-900" : "text-gray-900"
                    }`
                  }
                  value={token}
                >
                  {({ selected }) => (
                    <>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                          <CheckPink />
                        </span>
                      ) : null}
                      <div className="flex flex-row gap-2">
                        <token.svgLogo />
                        <div>{token.name}</div>
                      </div>
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};
export default ListboxComponent;
