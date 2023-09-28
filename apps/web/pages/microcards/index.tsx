// import PageWrapper from "@components/PageWrapper";
// const MicroCardTestPage = () => {
//   return (
//     <div className="grid grid-cols-4 gap-12">
//       <CoordonneesPage />
//       <AIPage />
//       <TimeTokenPage />
//       <ServicesPage />
//     </div>
//   );
// };
// MicroCardTestPage.PageWrapper = PageWrapper;
// export default MicroCardTestPage;
import React from "react";

import MicroCards from "@components/microcard";

const MicroCardTestPage = () => {
  return (
    <div className="w-1/2">
      <MicroCards />
    </div>
  );
};

export default MicroCardTestPage;
