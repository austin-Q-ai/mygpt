import PageWrapper from "@components/PageWrapper";
import { CoordonneesPage, AIPage, TimeTokenPage, ServicesPage } from "@components/microcard";

const MicroCardTestPage = () => {
  return (
    <div className="grid grid-cols-4 gap-12">
      <CoordonneesPage />
      <AIPage />
      <TimeTokenPage />
      <ServicesPage />
    </div>
  );
};

MicroCardTestPage.PageWrapper = PageWrapper;

export default MicroCardTestPage;
