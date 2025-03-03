import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { translationKeys } from "../../lang/translationKeys";
import homeImg1 from "../../assets/img/home-img-1.svg";
import homeImg2 from "../../assets/img/home-img-2.svg";
import homeImg3 from "../../assets/img/home-img-3.svg";
import spinner from "../../assets/img/spinner.png";
import arrowWhite from "../../assets/img/arrow-up-right-white.png";
import arrowBlack from "../../assets/img/arrow-up-right.png";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { API_LINKS, ROUTE } from "../../constants";
import { useAppDispatch } from "../../store";
import { useSelector } from "react-redux";
import { loginWithJWTAction } from "../../store/state/auth";
import {
  getAccessTokenSelector,
  getIsAuthenticatedSelector,
} from "../../store/state/auth/selectors";
import "./styles.css";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const isAuthenticated = useSelector(getIsAuthenticatedSelector);
  const accessToken = useSelector(getAccessTokenSelector);

  const handleAuthCallback = () => {
    window.location.href = API_LINKS.AUTHORIZE;
  };

  const handleJwtAuthFlow = () => {
    dispatch(loginWithJWTAction() as any);
  };

  useEffect(() => {
    const hasAccessToken = !!accessToken;
    if (isAuthenticated && hasAccessToken) {
      navigate(ROUTE.AGREEMENTS);
    }
  }, [isAuthenticated, accessToken, navigate]);

  return (
    <div className="content">
      <Header className="home-header" />
      <section className="hero-section hero-home small-container">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-5 col-md-12">
              <div className="hero-info-container headers-container">
                <div className="hero-info">
                  <h1
                    className="main-title"
                    dangerouslySetInnerHTML={{
                      __html: t(translationKeys.HOME_HEADER_TITLE),
                    }}
                  ></h1>
                </div>
                <div className="buttons-div">
                  <a
                    className="btn-homepage btn-connect authorize-btn connect-to-docusign-account"
                    onClick={handleAuthCallback}
                  >
                    {t(translationKeys.HOME_HEADER_BTN_TITLE)}
                    <img src={arrowWhite} alt="" />
                  </a>
                  <a
                    className="btn-homepage btn-connect btn-login authorize-btn connect-with-test-account"
                    onClick={handleJwtAuthFlow}
                  >
                    {t(translationKeys.HOME_HEADER_CARD_BTN_TITLE1)}
                    <img src={arrowBlack} alt="" />
                  </a>
                </div>
                <p className="step-description">
                  {t(translationKeys.HOME_HEADER_STEP_ONE)}  or <a href='https://developers.docusign.com/docs/navigator-api/beta/' target='_blank' rel='noopener noreferrer'>join the closed beta</a>.
                </p>
              </div>
            </div>
            <div className="col-lg-7 col-md-12 main-images">
              <div className="main-image">
                <img className="home-first-image" src={homeImg1} alt="" />
                <img className="home-second-image" src={homeImg2} alt="" />
                <div className="d-flex">
                  <img className="home-third-image" src={homeImg3} alt="" />
                  <span
                    className="cta-title"
                    dangerouslySetInnerHTML={{
                      __html: t(translationKeys.HOME_HEADER_NOTE),
                    }}
                  ></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="info-section text-center">
        <div className="container-fluid">
          <div className="info-container">
            <div className="links-group">
              <a
                className="btn-homepage btn-connect btn-login authorize-btn connect-with-test-account documentation-button-1"
                href="https://go.docusign.com/o/sandbox/"
                target="_blank"
                aria-label="Visit DocuSign Sandbox"
              >
                {t(translationKeys.HOME_DOCUSIGN_CREATE_ACCOUNT)}
              </a>
              <a
                className="btn-homepage btn-connect btn-login authorize-btn connect-with-test-account documentation-button-2"
                href="https://developers.docusign.com/"
                target="_blank"
                aria-label="Learn more about DocuSign"
              >
                {t(translationKeys.HOME_DOCUSIGN_LEARN_MORE)}
              </a>
            </div>
          </div>
          <div className="links-container">
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Home;
