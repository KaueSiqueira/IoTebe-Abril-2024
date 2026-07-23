import React, { useState } from "react";
import styles from "./styles/Login.module.css";
import LoginForm from "./components/LoginForm";
import SliderItem from "./components/SliderItem";
import Carousel from "./components/Carousel";
import { FullPageLoader } from "../../components";

import { logo, monitoramento, sensor, tebeApp } from "../../assets/imgs";

import { concatClassName } from "../../utilities";

const Login = ({ history }) => {
  const [isLoading, setLoading] = useState(false);

  const slides = [
    <SliderItem
      title="Monitoramento online completo da condição dos seus ativos"
      subtitle="Com o IoTebe você monitora a saúde dos seus equipamentos e detecta falhas antes que ocorram, eliminando manutenções corretivas não programadas"
      image={monitoramento}
      link="https://www.tebesensor.com/blog"
    />,
    <SliderItem
      title="Alertas automáticos de falhas críticas, direto no seu celular"
      subtitle="O sistema preditivo da Tebe coleta dados de 1 em 1 minuto e emite avisos automáticos para você e sua equipe via WhatsApp e e-mail"
      image={tebeApp}
      link="https://www.tebesensor.com/blog"
    />,
    <SliderItem
      title="Detecte defeitos com antecedência e tome decisões mais rápidas e assertivas"
      subtitle="O IoTebe gera diagnósticos automáticos dos seus ativos industriais com o apoio de Inteligência Artificial e ferramentas sofisticadas de análise de dados"
      image={sensor}
      link="https://www.tebesensor.com/blog"
    />,
  ];

  return (
    <>
      {isLoading && <FullPageLoader />}
      <div className={styles.loginContainer}>
        <div
          className={concatClassName(
            styles.loginContainerCollumn,
            styles.sliderColumn
          )}
        >
          <Carousel slides={slides} />
        </div>
        <div
          className={concatClassName(
            styles.loginContainerCollumn,
            styles.formColumn
          )}
        >
          <div className={styles.loginLogo}>
            <img src={logo} alt="logo-tebe" />
          </div>
          <LoginForm isLoading={setLoading} history={history} />
        </div>
      </div>
    </>
  );
};

export default Login;
