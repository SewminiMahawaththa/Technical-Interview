import { Route, Routes } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import HomePage from "../pages/Home/Home";
import { Reports } from "../pages/Reports";
import Quiz from "../pages/Quiz/Quiz";
import MockQuiz from "../pages/MockQuiz/mockQuiz";


export default function MainRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage /> }/>
        <Route path="/mock-quiz" element={<MockQuiz /> }/>
        <Route path="/quiz" element={ <Quiz/> }/>
        <Route path="/Results" element={<Reports /> }/>
      </Routes>
    </BrowserRouter>
  );
}
