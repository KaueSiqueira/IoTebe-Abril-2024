import React from "react";
import Input from "../../../shared/components/Input";
import useCodeInput from "./hooks/useCodeInput";
import styles from "./styles/CodeInput.module.css";

const CodeInput = React.forwardRef(
  (
    {
      numberToVerify,
      selectedCountry,
      changeNumberAction,
      setIsCodeValid,
      setLoadingValidation,
    },
    ref
  ) => {
    const {
      register,
      errors,
      handleCodeInput,
      handleKeyDown,
      handlePaste,
      handleSubmit,
      confirmWhatsappCode,
      formattedNumber,
      sendWhatsappCode,
      formatTime,
      isRunning,
    } = useCodeInput(
      numberToVerify,
      selectedCountry,
      setIsCodeValid,
      setLoadingValidation
    );

    return (
      <>
        <form
          onSubmit={handleSubmit(confirmWhatsappCode)}
          className={styles.verifyContainer}
          ref={ref}
        >
          <div>
            <h1 className={styles.verifyTitle}>
              Insira o Código de verificação enviado no seu WhatsApp
            </h1>
            <div className={styles.verifySubTitle}>
              <h5>
                Para prosseguir com a alteração do seu número, insira o código
                de 6 dígitos que enviamos para o número{" "}
                <span className={styles.phoneNumber}>{formattedNumber}</span>.{" "}
                <span
                  onClick={changeNumberAction}
                  className={styles.linkAction}
                >
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
                Não recebeu o código?{" "}
                {isRunning ? (
                  <>Aguarde {formatTime()}</>
                ) : (
                  <span
                    onClick={sendWhatsappCode}
                    className={styles.linkAction}
                  >
                    Reenviar código
                  </span>
                )}
              </h5>
            </div>
          </div>
        </form>
      </>
    );
  }
);

export default CodeInput;
