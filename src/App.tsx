import { SiteProvider } from "./context/SiteContext";
import { Chrome } from "./components/Chrome";
import { PlateNav } from "./components/PlateNav";
import { Threshold } from "./components/plates/Threshold";
import { About } from "./components/plates/About";
import { Campus } from "./components/plates/Campus";
import { Work } from "./components/plates/Work";
import { Worlds } from "./components/plates/Worlds";
import { Now } from "./components/plates/Now";
import { Door } from "./components/plates/Door";

export default function App() {
  return (
    <SiteProvider>
      <div className="grain" aria-hidden="true" />
      <Chrome />
      <PlateNav />
      <main>
        <Threshold />
        <About />
        <Campus />
        <Work />
        <Worlds />
        <Now />
        <Door />
      </main>
    </SiteProvider>
  );
}
