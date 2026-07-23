import React, { useRef, useState, useEffect, useContext, Component } from "react";

import { ClickAwayListener, Grow, IconButton, Paper, Popper, Tooltip } from "@material-ui/core";
import { NotificationsActive, NotificationsOff, ArrowForwardIos, WhatsApp } from '@mui/icons-material';
import { MyCustomSwitch } from "../dashboards/sensor/settings_cards/Customizations";
import { WhichRenderContext } from "../contexts";
import { updateNotification, readNotification } from "../apis";
import IoTebeModal from "./IoTebeModal";
import FeedbackToast from "./FeedbackToast/FeedbackToast";

export function NotificationButton(props) {
  const { selectedNodeFullPath } = useContext(WhichRenderContext);
  const { selectedNode, setSelectedNode } = useContext(WhichRenderContext);
  const [open, setOpen] = useState(false);
  const [emailNotificationConfig, setEmailNotificationsConfig] = useState(null);
  const [whatsappNotificationConfig, setWhatsappNotificationsConfig] = useState(null);
  const [createModal, setCreateModal] = useState(false);
  const [emailManageNotifications, setEmailManageNotifications] = useState(false);
  const [whatsAppManageNotifications, setWhatsAppManageNotifications] = useState(false);
  const [userPhone, setUserPhone] = useState(false);
  const anchorRef = useRef(null);

  const loadTypeNotification = async (groupId) => {
    try {
      const response = await readNotification(groupId);
      setEmailNotificationsConfig(response.data.email);
      setWhatsappNotificationsConfig(response.data.whatsApp);
      setUserPhone(response.data.user_phone);
    } catch { }
  };
 
  const handleChangeNotificationSettings = async (type, sendNotification) => {    
  
    let notificationPreference = "";

    switch (sendNotification) {
      case false:
      case null:
      case undefined:
        notificationPreference = null;
        break;
      case true:
        notificationPreference = 3;
        break;
      default:
        notificationPreference = sendNotification;
    }

    if (type === 'email') {
      try {
        setEmailNotificationsConfig(notificationPreference)
        const response = await updateNotification(selectedNode.id, notificationPreference, whatsappNotificationConfig);
        FeedbackToast.success();
      } catch {
        FeedbackToast.error();
      }
    } else if (type === 'whatsapp') {
      try {
        setWhatsappNotificationsConfig(notificationPreference)
        const response = await updateNotification(selectedNode.id, emailNotificationConfig, notificationPreference);
        FeedbackToast.success();
      } catch {
        FeedbackToast.error();
      }
    }
  };  

  useEffect(() => {
    loadTypeNotification(selectedNode.id);
  }, [selectedNode]);

  return (
    <>
      <Tooltip title={"Notificações"} placement="left" arrow>
        <IconButton
          onClick={() => {
            setOpen((prev) => !prev);
          }}
          size="small"
          ref={anchorRef}
          style={{ paddingBottom: 1, paddingTop: 1, marginRight: 5 }}
        >
          {(emailNotificationConfig || whatsappNotificationConfig) ? (
            <NotificationsActive style={{ color: "#1fc4ad" }} fontSize="small" />
          ) : (
            <NotificationsOff fontSize="small" />
          )}
        </IconButton>
      </Tooltip>

      <Popper open={open} anchorEl={anchorRef.current} style={{ zIndex: 5 }} transition>
        {({ TransitionProps }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: "center bottom",
            }}
          >
            <Paper>
              <ClickAwayListener
                onClickAway={() => {
                  setOpen(false);
                  setCreateModal(false);
                  setEmailManageNotifications(false);
                  setWhatsAppManageNotifications(false);
                }}
              >
                { 
                  emailManageNotifications ?
                      <div style={{ height: "auto", width: 280 }}>
                        <div style={{ fontSize: "0.9rem", display: "flex", padding: "3%" }}>
                          <ArrowForwardIos className="arrow-rotate" onClick={() => setEmailManageNotifications(false)} style={{ fontSize: "0.9rem", marginRight: "3%", cursor: "pointer" }} />
                          <div style={{display: "flex", flexDirection: "column"}}>
                          <div>
                            <h4 style={{ fontSize: "0.9rem" }}>Gerenciar notificações de email</h4>
                            <h5 style={{ fontSize: "0.6rem" }}>Gerenciar notificações de {selectedNodeFullPath}</h5>
                          </div>
                              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                {/* <div>
                                  <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "3%" }}>
                                    <input id="all-status-change-alarms" type="radio" name="notification-type" className="radio-hover" onChange={() => {handleChangeNotificationSettings("email", 1)}} checked={emailNotificationConfig == 1} />
                                    <label htmlFor="all-status-change-alarms" style={{ fontSize: "0.85rem", marginBottom: 0 }}>Todas as mudanças de status</label>
                                  </div>
                                  <h5 style={{ fontSize: "0.7rem", marginTop: "1%", marginLeft: "8%" }}>Receba notificações toda vez que houver mudança de status do alarme, independente se indicar melhora ou piora da condição.</h5>
                                </div> */}

                                <div>
                                  <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "3%" }}>
                                    <input id="all-alarms" type="radio" name="notification-type" className="radio-hover" onChange={() => {handleChangeNotificationSettings("email", 3)}} checked={emailNotificationConfig == 3} />
                                    <label htmlFor="all-alarms" style={{ fontSize: "0.85rem", marginBottom: 0 }}>Todos os alarmes</label>
                                  </div>
                                  <h5 style={{ fontSize: "0.7rem", marginTop: "1%", marginLeft: "8%" }}>Receba notificações quando o alarme for acionado, seja ele de alerta (amarelo) ou crítico (vermelho).</h5>
                                </div>

                                <div>
                                  <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "3%" }}>
                                    <input id="only-critic-alarms" type="radio" name="notification-type" className="radio-hover" onChange={() => {handleChangeNotificationSettings("email", 2)}} checked={emailNotificationConfig == 2} />
                                    <label htmlFor="only-critic-alarms" style={{ fontSize: "0.85rem", marginBottom: 0 }}>Somente alarmes críticos</label>
                                  </div>
                                  <h5 style={{ fontSize: "0.7rem", marginTop: "1%", marginLeft: "8%" }}>Receba notificações somente quando o alarme crítico (vermelho) for acionado.</h5>
                                </div>
                              </div>
                          </div>
                        </div>
                    </div> :
                  whatsAppManageNotifications && userPhone ?
                    <div style={{ height: "auto", width: 280 }}>
                      <div style={{ fontSize: "0.9rem", display: "flex", padding: "3%" }}>
                        <ArrowForwardIos className="arrow-rotate" onClick={() => setWhatsAppManageNotifications(false)} style={{ fontSize: "0.9rem", marginRight: "3%", cursor: "pointer" }} />
                        <div style={{display: "flex", flexDirection: "column"}}>
                        <div>
                          <h4 style={{ fontSize: "0.9rem" }}>Gerenciar notificações de WhatsApp</h4>
                          <h5 style={{ fontSize: "0.6rem" }}>Gerenciar notificações de {selectedNodeFullPath}</h5>
                        </div>
                            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                              {/* <div>
                                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "3%" }}>
                                  <input id="all-status-change-alarms" type="radio" name="notification-type" className="radio-hover" onChange={() => {handleChangeNotificationSettings("whatsapp", 1)}} checked={whatsappNotificationConfig == 1} />
                                  <label htmlFor="all-status-change-alarms" style={{ fontSize: "0.85rem", marginBottom: 0 }}>Todas as mudanças de status</label>
                                </div>
                                <h5 style={{ fontSize: "0.7rem", marginTop: "1%", marginLeft: "8%" }}>Receba notificações toda vez que houver mudança de status do alarme, independente se indicar melhora ou piora da condição.</h5>
                              </div> */}

                              <div>
                                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "3%" }}>
                                  <input id="all-alarms" type="radio" name="notification-type" className="radio-hover" onChange={() => {handleChangeNotificationSettings("whatsapp", 3)}} checked={whatsappNotificationConfig == 3} />
                                  <label htmlFor="all-alarms" style={{ fontSize: "0.85rem", marginBottom: 0 }}>Todos os alarmes</label>
                                </div>
                                <h5 style={{ fontSize: "0.7rem", marginTop: "1%", marginLeft: "8%" }}>Receba notificações quando o alarme for acionado, seja ele de alerta (amarelo) ou crítico (vermelho).</h5>
                              </div>

                              <div>
                                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "3%" }}>
                                  <input id="only-critic-alarms" type="radio" name="notification-type" className="radio-hover" onChange={() => {handleChangeNotificationSettings("whatsapp", 2)}} checked={whatsappNotificationConfig == 2} />
                                  <label htmlFor="only-critic-alarms" style={{ fontSize: "0.85rem", marginBottom: 0 }}>Somente alarmes críticos</label>
                                </div>
                                <h5 style={{ fontSize: "0.7rem", marginTop: "1%", marginLeft: "8%" }}>Receba notificações somente quando o alarme crítico (vermelho) for acionado.</h5>
                              </div>
                            </div>
                        </div>
                      </div>
                    </div> :
                    // Tamanho do modalzinho para selecionar o tipo de notificação 
                    <div style={{ height: 105, width: 150 }}>
                    <div style={{ height: 50, width: 150, justifyContent: "space-between" }} className={"row-evenly"}>
                      <div style={{ margin: "4%" }} className={"row-evenly"}>
                        <div style={{ margin: "8%" }}>
                          <MyCustomSwitch
                            name="switchEmailNotification"
                            onChange={() => {
                              setEmailNotificationsConfig((prevState) => {
                                if (prevState == undefined || prevState == null) {
                                  handleChangeNotificationSettings('email', true);
                                  return true;
                                } else {
                                  handleChangeNotificationSettings('email', false);
                                  return null;
                                }
                              })
                            }}
                            checked={emailNotificationConfig != undefined && emailNotificationConfig != null}
                          />
                        </div>
                        <span style={{ fontSize: "0.9rem" }}>Email</span>
                      </div>
                      <ArrowForwardIos onClick={() => setEmailManageNotifications(true)} style={{ fontSize: "0.9rem", margin: "4%", cursor: "pointer", display: emailNotificationConfig == null || emailNotificationConfig == undefined ? 'none' : '' }} />
                    </div>
                    <hr />
                    <div style={{ height: 50, width: 150, justifyContent: "space-between" }} className={"row-evenly"}>
                      <div style={{ margin: "4%" }} className={"row-evenly"}>
                        <div style={{ margin: "8%" }}>
                        {createModal && <IoTebeModal
                          showModal={createModal}
                          changeMarginBottom={"35px"}
                          title="Cadastrar Número"
                          onDismissTitle="Fechar"
                          dismissFunc={() => {
                            setCreateModal(false);
                          }}

                          onConfirm={() => {
                            setSelectedNode({type: "account"})
                          }}
                          onConfirmTitle="Cadastrar agora"
                          children={
                            <div className="text-whatsapp-number">
                              <WhatsApp style={{ color: "#156284", fontSize: "40px" }}></WhatsApp>
                              <p>Para receber <span style={{ fontWeight: "bold" }}>alertas via WhatsApp</span>, primeiro você precisa cadastrar um número em seu perfil.</p>
                            </div>
                          }
                        />}
                          <MyCustomSwitch
                            name="switchWhatsappNotification"
                            onChange={() => {
                              setWhatsappNotificationsConfig((prevState) => {
                                if (prevState == undefined || prevState == null) {
                                  if (userPhone) {
                                    handleChangeNotificationSettings('whatsapp', true);
                                    return true;
                                  } else {
                                    setWhatsappNotificationsConfig(null);
                                    setCreateModal(true);
                                  }
                                } else {
                                  handleChangeNotificationSettings('whatsapp', null);
                                  return null;
                                }
                              })
                            }}
                            checked={whatsappNotificationConfig != undefined && whatsappNotificationConfig != null}
                          />
                        </div>
                        <span style={{ fontSize: "0.9rem" }}>WhatsApp</span>
                      </div>
                      <ArrowForwardIos onClick={() => setWhatsAppManageNotifications(true)} style={{ fontSize: "0.9rem", margin: "4%", cursor: "pointer", display: whatsappNotificationConfig == null || whatsappNotificationConfig == undefined ? 'none' : ''}} />
                    </div>
                  </div>       
                }  
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
}
