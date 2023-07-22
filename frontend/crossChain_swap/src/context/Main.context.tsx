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
  showModalConnexion: boolean;
  setShowModalConnexion: Function;
};

type MainProviderProps = {
  children: ReactNode;
};

export const MainContext = createContext({} as MainContextProps);

const MainProvider: FC<MainProviderProps> = ({ children }) => {
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const [showModalConnexion, setShowModalConnexion] = useState<boolean>(false);

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
        showModalConnexion,
        setShowModalConnexion,
      }}
    >
      {children}
    </MainContext.Provider>
  );
};

export default MainProvider;
