import React from "react";
import styles from "./styles/ForgottenPasswordReset.module.css";
import useForgottenPasswordReset from "./hooks/useForgottenPasswordReset";
import FullPageLoader from "../../components/FullPageLoader";
import { Redirect } from "react-router-dom";
import { CheckRounded } from "@mui/icons-material";
import Input from "../../shared/components/Input";
import { formatErrorList } from "../../utilities";
import Button from "../../shared/components/Button";
import { ComponentLoader } from "../../components";
import ValidTokenInfo from "../../shared/components/ValidTokenInfo";
import SimpleNavbar from "../../shared/components/SimpleNavbar";

const ForgottenPasswordReset = ({ location }) => {
  const {
    isPageLoading,
    email,
    register,
    handleSubmit,
    watch,
    errors,
    onSubmit,
    loading,
    passwordChanged,
  } = useForgottenPasswordReset(location);

  if (isPageLoading) {
    return <FullPageLoader />;
  }

  if (passwordChanged) {
    return (
      <Redirect
        to={{
          pathname: "/",
        }}
      />
    );
  }

  if (!email) {
    return (
      <>
        <SimpleNavbar />
        <ValidTokenInfo
          isValid={false}
          message={"O link de redefinição é inválido"}
        />
      </>
    );
  }

  const passwordVerifyAux = watch("password")?.length > 0 ? true : null;

  return (
    <>
      {loading && <ComponentLoader className={styles.loaderComponent} />}
      <SimpleNavbar />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles.forgottenPasswordReset}
      >
        <div className={styles.title}>
          <h1>Redefinição de Senha</h1>
          <p>Preencha os dados abaixo atentamente, para redefinir sua senha.</p>
        </div>
        <div className={styles.securePassword}>
          <h3>Dicas para criar uma senha mais segura:</h3>
          <div className={styles.tips}>
            <div className={styles.tip}>
              <CheckRounded />
              <p>Combine letras maiúsculas e minúsculas, símbolos e números</p>
            </div>
            <div className={styles.tip}>
              <CheckRounded />
              <p>Não use informações pessoais</p>
            </div>
            <div className={styles.tip}>
              <CheckRounded />
              <p>
                Para maior segurança, defina uma senha diferente da anterior
              </p>
            </div>
          </div>
        </div>
        <div className={styles.form}>
          <Input
            type={"email"}
            label={"E-mail"}
            readOnly
            disabled
            {...register("email", {
              value: email,
              validate: {
                unchangedEmail: (value) =>
                  value === email || "O e-mail não pode ser alterado",
              },
            })}
            errorMessages={formatErrorList(errors["email"])}
          />
          <Input
            type="password"
            label={"Senha"}
            placeholder={"Digite sua senha"}
            requirementsInfo={{
              title: "Senha deve conter no mínimo",
              requirements: [
                {
                  label: "8 caracteres",
                  isValid: !errors["password"]?.types?.hasOwnProperty(
                    "minLength"
                  )
                    ? passwordVerifyAux
                    : false,
                },
                {
                  label: "1 caractere especial",
                  isValid: !errors["password"]?.types?.hasOwnProperty(
                    "hasSpecialChar"
                  )
                    ? passwordVerifyAux
                    : false,
                },
                {
                  label: "1 número",
                  isValid: !errors["password"]?.types?.hasOwnProperty(
                    "hasNumber"
                  )
                    ? passwordVerifyAux
                    : false,
                },
                {
                  label: "1 letra maiúscula",
                  isValid: !errors["password"]?.types?.hasOwnProperty(
                    "hasUppercaseLetter"
                  )
                    ? passwordVerifyAux
                    : false,
                },
                {
                  label: "1 letra minúscula",
                  isValid: !errors["password"]?.types?.hasOwnProperty(
                    "hasLowercaseLetter"
                  )
                    ? passwordVerifyAux
                    : false,
                },
              ],
            }}
            isValid={!!!errors["password"]}
            errorMessages={
              errors["password"]?.type === "maxLength"
                ? [errors["password"].message]
                : []
            }
            {...register("password", {
              required: true,
              minLength: { value: 8, message: "Mínimo 8 caracteres" },
              maxLength: { value: 256, message: "Máximo 256 caracteres" },
              validate: {
                hasUppercaseLetter: (value) =>
                  /^(?=.*[A-Z])/.test(value) || "1 letra maiúscula",
                hasLowercaseLetter: (value) =>
                  /^(?=.*[a-z])/.test(value) || "1 letra minúscula",
                hasSpecialChar: (value) =>
                  /[!@#$%^&*(),.?":{}|<>]/.test(value) ||
                  "1 caractere especial",
                hasNumber: (value) => /\d/.test(value) || "1 número",
                minLength: (value) =>
                  value.length >= 8 || "Mínimo 8 caracteres",
              },
            })}
            required
            autoComplete="new-password"
            isFakePassword={true}
          />
          <Input
            type="password"
            label={"Confirmar Senha"}
            placeholder={"Repita sua senha"}
            info={
              "Repita a senha para verificação. Certifique-se de coincidir com a senha original."
            }
            {...register("repassword", {
              required: true,
              validate: {
                samePassword: (value) =>
                  watch("password") === value ||
                  "Repita a senha para verificação. Certifique-se de coincidir com a senha original.",
              },
            })}
            required
            isValid={!!!errors["repassword"]}
            isFakePassword={true}
          />
        </div>
        <Button>REDEFINIR SENHA</Button>
      </form>
    </>
  );
};

export default ForgottenPasswordReset;
