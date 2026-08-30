import { SiteProvider } from "./context/SiteContext";
import { Chrome } from "./components/Chrome";
import { Profile } from "./components/plates/Profile";
import { Timeline } from "./components/plates/Timeline";
import { Projects } from "./components/plates/Projects";
import { Contact } from "./components/plates/Contact";

export default function App() {
  return (
    <SiteProvider>
      <div className="grain" aria-hidden="true" />
      <Chrome />
      <main>
        <Profile />
        <Timeline />
        <Projects />
        <Contact />
      </main>
    </SiteProvider>
  );
}
