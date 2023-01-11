import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";

interface AppProvidersProps {
  children: React.ReactNode;
}

const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <BrowserRouter>
      <RecoilRoot>{children}</RecoilRoot>
    </BrowserRouter>
  );
};

export default AppProviders;
