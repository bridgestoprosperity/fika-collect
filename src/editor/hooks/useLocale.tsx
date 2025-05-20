import { createContext, useContext, useState, ReactNode } from "react";

type LocaleContextType = {
  selectedLocale: string;
  setLocale: ((locale: string) => void) | null;
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export const LocaleProvider = ({ children }: { children: ReactNode }) => {
  const [selectedLocale, setSelectedLocale] = useState("en");
  const setLocale = (locale: string) => {
    setSelectedLocale(locale);
  };

  return (
    <LocaleContext.Provider value={{ selectedLocale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = (): LocaleContextType => {
  const context = useContext(LocaleContext);
  if (!context) {
    return { selectedLocale: "en", setLocale: null };
  }
  return context;
};
