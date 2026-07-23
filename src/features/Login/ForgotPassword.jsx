import React from "react";
import styles from "./styles/ForgotPassword.module.css";
import Input from "../../shared/components/Input";
import Button from "../../shared/components/Button";
import TebeModal from "../../shared/components/Modal";
import useForgotPassword from "./hooks/useForgotPassword";
import ComponentLoader from "../../components/ComponentLoader";

const ForgotPassword = ({ toggleForgotPassword }) => {
  const {
    openSuccessModal,
    toggleSuccessModal,
    register,
    handleSubmit,
    watch,
    sendEmail,
    loading,
    errors,
    validateEmail,
    clearErrors,
  } = useForgotPassword();

  return (
    <>
      {loading && (
        <ComponentLoader customStyle={{ position: "fixed", top: 0, left: 0 }} />
      )}
      <div className={styles.forgotPassword}>
        <div className={styles.forgotText}>
          <h3>Esqueceu a senha?</h3>
          <p>Para redefinir sua senha, insira seu endereço de e-mail abaixo.</p>
          <p>Em seguida, enviaremos um link para o processo de redefinição.</p>
        </div>

        <div className={styles.emailInput}>
          <Input
            type={"email"}
            label={"E-mail"}
            placeholder={"nome@email.com"}
            {...register("email", {
              required: true,
              validate: {
                validEmail: async (value) => {
                  const validate = await validateEmail({
                    email: value,
                    sender: value,
                    validateRegex: true,
                    validateMx: true,
                    validateTypo: true,
                    validateDisposable: true,
                    validateSMTP: false,
                  });

                  return validate.valid || "E-mail inválido";
                },
              },
              onChange: () => clearErrors("emailNotFound"),
            })}
            errorMessages={
              !!!errors?.email && !!!errors?.emailNotFound
                ? []
                : [
                    !!errors?.email ? "Insira um e-mail válido" : "",
                    !!errors?.emailNotFound
                      ? "Não foi encontrado nenhuma conta para esse endereço de e-mail."
                      : "",
                  ]
            }
          />
        </div>

        <div className={styles.actionButtons}>
          <Button onClick={handleSubmit(sendEmail)}>ENVIAR E-MAIL</Button>
          <Button outline={true} onClick={toggleForgotPassword}>
            VOLTAR
          </Button>
        </div>
      </div>
      <TebeModal
        showModal={openSuccessModal}
        toggleModal={toggleSuccessModal}
        title={"E-mail enviado!"}
        modalLine={false}
        bodyContent={
          <>
            <p>
              Enviamos um e-mail para o endereço fornecido{" "}
              <b>{watch("email")}</b>. Se associado a uma conta, você receberá
              em breve as instruções para redefinir sua senha. Se você não
              receber o e-mail em alguns minutos, verifique a sua caixa de spam
              ou tente novamente.
            </p>
          </>
        }
        dismissButton={false}
        confirmButton={false}
      />
    </>
  );
};

export default ForgotPassword;
