import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { BarChart, LogOut, NotebookTabs, ClipboardList } from "lucide-react";

export const NavBar = ({ handleLogout }) => {
  const navigate = useNavigate()

  const onLogout = () => {
    handleLogout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-light bg-[#11237c] m-0 min-w-[400px] lg:w-[100%] h-auto xl:h-[125px] flex justify-center border-b-4 border-gray-950 ">
      <div className="w-[80%] flex flex-col xl:flex-row justify-between items-center">
        <div className="flex xl:ml-11">
          <img src="/logo_gob.png" alt="logo gobierno" className="h-[90px] mx-4" />
          <div
            className="inline-block h-[90px] min-h-[1em] w-0.5 self-stretch separator-gradient"></div>
          <img src="/logo_midme.png" alt="logo midme" className="h-[90px] ml-4 invert-[1] brightness-0" />
          <div
            className="inline-block h-[90px] xl:hidden  min-h-[1em] w-0.5 self-stretch separator-gradient "></div>
          <img src="/logo_batalla.png" alt="logo cvm" className="h-[90px] invert-[1] brightness-0 mr-11 xl:hidden " />
        </div>
        <div className="flex mt-8 xl:mt-0 lg:mr-11 text-center justify-center items-end text-white">
          <div className="flex flex-col lg:flex-row text-center justify-center items-end text-white">
            <Button
              variant="transparent"
              className="flex justify-center items-center"
              onClick={() => navigate('/dashboard')}
            >
              <NotebookTabs className="h-[20px] w-[20px] mr-1" />
              <span className="primary-text">REGISTROS</span>
            </Button>
            <Button
              variant="transparent"
              className="flex justify-center items-center"
              onClick={() => navigate('/reports-dashboard')}
            >
              <ClipboardList className="h-[20px] w-[20px] mr-1" />
              <span className="primary-text">REPORTES</span>
            </Button>
            <Button
              variant="transparent"
              className="flex justify-center items-center "
              onClick={() => navigate('/statistics-dashboard')}
            >
              <BarChart className="h-[20px] w-[20px] mr-1" />
              <span className="primary-text">ESTADÍSTICAS</span>
            </Button>
            <Button
              variant="transparent"
              className="flex justify-center items-center p-2"
              onClick={onLogout}
            >
              <LogOut className="h-[20px] w-[20px] mr-1" />
              <span className="primary-text">SALIR</span>
            </Button>
          </div>
          <div
            className=" h-[90px] hidden xl:inline-block  min-h-[1em] w-0.5 self-stretch separator-gradient "></div>
          <img src="/logo_batalla.png" alt="logo cvm" className="h-[90px] mx-4 xl:mr-11 hidden invert-[1] brightness-0 xl:block " />
        </div>
      </div>
    </nav>
  );
}