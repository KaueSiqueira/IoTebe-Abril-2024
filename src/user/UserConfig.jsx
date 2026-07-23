import React, { Component } from "react";
import { Auth } from "aws-amplify";
import { Link } from '@mui/icons-material';

import { Button, LabeledCard, ComponentLoader, PopupModal } from "../components";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Container,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  OutlinedInput,
  TextField,
  Tooltip,
} from "@material-ui/core";
import { CustomInputTextField } from "../components";

import {
  configUserInfo,
  createApiKey,
  readApiKey,
  readUserInfo,
} from "../apis";
import { Visibility, VisibilityOff, FileCopy } from "@mui/icons-material";

import { WhichRenderContext } from "../contexts";
import { ProtectedFeature } from "../components/ProtectedFeature/ProtectedFeature";
import FeedbackToast from "../components/FeedbackToast/FeedbackToast";


const normalizePhone = (value) => {
  let output = "";
  value.replace(/^\D*(\d{0,2})\D*(\d{0,5})\D*(\d{0,4})/, (match, g1, g2, g3) => {
    if (g1.length) output += "+55 (" + g1;
    if (g1.length === 6) output += ") ";
    if (g2.length) output += ") " + g2;
    if (g2.length === 5) output += "-";
    if (g3.length) output += g3;
  });
  return output;
};

const removeInputMask = (value) => {
  return value.replace(/[^\d]+/g, "");
}

const checkPhoneNumber = (value, prev) => {
  if (value.length >= 9 && !isNaN(value)) {
    return normalizePhone(value);
  } else {
    return value;
  } 
};

// const normalizeZipCode = (value) => {
//   let output = "";
//   value.replace(/^\D*(\d{0,5})\D*(\d{0,3})/, (match, g1, g2) => {
//     if (g1.length) output += g1;
//     if (g1.length === 5) output += "-";
//     if (g2.length) output += g2;
//   });
//   return output;
// };

const checkZipCode = (value, prev) => {
  if (value.length <= 8 && !isNaN(value)) return value;
  else return prev;
};

export default class UserConfig extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      username: "",
      email: "",
      phone: "",
      company_name: "",
      company_city: "",
      company_zipcode: "",
      company_address: "",
      page: "",
      editUserMode: false,
      editCompanyMode: false,
      showModal: false,
      password: "",
      code: "",
      old_password: "",
      new_password: "",
      userNotFound: "",
      passwordError: "",
      error: "",
      isLoading: true,
      buttonLoading: false,
      drawerState: true,
      isAdding: false,
      emailToAdd: "",
      emails: [],
      showToken: false,
      openTooltip: false,
      tokenValue: "",
      apiKeyIsLoading: true,
    };
  }

  static contextType = WhichRenderContext;

  componentDidMount() {
    this.authenticate();
  }

  authenticate() {
    Auth.currentAuthenticatedUser()
      .then((user) => {
        this.setState({ username: user.username }, () => {
          this.getUserInfo();
          // this.loadEmail();
          this.loadApiKey();
        });
      })
      .catch(() => this.props.history.push("/login"));
  }

  loadApiKey = async () => {
    try {
      const res = await readApiKey();
      this.setState({ tokenValue: res.data.api_key });
    } catch (error) {
      //console.log(error);
    } finally {
      this.setState({ apiKeyIsLoading: false });
    }
    // readApiKey().then((res) => {
    //   this.setState({ tokenValue: res.data.api_key, apiKeyIsLoading: false });
    // }).fin;
  };

  async getUserInfo() {
    try {
      const { data } = await readUserInfo();
      this.setState({
        name: data.name,
        email: data.email,
        phone: data.phone,
        company_name: data.company_name,
        company_city: data.company_city,
        company_zipcode: data.company_zipcode,
        company_address: data.company_address,
        page: "/ Usuário",
        isLoading: false,
      });
    } catch (error) {
      // checkNetworkError(error);
    }
  }

  submitCompanyForm = async (event) => {
    event.preventDefault();
    this.setState({ buttonLoading: true });
    const { username, company_name, company_city, company_zipcode, company_address } = this.state;

    try {
      await configUserInfo({
        update: "company",
        company_name: company_name,
        company_city: company_city,
        company_zipcode: company_zipcode,
        company_address: company_address,
        username: username,
      });

      try {
        const user = await Auth.currentAuthenticatedUser();
        Auth.updateUserAttributes(user, { locale: company_name });
      } catch (error) {
        console.error(error);
      }

      FeedbackToast.success();
      if (this.state.editCompanyMode) this.setState({ editCompanyMode: false, buttonLoading: false });
    } catch (error) {
      console.error(error);
      this.setState({ buttonLoading: false });
      FeedbackToast.error();
    }
  };

  submitUserForm = async (event) => {
    event.preventDefault();
    this.setState({ buttonLoading: true });
    const { name, phone, username } = this.state;
    try {
      await configUserInfo({
        update: "user",
        name: name,
        phone: phone ? removeInputMask(phone) : null,
        username: username,
      });

      const { setUserPhone } = this.context;
      setUserPhone(phone ? removeInputMask(phone) : "");

      try {
        const user = await Auth.currentAuthenticatedUser();
        Auth.updateUserAttributes(user, { name: name });
      } catch (error) {
        console.error(error);
      }

      FeedbackToast.success();
      if (this.state.editUserMode) this.setState({ editUserMode: false, buttonLoading: false });
    } catch (error) {
      console.error(error);
      this.setState({ buttonLoading: false });
      FeedbackToast.error();
    }
  };

  editUserConfig = (event) => {
    event.preventDefault();
    this.setState({ editUserMode: !this.state.editUserMode });
  };

  editCompanyConfig = (event) => {
    event.preventDefault();
    this.setState({ editCompanyMode: !this.state.editCompanyMode });
  };

  handleCreateApiKey = () => {
    createApiKey().then((res) => this.setState({ tokenValue: res.data.api_key }));
  };

  handleCopyClipboard = () => {
    this.setState({ openTooltip: true });

    if (window.isSecureContext && navigator.clipboard) {
      navigator.clipboard.writeText(this.state.tokenValue);
    } else { 
      // Copy to clipboard for insecure connections as stage and dev enviroments
      const textArea = document.createElement("textarea"); 
      textArea.value = this.state.tokenValue; 
      document.body.appendChild(textArea); 
      textArea.focus();
      textArea.select(); 
      
      try {
        document.execCommand('copy');
      } catch(err) {
        console.error('Unable to copy to clipboard', err);
      }
      
      document.body.removeChild(textArea)
    }    

    setTimeout(() => this.setState({ openTooltip: false }), 1000);
  };

  handleChange = (event) => {
    event.preventDefault();
    this.setState({ [event.target.name]: event.target.value });
  };

  handleChangePhone = ({ target: { value } }) => {
    let inputTelefone = value

    if (value.length <= 19) {
      this.setState((prevState) => ({ phone: checkPhoneNumber(inputTelefone, prevState.phone) }));
    }
  };

  handleChangeZipCode = ({ target: { value } }) => {
    this.setState((prevState) => ({ company_zipcode: checkZipCode(value, prevState.company_zipcode) }));
  };

  toggleModal = (event) => {
    event.preventDefault();
    this.setState({ showModal: !this.state.showModal });
  };

  changePassword = () => {
    this.setState({ userNotFound: "", passwordError: "", error: "" });
    let { old_password, new_password } = this.state;

    Auth.currentAuthenticatedUser()
      .then((user) => {
        return Auth.changePassword(user, old_password, new_password);
      })
      .then((data) => { })
      .catch((error) => {
        if (error.message.includes("previousPassword")) {
          this.setState({ userNotFound: "Senha atual incorreta." });
          this.setState({ error: "error genérico" });
        }
        if (
          error.message.includes("proposedPassword") &&
          error.message.includes("must have length greater than or equal to 6")
        ) {
          this.setState({
            passwordError:
              "A nova senha precisa ter letras maiúsculas, minúsculas, números e caracteres especiais",
          });
          this.setState({ error: "error genérico" });
        }
      });
  };

  render() {
    return (
      <div className="relative row edit-profile">
        {(this.state.isLoading || this.state.apiKeyIsLoading) && <ComponentLoader />}

        <ProtectedFeature requiredPermissions={["API_ACCESS"]} verifyEntireTree>
          <div className="edit-profile-split">
            <LabeledCard title="Chave de API" style={{padding: 0 }} className="edit-profile-full-height">
              <Container style={{ width: "80%", marginTop: 15 }}>
                {/* <InputLabel htmlFor="outlined-adornment-password">Chave de API</InputLabel> */}
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <Tooltip open={this.state.openTooltip} title="Copiado!" arrow>
                    <IconButton
                      onClick={this.handleCopyClipboard}
                    >
                      <FileCopy style={{ color: "rgb(21, 98, 132)" }} />
                    </IconButton>
                  </Tooltip>
                  <OutlinedInput
                    id="outlined-adornment-password"
                    type={this.state.showToken ? "text" : "password"}
                    margin={"dense"}
                    style={{ width: "90%" }}
                    value={this.state.tokenValue}
                    readOnly
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => {
                            this.setState({ showToken: !this.state.showToken });
                          }}
                          edge="end"
                        >
                          {this.state.showToken ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </div>
                {this.state.tokenValue === null && (
                  <div
                    style={{
                      height: 30,
                      marginTop: 15,
                      marginBottom: 15,
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Button className="rounded-button" onClick={this.handleCreateApiKey}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <span>Gerar token</span>
                      </div>
                    </Button>
                  </div>
                )}
                <a className="link-api" href="https://tebe.stoplight.io/docs/iotebe-api/0cc18a8fedfd0-serverless-api" target="_blank" style={{ color: "rgb(21, 98, 132)", backgroundColor: "white", }}>
                  <button className="button-api">
                      <Link style={{color: "#156284"}} />
                      Documentação da API
                  </button>
                </a>
              </Container>
            </LabeledCard>
          </div>
        </ProtectedFeature>
        <div className="edit-profile-split">
          <LabeledCard title="Configurações do Usuário" style={{padding: 0}} childrenClassName="edit-profile-card">
            <Container style={{ width: "80%" }}>
              <CustomInputTextField
                inputPropsInput={{
                  readOnly: !this.state.editUserMode,
                }}
                inputLabelPropsInput={{
                  shrink: true,
                }}
                style={{}}
                margin="dense"
                variant="outlined"
                labelInput="Nome"
                name="name"
                id="name"
                fullWidth
                placeholderInput="Ex: Mauricio da Costa"
                valueInput={this.state.name}
                handleChange={this.handleChange}
              />
              <CustomInputTextField
                inputLabelPropsInput={{
                  shrink: true,
                }}
                disabledTrue={true}
                margin="dense"
                variant="outlined"
                labelInput="Usuário"
                disabled={true}
                id="username"
                fullWidth
                placeholderInput="Ex: mauricio.costa"
                valueInput={this.state.username}
              />
              <CustomInputTextField
                inputLabelPropsInput={{
                  shrink: true,
                }}
                disabledTrue={true}
                margin="dense"
                variant="outlined"
                labelInput="Email"
                disabled={true}
                id="email"
                fullWidth
                placeholderInput="Ex: mauricio.costa@abcd.com.br"
                valueInput={this.state.email}
              />
              <CustomInputTextField
                inputPropsInput={{
                  readOnly: !this.state.editUserMode,
                }}
                inputLabelPropsInput={{
                  shrink: true,
                }}
                margin="dense"
                variant="outlined"
                labelInput="Celular"
                id="phone"
                name="phone"
                fullWidth
                placeholderInput="Ex: 1998765-4321"
                maxLength={19}
                valueInput={this.state.phone}
                handleChange={this.handleChangePhone}
              />

              <div
                style={{
                  height: 30,
                  marginBlockStart: 10,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                {/* <Button onClick={this.toggleModal}>Alterar Senha</Button> */}
                {this.state.editUserMode ? (
                  <Button onClick={this.submitUserForm} buttonType="rounded-button">
                    {this.state.buttonLoading ? (
                      <i style={{ marginRight: "5px" }} className="fa fa-refresh fa-spin"></i>
                    ) : null}
                    <span>Salvar</span>
                  </Button>
                ) : (
                  <Button onClick={this.editUserConfig} buttonType="rounded-button">Editar</Button>
                )}
              </div>
            </Container>
          </LabeledCard>

          <LabeledCard title="Configurações da Empresa" style={{padding: 0}} childrenClassName="edit-profile-card">
            <Container style={{ width: "80%" }}>
              <CustomInputTextField
                inputPropsInput={{
                  readOnly: !this.state.editCompanyMode,
                }}
                inputLabelPropsInput={{
                  shrink: true,
                }}
                margin="dense"
                variant="outlined"
                labelInput="Nome"
                id="company_name"
                name="company_name"
                fullWidth
                placeholderInput="Ex: Usina Santo Antonio"
                valueInput={this.state.company_name}
                handleChange={this.handleChange}
              />

              <CustomInputTextField
                inputPropsInput={{
                  readOnly: !this.state.editCompanyMode,
                }}
                inputLabelPropsInput={{
                  shrink: true,
                }}
                margin="dense"
                variant="outlined"
                labelInput="Cidade"
                type="text"
                id="company_city"
                name={"company_city"}
                fullWidth
                placeholderInput="Ex: Santo André"
                valueInput={this.state.company_city}
                handleChange={this.handleChange}
              />

              <CustomInputTextField
                inputPropsInput={{
                  readOnly: !this.state.editCompanyMode,
                }}
                inputLabelPropsInput={{
                  shrink: true,
                }}
                margin="dense"
                variant="outlined"
                labelInput="CEP"
                id="company_zipcode"
                fullWidth
                placeholderInput="Ex: 02140001"
                valueInput={this.state.company_zipcode}
                handleChange={this.handleChangeZipCode}
              />

              <CustomInputTextField
                inputPropsInput={{
                  readOnly: !this.state.editCompanyMode,
                }}
                inputLabelPropsInput={{
                  shrink: true,
                }}
                margin="dense"
                variant="outlined"
                type="text"
                labelInput="Endereço"
                id="company_address"
                fullWidth
                name={"company_address"}
                placeholderInput="Ex: Rua Porto Alegre, 62, Jardim Candida"
                valueInput={this.state.company_address}
                handleChange={this.handleChange}
              />

              <div
                style={{
                  height: 30,
                  marginTop: 10,
                  display: "flex",
                  justifyContent: "flex-start",
                }}
              >
                {this.state.editCompanyMode ? (
                  <Button onClick={this.submitCompanyForm} buttonType="rounded-button">
                    {this.state.buttonLoading ? (
                      <i style={{ marginRight: "5px" }} className="fa fa-refresh fa-spin"></i>
                    ) : null}
                    <span>Salvar</span>
                  </Button>
                ) : (
                  <Button onClick={this.editCompanyConfig} buttonType="rounded-button">Editar</Button>
                )}
              </div>
            </Container>
          </LabeledCard>
        </div>

        <Modal
          isOpen={this.state.showModal}
          toggle={this.toggleModal}
          className={this.props.className}
          centered
        >
          <ModalHeader toggle={this.toggleModal.bind(this)}>Alteração da Senha de Acesso</ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <Label for="username">Usuário</Label>
                <Input
                  disabled={true}
                  maxLength={30}
                  type="text"
                  name="username"
                  id="username"
                  value={this.state.username}
                  onChange={this.handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="code">Senha Atual</Label>
                <Input
                  type="password"
                  name="old_password"
                  id="old_password"
                  value={this.state.old_password}
                  onChange={this.handleChange}
                ></Input>
              </FormGroup>
              <FormGroup>
                <Label for="description">Nova Senha</Label>
                <Input
                  type="password"
                  name="new_password"
                  id="new_password"
                  value={this.state.new_password}
                  onChange={this.handleChange}
                />
              </FormGroup>
              <div id="error" role="alert" className={this.state.error !== "" ? "alert alert-danger" : ""}>
                <p>
                  {this.state.userNotFound.length > 0
                    ? this.state.userNotFound
                    : "" || this.state.passwordError.length > 0
                      ? this.state.passwordError
                      : ""}
                </p>
              </div>
            </Form>
          </ModalBody>
          <ModalFooter style={{ height: 60, display: "flex", justifyContent: "flex-end" }}>
            <Button cancel={true} onClick={this.toggleModal}>
              Cancelar
            </Button>
            <Button onClick={this.changePassword}>Salvar</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
