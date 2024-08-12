import { RecoilRoot } from "recoil";
import { QueryProvider } from "./provider/QueryProvider";
import { ThemeProvider } from "./provider/ThemeProvider";
import Routes from "./routes";

function App() {
  return (
    <QueryProvider>
      <RecoilRoot>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <Routes />
        </ThemeProvider>
      </RecoilRoot>
    </QueryProvider>
  );
}

export default App;
