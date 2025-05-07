import { BrowserRouter, Route, Routes } from "react-router";
import { Home, NotFound, RootErrorBoundary, AnimeDetails } from "./page";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} errorElement={<RootErrorBoundary />} />
        <Route path="/anime/:id" element={<AnimeDetails />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
