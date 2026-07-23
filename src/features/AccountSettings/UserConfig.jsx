import React from "react";
import useUserConfig from "./hooks/useUserConfig";
import useChangeEmail from "./hooks/useChangeEmail";
import styles from "./styles/AccountSettings.module.css";
import Input from "../../shared/components/Input";
import { formatErrorList } from "../../utilities";
import Button from "../../shared/components/Button";
import { SyncLockRounded } from "@mui/icons-material";
import TebeModal from "../../shared/components/Modal";
import ComponentLoader from "../../components/ComponentLoader";
import useChangePhone from "./hooks/useChangePhone";
import CodeInput from "./CodeInput";
import useChangePassword from "./hooks/useChangePassword";

const UserConfig = ({
  userInfo,
  countryLabels,
  countries,
  saveUserInfo,
  getUserInfo,
}) => {
  const {
    register,
    errors,
    watch,
    openEmailModal,
    toggleEmailModal,
    openPhoneModal,
    togglePhoneModal,
    openPasswordModal,
    togglePasswordModal,
  } = useUserConfig(userInfo);

  return (
    <>
      <div className={styles.contentContainer}>
        <div className={styles.configSection}>
          <h1 className={styles.contentTitle}>Configurações do Usuário</h1>
          <div className={styles.configInputs}>
            <Input
              label={"Nome"}
              placeholder={"Nome completo"}
              {...register("name", {
                required: true,
                minLength: { value: 3, message: "Mínimo 3 caracteres" },
                maxLength: { value: 255, message: "Máximo 255 caracteres" },
              })}
              saveButton={{
                isActive: watch("name") !== userInfo.name,
                action: () => {
                  saveUserInfo({
                    update: "user",
                    name: watch("name"),
                    phone: userInfo.phone,
                    username: userInfo.username,
                  });
                },
              }}
              errorMessages={formatErrorList(errors["name"])}
            />
            <Input
              label={"Usuário"}
              placeholder={"Nome de usuário"}
              defaultValue={userInfo.username}
              readOnly
              disabled
            />
            <Input
              type="tel"
              label={"Celular"}
              placeholder={"Número do WhatsApp"}
              countries={countries}
              countryLabels={countryLabels}
              selectedCountry={userInfo.phoneCountry}
              defaultValue={userInfo.phone}
              readOnly
              inputAction={{
                label: "Editar Número",
                action: togglePhoneModal,
              }}
            />
            <Input
              type="email"
              label={"E-mail"}
              placeholder={"Endereço de E-mail"}
              defaultValue={userInfo.email}
              readOnly
              inputAction={{
                label: "Editar E-mail",
                action: toggleEmailModal,
              }}
            />
          </div>
        </div>
        <div className={styles.resetPassword}>
          <h1 className={styles.contentTitle}>Redefinição de Senha</h1>
          <Button size="sm" onClick={togglePasswordModal}>
            <SyncLockRounded /> Alterar senha
          </Button>
        </div>
      </div>
      {openEmailModal && (
        <EmailModal
          openEmailModal={openEmailModal}
          toggleEmailModal={toggleEmailModal}
        />
      )}
      {openPhoneModal && (
        <PhoneModal
          openPhoneModal={openPhoneModal}
          togglePhoneModal={togglePhoneModal}
          userInfo={userInfo}
          countries={countries}
          countryLabels={countryLabels}
          getUserInfo={getUserInfo}
        />
      )}
      {openPasswordModal && (
        <PasswordModal
          openPasswordModal={openPasswordModal}
          togglePasswordModal={togglePasswordModal}
          getUserInfo={getUserInfo}
        />
      )}
    </>
  );
};

const EmailModal = ({ openEmailModal, toggleEmailModal }) => {
  const {
    register,
    errors,
    handleSubmit,
    checkEmail,
    handleEmail,
    handlePassword,
    loading,
    emailSended,
    watch,
  } = useChangeEmail(toggleEmailModal);

  return (
    <TebeModal
      showModal={openEmailModal}
      toggleModal={toggleEmailModal}
      title={"Alterar o E-mail"}
      modalLine={false}
      size={"sm"}
      bodyContent={
        <>
          {loading && (
            <ComponentLoader
              customStyle={{ position: "fixed", top: 0, left: 0 }}
            />
          )}
          {emailSended ? (
            <>
              <p>
                A alteração ficará pendente até a confirmação do seu novo e-mail{" "}
                <b>{watch("email")}</b>.
              </p>
              <p>
                Verifique sua caixa de entrada para acessar o link de
                confirmação.
              </p>
            </>
          ) : (
            <>
              <Input
                autoComplete="off"
                type="email"
                label={"Novo e-mail"}
                placeholder={"Novo endereço de E-mail"}
                {...register("email", {
                  required: true,
                  onChange: () => handleEmail(),
                })}
                isValid={!!!errors?.email && !!!errors?.invalidEmail}
                errorMessages={
                  errors?.invalidEmail ? [errors.invalidEmail.message] : []
                }
              />
              <Input
                autoComplete="off"
                type="password"
                label={"Senha"}
                placeholder={"Insira sua senha"}
                {...register("password", {
                  required: true,
                  onChange: () => handlePassword(),
                })}
                isValid={!!!errors?.password && !!!errors?.invalidPassword}
                errorMessages={
                  errors?.invalidPassword
                    ? [errors.invalidPassword.message]
                    : []
                }
                isFakePassword={true}
              />
            </>
          )}
        </>
      }
      onConfirm={handleSubmit(checkEmail)}
      confirmButton={!emailSended}
      dismissButton={!emailSended}
    />
  );
};

const PhoneModal = ({
  openPhoneModal,
  togglePhoneModal,
  userInfo,
  countryLabels,
  countries,
  getUserInfo,
}) => {
  const {
    register,
    errors,
    handleSubmit,
    loading,
    setLoading,
    watch,
    handleSelectCountry,
    validatePhoneNumber,
    setValue,
    validPhone,
    selectedCountry,
    nextStep,
    prevStep,
    verifyCodeRef,
    setIsCodeValid,
    validateCodeSubmit,
  } = useChangePhone(togglePhoneModal, userInfo, getUserInfo);

  return (
    <TebeModal
      showModal={openPhoneModal}
      toggleModal={togglePhoneModal}
      title={validPhone ? "Confirmar código" : "Alterar o número do celular"}
      subTitle={
        !validPhone &&
        "Ao registrar o celular, você concorda em receber notificações por meio de mensagem de texto da Tebe."
      }
      modalLine={false}
      size="sm"
      bodyContent={
        <>
          {loading && (
            <ComponentLoader
              customStyle={{ position: "fixed", top: 0, left: 0 }}
            />
          )}
          {validPhone ? (
            <CodeInput
              numberToVerify={watch("phone")}
              selectedCountry={selectedCountry}
              changeNumberAction={prevStep}
              ref={verifyCodeRef}
              setLoadingValidation={setLoading}
              setIsCodeValid={setIsCodeValid}
            />
          ) : (
            <Input
              type="tel"
              label={"Celular"}
              placeholder={"Número do WhatsApp"}
              countries={countries}
              countryLabels={countryLabels}
              selectedCountry={selectedCountry}
              onChangeCountry={handleSelectCountry}
              {...register("phone", {
                required: true,
                validate: {
                  validNumber: (value) =>
                    validatePhoneNumber(value) || "Número de telefone inválido",
                },
                onChange: (e) => {
                  setValue("phone", e.target.value.replace(/[^0-9]/, ""));
                },
              })}
              errorMessages={errors?.phone ? [errors.phone.message] : []}
            />
          )}
        </>
      }
      onConfirm={handleSubmit(() => {
        validPhone ? validateCodeSubmit() : nextStep();
      })}
    />
  );
};

const PasswordModal = ({
  openPasswordModal,
  togglePasswordModal,
  getUserInfo,
}) => {
  const {
    register,
    errors,
    handleSubmit,
    changePassword,
    handlePassword,
    loading,
    watch,
  } = useChangePassword(togglePasswordModal, getUserInfo);

  const passwordVerifyAux = watch("password")?.length > 0 ? true : null;

  return (
    <TebeModal
      showModal={openPasswordModal}
      toggleModal={togglePasswordModal}
      title={"Alterar senha"}
      modalLine={false}
      size={"sm"}
      bodyContent={
        <>
          {loading && (
            <ComponentLoader
              customStyle={{ position: "fixed", top: 0, left: 0 }}
            />
          )}
          <Input
            type="password"
            label={"Senha atual"}
            placeholder={"Insira sua senha atual"}
            {...register("currentpassword", {
              required: true,
              onChange: () => handlePassword(),
            })}
            isValid={!!!errors?.currentpassword && !!!errors?.invalidPassword}
            errorMessages={
              errors?.invalidPassword ? [errors.invalidPassword.message] : []
            }
            isFakePassword={true}
          />
          <Input
            type="password"
            label={"Nova senha"}
            placeholder={"Digite sua nova senha"}
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
            autoComplete="new-password"
            isFakePassword={true}
          />
          <Input
            type="password"
            label={"Confirmar senha"}
            placeholder={"Repita sua nova senha"}
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
            isValid={!!!errors["repassword"]}
            isFakePassword={true}
          />
        </>
      }
      onConfirm={handleSubmit(changePassword)}
    />
  );
};

export default UserConfig;
