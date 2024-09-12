import Header from "./components/Header"
import { BrowserRouter,Route,Routes } from "react-router-dom"
import CountryNews from "./components/CountryNews"
import News from "./components/News"
import TopHeadlines from "./components/TopHeadlines"
import Footer from "./components/Footer"

function App() {
  return (
    <div className="w-full">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<News />} />
          <Route path="/top-headlines/:category" element={<TopHeadlines />} />
          <Route path="/country/:iso" element={<CountryNews />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App
