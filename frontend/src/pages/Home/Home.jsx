import { useEffect, useState } from 'react';
import TopBar from "./TopBar";
import { homeContent } from "../../Content/Text";
import { AwesomeButton } from "react-awesome-button";
import { useNavigate } from "react-router-dom";
import bgImage from '../../assets/images/backgrounds/Creativity-pana.svg'

function HomePage() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const email = params.get('email');
    const username = params.get('username');

    // Check if email and username exist in URL
    if (email && username) {
      const logindata = {
        email,
        username
      };

      localStorage.setItem('logindata', JSON.stringify(logindata));
      console.log('Login data saved:', logindata);
    }

    const logindata = localStorage.getItem('logindata');
    if (logindata) {
      try {
        const parsedData = JSON.parse(logindata);
        if (Object.keys(parsedData).length > 0) {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('Error parsing logindata:', error);
      }
    }
  }, []);


  return (
    <div className="h-screen">
      <TopBar />
      <div className="flex h-full">
        <div className="w-1/2 flex flex-col items-center justify-center ">
          <div className=" w-2/3">
            {/* <h1 className="font-short-stack text-3xl">{homeContent.title}</h1> */}
            <p className="font-delius text-3xl font-bold">{homeContent.aboutUs}</p>
            <br></br>
            <p className="font-delius text-2xl">{homeContent.about}</p>
            <ul>
              <li className="font-delius text-1xl text-blue-800">{homeContent.instruction1}</li>
              <li className="font-delius text-1xl text-blue-800">{homeContent.instruction2}</li>
              <li className="font-delius text-1xl text-blue-800">{homeContent.instruction3}</li>
              <li className="font-delius text-1xl text-blue-800">{homeContent.instruction4}</li>
              <li className="font-delius text-1xl text-blue-800">{homeContent.instruction5}</li>
            </ul>
          </div>
          <div className="flex mt-8 w-2/3">
            <div className="mr-2">
              <AwesomeButton
                type="primary"
                onReleased={() => {
                  navigate(homeContent.btn1Navigation);
                }}
                style={{
                  "--button-primary-color": "#ffbc05",
                  "--button-primary-color-dark": "#daa000",
                  "--button-primary-color-light": "#ffffff",
                  "--button-primary-color-hover": "#00cee9",
                  "--button-primary-color-active": "#00a5bb",
                  "--button-default-border-radius": "8px",
                  height: "50px",
                  marginRight: "10px",
                  fontSize: "20px",
                  borderStyle: "solid",
                  borderRadius: "10px",
                  borderColor: "black",
                  fontFamily: "'Short Stack', cursive",
                  fontSize: "20px",
                }}
              >
                {homeContent.bt1Name}
              </AwesomeButton>
            </div>
            { isLoggedIn && 
                <div>
                  <AwesomeButton
                    type="primary"
                    onReleased={() => {
                      navigate(homeContent.btn3Navigation);
                    }}
                    style={{
                      "--button-primary-color": "#ffbc05",
                      "--button-primary-color-dark": "#daa000",
                      "--button-primary-color-light": "#ffffff",
                      "--button-primary-color-hover": "#00cee9",
                      "--button-primary-color-active": "#00a5bb",
                      "--button-default-border-radius": "8px",
                      height: "50px",
                      marginRight: "10px",
                      fontSize: "20px",
                      borderStyle: "solid",
                      borderRadius: "10px",
                      borderColor: "black",
                      fontFamily: "'Short Stack', cursive",
                      fontSize: "20px",
                    }}
                  >
                    {homeContent.btn3Name}
                  </AwesomeButton>
                </div>
            }
          </div>
        </div>
        <div className="w-1/2 bg-blue-900 h-full">
              <div className="flex h-screen items-center justify-center">
                <div>
                  <img src={bgImage} width={700} alt="bgImage" />
                </div>
              </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
