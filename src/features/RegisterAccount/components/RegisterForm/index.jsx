import React from "react";
import styles from "./styles/RegisterForm.module.css";
import Button from "../../../../shared/components/Button";
import Input from "../../../../shared/components/Input";
import useRegisterForm from "./hooks/useRegisterForm";
import { HighlightOffRounded } from "@mui/icons-material";
import { formatErrorList } from "../../../../utilities";
import { ComponentLoader } from "../../../../components";

const RegisterForm = ({
  email,
  handleNumberToVerify,
  selectedCountry,
  handleNumberCountry,
  token,
  handleEndRegister,
}) => {
  const {
    countryLabels,
    countries,
    onSubmit,
    register,
    handleSubmit,
    errors,
    validatePhoneNumber,
    handleSelectCountry,
    handleChangeValue,
    watch,
    loadingRegistration,
  } = useRegisterForm(
    handleNumberToVerify,
    selectedCountry,
    handleNumberCountry,
    token,
    handleEndRegister
  );

  const passwordVerifyAux = watch("password")?.length > 0 ? true : null;

  return (
    <>
      {loadingRegistration && (
        <ComponentLoader className={styles.loaderComponent} />
      )}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles.registerContainer}
      >
        <div className={styles.registerTitle}>
          <h1>Crie sua conta</h1>
          <h5 className={styles.subTitle}>
            Preencha os dados abaixo atentamente para criar seu acesso à
            plataforma IoTebe.
          </h5>
          <h5 className={styles.requiredFieldsMessage}>
            <span>*</span> campos obrigatórios
          </h5>
          {Object.keys(errors).find(
            (key) => errors[key].type === "required"
          ) && (
            <div className={styles.requiredFieldsError}>
              <HighlightOffRounded />
              <p>
                É necessário preencher todos os campos obrigatórios (
                <span>*</span>)
              </p>
            </div>
          )}
        </div>
        <div className={styles.registerInputs}>
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
            label={"Nome"}
            placeholder={"Nome completo"}
            {...register("name", {
              required: true,
              minLength: { value: 3, message: "Mínimo 3 caracteres" },
              maxLength: { value: 255, message: "Máximo 255 caracteres" },
            })}
            errorMessages={formatErrorList(errors["name"])}
            required
          />
          <Input
            label={"Empresa"}
            placeholder={"Nome da empresa"}
            {...register("company_name", {
              required: true,
              minLength: { value: 3, message: "Mínimo 3 caracteres" },
              maxLength: { value: 255, message: "Máximo 255 caracteres" },
            })}
            errorMessages={formatErrorList(errors["company_name"])}
            required
          />
          <Input
            type="tel"
            label={"Celular"}
            subLabel={
              "Enviaremos uma mensagem pelo WhatsApp para confirmar o seu número."
            }
            placeholder={"Número do WhatsApp"}
            countries={countries}
            countryLabels={countryLabels}
            selectedCountry={selectedCountry}
            onChangeCountry={(value) => {
              handleSelectCountry(value);
            }}
            {...register("phone", {
              validate: {
                validNumber: (value) =>
                  validatePhoneNumber(value) || "Número de telefone inválido",
              },
              onChange: (e) => {
                handleChangeValue(
                  "phone",
                  e.target.value.replace(/[^0-9]/, "")
                );
              },
            })}
            errorMessages={formatErrorList(errors["phone"])}
          />
          <Input
            label={"Nome de Usuário"}
            subLabel={
              "O nome de usuário será utilizado no login e não poderá ser alterado."
            }
            placeholder={"nome.sobrenome"}
            {...register("username", {
              required: true,
              minLength: { value: 3, message: "Mínimo 3 caracteres" },
              maxLength: { value: 128, message: "Máximo 128 caracteres" },
              pattern: {
                value: /^[a-z0-9._+-]*$/,
                message:
                  'Utilize apenas letras minúsculas e números. Os seguintes caracteres especiais também são permitidos: "_", ".", "+" e "-".',
              },
            })}
            errorMessages={formatErrorList(errors["username"])}
            required
            autoComplete="new-password"
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
        <div className={styles.registerButtons}>
          <Button type="submit">CADASTRAR</Button>
          <p>
            Já possuí Cadastro?{" "}
            <a href="https://iotebe.com/login">Acessar Login</a>
          </p>
        </div>
      </form>
    </>
  );
};

export default RegisterForm;
