import React from "react";
import Input from "../../../../shared/components/Input";
import useVerifyNumber from "./hooks/useVerifyNumber";
import styles from "./styles/VerifyNumber.module.css";
import Button from "../../../../shared/components/Button";
import { ComponentLoader } from "../../../../components";
import TebeModal from "../../../../shared/components/Modal";
import { formatErrorList } from "../../../../utilities";

const VerifyNumber = ({
  numberToVerify,
  handleNumberToVerify,
  selectedCountry,
  handleNumberCountry,
  handleEndRegister,
}) => {
  const {
    countries,
    countryLabels,
    register,
    validatePhoneNumber,
    handleChangeValue,
    errors,
    handleCodeInput,
    handleKeyDown,
    handlePaste,
    handleSubmit,
    confirmWhatsappCode,
    formattedNumber,
    loadingVerify,
    sendWhatsappCode,
    formatTime,
    isRunning,
    phoneModel,
    togglePhoneModal,
    handleNewPhone,
    tempSelectedCountry,
    handleTempCountry,
  } = useVerifyNumber(
    numberToVerify,
    handleNumberToVerify,
    selectedCountry,
    handleNumberCountry,
    handleEndRegister
  );

  return (
    <>
      {loadingVerify && <ComponentLoader className={styles.loaderComponent} />}
      <form
        onSubmit={handleSubmit(confirmWhatsappCode)}
        className={styles.verifyContainer}
      >
        <div>
          <h1 className={styles.verifyTitle}>
            Insira o Código de verificação enviado no seu WhatsApp
          </h1>
          <div className={styles.verifySubTitle}>
            <h5>
              Para prosseguir com a criação da sua conta, insira o código de 6
              dígitos que enviamos para o número{" "}
              <span className={styles.phoneNumber}>{formattedNumber}</span>.{" "}
              <span onClick={togglePhoneModal} className={styles.linkAction}>
                Alterar número.
              </span>
            </h5>
          </div>
        </div>

        <div className={styles.verifyBody}>
          <div className={styles.codeInputs}>
            <Input
              type="number"
              onKeyDown={(e) => handleKeyDown(e, 1)}
              onPaste={handlePaste}
              autoComplete="new-password"
              {...register("digit-1", {
                onChange: (e) => handleCodeInput(e, 1),
              })}
              isValid={!Object.keys(errors).length}
            />
            <Input
              type="number"
              onKeyDown={(e) => handleKeyDown(e, 2)}
              onPaste={handlePaste}
              autoComplete="new-password"
              {...register("digit-2", {
                onChange: (e) => handleCodeInput(e, 2),
              })}
              isValid={!Object.keys(errors).length}
            />
            <Input
              type="number"
              onKeyDown={(e) => handleKeyDown(e, 3)}
              onPaste={handlePaste}
              autoComplete="new-password"
              {...register("digit-3", {
                onChange: (e) => handleCodeInput(e, 3),
              })}
              isValid={!Object.keys(errors).length}
            />
            <Input
              type="number"
              onKeyDown={(e) => handleKeyDown(e, 4)}
              onPaste={handlePaste}
              autoComplete="new-password"
              {...register("digit-4", {
                onChange: (e) => handleCodeInput(e, 4),
              })}
              isValid={!Object.keys(errors).length}
            />
            <Input
              type="number"
              onKeyDown={(e) => handleKeyDown(e, 5)}
              onPaste={handlePaste}
              autoComplete="new-password"
              {...register("digit-5", {
                onChange: (e) => handleCodeInput(e, 5),
              })}
              isValid={!Object.keys(errors).length}
            />
            <Input
              type="number"
              onKeyDown={(e) => handleKeyDown(e, 6)}
              onPaste={handlePaste}
              autoComplete="new-password"
              {...register("digit-6", {
                onChange: (e) => handleCodeInput(e, 6),
              })}
              isValid={!Object.keys(errors).length}
            />
          </div>
          {!!Object.keys(errors).find((key) => key === "invalidCode") && (
            <p className={styles.codeError}>
              O código informado está incorreto, tente novamente
            </p>
          )}
          <div className={styles.verifySubTitle}>
            <h5>
              O Código irá expirar em 10 minutos. Não recebeu o código?{" "}
              {isRunning ? (
                <>Aguarde {formatTime()}</>
              ) : (
                <span
                  onClick={() => sendWhatsappCode()}
                  className={styles.linkAction}
                >
                  Reenviar código
                </span>
              )}
            </h5>
          </div>
        </div>

        <div className={styles.verifyFooter}>
          <div className={styles.verifySubTitle}>
            <h4>
              Ao registrar um número de celular, você concorda em receber
              notificações automatizadas por meio de mensagem de texto da Tebe.
            </h4>
          </div>

          <Button type="submit">VALIDAR CÓDIGO</Button>
        </div>

        <TebeModal
          showModal={phoneModel}
          toggleModal={togglePhoneModal}
          title={"Alterar o número do celular"}
          onConfirm={handleNewPhone}
          size={"sm"}
          modalLine={false}
          bodyContent={
            <Input
              type="tel"
              label={"Celular"}
              placeholder={"Número do WhatsApp"}
              countries={countries}
              countryLabels={countryLabels}
              selectedCountry={tempSelectedCountry}
              onChangeCountry={(value) => {
                handleTempCountry(value);
              }}
              {...register("verifyPhone", {
                required: true,
                value: numberToVerify,
                validate: {
                  validNumber: (value) =>
                    validatePhoneNumber(value) || "Número de telefone inválido",
                },
                onChange: (e) => {
                  handleChangeValue(
                    "verifyPhone",
                    e.target.value.replace(/[^0-9]/, "")
                  );
                },
              })}
              errorMessages={formatErrorList(errors["verifyPhone"])}
            />
          }
        />
      </form>
    </>
  );
};

export default VerifyNumber;
