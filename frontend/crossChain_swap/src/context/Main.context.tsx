import React, {
  createContext,
  FC,
  ReactNode,
  useEffect,
  useState,
} from "react";

type MainContextProps = {
  setShowContactModal: Function;
  showContactModal: boolean;
  windowWidth: number;
};

type MainProviderProps = {
  children: ReactNode;
};

export const MainContext = createContext({} as MainContextProps);

const MainProvider: FC<MainProviderProps> = ({ children }) => {
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  const [showContactModal, setShowContactModal] = useState<boolean>(false);

  useEffect(() => {
    function handleWindowResize() {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  return (
    <MainContext.Provider
      value={{
        setShowContactModal,
        showContactModal,
        windowWidth,
      }}
    >
      {children}
    </MainContext.Provider>
  );
};

export default MainProvider;
