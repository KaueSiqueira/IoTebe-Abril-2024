import React from "react";
import Input from "../../../../shared/components/Input";
import Button from "../../../../shared/components/Button";
import spotify from "../../../../assets/customIcons/spotify.svg";
import useLogin from "../../hooks/useLogin";
import styles from "./styles/LoginForm.module.css";
import ForgotPassword from "../../ForgotPassword";
import {
  FacebookRounded,
  HighlightOffRounded,
  Instagram,
  LanguageRounded,
  LinkedIn,
  SupportAgentRounded,
  YouTube,
} from "@mui/icons-material";
import { concatClassName } from "../../../../utilities";

function LoginForm({ isLoading, history }) {
  const {
    register,
    handleSubmit,
    handleSignIn,
    errors,
    clearErrors,
    toggleForgotPassword,
    forgotPassword,
  } = useLogin(isLoading, history);

  const hasErrors = errors?.invalid;

  if (forgotPassword) {
    return <ForgotPassword toggleForgotPassword={toggleForgotPassword} />;
  }

  return (
    <>
      <div className={styles.loginForm}>
        <div
          className={concatClassName(
            styles.loginLogoHeader,
            hasErrors && styles.loginLogoHeaderMargins
          )}
        >
          <h2 className={styles.loginLogoHeaderTitle}>Login</h2>
          <p>Acesse o IoTebe e monitore seus ativos</p>
        </div>

        {hasErrors && (
          <div className={styles.loginError}>
            <HighlightOffRounded />
            Usuário ou senha incorretos
          </div>
        )}

        <div className={styles.inputWrapper}>
          <Input
            type={"text"}
            label={"Usuário"}
            placeholder="Nome de usuário"
            {...register("username", {
              onChange: () => clearErrors("invalid"),
            })}
            isValid={!errors?.invalid}
          />

          <Input
            type={"password"}
            label={"Senha"}
            placeholder="Digite sua senha"
            inputAction={{
              label: "esqueceu a senha?",
              action: toggleForgotPassword,
            }}
            {...register("password", {
              onChange: () => clearErrors("invalid"),
            })}
            isValid={!errors?.invalid}
          />
        </div>

        <div className={styles.actionButtons}>
          <Button onClick={handleSubmit(handleSignIn)}>LOGIN</Button>
          <Button
            outline
            href={"https://wa.me/551931321442?text=Olá, gostaria de ajuda"}
            target="_blank"
          >
            <SupportAgentRounded /> SUPORTE
          </Button>
        </div>

        <div className={styles.loginSocial}>
          <p>Siga nossas redes e fique por dentro de novas atualizações!</p>

          <div className={styles.loginSocialButtons}>
            <div className={styles.groupButtons}>
              <Button
                className={styles.roundedButton}
                href="https://www.instagram.com/tebesensor/"
                target="_blank"
              >
                <Instagram />
              </Button>
              <Button
                className={styles.roundedButton}
                href="https://www.facebook.com/tebesensor"
                target="_blank"
              >
                <FacebookRounded />
              </Button>
              <Button
                className={styles.roundedButton}
                href="https://open.spotify.com/show/1Hrb3QMmWIuW2e8JIj0nBi?si=d05861c8cf64416d"
                target="_blank"
              >
                <img src={spotify} alt="" />
              </Button>
            </div>

            <div className={styles.groupButtons}>
              <Button
                className={styles.roundedButton}
                href="https://br.linkedin.com/company/tebe-sensores"
                target="_blank"
              >
                <LinkedIn />
              </Button>
              <Button
                className={styles.roundedButton}
                href="https://www.youtube.com/channel/UCk6m6oKujmvrWUYgBeEIQNQ"
                target="_blank"
              >
                <YouTube />
              </Button>
              <Button
                className={styles.roundedButton}
                href="https://www.tebesensor.com/"
                target="_blank"
              >
                <LanguageRounded />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginForm;
