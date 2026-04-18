import Navbar from "../components/Navbar";
import SectionOne from "../components/SectionOne";
import SectionTwo from "../components/SectionTwo";
import "../styles/landing.css";
const Landing = () => {
  return (
    <div className="landing">
      <Navbar />
      <SectionOne />
      <SectionTwo />
    </div>
  );
};

export default Landing;
