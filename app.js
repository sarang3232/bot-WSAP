import "dotenv/config";
import bot from "@bot-whatsapp/bot";
import { getDay } from "date-fns";
import QRPortalWeb from "@bot-whatsapp/portal";
import BaileysProvider from "@bot-whatsapp/provider/baileys";
import MockAdapter from "@bot-whatsapp/database/mock";
import { readFileSync } from "fs";
import { join } from "path";
import pkg from '@bot-whatsapp/bot';
const { addKeyword } = pkg;





import chatgpt from "./services/openai/chatgpt.js";
import GoogleSheetService from "./services/sheets/index.js";

const googelSheet = new GoogleSheetService(
  "1y7tfnQSwL4IK4612hBahnRiMwP-MeuGMBNIPneHhf0A"
);

const GLOBAL_STATE = [];
import ChatGPTClass from "./chatgpt.class.js";
const chatGPT = new ChatGPTClass();
import flowPrincipalC from "./flowPrincipal.js";


function validarHora(hora) {
  // Expresión regular para validar el formato HH:mm:ss o HH:mm
  var regex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9](?::[0-5][0-9])?$/;

  if (regex.test(hora)) {
    return true; // El formato es válido
  } else {
    return false; // El formato es inválido
  }
}


const delay = (ms) => new Promise((res =>  setTimeout(res, ms)))

/**
 * Recuperamos el prompt "TECNICO"
 */
const getPrompt = async () => {
  const pathPromp = join(process.cwd(), "promps");
  const text = readFileSync(join(pathPromp, "01_TECNICO.txt"), "utf-8");
  return text;
};

const getPrompt1 = async () => {
  const pathPromp = join(process.cwd(), "promps");
  const text = readFileSync(join(pathPromp, "02_TECNICO.txt"), "utf-8");
  return text;
};

const getPrompt2 = async () => {
  const pathPromp = join(process.cwd(), "promps");
  const text = readFileSync(join(pathPromp, "03_TECNICO.txt"), "utf-8");
  return text;
};


  /**
  * Exportamos
  * @param {*} chatgptClass
  * @returns
  */

 
const flowReparacion = (chatgptClass) => {
  return addKeyword(["IALINEA1","ialinea1","IALINEA1 ", "ialinea1 "])
  .addAnswer([
    `Escribe el numero asignado correspondiente a la consulta de ayuda`,
    `*1* Contiflow`,
    `*2* Etiquetadora`,
    `*3* Sopladora`,

  ])
  .addAnswer(
    "Ingresa el valor adecuado 👀💥",
    { capture: true },
    async (ctx, { endFlow, flowDynamic, provider,fallBack }) => {
      if(ctx.body == '1'){
        await flowDynamic("En unos momentos se te sera atendido, recuerda que para terminar la conversacion debes escribir la palabra *fin*");
        const jid = ctx.key.remoteJid
        const refProvider = await provider.getInstance()
        await refProvider.presenceSubscribe(jid)
        await delay(500)
        await refProvider.sendPresenceUpdate('composing', jid)
        const data = await getPrompt();
        const textFromAI=await chatgptClass.handleMsgChatGPT(data);//Dicinedole actua!!
        await flowDynamic(textFromAI.text);
      }else{
        if(ctx.body == '2'){
          await flowDynamic("En unos momentos se te sera atendido, recuerda que para terminar la conversacion debes escribir la palabra fin");
          const jid = ctx.key.remoteJid
          const refProvider = await provider.getInstance()
          await refProvider.presenceSubscribe(jid)
          await delay(500)
          await refProvider.sendPresenceUpdate('composing', jid)
          const data = await getPrompt2();
          const textFromAI=await chatgptClass.handleMsgChatGPT(data);//Dicinedole actua!!
          await flowDynamic(textFromAI.text);
        }else{
          if(ctx.body == '3'){
            await flowDynamic("En unos momentos se te sera atendido, recuerda que para terminar la conversacion debes escribir la palabra fin");
            const jid = ctx.key.remoteJid
            const refProvider = await provider.getInstance()
            await refProvider.presenceSubscribe(jid)
            await delay(500)
            await refProvider.sendPresenceUpdate('composing', jid)
            const data = await getPrompt1();
            const textFromAI=await chatgptClass.handleMsgChatGPT(data);//Dicinedole actua!!
            await flowDynamic(textFromAI.text);
          }
        }
      }
      })
  .addAnswer(
    "👀💥",
    { capture: true },
    async (ctx, { provider,fallBack,endFlow }) => {
      // ctx.body = es lo que la peronsa escribe!!
      
      if(!ctx.body.toLowerCase().includes('fin')){
          const jid = ctx.key.remoteJid
          const refProvider = await provider.getInstance()
          await refProvider.presenceSubscribe(jid)
          await delay(500)
          await refProvider.sendPresenceUpdate('composing', jid)
          const textFromAI = await chatgptClass.handleMsgChatGPT(ctx.body);
          await fallBack(textFromAI.text);
      }else{
        return endFlow();
      }
    }
  );
};


const flowPrincipalIA = bot
  .addKeyword(["Solucionario", "solucionario","Solucionario  ", "solucionario  "])
  .addAnswer([
    `Bienvenido al solucionario de Postobon🚀`,
    `Escribe el numero asignado por la ubicacion tecnica correspondiente a la cual vas a consultar la ayuda`,
    `*1* LINEA 1`,
  ])
  .addAnswer(
    "Ingresa el valor adecuado 👀💥",
    { capture: true },
    async (ctx, { gotoFlow,fallBack,state,endFlow }) => {
      if(ctx.body == '1'){
      return gotoFlow(flowLinea1Ia);
    }else{
      if(ctx.body == 'Salir'){
      return endFlow();
    }else{
      return fallBack();
    }
    }
    }
    );

    const flowLinea1Ia = bot
    .addKeyword(bot.EVENTS.ACTION)
    .addAnswer([
      `Escribe la palabra clave para ingresar a la IA de la linea 1`,
      `*IALINEA1*`,
    ])
    .addAnswer(
      "Ingresa el valor adecuado 👀💥",
      { capture: true },
      async (ctx, { gotoFlow,fallBack,state,endFlow }) => {
        if(ctx.body == '1'){
        return gotoFlow(flowReparacion(chatGPT));
      }else{
        if(ctx.body == 'Salir'){
        return endFlow();
      }else{
        return fallBack();
      }
      }
      }
      );

const flowPrincipal = bot
  .addKeyword(bot.EVENTS.ACTION)
  .addAnswer([
    `Bienvenido al registro de Postobon avisos M2 desde Whatsapp!🚀`,
    `Escribe el numero asignado por la ubicacion tecnica correspondiente a la cual vas a realizar el aviso`,
    `*1* LINEA 1`,
    `*2* LINEA 8`,
    `*3* LINEA 10`,
    `*4* LINEA PRODUCCION BOTELLONES`,
    `*5* LINEA LLENADO DE BOLSAS`,
    `*6* LINEA 3`,

  ])
  .addAnswer(
    "Ingresa el valor adecuado 👀💥",
    { capture: true },
    async (ctx, { gotoFlow,fallBack,state,endFlow }) => {
      if(ctx.body == '3'){
        ctx.body="LINEA 10"
        state.update({ubicacion: ctx.body });
      return gotoFlow(flowLinea10);
    }else{
      if(ctx.body == '2'){
        ctx.body="LINEA 8"
        state.update({ubicacion: ctx.body });
      return gotoFlow(flowLinea8);
    }else{
      if(ctx.body == '1'){
        ctx.body="LINEA 1"
        state.update({ubicacion: ctx.body });
      return gotoFlow(flowLinea1);
    }else{
      if(ctx.body == '4'){
        ctx.body="LINEA PRODUCCION BOTELLONES"
        state.update({ubicacion: ctx.body });
      return gotoFlow(flowBotellones);
    }else{
      if(ctx.body == '5'){
        ctx.body="LINEA LLENADO DE BOLSAS"
        state.update({ubicacion: ctx.body });
      return gotoFlow(flowBolsas);
    }else{
      if(ctx.body == '6'){
        ctx.body="LINEA 3"
        state.update({ubicacion: ctx.body });
      return gotoFlow(flowLinea3);
    }else{
      if(ctx.body == 'Salir'){
      return endFlow();
    }else{
      return fallBack();
    }
    }
    }
    }
    }
    }
      }
    }
    );

    const flowLinea1 = bot
    .addKeyword(bot.EVENTS.ACTION)
    .addAnswer(
        [
        `Escoge el numero correspondiente a la denominación del equipo a la cual realizas el aviso!👓`,
        `*1* LLENADORA`,
        `*2* INSPECTOR DE BOTELLA LLENA`,
        `*3* ENJUAGADORA-RINSE`,
        `*4* EMBANDEJADORA VARIOPAC`,
        `*5* ETIQUETADORA`,
        `*6* TRANSPORTADOR AEREO`,
        `*7* TRANSPORTADOR ENVASE`,
        `*8* TRANSPORTADOR DE EMBALAJES`,
        `*9* PROCESADOR DE BEBIDA`,
        `*10* ALMACEN DE PALETS`,
        `*11* PALETIZADORA`,
        `*12* ENVOLVEDORA-ROBOPAC`,
        `*13* TOLVA TAPAS`,
        `*14* ELEVADOR TAPA`,
        `*15* DOSIFICADOR DE NITROGENO`,
        `*16* HORNO EMBANDEJADORA VARIOPAC`,
        `*17* APLICADOR DE ADHESIVO HOTMELT SERIE C`,
        `*18* CODIFICADOR LASER`,

  
  
  
      ])
    .addAnswer(
      [
       `*Escoge el numero correcto* `,
       `🐵` ,
      ],
      { capture: true },
      async (ctx, { state,fallBack,gotoFlow }) => {
        if(ctx.body == '1'){
          ctx.body="LLENADORA"
          state.update({ Equipo: ctx.body,CodEquipo: "518635" });
        return gotoFlow(flowL1LLENADORA);
      }else{
        if(ctx.body=='2'){
          ctx.body="INSPECTOR DE BOTELLA LLENA"
          state.update({ Equipo: ctx.body , CodEquipo:"599557"});
          return gotoFlow(flowL1INSPECTOR);
        }else{
          if(ctx.body== '3'){
            ctx.body="ENJUAGADORA-RINSE"
            state.update({ Equipo: ctx.body, CodEquipo:"710315" });
            return gotoFlow(flowL1ENJUAGADORA);
          }else{
            if(ctx.body=='4'){
              ctx.body="EMBANDEJADORA VARIOPAC"
              state.update({ Equipo: ctx.body, CodEquipo:"710316" });
              return gotoFlow(flowL1EMBANDEJADORA);
            }else{
              if(ctx.body=='5'){
                ctx.body="ETIQUETADORA"
                state.update({ Equipo: ctx.body, CodEquipo:"820071" });
                return gotoFlow(flowL1ETIQUETADORA);
              }else{
                if(ctx.body=='6'){
                  ctx.body="TRANSPORTADOR AEREO"
                  state.update({ Equipo: ctx.body, CodEquipo:"829612" });
                  return gotoFlow(flowL1AEREO);
                }else{
                  if(ctx.body=='7'){
                    ctx.body="TRANSPORTADOR ENVASE"
                    state.update({ Equipo: ctx.body, CodEquipo:"829613" });
                    return gotoFlow(flowL1TRANSPORTADOR);
                  }else{
                    if(ctx.body=='8'){
                      ctx.body="TRANSPORTADOR DE EMBALAJES"
                      state.update({ Equipo: ctx.body, CodEquipo:"829614" });
                      return gotoFlow(flowL1EMBALAJES);
                    }else{
                      if(ctx.body=='9'){
                        ctx.body="PROCESADOR DE BEBIDA"
                        state.update({ Equipo: ctx.body, CodEquipo:"900230" });
                        return gotoFlow(flowL1PROCESADOR);
                      }else{
                        if(ctx.body=='10'){
                          ctx.body="ALMACEN DE PALETS"
                          state.update({ Equipo: ctx.body,CodEquipo:"900231" });
                          return gotoFlow(flowL1ALMACEN);
                        }else{
                          if(ctx.body=='11'){
                            ctx.body="PALETIZADORA"
                            state.update({ Equipo: ctx.body,CodEquipo:"900232" });
                            return gotoFlow(flowPaletizadora);
                          }else{
                            if(ctx.body=='12'){
                              ctx.body="ENVOLVEDORA-ROBOPAC"
                              state.update({ Equipo: ctx.body, CodEquipo:"900233" });
                              return gotoFlow(flowL1ENVOLVEDORA);
                            }else{
                              if(ctx.body=='13'){
                                ctx.body="TOLVA TAPAS"
                                state.update({ Equipo: ctx.body, CodEquipo:"51863501" });
                                return gotoFlow(flowL1TOLVA);
                              }else{
                                if(ctx.body=='14'){
                                ctx.body="ELEVADOR TAPA"
                                state.update({ Equipo: ctx.body, CodEquipo:"51863502" });
                                return gotoFlow(flowL1ELEVADOR);
                              }else{
                                if(ctx.body=='15'){
                                  ctx.body="DOSIFICADOR DE NITROGENO"
                                  state.update({ Equipo: ctx.body, CodEquipo:"51863504" });
                                  return gotoFlow(flowL1DOSIFICADOR);
                                }else{
                                  if(ctx.body=='16'){
                                    ctx.body="HORNO EMBANDEJADORA VARIOPAC"
                                    state.update({ Equipo: ctx.body, CodEquipo:"71031601" });
                                    return gotoFlow(flowL1HORNOVARIOPAC);
                                  }else{
                                    if(ctx.body=='17'){
                                      ctx.body="APLICADOR DE ADHESIVO HOTMELT SERIE C"
                                      state.update({ Equipo: ctx.body, CodEquipo:"71031602" });
                                      return gotoFlow(flowL1ADHESIVO);
                                    }else{
                                      if(ctx.body=='18'){
                                        ctx.body="CODIFICADOR LASER"
                                        state.update({ Equipo: ctx.body, CodEquipo:"82964102" });
                                        return gotoFlow(flowL1CODIFICADOR);
                                      }else{
                                  if(ctx.body=='M2'){
                                    return gotoFlow(flowcedula);
                                  }else{
                                    if(ctx.body=='m2'){
                                      return gotoFlow(flowcedula);
                                    }else{
                                      return fallBack();
                                    }
                                  }
                                }
                              }
                                
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
        }
      }}}}
      );


      const flowL1LLENADORA = bot
    .addKeyword(bot.EVENTS.ACTION)
    .addAnswer(
      [
        `Escoge el numero correspondiente al conjunto de la llenadora!👓`,
        `*1* Carrusel`,
        `*2* Taponadora`,
        `*3* Transportador de salida`,
        `*4* Tablero electrico`,
        `*5* Materia prima`,
        `*6* Falla Humana`,

      ])
    .addAnswer(
    [
     `*Escoge el numero correcto* `,
     `🐵` ,
    ],
      { capture: true },
      async (ctx, { state,gotoFlow,fallBack }) => {
        if(ctx.body=='1'){
          ctx.body="Carrusel"
          state.update({ Conjunto: ctx.body });
        return gotoFlow(flowL1CONJCARRUSEL);
    }else{
        if(ctx.body=='2'){
          ctx.body="Taponadora"
          state.update({ Conjunto: ctx.body });
          return gotoFlow(flowL1CONJTAPONADORA);
        }else{
          if(ctx.body=='3'){
            ctx.body="Transportador de salida"
            state.update({ Conjunto: ctx.body });
            return gotoFlow(flowL1CONJTRANSPORTADOR);
          }else{
            if(ctx.body=='4'){
              ctx.body="Tablero electrico"
              state.update({ Conjunto: ctx.body });
              return gotoFlow(flowL1CONJTABLERO);
            }else{
              if(ctx.body=='5'){
                ctx.body="Materia prima"
                state.update({ Conjunto: ctx.body });
                return gotoFlow(flowEscrito);} 
                else{
                  if(ctx.body=='6'){
                ctx.body="Falla Humana"
                state.update({ Conjunto: ctx.body, Subconjunto: "NA" });
                return gotoFlow(flowEscrito);} 
                else{

                  if(ctx.body=='M2'){
                    return gotoFlow(flowcedula);
                  }else{
                    if(ctx.body=='m2'){
                      return gotoFlow(flowcedula);
                    }else{
                      return fallBack();
                    }
                  }
                }
                }
                }
                }
              }
            }
          }
    );

    const flowL1DOSIFICADOR = bot
    .addKeyword(bot.EVENTS.ACTION)
    .addAnswer(
      [
        `Escoge el numero correspondiente al conjunto del dosificador de nitrogeno!👓`,
        `*1* Reservorio nitrogeno`,
        `*2* Controlador de nivel`,
        `*3* Control alimentacion N2`,
        `*4* Tablero electrico`,
        `*5* Valvula dosificadora`,
        `*6* Valvula reguladora entrada`,
        `*7* Sistema neumatico`,
        `*8* Falla Humana`,

      ])
    .addAnswer(
    [
     `*Escoge el numero correcto* `,
     `🐵` ,
    ],
      { capture: true },
      async (ctx, { state,gotoFlow,fallBack }) => {
        if(ctx.body=='1'){
          ctx.body="Reservorio nitrogeno"
          state.update({ Conjunto: ctx.body });
        return gotoFlow(flowL1RESERVORIO);
    }else{
        if(ctx.body=='2'){
          ctx.body="Controlador de nivel"
          state.update({ Conjunto: ctx.body });
          return gotoFlow(flowL1NIVEL);
        }else{
          if(ctx.body=='3'){
            ctx.body="Control alimentacion N2"
            state.update({ Conjunto: ctx.body });
            return gotoFlow(flowL1ALIMENTACIONN2);
          }else{
            if(ctx.body=='4'){
              ctx.body="Tablero electrico"
              state.update({ Conjunto: ctx.body });
              return gotoFlow(flowL1TABLEROV2);
            }else{
              if(ctx.body=='5'){
                ctx.body="Valvula dosificadora"
                state.update({ Conjunto: ctx.body, Subconjunto: "NA" });
                return gotoFlow(flowEscrito);} 
                else{
                  if(ctx.body=='6'){
                ctx.body="Valvula reguladora entrada"
                state.update({ Conjunto: ctx.body, Subconjunto: "NA" });
                return gotoFlow(flowEscrito);} 
                else{
                  if(ctx.body=='7'){
                    ctx.body="Sistema neumatico"
                    state.update({ Conjunto: ctx.body, Subconjunto: "NA" });
                    return gotoFlow(flowEscrito);} 
                    else{
                      if(ctx.body=='8'){
                        ctx.body="Falla Humana"
                        state.update({ Conjunto: ctx.body, Subconjunto: "NA" });
                        return gotoFlow(flowEscrito);} 
                        else{

                  if(ctx.body=='M2'){
                    return gotoFlow(flowcedula);
                  }else{
                    if(ctx.body=='m2'){
                      return gotoFlow(flowcedula);
                    }else{
                      return fallBack();
                    }
                  }
                }
                }
                }
                }
              }
            }
          }}}
    );

    const flowL1AEREO = bot
    .addKeyword(bot.EVENTS.ACTION)
    .addAnswer(
      [
        `Escoge el numero correspondiente al conjunto del Transportador aereo!👓`,
        `*1* Electrovalvulas`,
        `*2* Caida de presion`,
        `*3* Apertura de barandillas`,
        `*4* Motores`,
        `*5* Sensores`,
        `*6* Materia prima`,

      ])
    .addAnswer(
    [
     `*Escoge el numero correcto* `,
     `🐵` ,
    ],
      { capture: true },
      async (ctx, { state,gotoFlow,fallBack }) => {
        if(ctx.body=='1'){
          ctx.body="Electrovalvulas"
          state.update({ Conjunto: ctx.body, Subconjunto:"NA" });
        return gotoFlow(flowEscrito);
    }else{
        if(ctx.body=='2'){
          ctx.body="Caida de presion"
          state.update({ Conjunto: ctx.body, Subconjunto:"NA" });
          return gotoFlow(flowEscrito);
        }else{
          if(ctx.body=='3'){
            ctx.body="Apertura barandillas"
            state.update({ Conjunto: ctx.body });
            return gotoFlow(flowL1BARRANDILLAS);
          }else{
            if(ctx.body=='4'){
              ctx.body="Motores"
              state.update({ Conjunto: ctx.body });
              return gotoFlow(flowEscrito);
            }else{
              if(ctx.body=='5'){
                ctx.body="Sensores"
                state.update({ Conjunto: ctx.body, Subconjunto: "NA" });
                return gotoFlow(flowEscrito);} 
                else{
                  if(ctx.body=='6'){
                ctx.body="Materia prima"
                state.update({ Conjunto: ctx.body, Subconjunto: "NA" });
                return gotoFlow(flowEscrito);} 
                        else{

                  if(ctx.body=='M2'){
                    return gotoFlow(flowcedula);
                  }else{
                    if(ctx.body=='m2'){
                      return gotoFlow(flowcedula);
                    }else{
                      return fallBack();
                    }
                  }
                }
                }
                }
                }
              }
            }
          }
    );

    const flowL1ETIQUETADORA = bot
    .addKeyword(bot.EVENTS.ACTION)
    .addAnswer(
      [
        `Escoge el numero correspondiente al conjunto de la Etiquetadora!👓`,
        `*1* Maquina principal`,
        `*2* Agregado (LSU)`,
        `*3* Falla Humana`,
        `*4* Materia prima`,

      ])
    .addAnswer(
    [
     `*Escoge el numero correcto* `,
     `🐵` ,
    ],
      { capture: true },
      async (ctx, { state,gotoFlow,fallBack }) => {
        if(ctx.body=='1'){
          ctx.body="Maquina principal"
          state.update({ Conjunto: ctx.body});
        return gotoFlow(flowL1MAQUINA);
    }else{
        if(ctx.body=='2'){
          ctx.body="Agregado (LSU)"
          state.update({ Conjunto: ctx.body});
          return gotoFlow(flowL1AGREGADO);
        }else{
          if(ctx.body=='3'){
            ctx.body="Falla Humana"
            state.update({ Conjunto: ctx.body, Subconjunto:"NA" });
            return gotoFlow(flowEscrito);
          }else{
            if(ctx.body=='4'){
              ctx.body="Materia prima"
              state.update({ Conjunto: ctx.body, Subconjunto:"NA" });
              return gotoFlow(flowEscrito);
            }else{

                  if(ctx.body=='M2'){
                    return gotoFlow(flowcedula);
                  }else{
                    if(ctx.body=='m2'){
                      return gotoFlow(flowcedula);
                    }else{
                      return fallBack();
                    }
                  }
                }
                }
                }
                }
              }
    );


    const flowL1AGREGADO = bot
    .addKeyword(bot.EVENTS.ACTION)
    .addAnswer(
      [
        `Escoge el numero correspondiente al conjunto del agregado(LSU)!👓`,
        `*1* Platos portabobinas`,
        `*2* Rodillos compensadores`,
        `*3* Compensadores de etiqueta`,
        `*4* Sensor de longitud etiqueta`,
        `*5* Cilindro de corte`,

      ])
    .addAnswer(
    [
     `*Escoge el numero correcto* `,
     `🐵` ,
    ],
      { capture: true },
      async (ctx, { state,gotoFlow,fallBack }) => {
        if(ctx.body=='1'){
          ctx.body="Platos portabobinas"
          state.update({ Conjunto: ctx.body});
        return gotoFlow(flowL1PLATOS);
    }else{
        if(ctx.body=='2'){
          ctx.body="Rodillos compensadores"
          state.update({ Conjunto: ctx.body, Subconjunto:"NA"});
          return gotoFlow(flowEscrito);
        }else{
          if(ctx.body=='3'){
            ctx.body="Compensadores de etiqueta"
            state.update({ Conjunto: ctx.body });
            return gotoFlow(flowL1ETIQUETA);
          }else{
            if(ctx.body=='4'){
              ctx.body="Sensor de longitud etiqueta"
              state.update({ Conjunto: ctx.body, Subconjunto:"NA" });
              return gotoFlow(flowEscrito);
            }else{
              if(ctx.body=='5'){
                ctx.body="Cilindro de corte"
                state.update({ Conjunto: ctx.body });
                return gotoFlow(flowL1CORTE);
              }else{

                  if(ctx.body=='M2'){
                    return gotoFlow(flowcedula);
                  }else{
                    if(ctx.body=='m2'){
                      return gotoFlow(flowcedula);
                    }else{
                      return fallBack();
                    }
                  }
                }
                }
                }
                }
              }}
    );

const flowL1CONJCARRUSEL = bot
    .addKeyword(bot.EVENTS.ACTION)
    .addAnswer(
      [
        `Escoge el numero correspondiente al subconjunto del carrusel!👓`,
        `*1* Motor`,
        `*2* Transmision`,
        `*3* Sensores`,
        `*4* Pinzas cilindros elevadores`,
        `*5* Cilindros elevadores`,
        `*6* Tablero neumatico control valvulas llenado`,
        `*7* Estrella entrada-salida`,
        `*8* Valvulas en isla de valvulas`,
        `*9* Valvulas de llenado`,
        `*10* Tablero electrico valvulas`,
      ])
    .addAnswer(
    [
     `*Escoge el numero correcto* `,
     `🐵` ,
    ],
      { capture: true },
      async (ctx, { state,gotoFlow,fallBack }) => {
        if(ctx.body== '1'){
          ctx.body="Motor"
          state.update({ Subconjunto: ctx.body });
          return gotoFlow(flowEscrito);
        }else{
          if(ctx.body== '2'){
            ctx.body="Transmision"
            state.update({ Subconjunto: ctx.body });
            return gotoFlow(flowEscrito);
          }else{
            if(ctx.body =='3'){
              ctx.body="Sensores"
              state.update({ Subconjunto: ctx.body });
              return gotoFlow(flowEscrito);
            }else{
              if(ctx.body =='4'){
                ctx.body="Pinzas cilindros elevadores"
                state.update({ Subconjunto: ctx.body });
                return gotoFlow(flowEscrito);
              }else{
                if(ctx.body =='5'){
                  ctx.body="Cilindros elevadores"
                  state.update({ Subconjunto: ctx.body });
                  return gotoFlow(flowEscrito);
                }else{
                  if(ctx.body =='6'){
                    ctx.body="Tablero neumatico control valvulas llenado"
                    state.update({ Subconjunto: ctx.body });
                    return gotoFlow(flowEscrito);
                  }else{
                    if(ctx.body =='7'){
                      ctx.body="Estrella entrada-salida"
                      state.update({ Subconjunto: ctx.body });
                      return gotoFlow(flowEscrito);
                    }else{
                      if(ctx.body =='8'){
                        ctx.body="Valvulas en isla de valvulas"
                        state.update({ Subconjunto: ctx.body });
                        return gotoFlow(flowEscrito);
                      }else{
                        if(ctx.body =='9'){
                          ctx.body="Valvulas de llenado"
                          state.update({ Subconjunto: ctx.body });
                          return gotoFlow(flowEscrito);
                        }else{
                          if(ctx.body =='10'){
                            ctx.body="Tablero electrico valvulas"
                            state.update({ Subconjunto: ctx.body });
                            return gotoFlow(flowEscrito);
                          }else{
              if(ctx.body=='M2'){
                return gotoFlow(flowcedula);
              }else{
                if(ctx.body=='m2'){
                  return gotoFlow(flowcedula);
                }else{
                  return fallBack();
                }
              }
            }
          }
        }
      }}}}}}}});


      const flowL1PLATOS = bot
    .addKeyword(bot.EVENTS.ACTION)
    .addAnswer(
      [
        `Escoge el numero correspondiente al subconjunto de los platos portabobinas!👓`,
        `*1* Servomotores`,
        `*2* Sensores`,
        `*3* Sistema empalme`,
      ])
    .addAnswer(
    [
     `*Escoge el numero correcto* `,
     `🐵` ,
    ],
      { capture: true },
      async (ctx, { state,gotoFlow,fallBack }) => {
        if(ctx.body== '1'){
          ctx.body="Servomotores"
          state.update({ Subconjunto: ctx.body });
          return gotoFlow(flowEscrito);
        }else{
          if(ctx.body== '2'){
            ctx.body="Sensores"
            state.update({ Subconjunto: ctx.body });
            return gotoFlow(flowEscrito);
          }else{
            if(ctx.body =='3'){
              ctx.body="Sistema empalme"
              state.update({ Subconjunto: ctx.body });
              return gotoFlow(flowEscrito);
            }else{
              if(ctx.body=='M2'){
                return gotoFlow(flowcedula);
              }else{
                if(ctx.body=='m2'){
                  return gotoFlow(flowcedula);
                }else{
                  return fallBack();
                }
              }
            }
          }
        }
      });

      const flowL1CORTE = bot
      .addKeyword(bot.EVENTS.ACTION)
      .addAnswer(
        [
          `Escoge el numero correspondiente al subconjunto del cilindro de corte!👓`,
          `*1* Cuchillas`,
          `*2* Servomotor`,
          `*3* Encoder`,
          `*4* Agujeros de vacio`,
        ])
      .addAnswer(
      [
       `*Escoge el numero correcto* `,
       `🐵` ,
      ],
        { capture: true },
        async (ctx, { state,gotoFlow,fallBack }) => {
          if(ctx.body== '1'){
            ctx.body="Cuchillas"
            state.update({ Subconjunto: ctx.body });
            return gotoFlow(flowEscrito);
          }else{
            if(ctx.body== '2'){
              ctx.body="Servomotor"
              state.update({ Subconjunto: ctx.body });
              return gotoFlow(flowEscrito);
            }else{
              if(ctx.body =='3'){
                ctx.body="Encoder"
                state.update({ Subconjunto: ctx.body });
                return gotoFlow(flowEscrito);
              }else{
                if(ctx.body =='4'){
                  ctx.body="Agujeros de vacio"
                  state.update({ Subconjunto: ctx.body });
                  return gotoFlow(flowEscrito);
                }else{
                if(ctx.body=='M2'){
                  return gotoFlow(flowcedula);
                }else{
                  if(ctx.body=='m2'){
                    return gotoFlow(flowcedula);
                  }else{
                    return fallBack();
                  }
                }
              }
            }
          }
        }});
  

      const flowL1ETIQUETA = bot
      .addKeyword(bot.EVENTS.ACTION)
      .addAnswer(
        [
          `Escoge el numero correspondiente al subconjunto del compensador de etiqueta!👓`,
          `*1* Sensor`,
          `*2* Rodamientos`,
        ])
      .addAnswer(
      [
       `*Escoge el numero correcto* `,
       `🐵` ,
      ],
        { capture: true },
        async (ctx, { state,gotoFlow,fallBack }) => {
          if(ctx.body== '1'){
            ctx.body="Sensor"
            state.update({ Subconjunto: ctx.body });
            return gotoFlow(flowEscrito);
          }else{
            if(ctx.body== '2'){
              ctx.body="Rodamientos"
              state.update({ Subconjunto: ctx.body });
              return gotoFlow(flowEscrito);
            }else{
                if(ctx.body=='M2'){
                  return gotoFlow(flowcedula);
                }else{
                  if(ctx.body=='m2'){
                    return gotoFlow(flowcedula);
                  }else{
                    return fallBack();
                  }
                }
              }
            }
          }
        );
  

      const flowL1MAQUINA = bot
    .addKeyword(bot.EVENTS.ACTION)
    .addAnswer(
      [
        `Escoge el numero correspondiente al subconjunto de la maquina principal!👓`,
        `*1* Estrellas entrada`,
        `*2* Estrellas salida`,
        `*3* Carrusel`,
        `*4* Guia entrada`,
        `*5* Guia salida`,
      ])
    .addAnswer(
    [
     `*Escoge el numero correcto* `,
     `🐵` ,
    ],
      { capture: true },
      async (ctx, { state,gotoFlow,fallBack }) => {
        if(ctx.body== '1'){
          ctx.body="Estrellas entrada"
          state.update({ Subconjunto: ctx.body });
          return gotoFlow(flowEscrito);
        }else{
          if(ctx.body== '2'){
            ctx.body="Estrellas salida"
            state.update({ Subconjunto: ctx.body });
            return gotoFlow(flowEscrito);
          }else{
            if(ctx.body =='3'){
              ctx.body="Carrusel"
              state.update({ Subconjunto: ctx.body });
              return gotoFlow(flowEscrito);
            }else{
              if(ctx.body =='4'){
                ctx.body="Guia entrada"
                state.update({ Subconjunto: ctx.body });
                return gotoFlow(flowEscrito);
              }else{
                if(ctx.body =='5'){
                  ctx.body="Guia salida"
                  state.update({ Subconjunto: ctx.body });
                  return gotoFlow(flowEscrito);
                }else{
              if(ctx.body=='M2'){
                return gotoFlow(flowcedula);
              }else{
                if(ctx.body=='m2'){
                  return gotoFlow(flowcedula);
                }else{
                  return fallBack();
                }
              }
            }
          }
        }
      }}});

      const flowL1BARRANDILLAS = bot
      .addKeyword(bot.EVENTS.ACTION)
      .addAnswer(
        [
          `Escoge el numero correspondiente al subconjunto de la apertura de barandillas!👓`,
          `*1* Cilindros`,
          `*2* Manguera`,
        ])
      .addAnswer(
      [
       `*Escoge el numero correcto* `,
       `🐵` ,
      ],
        { capture: true },
        async (ctx, { state,gotoFlow,fallBack }) => {
          if(ctx.body== '1'){
            ctx.body="Cilindros"
            state.update({ Subconjunto: ctx.body });
            return gotoFlow(flowEscrito);
          }else{
            if(ctx.body== '2'){
              ctx.body="Manguera"
              state.update({ Subconjunto: ctx.body });
              return gotoFlow(flowEscrito);
            }else{
                if(ctx.body=='M2'){
                  return gotoFlow(flowcedula);
                }else{
                  if(ctx.body=='m2'){
                    return gotoFlow(flowcedula);
                  }else{
                    return fallBack();
                  }
                }
              }
            }
          }
      );
  
      const flowL1ADHESIVO = bot
      .addKeyword(bot.EVENTS.ACTION)
      .addAnswer(
        [
          `Escoge el numero correspondiente al conjunto del Aplicador de adhesivo!👓`,
          `*1* Tanque reservorio`,
          `*2* Dosificacion adhesivo`,
          `*3* Sistema neumatico`,
          `*4* Sensores`,
          `*5* Controlador`,
          `*6* Materia prima`,
          `*7* Falla Humana`,
  
        ])
      .addAnswer(
      [
       `*Escoge el numero correcto* `,
       `🐵` ,
      ],
        { capture: true },
        async (ctx, { state,gotoFlow,fallBack }) => {
          if(ctx.body=='1'){
            ctx.body="Tanque reservorio"
            state.update({ Conjunto: ctx.body });
          return gotoFlow(flowL1tanqueRESERVORIO);
      }else{
          if(ctx.body=='2'){
            ctx.body="Dosificacion adhesivo"
            state.update({ Conjunto: ctx.body });
            return gotoFlow(flowL1dosiadhesivo);
          }else{
            if(ctx.body=='3'){
              ctx.body="Sistema neumatico"
              state.update({ Conjunto: ctx.body,Subconjunto: "NA" });
              return gotoFlow(flowEscrito);
            }else{
              if(ctx.body=='4'){
                ctx.body="Sensores"
                state.update({ Conjunto: ctx.body,Subconjunto: "NA" });
                return gotoFlow(flowEscrito);
              }else{
                if(ctx.body=='5'){
                  ctx.body="Controlador"
                  state.update({ Conjunto: ctx.body, Subconjunto: "NA" });
                  return gotoFlow(flowEscrito);} 
                  else{
                    if(ctx.body=='6'){
                  ctx.body="Materia prima"
                  state.update({ Conjunto: ctx.body, Subconjunto: "NA" });
                  return gotoFlow(flowEscrito);} 
                  else{
                    if(ctx.body=='7'){
                      ctx.body="Falla Humana"
                      state.update({ Conjunto: ctx.body, Subconjunto: "NA" });
                      return gotoFlow(flowEscrito);} 
                          else{
  
                    if(ctx.body=='M2'){
                      return gotoFlow(flowcedula);
                    }else{
                      if(ctx.body=='m2'){
                        return gotoFlow(flowcedula);
                      }else{
                        return fallBack();
                      }
                    }
                  }
                  }
                  }
                  }
                }
              }
            }}
      );
  
  
  const flowL1tanqueRESERVORIO = bot
      .addKeyword(bot.EVENTS.ACTION)
      .addAnswer(
        [
          `Escoge el numero correspondiente al subconjunto del tanque reservorio!👓`,
          `*1* Bomba neumatica`,
          `*2* Resistencias`,
        ])
      .addAnswer(
      [
       `*Escoge el numero correcto* `,
       `🐵` ,
      ],
        { capture: true },
        async (ctx, { state,gotoFlow,fallBack }) => {
          if(ctx.body== '1'){
            ctx.body="Bomba neumatica"
            state.update({ Subconjunto: ctx.body });
            return gotoFlow(flowEscrito);
          }else{
            if(ctx.body== '2'){
              ctx.body="Resistencias"
              state.update({ Subconjunto: ctx.body });
              return gotoFlow(flowEscrito);
            }else{
                if(ctx.body=='M2'){
                  return gotoFlow(flowcedula);
                }else{
                  if(ctx.body=='m2'){
                    return gotoFlow(flowcedula);
                  }else{
                    return fallBack();
                  }
                }
              }
            }
          }
          );


          const flowL1dosiadhesivo = bot
          .addKeyword(bot.EVENTS.ACTION)
          .addAnswer(
            [
              `Escoge el numero correspondiente al subconjunto de la dosificacion de adhesivo!👓`,
              `*1* Mangueras`,
              `*2* Solenoides`,
              `*3* Valvula dosificacion`,
              `*4* Boquillas`,
            ])
          .addAnswer(
          [
           `*Escoge el numero correcto* `,
           `🐵` ,
          ],
            { capture: true },
            async (ctx, { state,gotoFlow,fallBack }) => {
              if(ctx.body== '1'){
                ctx.body="Mangueras"
                state.update({ Subconjunto: ctx.body });
                return gotoFlow(flowEscrito);
              }else{
                if(ctx.body== '2'){
                  ctx.body="Solenoides"
                  state.update({ Subconjunto: ctx.body });
                  return gotoFlow(flowEscrito);
                }else{
                  if(ctx.body== '3'){
                    ctx.body="Valvula dosificacion"
                    state.update({ Subconjunto: ctx.body });
                    return gotoFlow(flowEscrito);
                  }else{
                    if(ctx.body== '4'){
                      ctx.body="Boquillas"
                      state.update({ Subconjunto: ctx.body });
                      return gotoFlow(flowEscrito);
                    }else{
                    if(ctx.body=='M2'){
                      return gotoFlow(flowcedula);
                    }else{
                      if(ctx.body=='m2'){
                        return gotoFlow(flowcedula);
                      }else{
                        return fallBack();
                      }
                    }
                  }
                }
              }}}
              );


      const flowL1RESERVORIO = bot
    .addKeyword(bot.EVENTS.ACTION)
    .addAnswer(
      [
        `Escoge el numero correspondiente al subconjunto del Reservorio de nitrogeno!👓`,
        `*1* Sonda de temperatura`,
        `*2* Valvulas`,
      ])
    .addAnswer(
    [
     `*Escoge el numero correcto* `,
     `🐵` ,
    ],
      { capture: true },
      async (ctx, { state,gotoFlow,fallBack }) => {
        if(ctx.body== '1'){
          ctx.body="Sonda de temperatura"
          state.update({ Subconjunto: ctx.body });
          return gotoFlow(flowEscrito);
        }else{
          if(ctx.body== '2'){
            ctx.body="Valvulas"
            state.update({ Subconjunto: ctx.body });
            return gotoFlow(flowEscrito);
          }else{
              if(ctx.body=='M2'){
                return gotoFlow(flowcedula);
              }else{
                if(ctx.body=='m2'){
                  return gotoFlow(flowcedula);
                }else{
                  return fallBack();
                }
              }
            }
          }
        });


        const flowL1NIVEL = bot
        .addKeyword(bot.EVENTS.ACTION)
        .addAnswer(
          [
            `Escoge el numero correspondiente al subconjunto del controlador de nivel!👓`,
            `*1* Solenoides`,
            `*2* Reguladores`,
          ])
        .addAnswer(
        [
         `*Escoge el numero correcto* `,
         `🐵` ,
        ],
          { capture: true },
          async (ctx, { state,gotoFlow,fallBack }) => {
            if(ctx.body== '1'){
              ctx.body="Solenoides"
              state.update({ Subconjunto: ctx.body });
              return gotoFlow(flowEscrito);
            }else{
              if(ctx.body== '2'){
                ctx.body="Reguladores"
                state.update({ Subconjunto: ctx.body });
                return gotoFlow(flowEscrito);
              }else{
                  if(ctx.body=='M2'){
                    return gotoFlow(flowcedula);
                  }else{
                    if(ctx.body=='m2'){
                      return gotoFlow(flowcedula);
                    }else{
                      return fallBack();
                    }
                  }
                }
              }
            });


            const flowL1ALIMENTACIONN2 = bot
            .addKeyword(bot.EVENTS.ACTION)
            .addAnswer(
              [
                `Escoge el numero correspondiente al subconjunto del control de alimentacion N2!👓`,
                `*1* Desairedor(Resistencia)`,
                `*2* Valvulas seguridad`,
                `*3* Valvula alimentacion principal`,
              ])
            .addAnswer(
            [
             `*Escoge el numero correcto* `,
             `🐵` ,
            ],
              { capture: true },
              async (ctx, { state,gotoFlow,fallBack }) => {
                if(ctx.body== '1'){
                  ctx.body="Desairedor(Resistencia)"
                  state.update({ Subconjunto: ctx.body });
                  return gotoFlow(flowEscrito);
                }else{
                  if(ctx.body== '2'){
                    ctx.body="Valvulas seguridad"
                    state.update({ Subconjunto: ctx.body });
                    return gotoFlow(flowEscrito);
                  }else{
                    if(ctx.body== '3'){
                      ctx.body="Valvula alimentacion principal"
                      state.update({ Subconjunto: ctx.body });
                      return gotoFlow(flowEscrito);
                    }else{
                      if(ctx.body=='M2'){
                        return gotoFlow(flowcedula);
                      }else{
                        if(ctx.body=='m2'){
                          return gotoFlow(flowcedula);
                        }else{
                          return fallBack();
                        }
                      }
                    }
                  }
                }});

                const flowL1TABLEROV2 = bot
                .addKeyword(bot.EVENTS.ACTION)
                .addAnswer(
                  [
                    `Escoge el numero correspondiente al subconjunto del tablero electrico!👓`,
                    `*1* Pantalla`,
                    `*2* PLC`,
                    `*3* Red comunicacion`,
                  ])
                .addAnswer(
                [
                 `*Escoge el numero correcto* `,
                 `🐵` ,
                ],
                  { capture: true },
                  async (ctx, { state,gotoFlow,fallBack }) => {
                    if(ctx.body== '1'){
                      ctx.body="Pantalla"
                      state.update({ Subconjunto: ctx.body });
                      return gotoFlow(flowEscrito);
                    }else{
                      if(ctx.body== '2'){
                        ctx.body="PLC"
                        state.update({ Subconjunto: ctx.body });
                        return gotoFlow(flowEscrito);
                      }else{
                        if(ctx.body== '3'){
                          ctx.body="Red comunicacion"
                          state.update({ Subconjunto: ctx.body });
                          return gotoFlow(flowEscrito);
                        }else{
                          if(ctx.body=='M2'){
                            return gotoFlow(flowcedula);
                          }else{
                            if(ctx.body=='m2'){
                              return gotoFlow(flowcedula);
                            }else{
                              return fallBack();
                            }
                          }
                        }
                      }
                    }});
                

      const flowL1ENVOLVEDORA = bot
    .addKeyword(bot.EVENTS.ACTION)
    .addAnswer(
      [
        `Escoge el numero correspondiente al conjunto de la Envolvedora-robopac!👓`,
        `*1* Anillo rotacion`,
        `*2* Modulo corte y soldadura film`,
        `*3* Sistema elevacion`,
        `*4* Tablero electrico`,
        `*5* Transporte interno`,
        `*6* Sensores`,
        `*7* Falla Humana`,
        `*8* Materia prima`,

      ])
    .addAnswer(
    [
     `*Escoge el numero correcto* `,
     `🐵` ,
    ],
      { capture: true },
      async (ctx, { state,gotoFlow,fallBack }) => {
        if(ctx.body=='1'){
          ctx.body="Anillo rotacion"
          state.update({ Conjunto: ctx.body });
        return gotoFlow(flowL1Anillo);
    }else{
        if(ctx.body=='2'){
          ctx.body="Modulo corte y soldadura film"
          state.update({ Conjunto: ctx.body });
          return gotoFlow(flowL1Soldadura);
        }else{
          if(ctx.body=='3'){
            ctx.body="Sistema elevacion"
            state.update({ Conjunto: ctx.body });
            return gotoFlow(flowL1Elevacion);
          }else{
            if(ctx.body=='4'){
              ctx.body="Tablero electrico"
              state.update({ Conjunto: ctx.body });
              return gotoFlow(flowL1TABLEROELECTRICOL1);
            }else{
              if(ctx.body=='5'){
                ctx.body="Transporte interno"
                state.update({ Conjunto: ctx.body, Subconjunto: "NA"});
                return gotoFlow(flowEscrito);} 
                else{
                  if(ctx.body=='6'){
                ctx.body="Sensores"
                state.update({ Conjunto: ctx.body, Subconjunto: "NA" });
                return gotoFlow(flowEscrito);} 
                else{
                  if(ctx.body=='7'){
                    ctx.body="Falla Humana"
                    state.update({ Conjunto: ctx.body, Subconjunto: "NA" });
                    return gotoFlow(flowEscrito);} 
                    else{
                      if(ctx.body=='8'){
                        ctx.body="Materia prima"
                        state.update({ Conjunto: ctx.body, Subconjunto: "NA" });
                        return gotoFlow(flowEscrito);} 
                        else{

                  if(ctx.body=='M2'){
                    return gotoFlow(flowcedula);
                  }else{
                    if(ctx.body=='m2'){
                      return gotoFlow(flowcedula);
                    }else{
                      return fallBack();
                    }
                  }
                }
                }
                }
                }
              }
            }
          }}}
    );

const flowL1Anillo = bot
    .addKeyword(bot.EVENTS.ACTION)
    .addAnswer(
      [
        `Escoge el numero correspondiente al subconjunto del anillo de rotacion!👓`,
        `*1* Motor-transmision`,
        `*2* Correa`,
      ])
    .addAnswer(
    [
     `*Escoge el numero correcto* `,
     `🐵` ,
    ],
      { capture: true },
      async (ctx, { state,gotoFlow,fallBack }) => {
        if(ctx.body== '1'){
          ctx.body="Motor-transmision"
          state.update({ Subconjunto: ctx.body });
          return gotoFlow(flowEscrito);
        }else{
          if(ctx.body== '2'){
            ctx.body="Correa"
            state.update({ Subconjunto: ctx.body });
            return gotoFlow(flowEscrito);
          }else{
              if(ctx.body=='M2'){
                return gotoFlow(flowcedula);
              }else{
                if(ctx.body=='m2'){
                  return gotoFlow(flowcedula);
                }else{
                  return fallBack();
                }
              }
            }
          }
        }
        );

        const flowL1Elevacion = bot
    .addKeyword(bot.EVENTS.ACTION)
    .addAnswer(
      [
        `Escoge el numero correspondiente al subconjunto del sistema de elevacion!👓`,
        `*1* Motor-transmision`,
        `*2* Cadenas elevacion`,
      ])
    .addAnswer(
    [
     `*Escoge el numero correcto* `,
     `🐵` ,
    ],
      { capture: true },
      async (ctx, { state,gotoFlow,fallBack }) => {
        if(ctx.body== '1'){
          ctx.body="Motor-transmision"
          state.update({ Subconjunto: ctx.body });
          return gotoFlow(flowEscrito);
        }else{
          if(ctx.body== '2'){
            ctx.body="Cadenas elevacion"
            state.update({ Subconjunto: ctx.body });
            return gotoFlow(flowEscrito);
          }else{
              if(ctx.body=='M2'){
                return gotoFlow(flowcedula);
              }else{
                if(ctx.body=='m2'){
                  return gotoFlow(flowcedula);
                }else{
                  return fallBack();
                }
              }
            }
          }
        }
        );

        const flowL1Soldadura = bot
    .addKeyword(bot.EVENTS.ACTION)
    .addAnswer(
      [
        `Escoge el numero correspondiente al subconjunto del modulo de corte y soldadura film!👓`,
        `*1* Sistema neumatico`,
        `*2* Controlador de preestirado`,
        `*3* Rodillos,poleas,piñones`,
        `*4* Alternador`,
        `*5* Resistencias`,
        `*6* Pinza de agarre film`,
      ])
    .addAnswer(
    [
     `*Escoge el numero correcto* `,
     `🐵` ,
    ],
      { capture: true },
      async (ctx, { state,gotoFlow,fallBack }) => {
        if(ctx.body== '1'){
          ctx.body="Sistema neumatico"
          state.update({ Subconjunto: ctx.body });
          return gotoFlow(flowEscrito);
        }else{
          if(ctx.body== '2'){
            ctx.body="Controlador de preestirado"
            state.update({ Subconjunto: ctx.body });
            return gotoFlow(flowEscrito);
          }else{
            if(ctx.body== '3'){
              ctx.body="Rodillos,poleas,piñones"
              state.update({ Subconjunto: ctx.body });
              return gotoFlow(flowEscrito);
            }else{
              if(ctx.body== '4'){
                ctx.body="Alternador"
                state.update({ Subconjunto: ctx.body });
                return gotoFlow(flowEscrito);
              }else{
                if(ctx.body== '5'){
                  ctx.body="Resistencias"
                  state.update({ Subconjunto: ctx.body });
                  return gotoFlow(flowEscrito);
                }else{
                  if(ctx.body== '6'){
                    ctx.body="Pinza de agarre film"
                    state.update({ Subconjunto: ctx.body });
                    return gotoFlow(flowEscrito);
                  }else{
              if(ctx.body=='M2'){
                return gotoFlow(flowcedula);
              }else{
                if(ctx.body=='m2'){
                  return gotoFlow(flowcedula);
                }else{
                  return fallBack();
                }
              }
            }
          }
        }}}}}
        );


  const flowPaletizadora = bot
    .addKeyword(bot.EVENTS.ACTION)
    .addAnswer(
      [
        `Escoge el numero correspondiente al conjunto de la paletizadora!👓`,
        `*1* Multidivisor`,
        `*2* Vias entrada embalajes`,
        `*3* Mesa agrupamiento`,
        `*4* Conjunto elevador`,
        `*5* Aplicador de carton`,
        `*6* Transporte estibas interno`,
        `*7* Sensores`,
        `*8* Tablero electrico`,
        `*9* Falla Humana`,
        `*10* Materia prima`,

      ])
    .addAnswer(
    [
     `*Escoge el numero correcto* `,
     `🐵` ,
    ],
      { capture: true },
      async (ctx, { state,gotoFlow,fallBack }) => {
        if(ctx.body=='1'){
          ctx.body="Multidivisor"
          state.update({ Conjunto: ctx.body });
        return gotoFlow(flowL1Multidivisor);
    }else{
        if(ctx.body=='2'){
          ctx.body="Vias entrada embalajes"
          state.update({ Conjunto: ctx.body });
          return gotoFlow(flowL1Viasentradas);
        }else{
          if(ctx.body=='3'){
            ctx.body="Mesa agrupamiento"
            state.update({ Conjunto: ctx.body });
            return gotoFlow(flowL1Mesaagrupamiento);
          }else{
            if(ctx.body=='4'){
              ctx.body="Conjunto elevador"
              state.update({ Conjunto: ctx.body });
              return gotoFlow(flowL1conjuntoE);
            }else{
              if(ctx.body=='5'){
                ctx.body="Aplicador de carton"
                state.update({ Conjunto: ctx.body });
                return gotoFlow(flowL1Aplicador);} 
                else{
                  if(ctx.body=='6'){
                ctx.body="Transporte estibas interno"
                state.update({ Conjunto: ctx.body, Subconjunto: "NA"});
                return gotoFlow(flowEscrito);} 
                else{
                  if(ctx.body=='7'){
                ctx.body="Sensores"
                state.update({ Conjunto: ctx.body, Subconjunto: "NA" });
                return gotoFlow(flowEscrito);} 
                else{
                  if(ctx.body=='8'){
                ctx.body="Tablero electrico"
                state.update({ Conjunto: ctx.body });
                return gotoFlow(flowL1TABLEROELECTRICOL1);} 
                else{
                  if(ctx.body=='9'){
                ctx.body="Falla Humana"
                state.update({ Conjunto: ctx.body, Subconjunto: "NA" });
                return gotoFlow(flowEscrito);} 
                else{
                  if(ctx.body=='10'){
                ctx.body="Materia prima"
                state.update({ Conjunto: ctx.body, Subconjunto: "NA" });
                return gotoFlow(flowEscrito);} 
                else{

                  if(ctx.body=='M2'){
                    return gotoFlow(flowcedula);
                  }else{
                    if(ctx.body=='m2'){
                      return gotoFlow(flowcedula);
                    }else{
                      return fallBack();
                    }
                  }
                }
                }
                }
                }
              }
            }
          }}}}}
    );


 const flowL1CODIFICADOR = bot
    .addKeyword(bot.EVENTS.ACTION)
    .addAnswer(
      [
        `Escoge el numero correspondiente al conjunto del codificador laser!👓`,
        `*1* Encoder`,
        `*2* Cañon impresion`,
        `*3* Sistema refrigeracion`,
        `*4* Extractor de humos`,
        `*5* Filtros`,
        `*6* Sensores`,
        `*7* Controlador-pantalla`,
        `*8* Secador botellas`,

      ])
    .addAnswer(
    [
     `*Escoge el numero correcto* `,
     `🐵` ,
    ],
      { capture: true },
      async (ctx, { state,gotoFlow,fallBack }) => {
        if(ctx.body=='1'){
          ctx.body="Encoder"
          state.update({ Conjunto: ctx.body,Subconjunto: "NA" });
        return gotoFlow(flowEscrito);
    }else{
        if(ctx.body=='2'){
          ctx.body="Cañon impresion"
          state.update({ Conjunto: ctx.body,Subconjunto: "NA" });
          return gotoFlow(flowEscrito);
        }else{
          if(ctx.body=='3'){
            ctx.body="Sistema refrigeracion"
            state.update({ Conjunto: ctx.body,Subconjunto: "NA"});
            return gotoFlow(flowEscrito);
          }else{
            if(ctx.body=='4'){
              ctx.body="Extractor de humos"
              state.update({ Conjunto: ctx.body,Subconjunto: "NA" });
              return gotoFlow(flowEscrito);
            }else{
              if(ctx.body=='5'){
                ctx.body="Filtros"
                state.update({ Conjunto: ctx.body,Subconjunto: "NA" });
                return gotoFlow(flowEscrito);} 
                else{
                  if(ctx.body=='6'){
                ctx.body="Sensores"
                state.update({ Conjunto: ctx.body, Subconjunto: "NA"});
                return gotoFlow(flowEscrito);} 
                else{
                  if(ctx.body=='7'){
                ctx.body="Controlador-pantalla"
                state.update({ Conjunto: ctx.body, Subconjunto: "NA" });
                return gotoFlow(flowEscrito);} 
                else{
                  if(ctx.body=='8'){
                ctx.body="Secador botellas"
                state.update({ Conjunto: ctx.body,Subconjunto: "NA" });
                return gotoFlow(flowEscrito);} 
                else{

                  if(ctx.body=='M2'){
                    return gotoFlow(flowcedula);
                  }else{
                    if(ctx.body=='m2'){
                      return gotoFlow(flowcedula);
                    }else{
                      return fallBack();
                    }
                  }
                }
                }
                }
                }
              }
            }
          }}}
    );



    const flowL1ELEVADOR = bot
    .addKeyword(bot.EVENTS.ACTION)
    .addAnswer(
      [
        `Escoge el numero correspondiente al conjunto del elevador de tapas!👓`,
        `*1* Motores-transmision`,
        `*2* Banda cangilones`,
        `*3* Banda transportadora`,

      ])
    .addAnswer(
    [
     `*Escoge el numero correcto* `,
     `🐵` ,
    ],
      { capture: true },
      async (ctx, { state,gotoFlow,fallBack }) => {
        if(ctx.body=='1'){
          ctx.body="Motores-transmision"
          state.update({ Conjunto: ctx.body,Subconjunto: "NA" });
        return gotoFlow(flowEscrito);
    }else{
        if(ctx.body=='2'){
          ctx.body="Banda cangilones"
          state.update({ Conjunto: ctx.body,Subconjunto: "NA" });
          return gotoFlow(flowEscrito);
        }else{
          if(ctx.body=='3'){
            ctx.body="Banda transportadora"
            state.update({ Conjunto: ctx.body,Subconjunto: "NA"});
            return gotoFlow(flowEscrito);
          }else{

                  if(ctx.body=='M2'){
                    return gotoFlow(flowcedula);
                  }else{
                    if(ctx.body=='m2'){
                      return gotoFlow(flowcedula);
                    }else{
                      return fallBack();
                    }
                  }
                }
                }
                }
                }
    );


      const flowL1TOLVA = bot
    .addKeyword(bot.EVENTS.ACTION)
    .addAnswer(
      [
        `Escoge el numero correspondiente al conjunto de la tolva de tapas!👓`,
        `*1* Vibrador`,
        `*2* Sistema neumatico`,
        `*3* Compuerta alimentacion tapones`,
        `*4* Sensores`,
        `*5* Tablero electrico`,

      ])
    .addAnswer(
    [
     `*Escoge el numero correcto* `,
     `🐵` ,
    ],
      { capture: true },
      async (ctx, { state,gotoFlow,fallBack }) => {
        if(ctx.body=='1'){
          ctx.body="Vibrador"
          state.update({ Conjunto: ctx.body,Subconjunto: "NA" });
        return gotoFlow(flowEscrito);
    }else{
        if(ctx.body=='2'){
          ctx.body="Sistema neumatico"
          state.update({ Conjunto: ctx.body,Subconjunto: "NA" });
          return gotoFlow(flowEscrito);
        }else{
          if(ctx.body=='3'){
            ctx.body="Compuerta alimentacion tapones"
            state.update({ Conjunto: ctx.body,Subconjunto: "NA"});
            return gotoFlow(flowEscrito);
          }else{
            if(ctx.body=='4'){
            ctx.body="Sensores"
            state.update({ Conjunto: ctx.body,Subconjunto: "NA"});
            return gotoFlow(flowEscrito);
          }else{
            if(ctx.body=='5'){
            ctx.body="Tablero electrico"
            state.update({ Conjunto: ctx.body,Subconjunto: "NA"});
            return gotoFlow(flowEscrito);
          }else{

                  if(ctx.body=='M2'){
                    return gotoFlow(flowcedula);
                  }else{
                    if(ctx.body=='m2'){
                      return gotoFlow(flowcedula);
                    }else{
                      return fallBack();
                    }
                  }
                }
                }
                }
                }}}
    );


const flowL1Multidivisor = bot
    .addKeyword(bot.EVENTS.ACTION)
    .addAnswer(
      [
        `Escoge el numero correspondiente al subconjunto del multidivisor!👓`,
        `*1* Transporte interno`,
        `*2* Volteador embalajes`,
        `*3* Selector de vias`,
        `*4* Motor-transmision`,
        `*5* Banda de entrada`,
        `*6* Sistema neumatico`,
      ])
    .addAnswer(
    [
     `*Escoge el numero correcto* `,
     `🐵` ,
    ],
      { capture: true },
      async (ctx, { state,gotoFlow,fallBack }) => {
        if(ctx.body== '1'){
          ctx.body="Transporte interno"
          state.update({ Subconjunto: ctx.body });
          return gotoFlow(flowEscrito);
        }else{
          if(ctx.body== '2'){
            ctx.body="Volteador embalajes"
            state.update({ Subconjunto: ctx.body });
            return gotoFlow(flowEscrito);
          }else{
            if(ctx.body =='3'){
              ctx.body="Selector de vias"
              state.update({ Subconjunto: ctx.body });
              return gotoFlow(flowEscrito);
            }else{
              if(ctx.body =='4'){
                ctx.body="Motor-transmision"
                state.update({ Subconjunto: ctx.body });
                return gotoFlow(flowEscrito);
              }else{
                if(ctx.body =='5'){
                  ctx.body="Banda de entrada"
                  state.update({ Subconjunto: ctx.body });
                  return gotoFlow(flowEscrito);
                }else{
                  if(ctx.body =='6'){
                    ctx.body="Sistema neumatico"
                    state.update({ Subconjunto: ctx.body });
                    return gotoFlow(flowEscrito);
                  }else{
              if(ctx.body=='M2'){
                return gotoFlow(flowcedula);
              }else{
                if(ctx.body=='m2'){
                  return gotoFlow(flowcedula);
                }else{
                  return fallBack();
                }
              }
            }
          }
        }
      }}}});


      const flowL1Viasentradas = bot
    .addKeyword(bot.EVENTS.ACTION)
    .addAnswer(
      [
        `Escoge el numero correspondiente al subconjunto de las vias entrada embalajes!👓`,
        `*1* Via entrada #1`,
        `*2* Via entrada #2`,
      ])
    .addAnswer(
    [
     `*Escoge el numero correcto* `,
     `🐵` ,
    ],
      { capture: true },
      async (ctx, { state,gotoFlow,fallBack }) => {
        if(ctx.body== '1'){
          ctx.body="Via entrada #1"
          state.update({ Subconjunto: ctx.body });
          return gotoFlow(flowEscrito);
        }else{
          if(ctx.body== '2'){
            ctx.body="Via entrada #2"
            state.update({ Subconjunto: ctx.body });
            return gotoFlow(flowEscrito);
          }else{
              if(ctx.body=='M2'){
                return gotoFlow(flowcedula);
              }else{
                if(ctx.body=='m2'){
                  return gotoFlow(flowcedula);
                }else{
                  return fallBack();
                }
              }
            }
          }
        });

const flowL1Mesaagrupamiento = bot
    .addKeyword(bot.EVENTS.ACTION)
    .addAnswer(
      [
        `Escoge el numero correspondiente al subconjunto de la mesa de agrupamiento!👓`,
        `*1* Transporte por rodillos`,
        `*2* Motores-transmisiones`,
        `*3* Chapas bloqueadoras`,
        `*4* Sistema neumatico`,
        `*5* Guias laterales ajuste`,
        `*6* Empujador de filas`,
      ])
    .addAnswer(
    [
     `*Escoge el numero correcto* `,
     `🐵` ,
    ],
      { capture: true },
      async (ctx, { state,gotoFlow,fallBack }) => {
        if(ctx.body== '1'){
          ctx.body="Transporte por rodillos"
          state.update({ Subconjunto: ctx.body });
          return gotoFlow(flowEscrito);
        }else{
          if(ctx.body== '2'){
            ctx.body="Motores-transmisiones"
            state.update({ Subconjunto: ctx.body });
            return gotoFlow(flowEscrito);
          }else{
            if(ctx.body =='3'){
              ctx.body="Chapas bloqueadoras"
              state.update({ Subconjunto: ctx.body });
              return gotoFlow(flowEscrito);
            }else{
              if(ctx.body =='4'){
                ctx.body="Sistema neumatico"
                state.update({ Subconjunto: ctx.body });
                return gotoFlow(flowEscrito);
              }else{
                if(ctx.body =='5'){
                  ctx.body="Guias laterales ajuste"
                  state.update({ Subconjunto: ctx.body });
                  return gotoFlow(flowEscrito);
                }else{
                  if(ctx.body =='6'){
                    ctx.body="Empujador de filas"
                    state.update({ Subconjunto: ctx.body });
                    return gotoFlow(flowEscrito);
                  }else{
              if(ctx.body=='M2'){
                return gotoFlow(flowcedula);
              }else{
                if(ctx.body=='m2'){
                  return gotoFlow(flowcedula);
                }else{
                  return fallBack();
                }
              }
            }
          }
        }
      }}}});

const flowL1conjuntoE = bot
    .addKeyword(bot.EVENTS.ACTION)
    .addAnswer(
      [
        `Escoge el numero correspondiente al subconjunto del conjunto elevador!👓`,
        `*1* Carro cargador`,
        `*2* Empujador de capas`,
        `*3* Centradores de capas`,
        `*4* Correas de elevacion`,
      ])
    .addAnswer(
    [
     `*Escoge el numero correcto* `,
     `🐵` ,
    ],
      { capture: true },
      async (ctx, { state,gotoFlow,fallBack }) => {
        if(ctx.body== '1'){
          ctx.body="Carro cargador"
          state.update({ Subconjunto: ctx.body });
          return gotoFlow(flowEscrito);
        }else{
          if(ctx.body== '2'){
            ctx.body="Empujador de capas"
            state.update({ Subconjunto: ctx.body });
            return gotoFlow(flowEscrito);
          }else{
            if(ctx.body =='3'){
              ctx.body="Centradores de capas"
              state.update({ Subconjunto: ctx.body });
              return gotoFlow(flowEscrito);
            }else{
              if(ctx.body =='4'){
                ctx.body="Correas elevacion"
                state.update({ Subconjunto: ctx.body });
                return gotoFlow(flowEscrito);
              }else{
              if(ctx.body=='M2'){
                return gotoFlow(flowcedula);
              }else{
                if(ctx.body=='m2'){
                  return gotoFlow(flowcedula);
                }else{
                  return fallBack();
                }
              }
            }
          }
        }
      }});

const flowL1Aplicador = bot
    .addKeyword(bot.EVENTS.ACTION)
    .addAnswer(
      [
        `Escoge el numero correspondiente al subconjunto del aplicador de carton (Araña)!👓`,
        `*1* Motor-transmision-correa`,
        `*2* Conjunto de vacio`,
        `*3* Sistema neumatico`,
        `*4* Almacen de carton`,
      ])
    .addAnswer(
    [
     `*Escoge el numero correcto* `,
     `🐵` ,
    ],
      { capture: true },
      async (ctx, { state,gotoFlow,fallBack }) => {
        if(ctx.body== '1'){
          ctx.body="Motor-transmision-correa"
          state.update({ Subconjunto: ctx.body });
          return gotoFlow(flowEscrito);
        }else{
          if(ctx.body== '2'){
            ctx.body="Conjunto de vacio"
            state.update({ Subconjunto: ctx.body });
            return gotoFlow(flowEscrito);
          }else{
            if(ctx.body =='3'){
              ctx.body="Sistema neumatico"
              state.update({ Subconjunto: ctx.body });
              return gotoFlow(flowEscrito);
            }else{
              if(ctx.body =='4'){
                ctx.body="Almacen de carton"
                state.update({ Subconjunto: ctx.body });
                return gotoFlow(flowEscrito);
              }else{
              if(ctx.body=='M2'){
                return gotoFlow(flowcedula);
              }else{
                if(ctx.body=='m2'){
                  return gotoFlow(flowcedula);
                }else{
                  return fallBack();
                }
              }
            }
          }
        }
      }});


      const flowL1ALMACEN = bot
    .addKeyword(bot.EVENTS.ACTION)
    .addAnswer(
      [
        `Escoge el numero correspondiente al conjunto del almacen de palets!👓`,
        `*1* Transporte de estibas`,
        `*2* Sensores`,
        `*3* Tablero electrico`,
        `*4* Mecanismo elevacion estibas`,
        `*5* Botonera`,
        `*6* Falla Humana`,
        `*7* Materia prima`,

      ])
    .addAnswer(
    [
     `*Escoge el numero correcto* `,
     `🐵` ,
    ],
      { capture: true },
      async (ctx, { state,gotoFlow,fallBack }) => {
        if(ctx.body=='1'){
          ctx.body="Transporte de estibas"
          state.update({ Conjunto: ctx.body });
        return gotoFlow(flowL1CONJESTIBAS);
    }else{
        if(ctx.body=='2'){
          ctx.body="Sensores"
          state.update({ Conjunto: ctx.body, Subconjunto:"NA" });
          return gotoFlow(flowEscrito);
        }else{
          if(ctx.body=='3'){
            ctx.body="Tablero electrico"
            state.update({ Conjunto: ctx.body });
            return gotoFlow(flowL1tableroelectrico);
          }else{
            if(ctx.body=='4'){
              ctx.body="Mecanismo elevacion estibas"
              state.update({ Conjunto: ctx.body });
              return gotoFlow(flowL1CONJMECANISMO);
            }else{
              if(ctx.body=='5'){
                ctx.body="Botonera"
                state.update({ Conjunto: ctx.body, Subconjunto:"NA"});
                return gotoFlow(flowEscrito);} 
                else{
                  if(ctx.body=='6'){
                ctx.body="Falla Humana"
                state.update({ Conjunto: ctx.body, Subconjunto: "NA" });
                return gotoFlow(flowEscrito);} 
                else{
                   if(ctx.body=='7'){
                ctx.body="Materia prima"
                state.update({ Conjunto: ctx.body, Subconjunto: "NA" });
                return gotoFlow(flowEscrito);} 
                else{

                  if(ctx.body=='M2'){
                    return gotoFlow(flowcedula);
                  }else{
                    if(ctx.body=='m2'){
                      return gotoFlow(flowcedula);
                    }else{
                      return fallBack();
                    }
                  }
                }
                }
                }
                }
              }
            }
          }}
    );

const flowL1CONJESTIBAS = bot
    .addKeyword(bot.EVENTS.ACTION)
    .addAnswer(
      [
        `Escoge el numero correspondiente al subconjunto de transporte de estibas!👓`,
        `*1* Motor-transmision`,
        `*2* Rodillos`,
      ])
    .addAnswer(
    [
     `*Escoge el numero correcto* `,
     `🐵` ,
    ],
      { capture: true },
      async (ctx, { state,gotoFlow,fallBack }) => {
        if(ctx.body== '1'){
          ctx.body="Motor-transmision"
          state.update({ Subconjunto: ctx.body });
          return gotoFlow(flowEscrito);
        }else{
          if(ctx.body== '2'){
            ctx.body="Rodillos"
            state.update({ Subconjunto: ctx.body });
            return gotoFlow(flowEscrito);
          }else{
              if(ctx.body=='M2'){
                return gotoFlow(flowcedula);
              }else{
                if(ctx.body=='m2'){
                  return gotoFlow(flowcedula);
                }else{
                  return fallBack();
                }
              }
            }
          }
        });

        const flowL1CONJMECANISMO = bot
    .addKeyword(bot.EVENTS.ACTION)
    .addAnswer(
      [
        `Escoge el numero correspondiente al subconjunto mecanismo elevacion estibas!👓`,
        `*1* Motores-transmisiones`,
        `*2* Cadenas elevacion`,
        `*3* Uñas elevacion`,
      ])
    .addAnswer(
    [
     `*Escoge el numero correcto* `,
     `🐵` ,
    ],
      { capture: true },
      async (ctx, { state,gotoFlow,fallBack }) => {
        if(ctx.body== '1'){
          ctx.body="Motores-transmisiones"
          state.update({ Subconjunto: ctx.body });
          return gotoFlow(flowEscrito);
        }else{
          if(ctx.body== '2'){
            ctx.body="Cadenas elevacion"
            state.update({ Subconjunto: ctx.body });
            return gotoFlow(flowEscrito);
          }else{
            if(ctx.body== '3'){
            ctx.body="Uñas elevacion"
            state.update({ Subconjunto: ctx.body });
            return gotoFlow(flowEscrito);
          }else{
              if(ctx.body=='M2'){
                return gotoFlow(flowcedula);
              }else{
                if(ctx.body=='m2'){
                  return gotoFlow(flowcedula);
                }else{
                  return fallBack();
                }
              }
            }
          }
        }});



          const flowL1PROCESADOR = bot
    .addKeyword(bot.EVENTS.ACTION)
    .addAnswer(
      [
        `Escoge el numero correspondiente al conjunto del procesador de bebida!👓`,
        `*1* Motores-bomba`,
        `*2* Valvulas`,
        `*3* Sensores`,
        `*4* Tanques`,
        `*5* Tablero electrico`,
        `*6* Falla Humana`,
        `*7* Materia prima`,

      ])
    .addAnswer(
    [
     `*Escoge el numero correcto* `,
     `🐵` ,
    ],
      { capture: true },
      async (ctx, { state,gotoFlow,fallBack }) => {
        if(ctx.body=='1'){
          ctx.body="Motores-bomba"
          state.update({ Conjunto: ctx.body });
        return gotoFlow(flowEscrito);
    }else{
        if(ctx.body=='2'){
          ctx.body="Valvulas"
          state.update({ Conjunto: ctx.body });
          return gotoFlow(flowEscrito);
        }else{
          if(ctx.body=='3'){
            ctx.body="Sensores"
            state.update({ Conjunto: ctx.body });
            return gotoFlow(flowEscrito);
          }else{
            if(ctx.body=='4'){
              ctx.body="Tanques"
              state.update({ Conjunto: ctx.body });
              return gotoFlow(flowL1tanques);
            }else{
              if(ctx.body=='5'){
                ctx.body="Tablero electrico"
                state.update({ Conjunto: ctx.body });
                return gotoFlow(flowL1TABLEROELECTRICOL1);} 
                else{
                  if(ctx.body=='6'){
                ctx.body="Falla Humana"
                state.update({ Conjunto: ctx.body, Subconjunto: "NA" });
                return gotoFlow(flowEscrito);} 
                else{
                  if(ctx.body=='7'){
                ctx.body="Materia prima"
                state.update({ Conjunto: ctx.body, Subconjunto: "NA" });
                return gotoFlow(flowEscrito);} 
                else{

                  if(ctx.body=='M2'){
                    return gotoFlow(flowcedula);
                  }else{
                    if(ctx.body=='m2'){
                      return gotoFlow(flowcedula);
                    }else{
                      return fallBack();
                    }
                  }
                }
                }
                }
                }
              }
            }
          }}
    );

const flowL1tanques = bot
    .addKeyword(bot.EVENTS.ACTION)
    .addAnswer(
      [
        `Escoge el numero correspondiente al subconjunto de Tanques!👓`,
        `*1* Tanque de agua`,
        `*2* Tanque de producto`,
        `*3* Recipiente de jarabe`,
      ])
    .addAnswer(
    [
     `*Escoge el numero correcto* `,
     `🐵` ,
    ],
      { capture: true },
      async (ctx, { state,gotoFlow,fallBack }) => {
        if(ctx.body== '1'){
          ctx.body="Tanque de agua"
          state.update({ Subconjunto: ctx.body });
          return gotoFlow(flowEscrito);
        }else{
          if(ctx.body== '2'){
            ctx.body="Tanque de producto"
            state.update({ Subconjunto: ctx.body });
            return gotoFlow(flowEscrito);
          }else{
            if(ctx.body =='3'){
              ctx.body="Recipiente de jarabe"
              state.update({ Subconjunto: ctx.body });
              return gotoFlow(flowEscrito);
            }else{
              if(ctx.body=='M2'){
                return gotoFlow(flowcedula);
              }else{
                if(ctx.body=='m2'){
                  return gotoFlow(flowcedula);
                }else{
                  return fallBack();
                }
              }
            }
          }
        }
      });


      const flowL1TABLEROELECTRICOL1 = bot
    .addKeyword(bot.EVENTS.ACTION)
    .addAnswer(
      [
        `Escoge el numero correspondiente al subconjunto de Tablero electrico!👓`,
        `*1* Pantalla`,
        `*2* PLC`,
        `*3* Red comunicacion`,
      ])
    .addAnswer(
    [
     `*Escoge el numero correcto* `,
     `🐵` ,
    ],
      { capture: true },
      async (ctx, { state,gotoFlow,fallBack }) => {
        if(ctx.body== '1'){
          ctx.body="Pantalla"
          state.update({ Subconjunto: ctx.body });
          return gotoFlow(flowEscrito);
        }else{
          if(ctx.body== '2'){
            ctx.body="PLC"
            state.update({ Subconjunto: ctx.body });
            return gotoFlow(flowEscrito);
          }else{
            if(ctx.body =='3'){
              ctx.body="Red comunicacion"
              state.update({ Subconjunto: ctx.body });
              return gotoFlow(flowEscrito);
            }else{
              if(ctx.body=='M2'){
                return gotoFlow(flowcedula);
              }else{
                if(ctx.body=='m2'){
                  return gotoFlow(flowcedula);
                }else{
                  return fallBack();
                }
              }
            }
          }
        }
      });


        const flowL1HORNOVARIOPAC = bot
    .addKeyword(bot.EVENTS.ACTION)
    .addAnswer(
      [
        `Escoge el numero correspondiente al conjunto del horno embandejadora variopac!👓`,
        `*1* Zona calentamiento 1`,
        `*2* Zona calentamiento 2`,
        `*3* Tablero electrico`,
        `*4* Transporte malla`,
        `*5* Ventiladores salida`,
        `*6* Mesa transporte salida`,
        `*7* Sistema neumatico`,
        `*8* Sistema lubricacion`,
        `*9* Sensores`,
        `*10* Materia prima`,
        `*11* Falla Humana`,

      ])
    .addAnswer(
    [
     `*Escoge el numero correcto* `,
     `🐵` ,
    ],
      { capture: true },
      async (ctx, { state,gotoFlow,fallBack }) => {
        if(ctx.body=='1'){
          ctx.body="Zona calentamiento 1"
          state.update({ Conjunto: ctx.body });
        return gotoFlow(flowL1CONJZONA1);
    }else{
        if(ctx.body=='2'){
          ctx.body="Zona calentamiento 2"
          state.update({ Conjunto: ctx.body });
          return gotoFlow(flowL1CONJZONA1);
        }else{
          if(ctx.body=='3'){
            ctx.body="Tablero electrico"
            state.update({ Conjunto: ctx.body });
            return gotoFlow(flowL1CONJTABLEROL1);
          }else{
            if(ctx.body=='4'){
              ctx.body="Transporte malla"
              state.update({ Conjunto: ctx.body });
              return gotoFlow(flowL1TRANSPORTEMALLA);
            }else{
              if(ctx.body=='5'){
                ctx.body="Ventiladores salida"
                state.update({ Conjunto: ctx.body });
                return gotoFlow(flowL1VENTILADORES);} 
                else{
                  if(ctx.body=='6'){
                ctx.body="Mesa transporte salida"
                state.update({ Conjunto: ctx.body });
                return gotoFlow(flowL1SALIDA);} 
                else{
                   if(ctx.body=='7'){
                ctx.body="Sistema neumatico"
                state.update({ Conjunto: ctx.body, Subconjunto: "NA" });
                return gotoFlow(flowEscrito);} 
                else{
                   if(ctx.body=='8'){
                ctx.body="Sistema lubricacion"
                state.update({ Conjunto: ctx.body, Subconjunto: "NA" });
                return gotoFlow(flowEscrito);} 
                else{
                   if(ctx.body=='9'){
                ctx.body="Sensores"
                state.update({ Conjunto: ctx.body, Subconjunto: "NA" });
                return gotoFlow(flowEscrito);} 
                else{
                   if(ctx.body=='10'){
                ctx.body="Materia prima"
                state.update({ Conjunto: ctx.body, Subconjunto: "NA" });
                return gotoFlow(flowEscrito);} 
                else{
                  if(ctx.body=='11'){
                ctx.body="Falla Humana"
                state.update({ Conjunto: ctx.body, Subconjunto: "NA" });
                return gotoFlow(flowEscrito);} 
                else{

                  if(ctx.body=='M2'){
                    return gotoFlow(flowcedula);
                  }else{
                    if(ctx.body=='m2'){
                      return gotoFlow(flowcedula);
                    }else{
                      return fallBack();
                    }
                  }
                }
                }
                }
                }
              }
            }
          }}}}}}
    );

const flowL1CONJZONA1 = bot
    .addKeyword(bot.EVENTS.ACTION)
    .addAnswer(
      [
        `Escoge el numero correspondiente al subconjunto de Zona de calentamiento!👓`,
        `*1* Resistencias`,
        `*2* Sopladores`,
        `*3* Aislamiento termico`,
        `*4* Reguladores Damper`,
      ])
    .addAnswer(
    [
     `*Escoge el numero correcto* `,
     `🐵` ,
    ],
      { capture: true },
      async (ctx, { state,gotoFlow,fallBack }) => {
        if(ctx.body== '1'){
          ctx.body="Resistencias"
          state.update({ Subconjunto: ctx.body });
          return gotoFlow(flowEscrito);
        }else{
          if(ctx.body== '2'){
            ctx.body="Sopladores"
            state.update({ Subconjunto: ctx.body });
            return gotoFlow(flowEscrito);
          }else{
            if(ctx.body =='3'){
              ctx.body="Aislamiento termico"
              state.update({ Subconjunto: ctx.body });
              return gotoFlow(flowEscrito);
            }else{
              if(ctx.body =='4'){
                ctx.body="Reguladores Damper"
                state.update({ Subconjunto: ctx.body });
                return gotoFlow(flowEscrito);
              }else{
              if(ctx.body=='M2'){
                return gotoFlow(flowcedula);
              }else{
                if(ctx.body=='m2'){
                  return gotoFlow(flowcedula);
                }else{
                  return fallBack();
                }
              }
            }
          }
        }
      }});


        const flowL1EMBALAJES = bot
    .addKeyword(bot.EVENTS.ACTION)
    .addAnswer(
      [
        `Escoge el numero correspondiente al conjunto del transportador de embalajes!👓`,
        `*1* Bandas de transporte`,
        `*2* Tablero electrico`,
        `*3* Sensores`,
        `*4* Falla Humana`,

      ])
    .addAnswer(
    [
     `*Escoge el numero correcto* `,
     `🐵` ,
    ],
      { capture: true },
      async (ctx, { state,gotoFlow,fallBack }) => {
        if(ctx.body=='1'){
          ctx.body="Bandas de transporte"
          state.update({ Conjunto: ctx.body });
        return gotoFlow(flowL1CONJbandas);
    }else{
        if(ctx.body=='2'){
          ctx.body="Tablero electrico"
          state.update({ Conjunto: ctx.body });
          return gotoFlow(flowL1tableroelectrico);
        }else{
          if(ctx.body=='3'){
            ctx.body="Sensores"
            state.update({ Conjunto: ctx.body, Subconjunto:"NA" });
            return gotoFlow(flowEscrito);
          }else{
            if(ctx.body=='4'){
              ctx.body="Falla Humana"
              state.update({ Conjunto: ctx.body, Subconjunto:"NA" });
              return gotoFlow(flowEscrito);
            }else{
              if(ctx.body=='5'){
                ctx.body="Ventiladores salida"
                state.update({ Conjunto: ctx.body });
                return gotoFlow(flowL1VENTILADORES);} 
                else{
                  if(ctx.body=='6'){
                ctx.body="Mesa transporte salida"
                state.update({ Conjunto: ctx.body });
                return gotoFlow(flowL1SALIDA);} 
                else{
                   if(ctx.body=='7'){
                ctx.body="Sistema neumatico"
                state.update({ Conjunto: ctx.body, Subconjunto: "NA" });
                return gotoFlow(flowEscrito);} 
                else{
                   if(ctx.body=='8'){
                ctx.body="Sistema lubricacion"
                state.update({ Conjunto: ctx.body, Subconjunto: "NA" });
                return gotoFlow(flowEscrito);} 
                else{
                   if(ctx.body=='9'){
                ctx.body="Sensores"
                state.update({ Conjunto: ctx.body, Subconjunto: "NA" });
                return gotoFlow(flowEscrito);} 
                else{
                   if(ctx.body=='10'){
                ctx.body="Materia prima"
                state.update({ Conjunto: ctx.body, Subconjunto: "NA" });
                return gotoFlow(flowEscrito);} 
                else{
                  if(ctx.body=='11'){
                ctx.body="Falla Humana"
                state.update({ Conjunto: ctx.body, Subconjunto: "NA" });
                return gotoFlow(flowEscrito);} 
                else{

                  if(ctx.body=='M2'){
                    return gotoFlow(flowcedula);
                  }else{
                    if(ctx.body=='m2'){
                      return gotoFlow(flowcedula);
                    }else{
                      return fallBack();
                    }
                  }
                }
                }
                }
                }
              }
            }
          }}}}}}
    );




    const flowL1TRANSPORTADOR = bot
    .addKeyword(bot.EVENTS.ACTION)
    .addAnswer(
      [
        `Escoge el numero correspondiente al conjunto del transportador de envase!👓`,
        `*1* Flowliner`,
        `*2* Bandas de transporte`,
        `*3* Tablero electrico`,
        `*4* Sistema lubricacion bandas`,
        `*5* Sensores`,
        `*6* Falla Humana`,

      ])
    .addAnswer(
    [
     `*Escoge el numero correcto* `,
     `🐵` ,
    ],
      { capture: true },
      async (ctx, { state,gotoFlow,fallBack }) => {
        if(ctx.body=='1'){
          ctx.body="Flowliner"
          state.update({ Conjunto: ctx.body });
        return gotoFlow(flowL1CONJflowliner);
    }else{
        if(ctx.body=='2'){
          ctx.body="Bandas de transporte"
          state.update({ Conjunto: ctx.body });
          return gotoFlow(flowL1CONJbandas);
        }else{
          if(ctx.body=='3'){
            ctx.body="Tablero electrico"
            state.update({ Conjunto: ctx.body });
            return gotoFlow(flowL1tableroelectrico);
          }else{
            if(ctx.body=='4'){
              ctx.body="Sistema lubricacion bandas"
              state.update({ Conjunto: ctx.body, Subconjunto:"NA" });
              return gotoFlow(flowEscrito);
            }else{
              if(ctx.body=='5'){
                ctx.body="Sensores"
                state.update({ Conjunto: ctx.body, Subconjunto:"NA" });
                return gotoFlow(flowEscrito);} 
                else{
                  if(ctx.body=='6'){
                ctx.body="Falla Humana"
                state.update({ Conjunto: ctx.body, Subconjunto:"NA" });
                return gotoFlow(flowEscrito);} 
                else{

                  if(ctx.body=='M2'){
                    return gotoFlow(flowcedula);
                  }else{
                    if(ctx.body=='m2'){
                      return gotoFlow(flowcedula);
                    }else{
                      return fallBack();
                    }
                  }
                }
                }
                }
                }
              }
            }
          }
    );

const flowL1CONJflowliner = bot
    .addKeyword(bot.EVENTS.ACTION)
    .addAnswer(
      [
        `Escoge el numero correspondiente al subconjunto del Flowliner!👓`,
        `*1* Bandas tipo oruga`,
        `*2* Motores`,
        `*3* Transmision`,
      ])
    .addAnswer(
    [
     `*Escoge el numero correcto* `,
     `🐵` ,
    ],
      { capture: true },
      async (ctx, { state,gotoFlow,fallBack }) => {
        if(ctx.body== '1'){
          ctx.body="Bandas tipo oruga"
          state.update({ Subconjunto: ctx.body });
          return gotoFlow(flowEscrito);
        }else{
          if(ctx.body== '2'){
            ctx.body="Motores"
            state.update({ Subconjunto: ctx.body });
            return gotoFlow(flowEscrito);
          }else{
            if(ctx.body =='3'){
              ctx.body="Transmision"
              state.update({ Subconjunto: ctx.body });
              return gotoFlow(flowEscrito);
            }else{
              if(ctx.body=='M2'){
                return gotoFlow(flowcedula);
              }else{
                if(ctx.body=='m2'){
                  return gotoFlow(flowcedula);
                }else{
                  return fallBack();
                }
              }
            }
          }
        }
      });

      const flowL1CONJbandas = bot
    .addKeyword(bot.EVENTS.ACTION)
    .addAnswer(
      [
        `Escoge el numero correspondiente al subconjunto de bandas de transporte!👓`,
        `*1* Motor-reductor`,
        `*2* Banda de botellas`,
        `*3* Eje-piñones`,
        `*4* Guias de deslizamiento`,
        `*5* Rodillos`,
      ])
    .addAnswer(
    [
     `*Escoge el numero correcto* `,
     `🐵` ,
    ],
      { capture: true },
      async (ctx, { state,gotoFlow,fallBack }) => {
        if(ctx.body== '1'){
          ctx.body="Motor-reductor"
          state.update({ Subconjunto: ctx.body });
          return gotoFlow(flowEscrito);
        }else{
          if(ctx.body== '2'){
            ctx.body="Banda de botellas"
            state.update({ Subconjunto: ctx.body });
            return gotoFlow(flowEscrito);
          }else{
            if(ctx.body =='3'){
              ctx.body="Eje-piñones"
              state.update({ Subconjunto: ctx.body });
              return gotoFlow(flowEscrito);
            }else{
               if(ctx.body =='4'){
              ctx.body="Guias de deslizamiento"
              state.update({ Subconjunto: ctx.body });
              return gotoFlow(flowEscrito);
            }else{
               if(ctx.body =='5'){
              ctx.body="Rodillos"
              state.update({ Subconjunto: ctx.body });
              return gotoFlow(flowEscrito);
            }else{
              if(ctx.body=='M2'){
                return gotoFlow(flowcedula);
              }else{
                if(ctx.body=='m2'){
                  return gotoFlow(flowcedula);
                }else{
                  return fallBack();
                }
              }
            }
          }
        }
      }}});

      const flowL1tableroelectrico = bot
    .addKeyword(bot.EVENTS.ACTION)
    .addAnswer(
      [
        `Escoge el numero correspondiente al subconjunto del tablero electrico!👓`,
        `*1* Pantalla`,
        `*2* PLC`,
        `*3* Red comunicacion`,
        `*4* Variadores`,
      ])
    .addAnswer(
    [
     `*Escoge el numero correcto* `,
     `🐵` ,
    ],
      { capture: true },
      async (ctx, { state,gotoFlow,fallBack }) => {
        if(ctx.body== '1'){
          ctx.body="Pantalla"
          state.update({ Subconjunto: ctx.body });
          return gotoFlow(flowEscrito);
        }else{
          if(ctx.body== '2'){
            ctx.body="PLC"
            state.update({ Subconjunto: ctx.body });
            return gotoFlow(flowEscrito);
          }else{
            if(ctx.body =='3'){
              ctx.body="Red comunicacion"
              state.update({ Subconjunto: ctx.body });
              return gotoFlow(flowEscrito);
            }else{
               if(ctx.body =='4'){
              ctx.body="Variadores"
              state.update({ Subconjunto: ctx.body });
              return gotoFlow(flowEscrito);
            }else{
              if(ctx.body=='M2'){
                return gotoFlow(flowcedula);
              }else{
                if(ctx.body=='m2'){
                  return gotoFlow(flowcedula);
                }else{
                  return fallBack();
                }
              }
            }
          }
        }
      }});

      const flowL1CONJTABLEROL1 = bot
    .addKeyword(bot.EVENTS.ACTION)
    .addAnswer(
      [
        `Escoge el numero correspondiente al subconjunto del tablero electrico!👓`,
        `*1* Pantalla`,
        `*2* PLC`,
        `*3* Red comunicacion`,
        `*4* Contactores`,
        `*5* Reles estado solido`,
        `*6* Variadores`,
      ])
    .addAnswer(
    [
     `*Escoge el numero correcto* `,
     `🐵` ,
    ],
      { capture: true },
      async (ctx, { state,gotoFlow,fallBack }) => {
        if(ctx.body== '1'){
          ctx.body="Pantalla"
          state.update({ Subconjunto: ctx.body });
          return gotoFlow(flowEscrito);
        }else{
          if(ctx.body== '2'){
            ctx.body="PLC"
            state.update({ Subconjunto: ctx.body });
            return gotoFlow(flowEscrito);
          }else{
            if(ctx.body =='3'){
              ctx.body="Red comunicacion"
              state.update({ Subconjunto: ctx.body });
              return gotoFlow(flowEscrito);
            }else{
              if(ctx.body =='4'){
                ctx.body="Contactores"
                state.update({ Subconjunto: ctx.body });
                return gotoFlow(flowEscrito);
              }else{
                 if(ctx.body =='5'){
                ctx.body="Reles estado solido"
                state.update({ Subconjunto: ctx.body });
                return gotoFlow(flowEscrito);
              }else{
                 if(ctx.body =='6'){
                ctx.body="Variadores"
                state.update({ Subconjunto: ctx.body });
                return gotoFlow(flowEscrito);
              }else{
              if(ctx.body=='M2'){
                return gotoFlow(flowcedula);
              }else{
                if(ctx.body=='m2'){
                  return gotoFlow(flowcedula);
                }else{
                  return fallBack();
                }
              }
            }
          }
        }
      }}}});

const flowL1TRANSPORTEMALLA = bot
    .addKeyword(bot.EVENTS.ACTION)
    .addAnswer(
      [
        `Escoge el numero correspondiente al subconjunto del transporte malla!👓`,
        `*1* Motor transmision`,
        `*2* Cadena Malla`,
      ])
    .addAnswer(
    [
     `*Escoge el numero correcto* `,
     `🐵` ,
    ],
      { capture: true },
      async (ctx, { state,gotoFlow,fallBack }) => {
        if(ctx.body== '1'){
          ctx.body="Motor transmision"
          state.update({ Subconjunto: ctx.body });
          return gotoFlow(flowEscrito);
        }else{
          if(ctx.body== '2'){
            ctx.body="Cadena Malla"
            state.update({ Subconjunto: ctx.body });
            return gotoFlow(flowEscrito);
          }else{
              if(ctx.body=='M2'){
                return gotoFlow(flowcedula);
              }else{
                if(ctx.body=='m2'){
                  return gotoFlow(flowcedula);
                }else{
                  return fallBack();
                }
              }
            }
          }
        }
        );

        const flowL1VENTILADORES = bot
    .addKeyword(bot.EVENTS.ACTION)
    .addAnswer(
      [
        `Escoge el numero correspondiente al subconjunto de ventiladores de salida!👓`,
        `*1* Ventilador 1`,
        `*2* Ventilador 2`,
      ])
    .addAnswer(
    [
     `*Escoge el numero correcto* `,
     `🐵` ,
    ],
      { capture: true },
      async (ctx, { state,gotoFlow,fallBack }) => {
        if(ctx.body== '1'){
          ctx.body="Ventilador 1"
          state.update({ Subconjunto: ctx.body });
          return gotoFlow(flowEscrito);
        }else{
          if(ctx.body== '2'){
            ctx.body="Ventilador 2"
            state.update({ Subconjunto: ctx.body });
            return gotoFlow(flowEscrito);
          }else{
              if(ctx.body=='M2'){
                return gotoFlow(flowcedula);
              }else{
                if(ctx.body=='m2'){
                  return gotoFlow(flowcedula);
                }else{
                  return fallBack();
                }
              }
            }
          }
        });

        const flowL1SALIDA = bot
    .addKeyword(bot.EVENTS.ACTION)
    .addAnswer(
      [
        `Escoge el numero correspondiente al subconjunto de mesa transporte salida!👓`,
        `*1* Motor transmision`,
        `*2* Banda`,
        `*3* Rodillos`,
        `*4* Sistema nivelador`,
      ])
    .addAnswer(
    [
     `*Escoge el numero correcto* `,
     `🐵` ,
    ],
      { capture: true },
      async (ctx, { state,gotoFlow,fallBack }) => {
        if(ctx.body== '1'){
          ctx.body="Motor transmision"
          state.update({ Subconjunto: ctx.body });
          return gotoFlow(flowEscrito);
        }else{
          if(ctx.body== '2'){
            ctx.body="Banda"
            state.update({ Subconjunto: ctx.body });
            return gotoFlow(flowEscrito);
          }else{
            if(ctx.body =='3'){
              ctx.body="Rodillos"
              state.update({ Subconjunto: ctx.body });
              return gotoFlow(flowEscrito);
            }else{
              if(ctx.body =='4'){
                ctx.body="Sistema nivelador"
                state.update({ Subconjunto: ctx.body });
                return gotoFlow(flowEscrito);
              }else{
              if(ctx.body=='M2'){
                return gotoFlow(flowcedula);
              }else{
                if(ctx.body=='m2'){
                  return gotoFlow(flowcedula);
                }else{
                  return fallBack();
                }
              }
            }
          }
        }
      }});

        const flowL1EMBANDEJADORA = bot
    .addKeyword(bot.EVENTS.ACTION)
    .addAnswer(
      [
        `Escoge el numero correspondiente al conjunto de la embandejadora!👓`,
        `*1* Mesa entrada botellas`,
        `*2* Barras empuje de botellas entrada`,
        `*3* Sistema clasificador de botellas`,
        `*4* Guias separadoras`,
        `*5* Sensores`,
        `*6* Tablero electrico`,
        `*7* Mesa formado embalaje`,
        `*8* Mesa entrada horno`,
        `*9* Sistema de elevacion plastico`,
        `*10* Sistema de corte plastico`,
        `*11* Portabobinas plastico`,
        `*12* Falla Humana`,
        `*13* Materia prima`,

      ])
    .addAnswer(
    [
     `*Escoge el numero correcto* `,
     `🐵` ,
    ],
      { capture: true },
      async (ctx, { state,gotoFlow,fallBack }) => {
        if(ctx.body=='1'){
          ctx.body="Mesa entrada botellas"
          state.update({ Conjunto: ctx.body });
        return gotoFlow(flowL1CONJMESA);
    }else{
        if(ctx.body=='2'){
          ctx.body="Barras empuje de botellas entrada"
          state.update({ Conjunto: ctx.body });
          return gotoFlow(flowL1CONJBARRAS);
        }else{
          if(ctx.body=='3'){
            ctx.body="Sistema clasificador de botellas"
            state.update({ Conjunto: ctx.body });
            return gotoFlow(flowL1CONJCLASIFICADOR);
          }else{
            if(ctx.body=='4'){
              ctx.body="Guias separadoras"
              state.update({ Conjunto: ctx.body, Subconjunto:"NA" });
              return gotoFlow(flowEscrito);
            }else{
              if(ctx.body=='5'){
                ctx.body="Sensores"
                state.update({ Conjunto: ctx.body, Subconjunto:"NA" });
                return gotoFlow(flowEscrito);} 
                else{
                  if(ctx.body=='6'){
                ctx.body="Tablero electrico"
                state.update({ Conjunto: ctx.body});
                return gotoFlow(flowL1CONJELECTRICO);} 
                else{
                  if(ctx.body=='7'){
                ctx.body="Mesa formado embalaje"
                state.update({ Conjunto: ctx.body});
                return gotoFlow(flowL1CONJFORMADO);} 
                else{
                  if(ctx.body=='8'){
                ctx.body="Mesa entrada horno"
                state.update({ Conjunto: ctx.body });
                return gotoFlow(flowL1CONJENTRADA);} 
                else{
                  if(ctx.body=='9'){
                ctx.body="Sistema elevacion plastico"
                state.update({ Conjunto: ctx.body });
                return gotoFlow(flowL1CONJSISTEMA);} 
                else{
                  if(ctx.body=='10'){
                ctx.body="Sistema corte plastico"
                state.update({ Conjunto: ctx.body });
                return gotoFlow(flowL1CONJCORTE);} 
                else{
                  if(ctx.body=='11'){
                ctx.body="Portabobinas plastico"
                state.update({ Conjunto: ctx.body});
                return gotoFlow(flowL1CONJPORTABOBINAS);} 
                else{
                  if(ctx.body=='12'){
                ctx.body="Falla Humana"
                state.update({ Conjunto: ctx.body, Subconjunto: "NA" });
                return gotoFlow(flowEscrito);} 
                else{
                  if(ctx.body=='13'){
                ctx.body="Materia prima"
                state.update({ Conjunto: ctx.body, Subconjunto: "NA" });
                return gotoFlow(flowEscrito);} 
                else{

                  if(ctx.body=='M2'){
                    return gotoFlow(flowcedula);
                  }else{
                    if(ctx.body=='m2'){
                      return gotoFlow(flowcedula);
                    }else{
                      return fallBack();
                    }
                  }
                }
                }
                }
                }
              }
            }
          }}}}}}}}
    );

const flowL1CONJMESA = bot
    .addKeyword(bot.EVENTS.ACTION)
    .addAnswer(
      [
        `Escoge el numero correspondiente al subconjunto de la mesa entrada de botellas!👓`,
        `*1* Vibrador botellas`,
        `*2* Bandas de transporte`,
        `*3* Motor transmision`,
      ])
    .addAnswer(
    [
     `*Escoge el numero correcto* `,
     `🐵` ,
    ],
      { capture: true },
      async (ctx, { state,gotoFlow,fallBack }) => {
        if(ctx.body== '1'){
          ctx.body="Vibrador botellas"
          state.update({ Subconjunto: ctx.body });
          return gotoFlow(flowEscrito);
        }else{
          if(ctx.body== '2'){
            ctx.body="Bandas de transporte"
            state.update({ Subconjunto: ctx.body });
            return gotoFlow(flowEscrito);
          }else{
            if(ctx.body =='3'){
              ctx.body="Motor transmision"
              state.update({ Subconjunto: ctx.body });
              return gotoFlow(flowEscrito);
            }else{
              if(ctx.body=='M2'){
                return gotoFlow(flowcedula);
              }else{
                if(ctx.body=='m2'){
                  return gotoFlow(flowcedula);
                }else{
                  return fallBack();
                }
              }
            }
          }
        }
      });

      const flowL1CONJBARRAS = bot
    .addKeyword(bot.EVENTS.ACTION)
    .addAnswer(
      [
        `Escoge el numero correspondiente al subconjunto de barras de empuje!👓`,
        `*1* Motor transmision`,
        `*2* Cadena transmision`,
        `*3* Soporte barras`,
      ])
    .addAnswer(
    [
     `*Escoge el numero correcto* `,
     `🐵` ,
    ],
      { capture: true },
      async (ctx, { state,gotoFlow,fallBack }) => {
        if(ctx.body== '1'){
          ctx.body="Motor transmision"
          state.update({ Subconjunto: ctx.body });
          return gotoFlow(flowEscrito);
        }else{
          if(ctx.body== '2'){
            ctx.body="Cadena transmision"
            state.update({ Subconjunto: ctx.body });
            return gotoFlow(flowEscrito);
          }else{
            if(ctx.body =='3'){
              ctx.body="Soporte barras"
              state.update({ Subconjunto: ctx.body });
              return gotoFlow(flowEscrito);
            }else{
              if(ctx.body=='M2'){
                return gotoFlow(flowcedula);
              }else{
                if(ctx.body=='m2'){
                  return gotoFlow(flowcedula);
                }else{
                  return fallBack();
                }
              }
            }
          }
        }
      });

        const flowL1CONJCLASIFICADOR = bot
    .addKeyword(bot.EVENTS.ACTION)
    .addAnswer(
      [
        `Escoge el numero correspondiente al subconjunto de sistema de clasificador!👓`,
        `*1* Dedos clasificadores`,
        `*2* Servomotores`,
        `*3* Cadenas de botellas`,
        `*4* Cadenas de transmision`,
      ])
    .addAnswer(
    [
     `*Escoge el numero correcto* `,
     `🐵` ,
    ],
      { capture: true },
      async (ctx, { state,gotoFlow,fallBack }) => {
        if(ctx.body== '1'){
          ctx.body="Dedos clasificadores"
          state.update({ Subconjunto: ctx.body });
          return gotoFlow(flowEscrito);
        }else{
          if(ctx.body== '2'){
            ctx.body="Servomotores"
            state.update({ Subconjunto: ctx.body });
            return gotoFlow(flowEscrito);
          }else{
            if(ctx.body =='3'){
              ctx.body="Cadenas de botellas"
              state.update({ Subconjunto: ctx.body });
              return gotoFlow(flowEscrito);
            }else{
              if(ctx.body =='4'){
              ctx.body="Cadenas de transmision"
              state.update({ Subconjunto: ctx.body });
              return gotoFlow(flowEscrito);
            }else{
              if(ctx.body=='M2'){
                return gotoFlow(flowcedula);
              }else{
                if(ctx.body=='m2'){
                  return gotoFlow(flowcedula);
                }else{
                  return fallBack();
                }
              }
            }
          }
        }
      }});

       const flowL1CONJELECTRICO = bot
    .addKeyword(bot.EVENTS.ACTION)
    .addAnswer(
      [
        `Escoge el numero correspondiente al subconjunto del tablero electrico!👓`,
        `*1* Pantalla`,
        `*2* PLC`,
        `*3* Red comunicacion`,
        `*4* Controladores`,
      ])
    .addAnswer(
    [
     `*Escoge el numero correcto* `,
     `🐵` ,
    ],
      { capture: true },
      async (ctx, { state,gotoFlow,fallBack }) => {
        if(ctx.body== '1'){
          ctx.body="Pantalla"
          state.update({ Subconjunto: ctx.body });
          return gotoFlow(flowEscrito);
        }else{
          if(ctx.body== '2'){
            ctx.body="PLC"
            state.update({ Subconjunto: ctx.body });
            return gotoFlow(flowEscrito);
          }else{
            if(ctx.body =='3'){
              ctx.body="Red comunicacion"
              state.update({ Subconjunto: ctx.body });
              return gotoFlow(flowEscrito);
            }else{
              if(ctx.body =='4'){
              ctx.body="Controladores"
              state.update({ Subconjunto: ctx.body });
              return gotoFlow(flowEscrito);
            }else{
              if(ctx.body=='M2'){
                return gotoFlow(flowcedula);
              }else{
                if(ctx.body=='m2'){
                  return gotoFlow(flowcedula);
                }else{
                  return fallBack();
                }
              }
            }
          }
        }
      }});

       const flowL1CONJFORMADO = bot
    .addKeyword(bot.EVENTS.ACTION)
    .addAnswer(
      [
        `Escoge el numero correspondiente al subconjunto de la mesa de formado embalaje!👓`,
        `*1* Motor transmision`,
        `*2* Cadenas de barras plegadoras`,
        `*3* Banda`,
        `*4* Rodillos`,
        `*5* Sistema nivelador`,
      ])
    .addAnswer(
    [
     `*Escoge el numero correcto* `,
     `🐵` ,
    ],
      { capture: true },
      async (ctx, { state,gotoFlow,fallBack }) => {
        if(ctx.body== '1'){
          ctx.body="Motor transmision"
          state.update({ Subconjunto: ctx.body });
          return gotoFlow(flowEscrito);
        }else{
          if(ctx.body== '2'){
            ctx.body="Cadenas de barras plegadoras"
            state.update({ Subconjunto: ctx.body });
            return gotoFlow(flowEscrito);
          }else{
            if(ctx.body =='3'){
              ctx.body="Banda"
              state.update({ Subconjunto: ctx.body });
              return gotoFlow(flowEscrito);
            }else{
              if(ctx.body =='4'){
              ctx.body="Rodillos"
              state.update({ Subconjunto: ctx.body });
              return gotoFlow(flowEscrito);
            }else{
               if(ctx.body =='5'){
              ctx.body="Sistema nivelador"
              state.update({ Subconjunto: ctx.body });
              return gotoFlow(flowEscrito);
            }else{
              if(ctx.body=='M2'){
                return gotoFlow(flowcedula);
              }else{
                if(ctx.body=='m2'){
                  return gotoFlow(flowcedula);
                }else{
                  return fallBack();
                }
              }
            }
          }
        }
      }}});

        const flowL1CONJENTRADA = bot
    .addKeyword(bot.EVENTS.ACTION)
    .addAnswer(
      [
        `Escoge el numero correspondiente al subconjunto de la mesa entrada horno!👓`,
        `*1* Motor transmision`,
        `*2* Banda`,
        `*3* Rodillos`,
        `*4* Sistema nivelador`,
      ])
    .addAnswer(
    [
     `*Escoge el numero correcto* `,
     `🐵` ,
    ],
      { capture: true },
      async (ctx, { state,gotoFlow,fallBack }) => {
        if(ctx.body== '1'){
          ctx.body="Motor transmision"
          state.update({ Subconjunto: ctx.body });
          return gotoFlow(flowEscrito);
        }else{
          if(ctx.body== '2'){
            ctx.body="Banda"
            state.update({ Subconjunto: ctx.body });
            return gotoFlow(flowEscrito);
          }else{
              if(ctx.body =='3'){
              ctx.body="Rodillos"
              state.update({ Subconjunto: ctx.body });
              return gotoFlow(flowEscrito);
            }else{
               if(ctx.body =='4'){
              ctx.body="Sistema nivelador"
              state.update({ Subconjunto: ctx.body });
              return gotoFlow(flowEscrito);
            }else{
              if(ctx.body=='M2'){
                return gotoFlow(flowcedula);
              }else{
                if(ctx.body=='m2'){
                  return gotoFlow(flowcedula);
                }else{
                  return fallBack();
                }
              }
            }
          }
        }
      }});

         const flowL1CONJSISTEMA = bot
    .addKeyword(bot.EVENTS.ACTION)
    .addAnswer(
      [
        `Escoge el numero correspondiente al subconjunto del sistema de elevacion plastico!👓`,
        `*1* Bandas elevacion`,
        `*2* Rodillos`,
        `*3* Bomba vacio`,
        `*4* Transmision`,
        `*5* Servomotor`,
        `*6* Guia salida plastico`,
      ])
    .addAnswer(
    [
     `*Escoge el numero correcto* `,
     `🐵` ,
    ],
      { capture: true },
      async (ctx, { state,gotoFlow,fallBack }) => {
        if(ctx.body== '1'){
          ctx.body="Bandas elevacion"
          state.update({ Subconjunto: ctx.body });
          return gotoFlow(flowEscrito);
        }else{
          if(ctx.body== '2'){
            ctx.body="Rodillos"
            state.update({ Subconjunto: ctx.body });
            return gotoFlow(flowEscrito);
          }else{
              if(ctx.body =='3'){
              ctx.body="Bomba vacio"
              state.update({ Subconjunto: ctx.body });
              return gotoFlow(flowEscrito);
            }else{
               if(ctx.body =='4'){
              ctx.body="Transmision"
              state.update({ Subconjunto: ctx.body });
              return gotoFlow(flowEscrito);
            }else{
               if(ctx.body =='5'){
              ctx.body="Servomotor"
              state.update({ Subconjunto: ctx.body });
              return gotoFlow(flowEscrito);
            }else{
               if(ctx.body =='6'){
              ctx.body="Guia salida plastico"
              state.update({ Subconjunto: ctx.body });
              return gotoFlow(flowEscrito);
            }else{
              if(ctx.body=='M2'){
                return gotoFlow(flowcedula);
              }else{
                if(ctx.body=='m2'){
                  return gotoFlow(flowcedula);
                }else{
                  return fallBack();
                }
              }
            }
          }
        }
      }}}});

       const flowL1CONJCORTE = bot
    .addKeyword(bot.EVENTS.ACTION)
    .addAnswer(
      [
        `Escoge el numero correspondiente al subconjunto del sistema de corte plastico!👓`,
        `*1* Cuchilla`,
        `*2* Yunque`,
        `*3* Servomotor`,
        `*4* Transmision`,
        `*5* Rodillos`,
        `*6* Regulacion de presion`,
      ])
    .addAnswer(
    [
     `*Escoge el numero correcto* `,
     `🐵` ,
    ],
      { capture: true },
      async (ctx, { state,gotoFlow,fallBack }) => {
        if(ctx.body== '1'){
          ctx.body="Cuchilla"
          state.update({ Subconjunto: ctx.body });
          return gotoFlow(flowEscrito);
        }else{
          if(ctx.body== '2'){
            ctx.body="Yunque"
            state.update({ Subconjunto: ctx.body });
            return gotoFlow(flowEscrito);
          }else{
              if(ctx.body =='3'){
              ctx.body="Servomotor"
              state.update({ Subconjunto: ctx.body });
              return gotoFlow(flowEscrito);
            }else{
               if(ctx.body =='4'){
              ctx.body="Transmision"
              state.update({ Subconjunto: ctx.body });
              return gotoFlow(flowEscrito);
            }else{
               if(ctx.body =='5'){
              ctx.body="Rodillos"
              state.update({ Subconjunto: ctx.body });
              return gotoFlow(flowEscrito);
            }else{
               if(ctx.body =='6'){
              ctx.body="Regulacion de presion"
              state.update({ Subconjunto: ctx.body });
              return gotoFlow(flowEscrito);
            }else{
              if(ctx.body=='M2'){
                return gotoFlow(flowcedula);
              }else{
                if(ctx.body=='m2'){
                  return gotoFlow(flowcedula);
                }else{
                  return fallBack();
                }
              }
            }
          }
        }
      }}}});

       const flowL1CONJPORTABOBINAS = bot
    .addKeyword(bot.EVENTS.ACTION)
    .addAnswer(
      [
        `Escoge el numero correspondiente al subconjunto del portabobinas plastico!👓`,
        `*1* Portabobinas 1`,
        `*2* Portabobinas 2`,
        `*3* Modulo cambio automatico`,
      ])
    .addAnswer(
    [
     `*Escoge el numero correcto* `,
     `🐵` ,
    ],
      { capture: true },
      async (ctx, { state,gotoFlow,fallBack }) => {
        if(ctx.body== '1'){
          ctx.body="Portabobinas 1"
          state.update({ Subconjunto: ctx.body });
          return gotoFlow(flowEscrito);
        }else{
          if(ctx.body== '2'){
            ctx.body="Portabobinas 2"
            state.update({ Subconjunto: ctx.body });
            return gotoFlow(flowEscrito);
          }else{
              if(ctx.body =='3'){
              ctx.body="Modulo cambio automatico"
              state.update({ Subconjunto: ctx.body });
              return gotoFlow(flowEscrito);
            }else{
              if(ctx.body=='M2'){
                return gotoFlow(flowcedula);
              }else{
                if(ctx.body=='m2'){
                  return gotoFlow(flowcedula);
                }else{
                  return fallBack();
                }
              }
            }
          }
        }
      });


      const flowL1CONJTAPONADORA = bot
    .addKeyword(bot.EVENTS.ACTION)
    .addAnswer(
      [
        `Escoge el numero correspondiente al subconjunto de la taponadora!👓`,
        `*1* Media luna antigiro`,
        `*2* Transmision`,
        `*3* Tablero electrico`,
        `*4* Estrella de salida`,
        `*5* Juego cambio de formato`,
        `*6* Guias botellas`,
        `*7* Roscadores`,
        `*8* Sensores`,
        `*9* Disco selector tapa`,
      ])
    .addAnswer(
    [
     `*Escoge el numero correcto* `,
     `🐵` ,
    ],
      { capture: true },
      async (ctx, { state,gotoFlow,fallBack }) => {
        if(ctx.body== '1'){
          ctx.body="Media luna antigiro"
          state.update({ Subconjunto: ctx.body });
          return gotoFlow(flowEscrito);
        }else{
          if(ctx.body== '2'){
            ctx.body="Transmision"
            state.update({ Subconjunto: ctx.body });
            return gotoFlow(flowEscrito);
          }else{
            if(ctx.body =='3'){
              ctx.body="Tablero electrico"
              state.update({ Subconjunto: ctx.body });
              return gotoFlow(flowEscrito);
            }else{
              if(ctx.body =='4'){
                ctx.body="Estrella de salida"
                state.update({ Subconjunto: ctx.body });
                return gotoFlow(flowEscrito);
              }else{
                if(ctx.body =='5'){
                  ctx.body="Juego cambio de formato"
                  state.update({ Subconjunto: ctx.body });
                  return gotoFlow(flowEscrito);
                }else{
                  if(ctx.body =='6'){
                    ctx.body="Guias botellas"
                    state.update({ Subconjunto: ctx.body });
                    return gotoFlow(flowEscrito);
                  }else{
                    if(ctx.body =='7'){
                      ctx.body="Roscadores"
                      state.update({ Subconjunto: ctx.body });
                      return gotoFlow(flowEscrito);
                    }else{
                      if(ctx.body =='8'){
                        ctx.body="Sensores"
                        state.update({ Subconjunto: ctx.body });
                        return gotoFlow(flowEscrito);
                      }else{
                        if(ctx.body =='9'){
                          ctx.body="Disco selector tapa"
                          state.update({ Subconjunto: ctx.body });
                          return gotoFlow(flowEscrito);
                        }else{
              if(ctx.body=='M2'){
                return gotoFlow(flowcedula);
              }else{
                if(ctx.body=='m2'){
                  return gotoFlow(flowcedula);
                }else{
                  return fallBack();
                }
              }
            }
          }
        }
      }}}}}}});


      const flowL1CONJTRANSPORTADOR= bot
      .addKeyword(bot.EVENTS.ACTION)
      .addAnswer(
        [
          `Escoge el numero correspondiente al subconjunto del transportador de salida!👓`,
          `*1* Banda salida`,
          `*2* Motor-transmision`,
          `*3* Encoder`,
        ])
      .addAnswer(
      [
       `*Escoge el numero correcto* `,
       `🐵` ,
      ],
        { capture: true },
        async (ctx, { state,gotoFlow,fallBack }) => {
          if(ctx.body== '1'){
            ctx.body="Banda salida"
            state.update({ Subconjunto: ctx.body });
            return gotoFlow(flowEscrito);
          }else{
            if(ctx.body== '2'){
              ctx.body="Motor-transmision"
              state.update({ Subconjunto: ctx.body });
              return gotoFlow(flowEscrito);
            }else{
              if(ctx.body =='3'){
                ctx.body="Encoder"
                state.update({ Subconjunto: ctx.body });
                return gotoFlow(flowEscrito);
              }else{
                if(ctx.body=='M2'){
                  return gotoFlow(flowcedula);
                }else{
                  if(ctx.body=='m2'){
                    return gotoFlow(flowcedula);
                  }else{
                    return fallBack();
                  }
                }
              }
            }
          }
        });


        const flowL1CONJTABLERO= bot
        .addKeyword(bot.EVENTS.ACTION)
        .addAnswer(
          [
            `Escoge el numero correspondiente al subconjunto del tablero electrico!👓`,
            `*1* Pantalla`,
            `*2* Variadores`,
            `*3* Controladores`,
            `*4* Red comunicacion`,
            `*5* Control valvulas llenado KFS3`,
          ])
        .addAnswer(
        [
         `*Escoge el numero correcto* `,
         `🐵` ,
        ],
          { capture: true },
          async (ctx, { state,gotoFlow,fallBack }) => {
            if(ctx.body== '1'){
              ctx.body="Pantalla"
              state.update({ Subconjunto: ctx.body });
              return gotoFlow(flowEscrito);
            }else{
              if(ctx.body== '2'){
                ctx.body="Variadores"
                state.update({ Subconjunto: ctx.body });
                return gotoFlow(flowEscrito);
              }else{
                if(ctx.body =='3'){
                  ctx.body="Controladores"
                  state.update({ Subconjunto: ctx.body });
                  return gotoFlow(flowEscrito);
                }else{
                  if(ctx.body =='4'){
                    ctx.body="Red comunicacion"
                    state.update({ Subconjunto: ctx.body });
                    return gotoFlow(flowEscrito);
                  }else{
                    if(ctx.body =='5'){
                      ctx.body="Control valvulas llenado KFS3"
                      state.update({ Subconjunto: ctx.body });
                      return gotoFlow(flowEscrito);
                    }else{
                  if(ctx.body=='M2'){
                    return gotoFlow(flowcedula);
                  }else{
                    if(ctx.body=='m2'){
                      return gotoFlow(flowcedula);
                    }else{
                      return fallBack();
                    }
                  }
                }
              }
            }
          }}});
  
          const flowL1INSPECTOR = bot
          .addKeyword(bot.EVENTS.ACTION)
          .addAnswer(
            [
              `Escoge el numero correspondiente al conjunto del inspector de botella!👓`,
              `*1* Sensores`,
              `*2* Mecanismo elevacion ajuste`,
              `*3* Tablero electrico`,
      
            ])
          .addAnswer(
          [
           `*Escoge el numero correcto* `,
           `🐵` ,
          ],
            { capture: true },
            async (ctx, { state,gotoFlow,fallBack }) => {
              if(ctx.body=='1'){
                ctx.body="Sensores"
                state.update({ Conjunto: ctx.body });
              return gotoFlow(flowL1CONJSENSORES);
          }else{
              if(ctx.body=='2'){
                ctx.body="Mecanismo elevacion ajuste"
                state.update({ Conjunto: ctx.body, Subconjunto:"NA" });
                return gotoFlow(flowEscrito);
              }else{
                if(ctx.body=='3'){
                  ctx.body="Tablero electrico"
                  state.update({ Conjunto: ctx.body, Subconjunto:"NA" });
                  return gotoFlow(flowEscrito);
                }
                      else{
      
                        if(ctx.body=='M2'){
                          return gotoFlow(flowcedula);
                        }else{
                          if(ctx.body=='m2'){
                            return gotoFlow(flowcedula);
                          }else{
                            return fallBack();
                          }
                        }
                      }
                      }
                      }
                      }
          );
      
      const flowL1CONJSENSORES = bot
          .addKeyword(bot.EVENTS.ACTION)
          .addAnswer(
            [
              `Escoge el numero correspondiente al subconjunto de los sensores!👓`,
              `*1* Fotoceldas`,
              `*2* Sensores laser`,
              `*3* Sensor de nivel`,
            ])
          .addAnswer(
          [
           `*Escoge el numero correcto* `,
           `🐵` ,
          ],
            { capture: true },
            async (ctx, { state,gotoFlow,fallBack }) => {
              if(ctx.body== '1'){
                ctx.body="Fotoceldas"
                state.update({ Subconjunto: ctx.body });
                return gotoFlow(flowEscrito);
              }else{
                if(ctx.body== '2'){
                  ctx.body="Sensores laser"
                  state.update({ Subconjunto: ctx.body });
                  return gotoFlow(flowEscrito);
                }else{
                  if(ctx.body =='3'){
                    ctx.body="Sensor de nivel"
                    state.update({ Subconjunto: ctx.body });
                    return gotoFlow(flowEscrito);
                  }else{
                    if(ctx.body=='M2'){
                      return gotoFlow(flowcedula);
                    }else{
                      if(ctx.body=='m2'){
                        return gotoFlow(flowcedula);
                      }else{
                        return fallBack();
                      }
                    }
                  }
                }
              }
            });

            const flowL1ENJUAGADORA = bot
            .addKeyword(bot.EVENTS.ACTION)
            .addAnswer(
              [
                `Escoge el numero correspondiente al conjunto de la enjuagadora!👓`,
                `*1* Valvulas enjuage`,
                `*2* Estrella de entrada-salida`,
                `*3* Estrella dientes de sierra`,
                `*4* Motor`,
                `*5* Transmision`,
                `*6* Abridor cerrador de valvulas`,
                `*7* Pinzas plasticas enjuagadora`,
                `*8* Sensores`,
                `*9* Tablero electrico`,
                `*10* Tanque recoleccion agua`,
                `*11* Falla Humana`,
        
              ])
            .addAnswer(
            [
             `*Escoge el numero correcto* `,
             `🐵` ,
            ],
              { capture: true },
              async (ctx, { state,gotoFlow,fallBack }) => {
                if(ctx.body=='1'){
                  ctx.body="Valvulas enjuage"
                  state.update({ Conjunto: ctx.body, Subconjunto:"NA" });
                return gotoFlow(flowEscrito);
            }else{
                if(ctx.body=='2'){
                  ctx.body="Estrella entrada-salida"
                  state.update({ Conjunto: ctx.body, Subconjunto:"PINZAS-LEVAS" });
                  return gotoFlow(flowEscrito);
                }else{
                  if(ctx.body=='3'){
                    ctx.body="Estrella dientes de sierra"
                    state.update({ Conjunto: ctx.body, Subconjunto:"NA" });
                    return gotoFlow(flowEscrito);
                  }else{
                    if(ctx.body=='4'){
                      ctx.body="Motor"
                      state.update({ Conjunto: ctx.body,Subconjunto:"NA"});
                      return gotoFlow(flowEscrito);
                    }else{
                      if(ctx.body=='5'){
                        ctx.body="Transmision"
                        state.update({ Conjunto: ctx.body });
                        return gotoFlow(flowsubtransmision);} 
                        else{
                          if(ctx.body=='6'){
                        ctx.body="Abridor cerrador de valvulas"
                        state.update({ Conjunto: ctx.body });
                        return gotoFlow(flowsubabridor);} 
                        else{
                          if(ctx.body=='7'){
                            ctx.body="Pinzas plasticas enjuagadora"
                            state.update({ Conjunto: ctx.body, Subconjunto:"NA" });
                            return gotoFlow(flowEscrito);} 
                            else{
                              if(ctx.body=='8'){
                                ctx.body="Sensores"
                                state.update({ Conjunto: ctx.body, Subconjunto:"NA" });
                                return gotoFlow(flowEscrito);} 
                                else{
                                  if(ctx.body=='9'){
                                    ctx.body="Tablero electrico"
                                    state.update({ Conjunto: ctx.body, Subconjunto:"NA" });
                                    return gotoFlow(flowEscrito);} 
                                    else{
                                      if(ctx.body=='10'){
                                        ctx.body="Tanque recoleccion agua"
                                        state.update({ Conjunto: ctx.body, Subconjunto:"NA" });
                                        return gotoFlow(flowEscrito);} 
                                        else{
                                          if(ctx.body=='11'){
                                            ctx.body="Falla Humana"
                                            state.update({ Conjunto: ctx.body, Subconjunto:"NA" });
                                            return gotoFlow(flowEscrito);} 
                                            else{
                          if(ctx.body=='M2'){
                            return gotoFlow(flowcedula);
                          }else{
                            if(ctx.body=='m2'){
                              return gotoFlow(flowcedula);
                            }else{
                              return fallBack();
                            }
                          }
                        }
                        }
                        }
                        }
                      }
                    }
                  }}}}}}
            );
        
        const flowsubtransmision = bot
            .addKeyword(bot.EVENTS.ACTION)
            .addAnswer(
              [
                `Escoge el numero correspondiente al subconjunto de transmision!👓`,
                `*1* Caja reductora`,
                `*2* Cardan`,
                `*3* Correas-poleas`,
              ])
            .addAnswer(
            [
             `*Escoge el numero correcto* `,
             `🐵` ,
            ],
              { capture: true },
              async (ctx, { state,gotoFlow,fallBack }) => {
                if(ctx.body== '1'){
                  ctx.body="Caja reductora"
                  state.update({ Subconjunto: ctx.body });
                  return gotoFlow(flowEscrito);
                }else{
                  if(ctx.body== '2'){
                    ctx.body="Cardan"
                    state.update({ Subconjunto: ctx.body });
                    return gotoFlow(flowEscrito);
                  }else{
                    if(ctx.body =='3'){
                      ctx.body="Correas-poleas"
                      state.update({ Subconjunto: ctx.body });
                      return gotoFlow(flowEscrito);
                    }else{
                      if(ctx.body=='M2'){
                        return gotoFlow(flowcedula);
                      }else{
                        if(ctx.body=='m2'){
                          return gotoFlow(flowcedula);
                        }else{
                          return fallBack();
                        }
                      }
                    }
                  }
                }
              });

              const flowsubabridor = bot
              .addKeyword(bot.EVENTS.ACTION)
              .addAnswer(
                [
                  `Escoge el numero correspondiente al subconjunto del abridor cerrador de valvulas!👓`,
                  `*1* Levas`,
                  `*2* Mecanismo Tope abridor-Cerrador`,
                ])
              .addAnswer(
              [
               `*Escoge el numero correcto* `,
               `🐵` ,
              ],
                { capture: true },
                async (ctx, { state,gotoFlow,fallBack }) => {
                  if(ctx.body== '1'){
                    ctx.body="Levas"
                    state.update({ Subconjunto: ctx.body });
                    return gotoFlow(flowEscrito);
                  }else{
                    if(ctx.body== '2'){
                      ctx.body="Mecanismo Tope abridor-Cerrador"
                      state.update({ Subconjunto: ctx.body });
                      return gotoFlow(flowEscrito);
                    }else{
                        if(ctx.body=='M2'){
                          return gotoFlow(flowcedula);
                        }else{
                          if(ctx.body=='m2'){
                            return gotoFlow(flowcedula);
                          }else{
                            return fallBack();
                          }
                        }
                      }
                    }
                  }
                );
        

      const flowBotellones = bot
      .addKeyword(bot.EVENTS.ACTION)
      .addAnswer(
          [
          `Escoge el numero correspondiente a la denominación del equipo a la cual realizas el aviso!👓`,
          `*1* PRELAVADORA BOTELLONES`,
          `*2* LAVADORA BOTELLONES`,
          `*3* LLENADORA Y TAPONADORA`,
          `*4* LAVADORA HUACALES`,
          `*5* GENERADOR DE OZONO`,
          `*6* TUNEL TERMOENCOGIDO`,
          `*7* SNIFFER`,
          `*8* TRANSPORTADOR DE HUACALES`,
          `*9* SISTEMA CIP`,
          `*10* TRANSPORTADOR DE BOTELLONES`,
          `*11* HIPEROZONIZADOR`,
          `*12* CODIFICADOR`,
          `*13* GENERADOR OXIGENO`,
          `*14* PURIFICADOR DE AIRE`,
          `*15* TRANSPORTADOR RODILLOS PARA ESTIBAS`,
    
    
    
        ])
      .addAnswer(
        [
         `*Escoge el numero correcto* `,
         `🐵` ,
        ],
        { capture: true },
        async (ctx, { state,fallBack,gotoFlow }) => {
          if(ctx.body == '1'){
            ctx.body="PRELAVADORA BOTELLONES"
            state.update({ Equipo: ctx.body,CodEquipo: "508239", Conjunto:"NA",Subconjunto:"NA" });
          return gotoFlow(flowEscrito);
        }else{
          if(ctx.body=='2'){
            ctx.body="LAVADORA BOTELLONES"
            state.update({ Equipo: ctx.body , CodEquipo:"710129", Conjunto:"NA",Subconjunto:"NA"});
            return gotoFlow(flowEscrito);
          }else{
            if(ctx.body== '3'){
              ctx.body="LLENADORA Y TAPONADORA"
              state.update({ Equipo: ctx.body, CodEquipo:"719511", Conjunto:"NA",Subconjunto:"NA" });
              return gotoFlow(flowEscrito);
            }else{
              if(ctx.body=='4'){
                ctx.body="LAVADORA HUACALES"
                state.update({ Equipo: ctx.body, CodEquipo:"719519", Conjunto:"NA",Subconjunto:"NA" });
                return gotoFlow(flowEscrito);
              }else{
                if(ctx.body=='5'){
                  ctx.body="GENERADOR DE OZONO"
                  state.update({ Equipo: ctx.body, CodEquipo:"719606", Conjunto:"NA",Subconjunto:"NA" });
                  return gotoFlow(flowEscrito);
                }else{
                  if(ctx.body=='6'){
                    ctx.body="TUNEL TERMOENCOGIDO"
                    state.update({ Equipo: ctx.body, CodEquipo:"739532", Conjunto:"NA",Subconjunto:"NA" });
                    return gotoFlow(flowEscrito);
                  }else{
                    if(ctx.body=='7'){
                      ctx.body="SNIFFER"
                      state.update({ Equipo: ctx.body, CodEquipo:"820075", Conjunto:"NA",Subconjunto:"NA" });
                      return gotoFlow(flowEscrito);
                    }else{
                      if(ctx.body=='8'){
                        ctx.body="TRANSPORTADOR DE HUACALES"
                        state.update({ Equipo: ctx.body, CodEquipo:"829615", Conjunto:"NA",Subconjunto:"NA" });
                        return gotoFlow(flowEscrito);
                      }else{
                        if(ctx.body=='9'){
                          ctx.body="SISTEMA CIP"
                          state.update({ Equipo: ctx.body, CodEquipo:"900242", Conjunto:"NA",Subconjunto:"NA" });
                          return gotoFlow(flowEscrito);
                        }else{
                          if(ctx.body=='10'){
                            ctx.body="TRANSPORTADOR DE BOTELLONES"
                            state.update({ Equipo: ctx.body,CodEquipo:"71951101", Conjunto:"NA",Subconjunto:"NA" });
                            return gotoFlow(flowEscrito);
                          }else{
                            if(ctx.body=='11'){
                              ctx.body="HIPEROZONIZADOR"
                              state.update({ Equipo: ctx.body,CodEquipo:"71960602", Conjunto:"NA",Subconjunto:"NA" });
                              return gotoFlow(flowEscrito);
                            }else{
                              if(ctx.body=='12'){
                                ctx.body="CODIFICADOR"
                                state.update({ Equipo: ctx.body, CodEquipo:"82964101", Conjunto:"NA",Subconjunto:"NA" });
                                return gotoFlow(flowEscrito);
                              }else{
                                if(ctx.body=='13'){
                                  ctx.body="GENERADOR OXIGENO"
                                  state.update({ Equipo: ctx.body, CodEquipo:"71960605", Conjunto:"NA",Subconjunto:"NA" });
                                  return gotoFlow(flowEscrito);
                                }else{
                                  if(ctx.body=='14'){
                                  ctx.body="PURIFICADOR DE AIRE"
                                  state.update({ Equipo: ctx.body, CodEquipo:"82007501", Conjunto:"NA",Subconjunto:"NA" });
                                  return gotoFlow(flowEscrito);
                                }else{
                                  if(ctx.body=='15'){
                                    ctx.body="TRANSPORTADOR RODILLOS PARA ESTIBAS"
                                    state.update({ Equipo: ctx.body, CodEquipo:"82961501", Conjunto:"NA",Subconjunto:"NA" });
                                    return gotoFlow(flowEscrito);
                                  }else{
                                    if(ctx.body=='M2'){
                                      return gotoFlow(flowcedula);
                                    }else{
                                      if(ctx.body=='m2'){
                                        return gotoFlow(flowcedula);
                                      }else{
                                        return fallBack();
                                      }
                                    }
                                  }
                                }
                                  
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
          }
        }
        );

        const flowLinea3 = bot
        .addKeyword(bot.EVENTS.ACTION)
        .addAnswer(
            [
            `Escoge el numero correspondiente a la denominación del equipo a la cual realizas el aviso!👓`,
            `*1* LAVADORA DE BOTELLAS`,
            `*2* EMPACADORA`,
            `*3* DESEMPACADORA`,
            `*4* LAVADORA DE CAJAS`,
            `*5* INSPECTOR ELECTRONICO`,
            `*6* LLENADORA`,
            `*7* TRANSPORTADOR DE BOTELLAS`,
            `*8* TRANSPORTADOR DE CAJAS`,
            `*9* PROCESADOR DE BEBIDA`,
            `*10* CODIFICADOR`,
            `*11* DESPITILLADORA`,
      
      
      
          ])
        .addAnswer(
          [
           `*Escoge el numero correcto* `,
           `🐵` ,
          ],
          { capture: true },
          async (ctx, { state,fallBack,gotoFlow }) => {
            if(ctx.body == '1'){
              ctx.body="LAVADORA DE BOTELLAS"
              state.update({ Equipo: ctx.body,CodEquipo: "508169" });
            return gotoFlow(flowFallaL3LAVADORABOTELLAS);
          }else{
            if(ctx.body=='2'){
              ctx.body="EMPACADORA"
              state.update({ Equipo: ctx.body , CodEquipo:"558020"});
              return gotoFlow(flowFallaL3Empacadora);
            }else{
              if(ctx.body== '3'){
                ctx.body="DESEMPACADORA"
                state.update({ Equipo: ctx.body, CodEquipo:"558034" });
                return gotoFlow(flowFallaL3Desempacadora);
              }else{
                if(ctx.body=='4'){
                  ctx.body="LAVADORA DE CAJAS"
                  state.update({ Equipo: ctx.body, CodEquipo:"560025"});
                  return gotoFlow(flowL3LAVADORACAJAS);
                }else{
                  if(ctx.body=='5'){
                    ctx.body="INSPECTOR ELECTRONICO"
                    state.update({ Equipo: ctx.body, CodEquipo:"599558" });
                    return gotoFlow(flowL3INSPECTOR);
                  }else{
                    if(ctx.body=='6'){
                      ctx.body="LLENADORA"
                      state.update({ Equipo: ctx.body, CodEquipo:"828592"});
                      return gotoFlow(flowFallaL3LLENADORA);
                    }else{
                      if(ctx.body=='7'){
                        ctx.body="TRANSPORTADOR DE BOTELLAS"
                        state.update({ Equipo: ctx.body, CodEquipo:"829654" });
                        return gotoFlow(flowFallaL3TRANSPORTADORBOTELLA);
                      }else{
                        if(ctx.body=='8'){
                          ctx.body="TRANSPORTADOR DE CAJAS"
                          state.update({ Equipo: ctx.body, CodEquipo:"829852" });
                          return gotoFlow(flowFallaL3TRANSPORTADORCAJAS);
                        }else{
                          if(ctx.body=='9'){
                            ctx.body="CONTIFLOW"
                            state.update({ Equipo: ctx.body, CodEquipo:"900235"});
                            return gotoFlow(flowconjcontiflow);
                          }else{
                            if(ctx.body=='10'){
                              ctx.body="CODIFICADOR"
                              state.update({ Equipo: ctx.body,CodEquipo:"82963201"});
                              return gotoFlow(flowFallaL3CODIFICADOR);
                            }else{
                              if(ctx.body=='11'){
                                ctx.body="DESPITILLADORA"
                                state.update({ Equipo: ctx.body,CodEquipo:"82965401"});
                                return gotoFlow(flowFallaL3DESPITILLADORA);
                              }else{
                               
                                      if(ctx.body=='M2'){
                                        return gotoFlow(flowcedula);
                                      }else{
                                        if(ctx.body=='m2'){
                                          return gotoFlow(flowcedula);
                                        }else{
                                          return fallBack();
                                        }
                                      }
                                    }
                                  }
                                    
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
          );
  
    
        const flowBolsas = bot
        .addKeyword(bot.EVENTS.ACTION)
        .addAnswer(
            [
            `Escoge el numero correspondiente a la denominación del equipo a la cual realizas el aviso!👓`,
            `*1* LAVADORA CAJAS PLASTICAS`,
            `*2* CODIFICADOR BOLSAS 360`,
            `*3* CODIFICADOR BOLSAS 600`,
            `*4* LLENADORA LINEA 5`,
            `*5* LLENADORA LINEA 4`,
            `*6* GENERADOR DE OZONO`,
            `*7* TRANSPORTADOR DE CAJAS`,
            `*8* TRANSPORTADORES TABLETOP`,
            `*9* EQUIPO PARA REEMPAQUE`,
            `*10* LAMPARA UV`,
            `*11* TANQUE DE CONTACTO`,
            `*12* GENERADOR OXIGENO`,
      
      
      
          ])
        .addAnswer(
          [
           `*Escoge el numero correcto* `,
           `🐵` ,
          ],
          { capture: true },
          async (ctx, { state,fallBack,gotoFlow }) => {
            if(ctx.body == '1'){
              ctx.body="LAVADORA DE CAJAS PLASTICAS"
              state.update({ Equipo: ctx.body,CodEquipo: "560026", Conjunto:"NA",Subconjunto:"NA" });
            return gotoFlow(flowEscrito);
          }else{
            if(ctx.body=='2'){
              ctx.body="CODIFICADOR BOLSAS 360"
              state.update({ Equipo: ctx.body , CodEquipo:"589617", Conjunto:"NA",Subconjunto:"NA"});
              return gotoFlow(flowEscrito);
            }else{
              if(ctx.body== '3'){
                ctx.body="CODIFICADOR BOLSAS 600"
                state.update({ Equipo: ctx.body, CodEquipo:"589618", Conjunto:"NA",Subconjunto:"NA" });
                return gotoFlow(flowEscrito);
              }else{
                if(ctx.body=='4'){
                  ctx.body="LLENADORA LINEA 5"
                  state.update({ Equipo: ctx.body, CodEquipo:"710199", Conjunto:"NA",Subconjunto:"NA" });
                  return gotoFlow(flowEscrito);
                }else{
                  if(ctx.body=='5'){
                    ctx.body="LLENADORA LINEA 4"
                    state.update({ Equipo: ctx.body, CodEquipo:"710200", Conjunto:"NA",Subconjunto:"NA" });
                    return gotoFlow(flowEscrito);
                  }else{
                    if(ctx.body=='6'){
                      ctx.body="GENERADOR DE OZONO"
                      state.update({ Equipo: ctx.body, CodEquipo:"719607", Conjunto:"NA",Subconjunto:"NA" });
                      return gotoFlow(flowEscrito);
                    }else{
                      if(ctx.body=='7'){
                        ctx.body="TRANSPORTADOR DE CAJAS"
                        state.update({ Equipo: ctx.body, CodEquipo:"829853", Conjunto:"NA",Subconjunto:"NA"});
                        return gotoFlow(flowEscrito);
                      }else{
                        if(ctx.body=='8'){
                          ctx.body="TRANSPORTADOR TABLETOP"
                          state.update({ Equipo: ctx.body, CodEquipo:"71020001", Conjunto:"NA",Subconjunto:"NA" });
                          return gotoFlow(flowEscrito);
                        }else{
                          if(ctx.body=='9'){
                            ctx.body="EQUIPO PARA REEMPAQUE"
                            state.update({ Equipo: ctx.body, CodEquipo:"71020002", Conjunto:"NA",Subconjunto:"NA" });
                            return gotoFlow(flowEscrito);
                          }else{
                            if(ctx.body=='10'){
                              ctx.body="LAMPARA UV"
                              state.update({ Equipo: ctx.body,CodEquipo:"71020003", Conjunto:"NA",Subconjunto:"NA" });
                              return gotoFlow(flowEscrito);
                            }else{
                              if(ctx.body=='11'){
                                ctx.body="TANQUE DE CONTACTO"
                                state.update({ Equipo: ctx.body,CodEquipo:"71960701", Conjunto:"NA",Subconjunto:"NA" });
                                return gotoFlow(flowEscrito);
                              }else{
                                if(ctx.body=='12'){
                                  ctx.body="GENERADOR OXIGENO"
                                  state.update({ Equipo: ctx.body, CodEquipo:"71960702", Conjunto:"NA",Subconjunto:"NA" });
                                  return gotoFlow(flowEscrito);
                                }else{
                                      if(ctx.body=='M2'){
                                        return gotoFlow(flowcedula);
                                      }else{
                                        if(ctx.body=='m2'){
                                          return gotoFlow(flowcedula);
                                        }else{
                                          return fallBack();
                                        }
                                      }
                                    }
                                  }
                                    
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          );

    const flowLinea8 = bot
    .addKeyword(bot.EVENTS.ACTION)
    .addAnswer(
        [
        `Escoge el numero correspondiente a la denominación del equipo a la cual realizas el aviso!👓`,
        `*1* PALETIZADORA MODUPAL`,
        `*2* ENVOLVEDORA DE FILM`,
        `*3* INSPECTOR DE BOTELLA LLENA`,
        `*4* ENFRIADOR`,
        `*5* PASTEURIZADOR`,
        `*6* MAQUINA DE ESTERILIZACION CUELLOS`,
        `*7* ENFARDADORA`,
        `*8* SECADORA BOTELLAS`,
        `*9* TRANSPORTADOR`,
        `*10* TRANSPORTADOR DE EMBALAJES`,
        `*11* LLENADORA`,
        `*12* ETIQUETADORA`,
        `*13* CODIFICADOR LASER`,
        `*14* ENRUTADOR TAPAS`,
        `*15* SISTEMA INYECCIÓN DE NITRÓGENO`,
  
  
  
      ])
    .addAnswer(
      [
       `*Escoge el numero correcto* `,
       `🐵` ,
      ],
      { capture: true },
      async (ctx, { state,fallBack,gotoFlow }) => {
        if(ctx.body == '1'){
          ctx.body="PALETIZADORA MODUPAL"
          state.update({ Equipo: ctx.body,CodEquipo: "579063" });
        return gotoFlow(flowFalla3);
      }else{
        if(ctx.body=='2'){
          ctx.body="ENVOLVEDORA DE FILM"
          state.update({ Equipo: ctx.body , CodEquipo:"579063"});
          return gotoFlow(flowFalla2);
        }else{
          if(ctx.body== '3'){
            ctx.body="INSPECTOR DE BOTELLA LLENA"
            state.update({ Equipo: ctx.body, CodEquipo:"599566" });
            return gotoFlow(flowFalla5);
          }else{
            if(ctx.body=='4'){
              ctx.body="ENFRIADOR"
              state.update({ Equipo: ctx.body, CodEquipo:"669450" });
              return gotoFlow(flowFallal4);
            }else{
              if(ctx.body=='5'){
                ctx.body="PASTEURIZADOR"
                state.update({ Equipo: ctx.body, CodEquipo:"690104" });
                return gotoFlow(flowFallal5);
              }else{
                if(ctx.body=='6'){
                  ctx.body="MAQUINA DE ESTERILIZACION CUELLOS"
                  state.update({ Equipo: ctx.body, CodEquipo:"690105" });
                  return gotoFlow(flowFallal6);
                }else{
                  if(ctx.body=='7'){
                    ctx.body="ENFARDADORA"
                    state.update({ Equipo: ctx.body, CodEquipo:"710319" });
                    return gotoFlow(flowFalla6);
                  }else{
                    if(ctx.body=='8'){
                      ctx.body="SECADORA BOTELLAS"
                      state.update({ Equipo: ctx.body, CodEquipo:"820138" });
                      return gotoFlow(flowFallal8);
                    }else{
                      if(ctx.body=='9'){
                        ctx.body="TRANSPORTADOR"
                        state.update({ Equipo: ctx.body, CodEquipo:"829659" });
                        return gotoFlow(flowFallal9);
                      }else{
                        if(ctx.body=='10'){
                          ctx.body="TRANSPORTADOR DE EMBALAJES"
                          state.update({ Equipo: ctx.body,CodEquipo:"829667" });
                          return gotoFlow(flowFallal9);
                        }else{
                          if(ctx.body=='11'){
                            ctx.body="LLENADORA"
                            state.update({ Equipo: ctx.body,CodEquipo:"900303" });
                            return gotoFlow(flowFalla1);
                          }else{
                            if(ctx.body=='12'){
                              ctx.body="ETIQUETADORA"
                              state.update({ Equipo: ctx.body, CodEquipo:"900305" });
                              return gotoFlow(flowFallal12);
                            }else{
                              if(ctx.body=='13'){
                                ctx.body="CODIFICADOR LASER"
                                state.update({ Equipo: ctx.body, CodEquipo:"82964103" });
                                return gotoFlow(flowFalla4);
                              }else{
                                if(ctx.body=='14'){
                                ctx.body="ENRUTADOR TAPA"
                                state.update({ Equipo: ctx.body, CodEquipo:"90030303" });
                                return gotoFlow(flowFallal14);
                              }else{
                                if(ctx.body=='15'){
                                  ctx.body="SISTEMA INYECCIÓN DE NITRÓGENO"
                                  state.update({ Equipo: ctx.body, CodEquipo:"90030304" });
                                  return gotoFlow(flowFallal15);
                                }else{
                                  if(ctx.body=='M2'){
                                    return gotoFlow(flowcedula);
                                  }else{
                                    if(ctx.body=='m2'){
                                      return gotoFlow(flowcedula);
                                    }else{
                                      return fallBack();
                                    }
                                  }
                                }
                              }
                                
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
        }
      }
      );


  


const flowLinea10 = bot
  .addKeyword(bot.EVENTS.ACTION)
  .addAnswer(
      [
      `Escoge el numero correspondiente a la denominación del equipo a la cual realizas el aviso!👓`,
      `*1* LLENADORA DE BOTELLAS PET 162 VALVULAS`,
      `*2* ENVOLVEDORA FILM PLASTICO`,
      `*3* PALETIZADORA`,
      `*4* CODIFICADOR LASER DE ENVASE`,
      `*5* INSPECTOR ELECTRONICO DE ENVASE`,
      `*6* ENFARDADORA`,
      `*7* ALIMENTADOR DE TAPA PLASTICA`,
      `*8* CARBOENFRIADOR DE BEBIDAS`,
      `*9* ETIQUETADORA ENVOLVENTE`,
      `*10* TRANSPORTE DE PAQUETES`,
      `*11* TRANSPORTE DE PALETS`,
      `*12* LUBRICACION DE TRANSPORTADORES`,
      `*13* TRANSPORTE DE ENVASES`,
      `*14* SOPLADORA`,



    ])
  .addAnswer(
    [
     `*Escoge el numero correcto* `,
     `🐵` ,
    ],
    { capture: true },
    async (ctx, { state,fallBack,gotoFlow }) => {
      if(ctx.body == '1'){
        ctx.body="LLENADORA DE BOTELLAS PET 162 VALVULAS"
        state.update({ Equipo: ctx.body,CodEquipo: "519561" });
      return gotoFlow(flowFalla1);
    }else{
      if(ctx.body=='2'){
        ctx.body="ENVOLVEDORA FILM PLASTICO"
        state.update({ Equipo: ctx.body , CodEquipo:"579079"});
        return gotoFlow(flowFalla2);
      }else{
        if(ctx.body== '3'){
          ctx.body="PALETIZADORA"
          state.update({ Equipo: ctx.body, CodEquipo:"579080" });
          return gotoFlow(flowFalla3);
        }else{
          if(ctx.body=='4'){
            ctx.body="CODIFICADOR LASER DE ENVASE"
            state.update({ Equipo: ctx.body, CodEquipo:"589658" });
            return gotoFlow(flowFalla4);
          }else{
            if(ctx.body=='5'){
              ctx.body="INSPECTOR ELECTRONICO DE ENVASE"
              state.update({ Equipo: ctx.body, CodEquipo:"599605" });
              return gotoFlow(flowFalla5);
            }else{
              if(ctx.body=='6'){
                ctx.body="ENFARDADORA"
                state.update({ Equipo: ctx.body, CodEquipo:"710324" });
                return gotoFlow(flowFalla6);
              }else{
                if(ctx.body=='9'){
                  ctx.body="ETIQUETADORA ENVOLVENTE"
                  state.update({ Equipo: ctx.body, CodEquipo:"820082" });
                  return gotoFlow(flowFalla9);
                }else{
                  if(ctx.body=='8'){
                    ctx.body="CARBOENFRIADOR DE BEBIDAS"
                    state.update({ Equipo: ctx.body, CodEquipo:"829011" });
                    return gotoFlow(flowFalla8);
                  }else{
                    if(ctx.body=='7'){
                      ctx.body="ALIMENTADOR DE TAPA PLASTICA"
                      state.update({ Equipo: ctx.body, CodEquipo:"829703" });
                      return gotoFlow(flowFalla7);
                    }else{
                      if(ctx.body=='10'){
                        ctx.body="TRANSPORTE DE PAQUETES"
                        state.update({ Equipo: ctx.body,CodEquipo:"829868" });
                        return gotoFlow(flowFalla10);
                      }else{
                        if(ctx.body=='11'){
                          ctx.body="TRANSPORTE DE PALETS"
                          state.update({ Equipo: ctx.body,CodEquipo:"829869" });
                          return gotoFlow(flowFalla11);
                        }else{
                          if(ctx.body=='12'){
                            ctx.body="LUBRICACION DE TRANSPORTADORES"
                            state.update({ Equipo: ctx.body,Conjunto:"NA",Subconjunto:"NA", CodEquipo:"829870" });
                            return gotoFlow(flowEscrito);
                          }else{
                            if(ctx.body=='13'){
                              ctx.body="TRANSPORTE DE ENVASES"
                              state.update({ Equipo: ctx.body, CodEquipo:"829871" });
                              return gotoFlow(flowFalla13);
                            }else{
                              if(ctx.body=='14'){
                              ctx.body="SOPLADORA"
                              state.update({ Equipo: ctx.body, CodEquipo:"820048" });
                              return gotoFlow(flowFalla14);
                            }else{
                              if(ctx.body=='M2'){
                                return gotoFlow(flowcedula);
                              }else{
                                if(ctx.body=='m2'){
                                  return gotoFlow(flowcedula);
                                }else{
                                  return fallBack();
                                }
                              }
                            }
                              
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
      }
    }
    );

const flowFalla1 = bot
    .addKeyword(bot.EVENTS.ACTION)
    .addAnswer(
      [
        `Escoge el numero correspondiente al conjunto de la llenadora!👓`,
        `*1* Estrellas de transferencia`,
        `*2* Refrigeración de fondo`,
        `*3* Taponadora`,
        `*4* Isla de válvulas`,
        `*5* Carrusel`,
        `*6* Materia prima`,
        `*7* Falla Humana`,

      ])
    .addAnswer(
    [
     `*Escoge el numero correcto* `,
     `🐵` ,
    ],
      { capture: true },
      async (ctx, { state,gotoFlow,fallBack }) => {
        if(ctx.body=='1'){
          ctx.body="Estrellas de transferencia"
          state.update({ Conjunto: ctx.body });
        return gotoFlow(flowEquipo11);
    }else{
        if(ctx.body=='2'){
          ctx.body="Refrigeración de fondo"
          state.update({ Conjunto: ctx.body });
          return gotoFlow(flowEquipo12);
        }else{
          if(ctx.body=='3'){
            ctx.body="Taponadora"
            state.update({ Conjunto: ctx.body });
            return gotoFlow(flowEquipo13);
          }else{
            if(ctx.body=='4'){
              ctx.body="Isla de válvulas"
              state.update({ Conjunto: ctx.body });
              return gotoFlow(flowEquipo14);
            }else{
              if(ctx.body=='5'){
                ctx.body="Carrusel"
                state.update({ Conjunto: ctx.body });
                return gotoFlow(flowEquipo15);} 
                else{
                  if(ctx.body=='6'){
                ctx.body="Materia prima"
                state.update({ Conjunto: ctx.body, Subconjunto: "NA" });
                return gotoFlow(flowEscrito);} 
                else{
                  if(ctx.body=='7'){
                ctx.body="Falla Humana"
                state.update({ Conjunto: ctx.body, Subconjunto: "NA" });
                return gotoFlow(flowEscrito);} 
                else{

                  if(ctx.body=='M2'){
                    return gotoFlow(flowcedula);
                  }else{
                    if(ctx.body=='m2'){
                      return gotoFlow(flowcedula);
                    }else{
                      return fallBack();
                    }
                  }
                }
                }
                }
                }
              }
            }
          }
        }
    );

const flowEquipo11 = bot
    .addKeyword(bot.EVENTS.ACTION)
    .addAnswer(
      [
        `Escoge el numero correspondiente al subconjunto estrellas de transferencia!👓`,
        `*1* Servoaccionamientos`,
        `*2* Columnas de estrellas`,
        `*3* Dispositivos de mando`,
      ])
    .addAnswer(
    [
     `*Escoge el numero correcto* `,
     `🐵` ,
    ],
      { capture: true },
      async (ctx, { state,gotoFlow,fallBack }) => {
        if(ctx.body== '1'){
          ctx.body="Servoaccionamientos"
          state.update({ Subconjunto: ctx.body });
          return gotoFlow(flowEscrito);
        }else{
          if(ctx.body== '2'){
            ctx.body="Columnas de estrellas"
            state.update({ Subconjunto: ctx.body });
            return gotoFlow(flowEscrito);
          }else{
            if(ctx.body =='3'){
              ctx.body="Dispositivos de mando"
              state.update({ Subconjunto: ctx.body });
              return gotoFlow(flowEscrito);
            }else{
              if(ctx.body=='M2'){
                return gotoFlow(flowcedula);
              }else{
                if(ctx.body=='m2'){
                  return gotoFlow(flowcedula);
                }else{
                  return fallBack();
                }
              }
            }
          }
        }
      });

const flowEquipo12 = bot
    .addKeyword(bot.EVENTS.ACTION)
    .addAnswer(
      [
        `Escoge el numero correspondiente al subconjunto refrigeración de fondo!👓`,
        `*1* Sistema de refrigeración`,
        `*2* Sistema Hidraulico`,
      ])
    .addAnswer(
    [
     `*Escoge el numero correcto* `,
     `🐵` ,
    ],
      { capture: true },
      async (ctx, { state,gotoFlow,fallBack }) => {
        if(ctx.body== '1'){
            ctx.body="Sistema de refrigeración"
            state.update({ Subconjunto: ctx.body });
            return gotoFlow(flowEscrito);
        }else{
          if(ctx.body=='2'){
          ctx.body="Sistema Hidraulico"
          state.update({ Subconjunto: ctx.body });
          return gotoFlow(flowEscrito);
          } else{
            if(ctx.body=='M2'){
              return gotoFlow(flowcedula);
            }else{
              if(ctx.body=='m2'){
                return gotoFlow(flowcedula);
              }else{
                return fallBack();
              }
            }
          }
        }
      });

const flowEquipo13 = bot
    .addKeyword(bot.EVENTS.ACTION)
    .addAnswer(
      [
        `Escoge el numero correspondiente al subconjunto de la taponadora!👓`,
        `*1* Servoaccionamientos`,
        `*2* Formato de guia`,
        `*3* Mesa`,
        `*4* Cabezal parte-superior`,
      ])
    .addAnswer(
    [
     `*Escoge el numero correcto* `,
     `🐵` ,
    ],
      { capture: true },
      async (ctx, { state,gotoFlow,fallBack }) => {
        if(ctx.body== '1'){
          ctx.body="Servoaccionamientos"
          state.update({ Subconjunto: ctx.body });
          return gotoFlow(flowEscrito);
        }else{
          if(ctx.body=='2'){
            ctx.body="Formato de guia"
            state.update({ Subconjunto: ctx.body });
            return gotoFlow(flowEscrito);
          }else{
            if(ctx.body=='3'){
              ctx.body="Mesa"
              state.update({ Subconjunto: ctx.body });
              return gotoFlow(flowEscrito);
            }else{
              if(ctx.body== '4'){
              ctx.body="Cabezal parte-superior"
              state.update({ Subconjunto: ctx.body });
              return gotoFlow(flowEscrito);
        }else{
          if(ctx.body=='M2'){
            return gotoFlow(flowcedula);
          }else{
            if(ctx.body=='m2'){
              return gotoFlow(flowcedula);
            }else{
              return fallBack();
            }
          }
        }
            }
          }
         
        }
      });

const flowEquipo14 = bot
    .addKeyword(bot.EVENTS.ACTION)
    .addAnswer(
      [
        `Escoge el numero correspondiente al subconjunto de la Isla de válvulas!👓`,
        `*1* Secadores de aire`,
        `*2* Tuberia`,
        `*3* Filtros`,
        `*4* Válvulas de discos`,
        `*5* Válvulas reguladoras`,
      ])
    .addAnswer(
    [
     `*Escoge el numero correcto* `,
     `🐵` ,
    ],
      { capture: true },
      async (ctx, { state,gotoFlow,fallBack }) => {
        if(ctx.body== '1'){
              ctx.body="Secadores de aire"
              state.update({ Subconjunto: ctx.body });
              return gotoFlow(flowEscrito);
        }else{
          if(ctx.body== '2'){
              ctx.body="Tuberia"
              state.update({ Subconjunto: ctx.body });
              return gotoFlow(flowEscrito);
        }else{
          if(ctx.body== '3'){
              ctx.body="Filtros"
              state.update({ Subconjunto: ctx.body });
              return gotoFlow(flowEscrito);
        }else{
          if(ctx.body== '4'){
              ctx.body="Válvulas de discos"
              state.update({ Subconjunto: ctx.body });
              return gotoFlow(flowEscrito);
        }else{
          if(ctx.body== '5'){
              ctx.body="Válvulas reguladoras"
              state.update({ Subconjunto: ctx.body });
              return gotoFlow(flowEscrito);
        }else{
          if(ctx.body=='M2'){
            return gotoFlow(flowcedula);
          }else{
            if(ctx.body=='m2'){
              return gotoFlow(flowcedula);
            }else{
              return fallBack();
            }
          }
        }
        }
        }
        }
        }
      });
const flowEquipo15 = bot
    .addKeyword(bot.EVENTS.ACTION)
    .addAnswer(
      [
        `Escoge el numero correspondiente al carrusel!👓`,
        `*1* Servoaccionamientos`,
        `*2* Estaciones de llenado`,
        `*3* Unidades de Elevación`,
        `*4* Deposito de producto`,
        `*5* Cabezal parte-superior`,
        `*6* Mesa`,
      ])
    .addAnswer(
    [
     `*Escoge el numero correcto* `,
     `🐵` ,
    ],
      { capture: true },
      async (ctx, { state,gotoFlow,fallBack }) => {
        if(ctx.body== '1'){
              ctx.body="Servoaccionamientos"
              state.update({ Subconjunto: ctx.body });
              return gotoFlow(flowEscrito);
        }else{
          if(ctx.body== '2'){
              ctx.body="Estaciones de llenado"
              state.update({ Subconjunto: ctx.body });
              return gotoFlow(flowEscrito);
        }else{
          if(ctx.body== '3'){
              ctx.body="Unidades de Elevación"
              state.update({ Subconjunto: ctx.body });
              return gotoFlow(flowEscrito);
        }else{
          if(ctx.body== '4'){
              ctx.body="Deposito de producto"
              state.update({ Subconjunto: ctx.body });
              return gotoFlow(flowEscrito);
        }else{
          if(ctx.body== '5'){
              ctx.body="Cabezal parte-superior"
              state.update({ Subconjunto: ctx.body });
              return gotoFlow(flowEscrito);
        }else{
          if(ctx.body== '6'){
              ctx.body="Mesa"
              state.update({ Subconjunto: ctx.body });
              return gotoFlow(flowEscrito);
        }else{
          if(ctx.body=='M2'){
            return gotoFlow(flowcedula);
          }else{
            if(ctx.body=='m2'){
              return gotoFlow(flowcedula);
            }else{
              return fallBack();
            }
          }
        }
        }
        }
        }
        }
        }
      });
  
const flowFalla2 = bot
    .addKeyword(bot.EVENTS.ACTION)
    .addAnswer(
      [
        `Escoge el numero correspondiente al conjunto de la envolvedora!👓`,
        `*1* Soportes o Estructura`,
        `*2* Sensores`,
        `*3* Motores`,
        `*4* Rodillos`,
        `*5* Materia prima`,
        `*6* Falla Humana`,
      ])
    .addAnswer(
    [
     `*Escoge el numero correcto* `,
     `🐵` ,
    ],
      { capture: true },
      async (ctx, { state,gotoFlow,fallBack }) => {
        if(ctx.body=='1'){
          ctx.body="Soportes o Estructura"
          state.update({ Conjunto: ctx.body, Subconjunto:"NA" });
        return gotoFlow(flowEscrito);
    }else{
      if(ctx.body=='2'){
        ctx.body="Sensores"
        state.update({ Conjunto: ctx.body,Subconjunto:"NA" });
      return gotoFlow(flowEscrito);
  }else{
    if(ctx.body=='3'){
      ctx.body="Motores"
      state.update({ Conjunto: ctx.body,Subconjunto:"NA" });
    return gotoFlow(flowEscrito);
}else{
  if(ctx.body=='4'){
    ctx.body="Rodillos"
    state.update({ Conjunto: ctx.body,Subconjunto:"NA"  });
  return gotoFlow(flowEscrito);
}else{
   if(ctx.body=='5'){
      ctx.body="Materia prima"
      state.update({ Conjunto: ctx.body, Subconjunto: "NA" });
      return gotoFlow(flowEscrito);} else{
    if(ctx.body=='6'){
      ctx.body="Falla Humana"
      state.update({ Conjunto: ctx.body, Subconjunto: "NA" });
      return gotoFlow(flowEscrito);}
     else{
      if(ctx.body=='M2'){
        return gotoFlow(flowcedula);
      }else{
        if(ctx.body=='m2'){
          return gotoFlow(flowcedula);
        }else{
          return fallBack();
        }
      }
                }
                }
                }
}
}
  }
    }
    );


const flowFalla3 = bot
    .addKeyword(bot.EVENTS.ACTION)
    .addAnswer(
      [
        `Escoge el numero correspondiente al conjunto de la paletizadora!👓`,
        `*1* Robobox`,
        `*2* Estacion prueba de agrupamiento`,
        `*3* Materia prima`,
        `*4* Falla Humana`,
      ])
    .addAnswer(
    [
     `*Escoge el numero correcto* `,
     `🐵` ,
    ],
      { capture: true },
      async (ctx, { state,gotoFlow,fallBack }) => {
        if(ctx.body=='1'){
          ctx.body="Robobox"
          state.update({ Conjunto: ctx.body});
        return gotoFlow(flowEquipo31);
    }else{
        if(ctx.body=='2'){
          ctx.body="Estacion prueba de agrupamiento"
          state.update({ Conjunto: ctx.body });
        return gotoFlow(flowEquipo32);
    }else{
      if(ctx.body=='3'){
      ctx.body="Materia prima"
      state.update({ Conjunto: ctx.body, Subconjunto: "NA" });
      return gotoFlow(flowEscrito);}else{
        if(ctx.body=='4'){
      ctx.body="Falla Humana"
      state.update({ Conjunto: ctx.body, Subconjunto: "NA" });
      return gotoFlow(flowEscrito);}
        else{
          if(ctx.body=='M2'){
            return gotoFlow(flowcedula);
          }else{
            if(ctx.body=='m2'){
              return gotoFlow(flowcedula);
            }else{
              return fallBack();
            }
          }
      }
      }
      }
    }
    }
    );


const flowEquipo31 = bot
    .addKeyword(bot.EVENTS.ACTION)
    .addAnswer(
      [
        `Escoge el numero correspondiente al subconjunto del Robobox!👓`,
        `*1* Entrada`,
        `*2* Robobox 1`,
        `*3* Robobox 2`,
      ])
    .addAnswer(
    [
     `*Escoge el numero correcto* `,
     `🐵` ,
    ],
      { capture: true },
      async (ctx, { state,gotoFlow,fallBack }) => {
        if(ctx.body== '1'){
            ctx.body="Entrada"
            state.update({ Subconjunto: ctx.body });
            return gotoFlow(flowEscrito);
        }else{
          if(ctx.body=='2'){
          ctx.body="Robobox 1"
          state.update({ Subconjunto: ctx.body });
          return gotoFlow(flowEscrito);
          } else{
            if(ctx.body=='3'){
              ctx.body="Robobox 2"
              state.update({ Subconjunto: ctx.body });
              return gotoFlow(flowEscrito);
              }else{
                if(ctx.body=='M2'){
                  return gotoFlow(flowcedula);
                }else{
                  if(ctx.body=='m2'){
                    return gotoFlow(flowcedula);
                  }else{
                    return fallBack();
                  }
                }
              }

          }
        }
      });

      const flowEquipo32 = bot
      .addKeyword(bot.EVENTS.ACTION)
      .addAnswer(
        [
          `Escoge el numero correspondiente al subconjunto !👓`,
          `*1* Estacion prueba de agrupamiento 1`,
          `*2* Estacion prueba de agrupamiento 2`,
        ])
      .addAnswer(
      [
       `*Escoge el numero correcto* `,
       `🐵` ,
      ],
        { capture: true },
        async (ctx, { state,gotoFlow,fallBack }) => {
          if(ctx.body== '1'){
              ctx.body="Estacion prueba de agrupamiento 1"
              state.update({ Subconjunto: ctx.body });
              return gotoFlow(flowEscrito);
          }else{
            if(ctx.body=='2'){
            ctx.body="Estacion prueba de agrupamiento 2"
            state.update({ Subconjunto: ctx.body });
            return gotoFlow(flowEscrito);
            } else{
              if(ctx.body=='M2'){
                return gotoFlow(flowcedula);
              }else{
                if(ctx.body=='m2'){
                  return gotoFlow(flowcedula);
                }else{
                  return fallBack();
                }
              }
            }
          }
        });



const flowFallal4 = bot
        .addKeyword(bot.EVENTS.ACTION)
        .addAnswer(
          [
            `Escoge el numero correspondiente al conjunto del enfriador!👓`,
            `*1* Intercambiador`,
            `*2* Motores`,
            `*3* Transmision`,
            `*4* Sensores`,
            `*5* Bandas`,
          ])
        .addAnswer(
        [
         `*Escoge el numero correcto* `,
         `🐵` ,
        ],
          { capture: true },
          async (ctx, { state,gotoFlow,fallBack }) => {
            if(ctx.body=='1'){
              ctx.body="Intercambiador"
              state.update({ Conjunto: ctx.body, Subconjunto:"NA" });
            return gotoFlow(flowEscrito);
        }else{
          if(ctx.body=='2'){
            ctx.body="Motores"
            state.update({ Conjunto: ctx.body,Subconjunto:"NA" });
          return gotoFlow(flowEscrito);
      }else{
        if(ctx.body=='3'){
          ctx.body="Transmision"
          state.update({ Conjunto: ctx.body,Subconjunto:"NA" });
        return gotoFlow(flowEscrito);
    }else{
      if(ctx.body=='4'){
        ctx.body="Sensores"
        state.update({ Conjunto: ctx.body,Subconjunto:"NA"  });
      return gotoFlow(flowEscrito);
    }else{
       if(ctx.body=='5'){
          ctx.body="Bandas"
          state.update({ Conjunto: ctx.body, Subconjunto: "NA" });
          return gotoFlow(flowEscrito);} else{
            if(ctx.body=='M2'){
              return gotoFlow(flowcedula);
            }else{
              if(ctx.body=='m2'){
                return gotoFlow(flowcedula);
              }else{
                return fallBack();
              }
            }
                    }
                    }
    }
    }
      }
        }
        );


const flowFalla4 = bot
        .addKeyword(bot.EVENTS.ACTION)
        .addAnswer(
          [
            `Escoge el numero correspondiente al conjunto de la codificadora laser!👓`,
            `*1* Cañon principal`,
            `*2* Extractor`,
            `*3* Refrigeración`,
            `*4* Materia prima`,
            `*5* Falla Humana`,
          ])
        .addAnswer(
        [
         `*Escoge el numero correcto* `,
         `🐵` ,
        ],
          { capture: true },
          async (ctx, { state,gotoFlow,fallBack }) => {
            if(ctx.body=='1'){
              ctx.body="Cañon principal"
              state.update({ Conjunto: ctx.body, Subconjunto:"NA" });
            return gotoFlow(flowEscrito);
        }else{
            if(ctx.body=='2'){
              ctx.body="Extractor"
              state.update({ Conjunto: ctx.body, Subconjunto:"NA" });
              return gotoFlow(flowEscrito);
            }else{
              if(ctx.body=='3'){
                ctx.body="Refrigeración"
                state.update({ Conjunto: ctx.body, Subconjunto:"NA" });
                return gotoFlow(flowEscrito);
              }else{
                 if(ctx.body=='4'){
                    ctx.body="Materia prima"
                    state.update({ Conjunto: ctx.body, Subconjunto: "NA" });
                    return gotoFlow(flowEscrito);}else{
                       if(ctx.body=='5'){
                          ctx.body="Falla Humana"
                          state.update({ Conjunto: ctx.body, Subconjunto: "NA" });
                          return gotoFlow(flowEscrito);}else{
                            if(ctx.body=='M2'){
                              return gotoFlow(flowcedula);
                            }else{
                              if(ctx.body=='m2'){
                                return gotoFlow(flowcedula);
                              }else{
                                return fallBack();
                              }
                            }
      }
      }
                    }
                }
              }
            }
        );


const flowFallal5 = bot
        .addKeyword(bot.EVENTS.ACTION)
        .addAnswer(
          [
            `Escoge el numero correspondiente al conjunto del pasteurizador!👓`,
            `*1* Intercambiador`,
            `*2* Falla Humana`,
            `*3* Temperatura`,
            `*4* Sensores`,
            `*5* Motores`,
            `*6* Valvulas`,
            `*7* Sistema refrigeración`,
            `*8* Desaireador`,
          ])
        .addAnswer(
        [
         `*Escoge el numero correcto* `,
         `🐵` ,
        ],
          { capture: true },
          async (ctx, { state,gotoFlow,fallBack }) => {
            if(ctx.body=='1'){
              ctx.body="Intercambiador"
              state.update({ Conjunto: ctx.body, Subconjunto:"NA" });
            return gotoFlow(flowEscrito);
        }else{
          if(ctx.body=='2'){
            ctx.body="Falla Humana"
            state.update({ Conjunto: ctx.body,Subconjunto:"NA" });
          return gotoFlow(flowEscrito);
      }else{
        if(ctx.body=='3'){
          ctx.body="Temperatura"
          state.update({ Conjunto: ctx.body,Subconjunto:"NA" });
        return gotoFlow(flowEscrito);
    }else{
      if(ctx.body=='4'){
        ctx.body="Sensores"
        state.update({ Conjunto: ctx.body,Subconjunto:"NA"  });
      return gotoFlow(flowEscrito);
    }else{
       if(ctx.body=='5'){
          ctx.body="Motores"
          state.update({ Conjunto: ctx.body, Subconjunto: "NA" });
          return gotoFlow(flowEscrito);} else{
            if(ctx.body=='6'){
              ctx.body="Valvulas"
              state.update({ Conjunto: ctx.body, Subconjunto: "NA" });
              return gotoFlow(flowEscrito);} else{
                if(ctx.body=='7'){
                  ctx.body="Sistema refrigeración"
                  state.update({ Conjunto: ctx.body, Subconjunto: "NA" });
                  return gotoFlow(flowEscrito);} else{
                    if(ctx.body=='8'){
                      ctx.body="Desaireador"
                      state.update({ Conjunto: ctx.body, Subconjunto: "NA" });
                      return gotoFlow(flowEscrito);} else{
                        if(ctx.body=='M2'){
                          return gotoFlow(flowcedula);
                        }else{
                          if(ctx.body=='m2'){
                            return gotoFlow(flowcedula);
                          }else{
                            return fallBack();
                          }
                        }
                      }

                  }
              }
                    }
                    }
    }
    }
      }
        }
        );




const flowFalla5 = bot
        .addKeyword(bot.EVENTS.ACTION)
        .addAnswer(
          [
            `Escoge el numero correspondiente al conjunto del inspector!👓`,
            `*1* Cámaras`,
            `*2* Sensores`,
            `*3* Bandas`,
            `*4* Falla Humana`,
          ])
        .addAnswer(
        [
         `*Escoge el numero correcto* `,
         `🐵` ,
        ],
          { capture: true },
          async (ctx, { state,gotoFlow,fallBack }) => {
            if(ctx.body=='1'){
              ctx.body="Cámaras"
              state.update({ Conjunto: ctx.body, Subconjunto:"NA" });
            return gotoFlow(flowEscrito);
        }else{
            if(ctx.body=='2'){
              ctx.body="Sensores"
              state.update({ Conjunto: ctx.body, Subconjunto:"NA" });
              return gotoFlow(flowEscrito);
            }else{
              if(ctx.body=='3'){
                ctx.body="Bandas"
                state.update({ Conjunto: ctx.body, Subconjunto:"NA" });
                return gotoFlow(flowEscrito);
              }else{
                 if(ctx.body=='4'){
                    ctx.body="Falla Humana"
                    state.update({ Conjunto: ctx.body, Subconjunto: "NA" });
                    return gotoFlow(flowEscrito);}else{
                      if(ctx.body=='M2'){
                        return gotoFlow(flowcedula);
                      }else{
                        if(ctx.body=='m2'){
                          return gotoFlow(flowcedula);
                        }else{
                          return fallBack();
                        }
                      }
                    }
                    }
                }
              }
            }
        );


        const flowFallal6 = bot
        .addKeyword(bot.EVENTS.ACTION)
        .addAnswer(
          [
            `Escoge el numero correspondiente al conjunto de la maquina esterilizadora de cuellos!👓`,
            `*1* Sistema lubricación`,
            `*2* Motores`,
            `*3* Bandas`,
            `*4* Transportadores`,
            `*5* Sensores`,
            `*6* Guias`,
          ])
        .addAnswer(
        [
         `*Escoge el numero correcto* `,
         `🐵` ,
        ],
          { capture: true },
          async (ctx, { state,gotoFlow,fallBack }) => {
            if(ctx.body=='1'){
              ctx.body="Sistema lubricación"
              state.update({ Conjunto: ctx.body, Subconjunto:"NA" });
            return gotoFlow(flowEscrito);
        }else{
          if(ctx.body=='2'){
            ctx.body="Motores"
            state.update({ Conjunto: ctx.body,Subconjunto:"NA" });
          return gotoFlow(flowEscrito);
      }else{
        if(ctx.body=='3'){
          ctx.body="Bandas"
          state.update({ Conjunto: ctx.body,Subconjunto:"NA" });
        return gotoFlow(flowEscrito);
    }else{
      if(ctx.body=='4'){
        ctx.body="Transportadores"
        state.update({ Conjunto: ctx.body,Subconjunto:"NA"  });
      return gotoFlow(flowEscrito);
    }else{
       if(ctx.body=='5'){
          ctx.body="Sensores"
          state.update({ Conjunto: ctx.body, Subconjunto: "NA" });
          return gotoFlow(flowEscrito);} else{
            if(ctx.body=='6'){
              ctx.body="Guias"
              state.update({ Conjunto: ctx.body, Subconjunto: "NA" });
              return gotoFlow(flowEscrito);} else{
                if(ctx.body=='M2'){
                  return gotoFlow(flowcedula);
                }else{
                  if(ctx.body=='m2'){
                    return gotoFlow(flowcedula);
                  }else{
                    return fallBack();
                  }
                }
              }
                    }
                    }
    }
    }
      }
        }
        );

    

        const flowFalla6 = bot
        .addKeyword(bot.EVENTS.ACTION)
        .addAnswer(
          [
            `Escoge el numero correspondiente al conjunto de la enfardadora!👓`,
            `*1* Transportador entrada`,
            `*2* Transportador film`,
            `*3* Tunel`,
            `*4* Guía de envase`,
            `*5* Materia prima`,
            `*6* Falla Humana`,
          ])
        .addAnswer(
        [
         `*Escoge el numero correcto* `,
         `🐵` ,
        ],
          { capture: true },
          async (ctx, { state,gotoFlow,fallBack }) => {
            if(ctx.body=='1'){
              ctx.body="Transportador entrada"
              state.update({ Conjunto: ctx.body});
            return gotoFlow(flowEquipo61);
        }else{
            if(ctx.body=='2'){
              ctx.body="Transportador film"
              state.update({ Conjunto: ctx.body});
              return gotoFlow(flowEquipo61);
            }else{
              if(ctx.body=='3'){
                ctx.body="Tunel"
                state.update({ Conjunto: ctx.body});
                return gotoFlow(flowEquipo62);
              }else{
                if(ctx.body=='4'){
                  ctx.body="Guía de envase"
                  state.update({ Conjunto: ctx.body});
                  return gotoFlow(flowEquipo61);
                }else{
                  if(ctx.body=='5'){
                    ctx.body="Materia prima"
                    state.update({ Conjunto: ctx.body, Subconjunto: "NA" });
                    return gotoFlow(flowEscrito);}else{
                      if(ctx.body=='6'){
                    ctx.body="Falla Humana"
                    state.update({ Conjunto: ctx.body, Subconjunto: "NA" });
                    return gotoFlow(flowEscrito);}else{
                      if(ctx.body=='M2'){
                        return gotoFlow(flowcedula);
                      }else{
                        if(ctx.body=='m2'){
                          return gotoFlow(flowcedula);
                        }else{
                          return fallBack();
                        }
                      }
                    }
                    }
                    }
                }
                }
              }
            }
        );

const flowEquipo61 = bot
        .addKeyword(bot.EVENTS.ACTION)
        .addAnswer(
          [
            `Escoge el numero correspondiente del subconjunto!👓`,
            `*1* Motores`,
            `*2* Sensores`,
            `*3* Soporte o Estructura`,
          ])
        .addAnswer(
        [
         `*Escoge el numero correcto* `,
         `🐵` ,
        ],
          { capture: true },
          async (ctx, { state,gotoFlow,fallBack }) => {
            if(ctx.body== '1'){
                ctx.body="Motores"
                state.update({ Subconjunto: ctx.body });
                return gotoFlow(flowEscrito);
            }else{
              if(ctx.body=='2'){
              ctx.body="Sensores"
              state.update({ Subconjunto: ctx.body });
              return gotoFlow(flowEscrito);
              } else{
                if(ctx.body=='3'){
                  ctx.body="Soporte o Estructura"
                  state.update({ Subconjunto: ctx.body });
                  return gotoFlow(flowEscrito);
                  }else{
                    if(ctx.body=='M2'){
                      return gotoFlow(flowcedula);
                    }else{
                      if(ctx.body=='m2'){
                        return gotoFlow(flowcedula);
                      }else{
                        return fallBack();
                      }
                    }
                  }
    
              }
            }
          });

const flowEquipo62 = bot
          .addKeyword(bot.EVENTS.ACTION)
          .addAnswer(
            [
              `Escoge el numero correspondiente al subconjunto del tunel!👓`,
              `*1* Quemador`,
              `*2* Sensores`,
              `*3* Banda`,
              `*4* Motores`,
            ])
          .addAnswer(
          [
           `*Escoge el numero correcto* `,
           `🐵` ,
          ],
            { capture: true },
            async (ctx, { state,gotoFlow,fallBack }) => {
              if(ctx.body== '4'){
                  ctx.body="Motores"
                  state.update({ Subconjunto: ctx.body });
                  return gotoFlow(flowEscrito);
              }else{
                if(ctx.body=='2'){
                ctx.body="Sensores"
                state.update({ Subconjunto: ctx.body });
                return gotoFlow(flowEscrito);
                } else{
                  if(ctx.body=='3'){
                    ctx.body="Banda"
                    state.update({ Subconjunto: ctx.body });
                    return gotoFlow(flowEscrito);
                    }else{
                      if(ctx.body=='1'){
                        ctx.body="Quemador"
                        state.update({ Subconjunto: ctx.body });
                        return gotoFlow(flowEscrito);
                        }else{
                          if(ctx.body=='M2'){
                            return gotoFlow(flowcedula);
                          }else{
                            if(ctx.body=='m2'){
                              return gotoFlow(flowcedula);
                            }else{
                              return fallBack();
                            }
                          }
                        }
                    }
      
                }
              }
            });

            const flowFalla7 = bot
            .addKeyword(bot.EVENTS.ACTION)
            .addAnswer(
              [
                `Escoge el numero correspondiente al conjunto del alimentador de tapa plastica!👓`,
                `*1* Tolva de alimentación`,
                `*2* Transportador inclinado`,
                `*3* Transportador horizontal`,
                `*4* Elevador tapa volteada`,
                `*5* Inspector`,
                `*6* Materia prima`,
                `*7* Falla Humana`,
              ])
            .addAnswer(
            [
             `*Escoge el numero correcto* `,
             `🐵` ,
            ],
              { capture: true },
              async (ctx, { state,gotoFlow,fallBack }) => {
                if(ctx.body=='1'){
                  ctx.body="Tolva de alimentación"
                  state.update({ Conjunto: ctx.body,Subconjunto:"NA"});
                return gotoFlow(flowEscrito);
            }else{
                if(ctx.body=='2'){
                  ctx.body="Transportador inclinado"
                  state.update({ Conjunto: ctx.body,Subconjunto:"NA"});
                  return gotoFlow(flowEscrito);
                }else{
                  if(ctx.body=='3'){
                    ctx.body="Transportador horizontal"
                    state.update({ Conjunto: ctx.body,Subconjunto:"NA"});
                    return gotoFlow(flowEscrito);
                  }else{
                    if(ctx.body=='4'){
                      ctx.body="Elevador tapa volteada"
                      state.update({ Conjunto: ctx.body,Subconjunto:"NA"});
                      return gotoFlow(flowEscrito);
                    }else{
                      if(ctx.body=='5'){
                        ctx.body="Inspector"
                        state.update({ Conjunto: ctx.body,Subconjunto:"NA"});
                        return gotoFlow(flowEscrito);
                      }else{
                        if(ctx.body=='6'){
                    ctx.body="Materia prima"
                    state.update({ Conjunto: ctx.body, Subconjunto: "NA" });
                    return gotoFlow(flowEscrito);}else{
                      if(ctx.body=='7'){
                    ctx.body="Falla Humana"
                    state.update({ Conjunto: ctx.body, Subconjunto: "NA" });
                    return gotoFlow(flowEscrito);}else{
                      if(ctx.body=='M2'){
                        return gotoFlow(flowcedula);
                      }else{
                        if(ctx.body=='m2'){
                          return gotoFlow(flowcedula);
                        }else{
                          return fallBack();
                        }
                      }
                    }
                    }
                    }
                      }
                    }
                    }
                  }
                }
            );


            const flowFallal8 = bot
            .addKeyword(bot.EVENTS.ACTION)
            .addAnswer(
              [
                `Escoge el numero correspondiente al conjunto del secador de botellas!👓`,
                `*1* Turbinas`,
                `*2* Mangueras`,
                `*3* Boquillas`,
                `*4* Guias`,
              ])
            .addAnswer(
            [
             `*Escoge el numero correcto* `,
             `🐵` ,
            ],
              { capture: true },
              async (ctx, { state,gotoFlow,fallBack }) => {
                if(ctx.body=='1'){
                  ctx.body="Turbinas"
                  state.update({ Conjunto: ctx.body, Subconjunto:"NA" });
                return gotoFlow(flowEscrito);
            }else{
              if(ctx.body=='2'){
                ctx.body="Mangueras"
                state.update({ Conjunto: ctx.body,Subconjunto:"NA" });
              return gotoFlow(flowEscrito);
          }else{
            if(ctx.body=='3'){
              ctx.body="Boquillas"
              state.update({ Conjunto: ctx.body,Subconjunto:"NA" });
            return gotoFlow(flowEscrito);
        }else{
          if(ctx.body=='4'){
            ctx.body="Guias"
            state.update({ Conjunto: ctx.body,Subconjunto:"NA"  });
          return gotoFlow(flowEscrito);
        }else{
          if(ctx.body=='M2'){
            return gotoFlow(flowcedula);
          }else{
            if(ctx.body=='m2'){
              return gotoFlow(flowcedula);
            }else{
              return fallBack();
            }
          }
                        }
        }
        }
          }
            }
            );


            const flowFallaL3CODIFICADOR = bot
            .addKeyword(bot.EVENTS.ACTION)
            .addAnswer(
              [
                `Escoge el numero correspondiente al conjunto del codificador!👓`,
                `*1* Unidad de secado de botella`,
                `*2* Cabezal de impresion`,
                `*3* Falla humana`,
                `*4* Sensores`,
              ])
            .addAnswer(
            [
             `*Escoge el numero correcto* `,
             `🐵` ,
            ],
              { capture: true },
              async (ctx, { state,gotoFlow,fallBack }) => {
                if(ctx.body=='1'){
                  ctx.body="Unidad de secado de botella"
                  state.update({ Conjunto: ctx.body, Subconjunto:"NA" });
                return gotoFlow(flowEscrito);
            }else{
              if(ctx.body=='2'){
                ctx.body="Cabezal de impresion"
                state.update({ Conjunto: ctx.body,Subconjunto:"NA" });
              return gotoFlow(flowEscrito);
          }else{
            if(ctx.body=='3'){
              ctx.body="Falla Humana"
              state.update({ Conjunto: ctx.body,Subconjunto:"NA" });
            return gotoFlow(flowEscrito);
        }else{
          if(ctx.body=='4'){
            ctx.body="Sensores"
            state.update({ Conjunto: ctx.body,Subconjunto:"NA"  });
          return gotoFlow(flowEscrito);
        }else{
          if(ctx.body=='M2'){
            return gotoFlow(flowcedula);
          }else{
            if(ctx.body=='m2'){
              return gotoFlow(flowcedula);
            }else{
              return fallBack();
            }
          }
                        }
        }
        }
          }
            }
            );


            const flowL3INSPECTOR = bot
            .addKeyword(bot.EVENTS.ACTION)
            .addAnswer(
              [
                `Escoge el numero correspondiente al conjunto del Inspector electronico!👓`,
                `*1* Correas`,
                `*2* Camaras`,
                `*3* Cristales`,
                `*4* Sensores`,
                `*5* Tablero electrico`,
                `*6* Transporte de botellas`,
                `*7* Falla Humana`,
                `*8* Materia prima`,
                `*9* Sistema de rechazo 1`,
                `*10* Sistema de rechazo 2`,
                `*11* Sistema de rechazo 3`,
              ])
            .addAnswer(
            [
             `*Escoge el numero correcto* `,
             `🐵` ,
            ],
              { capture: true },
              async (ctx, { state,gotoFlow,fallBack }) => {
                if(ctx.body=='1'){
                  ctx.body="Correas"
                  state.update({ Conjunto: ctx.body, Subconjunto:"NA" });
                return gotoFlow(flowEscrito);
            }else{
              if(ctx.body=='2'){
                ctx.body="Camaras"
                state.update({ Conjunto: ctx.body,Subconjunto:"NA" });
              return gotoFlow(flowEscrito);
          }else{
            if(ctx.body=='3'){
              ctx.body="Cristales"
              state.update({ Conjunto: ctx.body,Subconjunto:"NA" });
            return gotoFlow(flowEscrito);
        }else{
          if(ctx.body=='4'){
            ctx.body="Sensores"
            state.update({ Conjunto: ctx.body,Subconjunto:"NA"  });
          return gotoFlow(flowEscrito);
        }else{
          if(ctx.body=='5'){
            ctx.body="Tablero electrico"
            state.update({ Conjunto: ctx.body });
          return gotoFlow(flowconjtarjetas);
        }else{
          if(ctx.body=='6'){
            ctx.body="Transporte de botellas"
            state.update({ Conjunto: ctx.body});
          return gotoFlow(flowconjtransportebotellas);
        }else{
          if(ctx.body=='7'){
            ctx.body="Falla Humana"
            state.update({ Conjunto: ctx.body,Subconjunto:"NA"  });
          return gotoFlow(flowEscrito);
        }else{
          if(ctx.body=='8'){
            ctx.body="Materia prima"
            state.update({ Conjunto: ctx.body,Subconjunto:"NA"  });
          return gotoFlow(flowEscrito);
        }else{
          if(ctx.body=='9'){
            ctx.body="Sistema de rechazo 1"
            state.update({ Conjunto: ctx.body });
          return gotoFlow(flowconjsistema1);
        }else{
          if(ctx.body=='10'){
            ctx.body="Sistema de rechazo 2"
            state.update({ Conjunto: ctx.body });
          return gotoFlow(flowconjsistema2);
        }else{
          if(ctx.body=='11'){
            ctx.body="Sistema de rechazo 3"
            state.update({ Conjunto: ctx.body });
          return gotoFlow(flowconjsistema3);
        }else{
          if(ctx.body=='M2'){
            return gotoFlow(flowcedula);
          }else{
            if(ctx.body=='m2'){
              return gotoFlow(flowcedula);
            }else{
              return fallBack();
            }
          }
                        }
        }
        }
          }
            }}}}}}}}
            );



            const flowFallaL3LAVADORABOTELLAS = bot
            .addKeyword(bot.EVENTS.ACTION)
            .addAnswer(
              [
                `Escoge el numero correspondiente al conjunto de la lavadora de botellas!👓`,
                `*1* Transporte interno`,
                `*2* Mesa de descargue`,
                `*3* Tanque 1`,
                `*4* Tanque 2`,
                `*5* Tanque 3`,
                `*6* Tanque 4`,
                `*7* Tanque 5`,
                `*8* Caja de transmision`,
                `*9* Tablero electrico`,
                `*10* Quimicos`,
                `*11* Falla Humana`,
              ])
            .addAnswer(
            [
             `*Escoge el numero correcto* `,
             `🐵` ,
            ],
              { capture: true },
              async (ctx, { state,gotoFlow,fallBack }) => {
                if(ctx.body=='1'){
                  ctx.body="Transporte interno"
                  state.update({ Conjunto: ctx.body});
                return gotoFlow(flowconjL3Transporte);
            }else{
              if(ctx.body=='2'){
                ctx.body="Mesa de descargue"
                state.update({ Conjunto: ctx.body});
              return gotoFlow(flowconjL3Mesa);
          }else{
            if(ctx.body=='3'){
              ctx.body="Tanque 1"
              state.update({ Conjunto: ctx.body});
            return gotoFlow(flowconjTanque1);
        }else{
          if(ctx.body=='4'){
            ctx.body="Tanque 2"
            state.update({ Conjunto: ctx.body });
          return gotoFlow(flowconjTanque1);
        }else{
          if(ctx.body=='5'){
            ctx.body="Tanque 3"
            state.update({ Conjunto: ctx.body });
          return gotoFlow(flowconjTanque1);
        }else{
          if(ctx.body=='6'){
            ctx.body="Tanque 4"
            state.update({ Conjunto: ctx.body });
          return gotoFlow(flowconjTanque4);
        }else{
          if(ctx.body=='7'){
            ctx.body="Tanque 5"
            state.update({ Conjunto: ctx.body });
          return gotoFlow(flowconjTanque4);
        }else{
          if(ctx.body=='8'){
            ctx.body="Caja de transmision"
            state.update({ Conjunto: ctx.body });
          return gotoFlow(flowconjtransmision);
        }else{
          if(ctx.body=='9'){
            ctx.body="Tablero electrico"
            state.update({ Conjunto: ctx.body });
          return gotoFlow(flowconjL3Tab);
        }else{
          if(ctx.body=='10'){
            ctx.body="Quimicos"
            state.update({ Conjunto: ctx.body, Subconjunto:"NA" });
          return gotoFlow(flowEscrito);
        }else{
          if(ctx.body=='11'){
            ctx.body="Falla Humana"
            state.update({ Conjunto: ctx.body, Subconjunto:"NA" });
          return gotoFlow(flowEscrito);
        }else{
          if(ctx.body=='M2'){
            return gotoFlow(flowcedula);
          }else{
            if(ctx.body=='m2'){
              return gotoFlow(flowcedula);
            }else{
              return fallBack();
            }
          }
                        }
        }
        }
          }
            }
          }
        }
      }
    }}}}
            );


            const flowconjL3Transporte = bot
            .addKeyword(bot.EVENTS.ACTION)
            .addAnswer(
              [
                `Escoge el numero correspondiente al Subconjunto del transporte interno !👓`,
                `*1* Bolsillos`,
                `*2* Eslabones`,
              ])
            .addAnswer(
            [
             `*Escoge el numero correcto* `,
             `🐵` ,
            ],
              { capture: true },
              async (ctx, { state,gotoFlow,fallBack }) => {
                if(ctx.body=='1'){
                  ctx.body="Bolsillos"
                  state.update({ Subconjunto:ctx.body});
                return gotoFlow(flowEscrito);
            }else{
              if(ctx.body=='2'){
                ctx.body="Eslabones"
                state.update({ Subconjunto:ctx.body });
              return gotoFlow(flowEscrito);
          }else{
          if(ctx.body=='M2'){
            return gotoFlow(flowcedula);
          }else{
            if(ctx.body=='m2'){
              return gotoFlow(flowcedula);
            }else{
              return fallBack();
            }
          }
                        }
        }
        }
            );



            const flowconjcontiflow = bot
            .addKeyword(bot.EVENTS.ACTION)
            .addAnswer(
              [
                `Escoge el numero correspondiente al conjuntos del contiflow!👓`,
                `*1* Bombas`,
                `*2* Valvulas`,
                `*3* Sensores`,
                `*4* Tanques`,
                `*5* Tablero electrico`,
                `*6* Intercambiador de refrigeracion`,
                `*7* Falla Humana`,
              ])
            .addAnswer(
            [
             `*Escoge el numero correcto* `,
             `🐵` ,
            ],
              { capture: true },
              async (ctx, { state,gotoFlow,fallBack }) => {
                if(ctx.body=='1'){
                  ctx.body="Bombas"
                  state.update({ Conjunto:ctx.body,Subconjunto:"NA"});
                return gotoFlow(flowEscrito);
            }else{
              if(ctx.body=='2'){
                ctx.body="Valvulas"
                state.update({ Conjunto:ctx.body,Subconjunto:"NA" });
              return gotoFlow(flowEscrito);
          }else{
            if(ctx.body=='3'){
              ctx.body="Sensores"
              state.update({ Conjunto:ctx.body,Subconjunto:"NA" });
            return gotoFlow(flowEscrito);
        }else{
          if(ctx.body=='4'){
            ctx.body="Tanques"
            state.update({ Conjunto:ctx.body });
          return gotoFlow(flowsubTanques);
      }else{
        if(ctx.body=='5'){
          ctx.body="Tablero electrico"
          state.update({ Conjunto:ctx.body });
        return gotoFlow(flowconjL3Tab);
    }else{
      if(ctx.body=='6'){
        ctx.body="Intercambiador de refrigeracion"
        state.update({ Conjunto:ctx.body,Subconjunto:"NA" });
      return gotoFlow(flowEscrito);
  }else{
    if(ctx.body=='7'){
      ctx.body="Falla Humana"
      state.update({ Conjunto:ctx.body,Subconjunto:"NA" });
    return gotoFlow(flowEscrito);
}else{
          if(ctx.body=='M2'){
            return gotoFlow(flowcedula);
          }else{
            if(ctx.body=='m2'){
              return gotoFlow(flowcedula);
            }else{
              return fallBack();
            }
          }
                        }
        }
        }}}}}}
            );


            const flowsubTanques = bot
            .addKeyword(bot.EVENTS.ACTION)
            .addAnswer(
              [
                `Escoge el numero correspondiente al subconjunto de tanques!👓`,
                `*1* Tanque producto terminado`,
                `*2* Tanque de agua`,
                `*3* Recipiente de jarabe`,
              ])
            .addAnswer(
            [
             `*Escoge el numero correcto* `,
             `🐵` ,
            ],
              { capture: true },
              async (ctx, { state,gotoFlow,fallBack }) => {
                if(ctx.body== '1'){
                    ctx.body="Tanque producto terminado"
                    state.update({ Subconjunto: ctx.body });
                    return gotoFlow(flowEscrito);
                }else{
                  if(ctx.body=='2'){
                  ctx.body="Tanque de agua"
                  state.update({ Subconjunto: ctx.body });
                  return gotoFlow(flowEscrito);
                  } else{
                    if(ctx.body=='3'){
                      ctx.body="Recipiente de jarabe"
                      state.update({ Subconjunto: ctx.body });
                      return gotoFlow(flowEscrito);
                      }else{
                        if(ctx.body=='M2'){
                          return gotoFlow(flowcedula);
                        }else{
                          if(ctx.body=='m2'){
                            return gotoFlow(flowcedula);
                          }else{
                            return fallBack();
                          }
                        }
                      }
        
                  }
                }
              });

            const flowconjtarjetas = bot
            .addKeyword(bot.EVENTS.ACTION)
            .addAnswer(
              [
                `Escoge el numero correspondiente al Subconjunto del tablero electrico !👓`,
                `*1* Tarjetas de control`,
                `*2* UPS`,
              ])
            .addAnswer(
            [
             `*Escoge el numero correcto* `,
             `🐵` ,
            ],
              { capture: true },
              async (ctx, { state,gotoFlow,fallBack }) => {
                if(ctx.body=='1'){
                  ctx.body="Tarjetas de control"
                  state.update({ Subconjunto:ctx.body});
                return gotoFlow(flowEscrito);
            }else{
              if(ctx.body=='2'){
                ctx.body="UPS"
                state.update({ Subconjunto:ctx.body });
              return gotoFlow(flowEscrito);
          }else{
          if(ctx.body=='M2'){
            return gotoFlow(flowcedula);
          }else{
            if(ctx.body=='m2'){
              return gotoFlow(flowcedula);
            }else{
              return fallBack();
            }
          }
                        }
        }
        }
            );

            const flowconjtransportebotellas = bot
            .addKeyword(bot.EVENTS.ACTION)
            .addAnswer(
              [
                `Escoge el numero correspondiente al Subconjunto del transporte de botellas !👓`,
                `*1* Cadena`,
                `*2* Piñones`,
                `*3* Lubricacion`,
              ])
            .addAnswer(
            [
             `*Escoge el numero correcto* `,
             `🐵` ,
            ],
              { capture: true },
              async (ctx, { state,gotoFlow,fallBack }) => {
                if(ctx.body=='1'){
                  ctx.body="Cadena"
                  state.update({ Subconjunto:ctx.body});
                return gotoFlow(flowEscrito);
            }else{
              if(ctx.body=='2'){
                ctx.body="Piñones"
                state.update({ Subconjunto:ctx.body });
              return gotoFlow(flowEscrito);
          }else{
            if(ctx.body=='3'){
              ctx.body="Lubricacion"
              state.update({ Subconjunto:ctx.body });
            return gotoFlow(flowEscrito);
        }else{
          if(ctx.body=='M2'){
            return gotoFlow(flowcedula);
          }else{
            if(ctx.body=='m2'){
              return gotoFlow(flowcedula);
            }else{
              return fallBack();
            }
          }
                        }
        }
        }}
            );


            const flowconjsistema1 = bot
            .addKeyword(bot.EVENTS.ACTION)
            .addAnswer(
              [
                `Escoge el numero correspondiente al Subconjunto del sistema de rechazo 1 !👓`,
                `*1* Cilindros`,
                `*2* Guias`,
                `*3* Solenoides`,
              ])
            .addAnswer(
            [
             `*Escoge el numero correcto* `,
             `🐵` ,
            ],
              { capture: true },
              async (ctx, { state,gotoFlow,fallBack }) => {
                if(ctx.body=='1'){
                  ctx.body="Cilindros"
                  state.update({ Subconjunto:ctx.body});
                return gotoFlow(flowEscrito);
            }else{
              if(ctx.body=='2'){
                ctx.body="Guias"
                state.update({ Subconjunto:ctx.body });
              return gotoFlow(flowEscrito);
          }else{
            if(ctx.body=='3'){
              ctx.body="Solenoides"
              state.update({ Subconjunto:ctx.body });
            return gotoFlow(flowEscrito);
        }else{
          if(ctx.body=='M2'){
            return gotoFlow(flowcedula);
          }else{
            if(ctx.body=='m2'){
              return gotoFlow(flowcedula);
            }else{
              return fallBack();
            }
          }
                        }
        }
        }}
            );

            const flowconjsistema2 = bot
            .addKeyword(bot.EVENTS.ACTION)
            .addAnswer(
              [
                `Escoge el numero correspondiente al Subconjunto del sistema de rechazo 2 !👓`,
                `*1* Cilindros`,
                `*2* Guias`,
                `*3* Solenoides`,
                `*4* Dedos de expulsion`,
              ])
            .addAnswer(
            [
             `*Escoge el numero correcto* `,
             `🐵` ,
            ],
              { capture: true },
              async (ctx, { state,gotoFlow,fallBack }) => {
                if(ctx.body=='1'){
                  ctx.body="Cilindros"
                  state.update({ Subconjunto:ctx.body});
                return gotoFlow(flowEscrito);
            }else{
              if(ctx.body=='2'){
                ctx.body="Guias"
                state.update({ Subconjunto:ctx.body });
              return gotoFlow(flowEscrito);
          }else{
            if(ctx.body=='3'){
              ctx.body="Solenoides"
              state.update({ Subconjunto:ctx.body });
            return gotoFlow(flowEscrito);
        }else{
          if(ctx.body=='4'){
            ctx.body="Dedos de expulsion"
            state.update({ Subconjunto:ctx.body });
          return gotoFlow(flowEscrito);
      }else{
          if(ctx.body=='M2'){
            return gotoFlow(flowcedula);
          }else{
            if(ctx.body=='m2'){
              return gotoFlow(flowcedula);
            }else{
              return fallBack();
            }
          }
                        }
        }
        }}}
            );

            const flowconjsistema3 = bot
            .addKeyword(bot.EVENTS.ACTION)
            .addAnswer(
              [
                `Escoge el numero correspondiente al Subconjunto del sistema de rechazo 3 !👓`,
                `*1* Cilindros`,
                `*2* Guias`,
                `*3* Solenoides`,
                `*4* Dedos de expulsion`,
              ])
            .addAnswer(
            [
             `*Escoge el numero correcto* `,
             `🐵` ,
            ],
              { capture: true },
              async (ctx, { state,gotoFlow,fallBack }) => {
                if(ctx.body=='1'){
                  ctx.body="Cilindros"
                  state.update({ Subconjunto:ctx.body});
                return gotoFlow(flowEscrito);
            }else{
              if(ctx.body=='2'){
                ctx.body="Guias"
                state.update({ Subconjunto:ctx.body });
              return gotoFlow(flowEscrito);
          }else{
            if(ctx.body=='3'){
              ctx.body="Solenoides"
              state.update({ Subconjunto:ctx.body });
            return gotoFlow(flowEscrito);
        }else{
          if(ctx.body=='4'){
            ctx.body="Dedos de expulsion"
            state.update({ Subconjunto:ctx.body });
          return gotoFlow(flowEscrito);
      }else{
          if(ctx.body=='M2'){
            return gotoFlow(flowcedula);
          }else{
            if(ctx.body=='m2'){
              return gotoFlow(flowcedula);
            }else{
              return fallBack();
            }
          }
                        }
        }
        }}}
            );

            const flowconjL3Mesa = bot
            .addKeyword(bot.EVENTS.ACTION)
            .addAnswer(
              [
                `Escoge el numero correspondiente al Subconjunto de la mesa de descargue !👓`,
                `*1* Principal de salida`,
                `*2* Principal de entrada`,
                `*3* Transmision`,
                `*4* Cilindros`,
                `*5* Sensores`,
                `*6* Motores`,
                `*7* Cluth`,
              ])
            .addAnswer(
            [
             `*Escoge el numero correcto* `,
             `🐵` ,
            ],
              { capture: true },
              async (ctx, { state,gotoFlow,fallBack }) => {
                if(ctx.body=='1'){
                  ctx.body="Principal de salida"
                  state.update({ Subconjunto:ctx.body});
                return gotoFlow(flowEscrito);
            }else{
              if(ctx.body=='2'){
                ctx.body="Principal de entrada"
                state.update({ Subconjunto:ctx.body });
              return gotoFlow(flowEscrito);
          }else{
            if(ctx.body=='3'){
              ctx.body="Transmision"
              state.update({ Subconjunto:ctx.body });
            return gotoFlow(flowEscrito);
        }else{
          if(ctx.body=='4'){
            ctx.body="Cilindros"
            state.update({ Subconjunto:ctx.body });
          return gotoFlow(flowEscrito);
      }else{
        if(ctx.body=='5'){
          ctx.body="Sensores"
          state.update({ Subconjunto:ctx.body });
        return gotoFlow(flowEscrito);
    }else{
      if(ctx.body=='6'){
        ctx.body="Motores"
        state.update({ Subconjunto:ctx.body });
      return gotoFlow(flowEscrito);
  }else{
    if(ctx.body=='7'){
      ctx.body="Cluth"
      state.update({ Subconjunto:ctx.body });
    return gotoFlow(flowEscrito);
}else{
          if(ctx.body=='M2'){
            return gotoFlow(flowcedula);
          }else{
            if(ctx.body=='m2'){
              return gotoFlow(flowcedula);
            }else{
              return fallBack();
            }
          }
                        }
        }
        }}}}}}
            );


            const flowconjTanque1 = bot
            .addKeyword(bot.EVENTS.ACTION)
            .addAnswer(
              [
                `Escoge el numero correspondiente al Subconjunto del tanque !👓`,
                `*1* Tubos de enguaje`,
                `*2* Solenoides`,
                `*3* Sensores`,
                `*4* Motores`,
                `*5* Bombas`,
              ])
            .addAnswer(
            [
             `*Escoge el numero correcto* `,
             `🐵` ,
            ],
              { capture: true },
              async (ctx, { state,gotoFlow,fallBack }) => {
                if(ctx.body=='1'){
                  ctx.body="Tubos de enguaje"
                  state.update({ Subconjunto:ctx.body});
                return gotoFlow(flowEscrito);
            }else{
              if(ctx.body=='2'){
                ctx.body="Solenoides"
                state.update({ Subconjunto:ctx.body });
              return gotoFlow(flowEscrito);
          }else{
            if(ctx.body=='3'){
              ctx.body="Sensores"
              state.update({ Subconjunto:ctx.body });
            return gotoFlow(flowEscrito);
        }else{
          if(ctx.body=='4'){
            ctx.body="Motores"
            state.update({ Subconjunto:ctx.body });
          return gotoFlow(flowEscrito);
      }else{
        if(ctx.body=='5'){
          ctx.body="Bombas"
          state.update({ Subconjunto:ctx.body });
        return gotoFlow(flowEscrito);
    }else{
          if(ctx.body=='M2'){
            return gotoFlow(flowcedula);
          }else{
            if(ctx.body=='m2'){
              return gotoFlow(flowcedula);
            }else{
              return fallBack();
            }
          }
                        }
        }
        }}}}
            );


            const flowconjTanque4 = bot
            .addKeyword(bot.EVENTS.ACTION)
            .addAnswer(
              [
                `Escoge el numero correspondiente al Subconjunto del tanque !👓`,
                `*1* Intercambiador`,
                `*2* Solenoides`,
                `*3* Sensores`,
                `*4* Motores`,
                `*5* Bombas`,
              ])
            .addAnswer(
            [
             `*Escoge el numero correcto* `,
             `🐵` ,
            ],
              { capture: true },
              async (ctx, { state,gotoFlow,fallBack }) => {
                if(ctx.body=='1'){
                  ctx.body="Intercambiador"
                  state.update({ Subconjunto:ctx.body});
                return gotoFlow(flowEscrito);
            }else{
              if(ctx.body=='2'){
                ctx.body="Solenoides"
                state.update({ Subconjunto:ctx.body });
              return gotoFlow(flowEscrito);
          }else{
            if(ctx.body=='3'){
              ctx.body="Sensores"
              state.update({ Subconjunto:ctx.body });
            return gotoFlow(flowEscrito);
        }else{
          if(ctx.body=='4'){
            ctx.body="Motores"
            state.update({ Subconjunto:ctx.body });
          return gotoFlow(flowEscrito);
      }else{
        if(ctx.body=='5'){
          ctx.body="Bombas"
          state.update({ Subconjunto:ctx.body });
        return gotoFlow(flowEscrito);
    }else{
          if(ctx.body=='M2'){
            return gotoFlow(flowcedula);
          }else{
            if(ctx.body=='m2'){
              return gotoFlow(flowcedula);
            }else{
              return fallBack();
            }
          }
                        }
        }
        }}}}
            );

            const flowconjtransmision = bot
            .addKeyword(bot.EVENTS.ACTION)
            .addAnswer(
              [
                `Escoge el numero correspondiente al Subconjunto de la caja de transmision !👓`,
                `*1* Ejes`,
                `*2* Cadenas`,
                `*3* Lubricacion`,
              ])
            .addAnswer(
            [
             `*Escoge el numero correcto* `,
             `🐵` ,
            ],
              { capture: true },
              async (ctx, { state,gotoFlow,fallBack }) => {
                if(ctx.body=='1'){
                  ctx.body="Ejes"
                  state.update({ Subconjunto:ctx.body});
                return gotoFlow(flowEscrito);
            }else{
              if(ctx.body=='2'){
                ctx.body="Cadenas"
                state.update({ Subconjunto:ctx.body });
              return gotoFlow(flowEscrito);
          }else{
            if(ctx.body=='3'){
              ctx.body="Lubricacion"
              state.update({ Subconjunto:ctx.body });
            return gotoFlow(flowEscrito);
        }else{
          if(ctx.body=='M2'){
            return gotoFlow(flowcedula);
          }else{
            if(ctx.body=='m2'){
              return gotoFlow(flowcedula);
            }else{
              return fallBack();
            }
          }
                        }
        }
        }}
            );

            const flowL3LAVADORACAJAS = bot
            .addKeyword(bot.EVENTS.ACTION)
            .addAnswer(
              [
                `Escoge el numero correspondiente al conjunto de la lavadora de cajas!👓`,
                `*1* Tanques`,
                `*2* Transportador cajas`,
                `*3* Tablero electrico`,
              ])
            .addAnswer(
            [
             `*Escoge el numero correcto* `,
             `🐵` ,
            ],
              { capture: true },
              async (ctx, { state,gotoFlow,fallBack }) => {
                if(ctx.body=='1'){
                  ctx.body="Tanques"
                  state.update({ Conjunto: ctx.body});
                return gotoFlow(flowconjL3Tan);
            }else{
              if(ctx.body=='2'){
                ctx.body="Transportador cajas"
                state.update({ Conjunto: ctx.body});
              return gotoFlow(flowconjL3Trans);
          }else{
            if(ctx.body=='3'){
              ctx.body="Tablero electrico"
              state.update({ Conjunto: ctx.body});
            return gotoFlow(flowconjL3Tab);
        }else{
          if(ctx.body=='M2'){
            return gotoFlow(flowcedula);
          }else{
            if(ctx.body=='m2'){
              return gotoFlow(flowcedula);
            }else{
              return fallBack();
            }
          }
                        }
        }
        }
          }
            
            );


            const flowFallaL3LLENADORA = bot
            .addKeyword(bot.EVENTS.ACTION)
            .addAnswer(
              [
                `Escoge el numero correspondiente al conjunto de la llenadora!👓`,
                `*1* Coronador`,
                `*2* Calderin`,
                `*3* Cilindros`,
                `*4* Estrellas-guias`,
                `*5* Motorreductores`,
                `*6* Transporte de salida`,
                `*7* Transporte de entrada`,
                `*8* Tablero electrico`,
                `*9* Control botonera`,
                `*10* Sensores`,
                `*11* Falla Humana`,
                `*12* Materia prima`,
              ])
            .addAnswer(
            [
             `*Escoge el numero correcto* `,
             `🐵` ,
            ],
              { capture: true },
              async (ctx, { state,gotoFlow,fallBack }) => {
                if(ctx.body=='1'){
                  ctx.body="Coronador"
                  state.update({ Conjunto: ctx.body });
                return gotoFlow(flowL3LLENADORAcoronador);
            }else{
              if(ctx.body=='2'){
                ctx.body="Calderin"
                state.update({ Conjunto: ctx.body });
              return gotoFlow(flowL3LLENADORAcalderin);
          }else{
            if(ctx.body=='3'){
              ctx.body="Cilindros"
              state.update({ Conjunto: ctx.body,Subconjunto:"NA" });
            return gotoFlow(flowEscrito);
        }else{
          if(ctx.body=='4'){
            ctx.body="Estrellas-guias"
            state.update({ Conjunto: ctx.body,Subconjunto:"NA"  });
          return gotoFlow(flowEscrito);
        }else{
          if(ctx.body=='5'){
            ctx.body="Motorreductores"
            state.update({ Conjunto: ctx.body,Subconjunto:"NA"  });
          return gotoFlow(flowEscrito);
        }else{
          if(ctx.body=='6'){
            ctx.body="Transporte de salida"
            state.update({ Conjunto: ctx.body,Subconjunto:"NA"  });
          return gotoFlow(flowEscrito);
        }else{
          if(ctx.body=='7'){
            ctx.body="Transporte de entrada"
            state.update({ Conjunto: ctx.body,Subconjunto:"NA"  });
          return gotoFlow(flowEscrito);
        }else{
          if(ctx.body=='8'){
            ctx.body="Tablero electrico"
            state.update({ Conjunto: ctx.body,Subconjunto:"NA"  });
          return gotoFlow(flowEscrito);
        }else{
          if(ctx.body=='9'){
            ctx.body="Control botonera"
            state.update({ Conjunto: ctx.body,Subconjunto:"NA"  });
          return gotoFlow(flowEscrito);
        }else{
          if(ctx.body=='10'){
            ctx.body="Sensores"
            state.update({ Conjunto: ctx.body,Subconjunto:"NA"  });
          return gotoFlow(flowEscrito);
        }else{
          if(ctx.body=='11'){
            ctx.body="Falla Humana"
            state.update({ Conjunto: ctx.body,Subconjunto:"NA"  });
          return gotoFlow(flowEscrito);
        }else{
          if(ctx.body=='12'){
            ctx.body="Materia prima"
            state.update({ Conjunto: ctx.body,Subconjunto:"NA"  });
          return gotoFlow(flowEscrito);
        }else{
          if(ctx.body=='M2'){
            return gotoFlow(flowcedula);
          }else{
            if(ctx.body=='m2'){
              return gotoFlow(flowcedula);
            }else{
              return fallBack();
            }
          }
                        }
        }
        }
          }
            }
          }
        }
      }}
    }
  }
}
              }
            );

            const flowFallaL3DESPITILLADORA = bot
            .addKeyword(bot.EVENTS.ACTION)
            .addAnswer(
              [
                `Escoge el numero correspondiente al conjunto de la despitilladora!👓`,
                `*1* Unidad de mando`,
                `*2* Bombas de succion`,
                `*3* Motores`,
              ])
            .addAnswer(
            [
             `*Escoge el numero correcto* `,
             `🐵` ,
            ],
              { capture: true },
              async (ctx, { state,gotoFlow,fallBack }) => {
                if(ctx.body=='1'){
                  ctx.body="Unidad de mando"
                  state.update({ Conjunto: ctx.body, Subconjunto:"NA" });
                return gotoFlow(flowEscrito);
            }else{
              if(ctx.body=='2'){
                ctx.body="Bombas de succion"
                state.update({ Conjunto: ctx.body,Subconjunto:"NA" });
              return gotoFlow(flowEscrito);
          }else{
            if(ctx.body=='3'){
              ctx.body="Motores"
              state.update({ Conjunto: ctx.body,Subconjunto:"NA" });
            return gotoFlow(flowEscrito);
        }else{
          if(ctx.body=='M2'){
            return gotoFlow(flowcedula);
          }else{
            if(ctx.body=='m2'){
              return gotoFlow(flowcedula);
            }else{
              return fallBack();
            }
          }
                        }
        }
        }
          }
            );

            const flowFallaL3Empacadora = bot
            .addKeyword(bot.EVENTS.ACTION)
            .addAnswer(
              [
                `Escoge el numero correspondiente al conjunto de la Empacadora!👓`,
                `*1* MESA DE BOTELLAS`,
                `*2* CABEZAL DE BOTELLAS`,
                `*3* TRANSPORTE ENCAJONADO`,
                `*4* TRANSMISION PRINCIPAL`,
                `*5* TABLERO ELECTRICO`,
                `*6* ENTRADA DE CAJAS`,
                `*7* BOTONERAS`,
                `*8* FALLA HUMANA`,
                `*9* MATERIA PRIMA`,
                `*10* FOTOCELDAS DE SEGURIDAD`,

              ])
            .addAnswer(
            [
             `*Escoge el numero correcto* `,
             `🐵` ,
            ],
              { capture: true },
              async (ctx, { state,gotoFlow,fallBack }) => {
                if(ctx.body=='1'){
                  ctx.body="MESA DE BOTELLAS"
                  state.update({ Conjunto: ctx.body });
                return gotoFlow(flowconjL31);
            }else{
              if(ctx.body=='2'){
                ctx.body="CABEZAL DE BOTELLAS"
                state.update({ Conjunto: ctx.body});
              return gotoFlow(flowconjL32);
          }else{
            if(ctx.body=='3'){
              ctx.body="TRANSPORTE ENCAJONADO"
              state.update({ Conjunto: ctx.body});
            return gotoFlow(flowconjL33);
        }else{
          if(ctx.body=='4'){
            ctx.body="TRANSMISION PRINCIPAL"
            state.update({ Conjunto: ctx.body});
          return gotoFlow(flowconjL34);
      }else{
        if(ctx.body=='5'){
          ctx.body="TABLERO ELECTRICO"
          state.update({ Conjunto: ctx.body});
        return gotoFlow(flowconjL35);
    }else{
      if(ctx.body=='6'){
        ctx.body="ENTRADA DE CAJAS"
        state.update({ Conjunto: ctx.body});
      return gotoFlow(flowconjL36);
  }else{
    if(ctx.body=='7'){
      ctx.body="BOTONERAS"
      state.update({ Conjunto: ctx.body,Subconjunto:"NA" });
    return gotoFlow(flowEscrito);
  }else{
    if(ctx.body=='8'){
      ctx.body="FALLA HUMANA"
      state.update({ Conjunto: ctx.body,Subconjunto:"NA" });
    return gotoFlow(flowEscrito);
  }else{
      if(ctx.body=='9'){
        ctx.body="MATERIA PRIMA"
        state.update({ Conjunto: ctx.body,Subconjunto:"NA" });
      return gotoFlow(flowEscrito);
  }else{
    if(ctx.body=='10'){
      ctx.body="FOTOCELDAS DE SEGURIDAD"
      state.update({ Conjunto: ctx.body,Subconjunto:"NA" });
    return gotoFlow(flowEscrito);
  }else{
          if(ctx.body=='M2'){
            return gotoFlow(flowcedula);
          }else{
            if(ctx.body=='m2'){
              return gotoFlow(flowcedula);
            }else{
            return fallBack;
          }
            }
          }
                        }
        }
        }
      }
    }
  }
}
          }
        }
      }
            );

 const flowFallaL3Desempacadora = bot
            .addKeyword(bot.EVENTS.ACTION)
            .addAnswer(
              [
                `Escoge el numero correspondiente al conjunto de la Desempacadora!👓`,
                `*1* MESA DE BOTELLAS`,
                `*2* CABEZAL DE BOTELLAS`,
                `*3* TRANSPORTE DESENCAJONADO`,
                `*4* TRANSMISION PRINCIPAL`,
                `*5* TABLERO ELECTRICO`,
                `*6* ENTRADA DE CAJAS`,
                `*7* BOTONERAS`,
                `*8* FALLA HUMANA`,
                `*9* MATERIA PRIMA`,
                `*10* FOTOCELDAS DE SEGURIDAD`,

              ])
            .addAnswer(
            [
             `*Escoge el numero correcto* `,
             `🐵` ,
            ],
              { capture: true },
              async (ctx, { state,gotoFlow,fallBack }) => {
                if(ctx.body=='1'){
                  ctx.body="MESA DE BOTELLAS"
                  state.update({ Conjunto: ctx.body });
                return gotoFlow(flowconjL31D);
            }else{
              if(ctx.body=='2'){
                ctx.body="CABEZAL DE BOTELLAS"
                state.update({ Conjunto: ctx.body});
              return gotoFlow(flowconjL32);
          }else{
            if(ctx.body=='3'){
              ctx.body="TRANSPORTE DESENCAJONADO"
              state.update({ Conjunto: ctx.body});
            return gotoFlow(flowconjL33R);
        }else{
          if(ctx.body=='4'){
            ctx.body="TRANSMISION PRINCIPAL"
            state.update({ Conjunto: ctx.body});
          return gotoFlow(flowconjL34);
      }else{
        if(ctx.body=='5'){
          ctx.body="TABLERO ELECTRICO"
          state.update({ Conjunto: ctx.body});
        return gotoFlow(flowconjL35);
    }else{
      if(ctx.body=='6'){
        ctx.body="ENTRADA DE CAJAS"
        state.update({ Conjunto: ctx.body});
      return gotoFlow(flowconjL36);
  }else{
    if(ctx.body=='7'){
      ctx.body="BOTONERAS"
      state.update({ Conjunto: ctx.body,Subconjunto:"NA" });
    return gotoFlow(flowEscrito);
  }else{
    if(ctx.body=='8'){
      ctx.body="FALLA HUMANA"
      state.update({ Conjunto: ctx.body,Subconjunto:"NA" });
    return gotoFlow(flowEscrito);
  }else{
      if(ctx.body=='9'){
        ctx.body="MATERIA PRIMA"
        state.update({ Conjunto: ctx.body,Subconjunto:"NA" });
      return gotoFlow(flowEscrito);
  }else{
    if(ctx.body=='10'){
      ctx.body="FOTOCELDAS DE SEGURIDAD"
      state.update({ Conjunto: ctx.body,Subconjunto:"NA" });
    return gotoFlow(flowEscrito);
  }else{
          if(ctx.body=='M2'){
            return gotoFlow(flowcedula);
          }else{
            if(ctx.body=='m2'){
              return gotoFlow(flowcedula);
            }else{
            return fallBack;
          }
            }
          }
                        }
        }
        }
      }
    }
  }
}
          }
        }
      }
            );


            

            const flowFallaL3TRANSPORTADORBOTELLA = bot
            .addKeyword(bot.EVENTS.ACTION)
            .addAnswer(
              [
                `Escoge el numero correspondiente al conjunto del transportador de botellas!👓`,
                `*1* MOTORREDUCTORES`,
                `*2* CADENAS`,
                `*3* PIÑONES`,
                `*4* SENSORES`,
                `*5* TRANSPORTADOR DE RODILLOS`,
                `*6* TABLERO ELECTRICO`,

              ])
            .addAnswer(
            [
             `*Escoge el numero correcto* `,
             `🐵` ,
            ],
              { capture: true },
              async (ctx, { state,gotoFlow,fallBack }) => {
                if(ctx.body=='1'){
                  ctx.body="MOTORREDUCTORES"
                  state.update({ Conjunto: ctx.body, Subconjunto:"NA" });
                return gotoFlow(flowEscrito);
            }else{
              if(ctx.body=='2'){
                ctx.body="CADENAS"
                state.update({ Conjunto: ctx.body, Subconjunto:"NA"});
              return gotoFlow(flowEscrito);
          }else{
            if(ctx.body=='3'){
              ctx.body="PIÑONES"
              state.update({ Conjunto: ctx.body, Subconjunto:"NA"});
            return gotoFlow(flowEscrito);
        }else{
          if(ctx.body=='4'){
            ctx.body="SENSORES"
            state.update({ Conjunto: ctx.body,Subconjunto:"NA"});
          return gotoFlow(flowEscrito);
      }else{
        if(ctx.body=='5'){
          ctx.body="TRANSPORTADOR DE RODILLOS"
          state.update({ Conjunto: ctx.body,Subconjunto:"NA"});
        return gotoFlow(flowEscrito);
    }else{
      if(ctx.body=='6'){
        ctx.body="TABLERO ELECTRICO"
        state.update({ Conjunto: ctx.body,Subconjunto:"NA"});
      return gotoFlow(flowconjL36TR);
  }else{
          if(ctx.body=='M2'){
            return gotoFlow(flowcedula);
          }else{
            if(ctx.body=='m2'){
              return gotoFlow(flowcedula);
            }else{
            return fallBack;
          }
            }
          }
                        }
        }
        }
      }
    }
  }
            );


     const flowFallaL3TRANSPORTADORCAJAS = bot
            .addKeyword(bot.EVENTS.ACTION)
            .addAnswer(
              [
                `Escoge el numero correspondiente al conjunto del transportador de cajas!👓`,
                `*1* MOTORREDUCTORES`,
                `*2* CADENAS`,
                `*3* PIÑONES`,
                `*4* SENSORES`,
                `*5* TRANSPORTADOR DE RODILLOS`,
                `*6* TABLERO ELECTRICO`,

              ])
            .addAnswer(
            [
             `*Escoge el numero correcto* `,
             `🐵` ,
            ],
              { capture: true },
              async (ctx, { state,gotoFlow,fallBack }) => {
                if(ctx.body=='1'){
                  ctx.body="MOTORREDUCTORES"
                  state.update({ Conjunto: ctx.body, Subconjunto:"NA" });
                return gotoFlow(flowEscrito);
            }else{
              if(ctx.body=='2'){
                ctx.body="CADENAS"
                state.update({ Conjunto: ctx.body, Subconjunto:"NA"});
              return gotoFlow(flowEscrito);
          }else{
            if(ctx.body=='3'){
              ctx.body="PIÑONES"
              state.update({ Conjunto: ctx.body, Subconjunto:"NA"});
            return gotoFlow(flowEscrito);
        }else{
          if(ctx.body=='4'){
            ctx.body="SENSORES"
            state.update({ Conjunto: ctx.body,Subconjunto:"NA"});
          return gotoFlow(flowEscrito);
      }else{
        if(ctx.body=='5'){
          ctx.body="TRANSPORTADOR DE RODILLOS"
          state.update({ Conjunto: ctx.body,Subconjunto:"NA"});
        return gotoFlow(flowEscrito);
    }else{
      if(ctx.body=='6'){
        ctx.body="TABLERO ELECTRICO"
        state.update({ Conjunto: ctx.body,Subconjunto:"NA"});
      return gotoFlow(flowconjL36TR);
  }else{
          if(ctx.body=='M2'){
            return gotoFlow(flowcedula);
          }else{
            if(ctx.body=='m2'){
              return gotoFlow(flowcedula);
            }else{
            return fallBack;
          }
            }
          }
                        }
        }
        }
      }
    }
  }
            );

            const flowconjL31 = bot
            .addKeyword(bot.EVENTS.ACTION)
            .addAnswer(
              [
                `Escoge el numero correspondiente al subconjunto de la Mesa de botellas!👓`,
                `*1* EJES`,
                `*2* PIÑONES`,
                `*3* CADENAS`,
                `*4* SENSORES`,
                `*5* AGITADOR DE BOTELLA`,
                `*6* SEPARADOR DE BOTELLA`,
                `*7* MOTORREDUCTOR`,
                `*8* TRANSFERENCIA DE BOTELLAS`,

              ])
            .addAnswer(
            [
             `*Escoge el numero correcto* `,
             `🐵` ,
            ],
              { capture: true },
              async (ctx, { state,gotoFlow,fallBack }) => {
                if(ctx.body=='1'){
                  ctx.body="EJES"
                  state.update({ Subconjunto: ctx.body });
                return gotoFlow(flowEscrito);
            }else{
              if(ctx.body=='2'){
                ctx.body="PIÑONES"
                state.update({ Subconjunto: ctx.body});
              return gotoFlow(flowEscrito);
          }else{
            if(ctx.body=='3'){
              ctx.body="CADENAS"
              state.update({ Subconjunto: ctx.body});
            return gotoFlow(flowEscrito);
        }else{
          if(ctx.body=='4'){
            ctx.body="SENSORES"
            state.update({ Subconjunto: ctx.body});
          return gotoFlow(flowEscrito);
      }else{
        if(ctx.body=='5'){
          ctx.body="AGITADOR DE BOTELLA"
          state.update({ Subconjunto: ctx.body});
        return gotoFlow(flowEscrito);
    }else{
      if(ctx.body=='6'){
        ctx.body="SEPARADOR DE BOTELLA"
        state.update({ Subconjunto: ctx.body});
      return gotoFlow(flowEscrito);
  }else{
    if(ctx.body=='7'){
      ctx.body="MOTORREDUCTOR"
      state.update({ Subconjunto: ctx.body});
    return gotoFlow(flowEscrito);
  }else{
    if(ctx.body=='8'){
      ctx.body="TRANSFERENCIA DE BOTELLAS"
      state.update({ Subconjunto: ctx.body});
    return gotoFlow(flowEscrito);
  }else{
          if(ctx.body=='M2'){
            return gotoFlow(flowcedula);
          }else{
            if(ctx.body=='m2'){
              return gotoFlow(flowcedula);
            }else{
            return fallBack;
          }
            }
          }
                        }
        }
        }
      }
    }
  }
}
          }
            );

            const flowL3LLENADORAcalderin = bot
            .addKeyword(bot.EVENTS.ACTION)
            .addAnswer(
              [
                `Escoge el numero correspondiente al subconjunto del calderin!👓`,
                `*1* Valvulas`,
                `*2* Deposito de bebida`,
                `*3* Centradores`,
                `*4* Soporte`,
                `*5* Mecanismo elevacion`,

              ])
            .addAnswer(
            [
             `*Escoge el numero correcto* `,
             `🐵` ,
            ],
              { capture: true },
              async (ctx, { state,gotoFlow,fallBack }) => {
                if(ctx.body=='1'){
                  ctx.body="Valvulas"
                  state.update({ Subconjunto: ctx.body });
                return gotoFlow(flowEscrito);
            }else{
              if(ctx.body=='2'){
                ctx.body="Deposito de bebida"
                state.update({ Subconjunto: ctx.body});
              return gotoFlow(flowEscrito);
          }else{
            if(ctx.body=='3'){
              ctx.body="Centradores"
              state.update({ Subconjunto: ctx.body});
            return gotoFlow(flowEscrito);
        }else{
          if(ctx.body=='4'){
            ctx.body="Soporte"
            state.update({ Subconjunto: ctx.body});
          return gotoFlow(flowEscrito);
      }else{
        if(ctx.body=='5'){
          ctx.body="Mecanismo elevacion"
          state.update({ Subconjunto: ctx.body});
        return gotoFlow(flowEscrito);
    }else{
          if(ctx.body=='M2'){
            return gotoFlow(flowcedula);
          }else{
            if(ctx.body=='m2'){
              return gotoFlow(flowcedula);
            }else{
            return fallBack;
          }
            }
          }
                        }
        }
        }
      }
    }
            );

            const flowL3LLENADORAcoronador = bot
            .addKeyword(bot.EVENTS.ACTION)
            .addAnswer(
              [
                `Escoge el numero correspondiente al subconjunto del coronador!👓`,
                `*1* Disco`,
                `*2* Bajante`,
                `*3* Tolva`,
                `*4* Banda bajante`,
                `*5* Coronadores`,

              ])
            .addAnswer(
            [
             `*Escoge el numero correcto* `,
             `🐵` ,
            ],
              { capture: true },
              async (ctx, { state,gotoFlow,fallBack }) => {
                if(ctx.body=='1'){
                  ctx.body="Disco"
                  state.update({ Subconjunto: ctx.body });
                return gotoFlow(flowEscrito);
            }else{
              if(ctx.body=='2'){
                ctx.body="Bajante"
                state.update({ Subconjunto: ctx.body});
              return gotoFlow(flowEscrito);
          }else{
            if(ctx.body=='3'){
              ctx.body="Tolva"
              state.update({ Subconjunto: ctx.body});
            return gotoFlow(flowEscrito);
        }else{
          if(ctx.body=='4'){
            ctx.body="Banda bajante"
            state.update({ Subconjunto: ctx.body});
          return gotoFlow(flowEscrito);
      }else{
        if(ctx.body=='5'){
          ctx.body="Coronadores"
          state.update({ Subconjunto: ctx.body});
        return gotoFlow(flowEscrito);
    }else{
          if(ctx.body=='M2'){
            return gotoFlow(flowcedula);
          }else{
            if(ctx.body=='m2'){
              return gotoFlow(flowcedula);
            }else{
            return fallBack;
          }
            }
          }
                        }
        }
        }
      }
    }
            );


            const flowconjL3Tan = bot
            .addKeyword(bot.EVENTS.ACTION)
            .addAnswer(
              [
                `Escoge el numero correspondiente al subconjunto de los tanques!👓`,
                `*1* Tanque 1`,
                `*2* Tanque 2`,
                `*3* Tanque 3`,


              ])
            .addAnswer(
            [
             `*Escoge el numero correcto* `,
             `🐵` ,
            ],
              { capture: true },
              async (ctx, { state,gotoFlow,fallBack }) => {
                if(ctx.body=='1'){
                  ctx.body="Tanque 1"
                  state.update({ Subconjunto: ctx.body });
                return gotoFlow(flowEscrito);
            }else{
              if(ctx.body=='2'){
                ctx.body="Tanque 2"
                state.update({ Subconjunto: ctx.body});
              return gotoFlow(flowEscrito);
          }else{
            if(ctx.body=='3'){
              ctx.body="Tanque 3"
              state.update({ Subconjunto: ctx.body});
            return gotoFlow(flowEscrito);
        }else{
          if(ctx.body=='M2'){
            return gotoFlow(flowcedula);
          }else{
            if(ctx.body=='m2'){
              return gotoFlow(flowcedula);
            }else{
            return fallBack;
          }
            }
          }
                        }
        }
        }
            );

            const flowconjL3Trans = bot
            .addKeyword(bot.EVENTS.ACTION)
            .addAnswer(
              [
                `Escoge el numero correspondiente al subconjunto de la transportadora de cajas!👓`,
                `*1* Transporte superior`,
                `*2* Transporte interior`,
                `*3* Sensores`,


              ])
            .addAnswer(
            [
             `*Escoge el numero correcto* `,
             `🐵` ,
            ],
              { capture: true },
              async (ctx, { state,gotoFlow,fallBack }) => {
                if(ctx.body=='1'){
                  ctx.body="Transporte superior"
                  state.update({ Subconjunto: ctx.body });
                return gotoFlow(flowEscrito);
            }else{
              if(ctx.body=='2'){
                ctx.body="Transporte interior"
                state.update({ Subconjunto: ctx.body});
              return gotoFlow(flowEscrito);
          }else{
            if(ctx.body=='3'){
              ctx.body="Sensores"
              state.update({ Subconjunto: ctx.body});
            return gotoFlow(flowEscrito);
        }else{
          if(ctx.body=='M2'){
            return gotoFlow(flowcedula);
          }else{
            if(ctx.body=='m2'){
              return gotoFlow(flowcedula);
            }else{
            return fallBack;
          }
            }
          }
                        }
        }
        }
            );


            const flowconjL3Tab = bot
            .addKeyword(bot.EVENTS.ACTION)
            .addAnswer(
              [
                `Escoge el numero correspondiente al subconjunto del tablero electrico!👓`,
                `*1* Contactores`,
                `*2* Variadores`,
                `*3* PLC`,


              ])
            .addAnswer(
            [
             `*Escoge el numero correcto* `,
             `🐵` ,
            ],
              { capture: true },
              async (ctx, { state,gotoFlow,fallBack }) => {
                if(ctx.body=='1'){
                  ctx.body="Contactores"
                  state.update({ Subconjunto: ctx.body });
                return gotoFlow(flowEscrito);
            }else{
              if(ctx.body=='2'){
                ctx.body="Variadores"
                state.update({ Subconjunto: ctx.body});
              return gotoFlow(flowEscrito);
          }else{
            if(ctx.body=='3'){
              ctx.body="PLC"
              state.update({ Subconjunto: ctx.body});
            return gotoFlow(flowEscrito);
        }else{
          if(ctx.body=='M2'){
            return gotoFlow(flowcedula);
          }else{
            if(ctx.body=='m2'){
              return gotoFlow(flowcedula);
            }else{
            return fallBack;
          }
            }
          }
                        }
        }
        }
            );


            const flowconjL31D = bot
            .addKeyword(bot.EVENTS.ACTION)
            .addAnswer(
              [
                `Escoge el numero correspondiente al subconjunto de la Mesa de botellas!👓`,
                `*1* EJES`,
                `*2* PIÑONES`,
                `*3* CADENAS`,
                `*4* SENSORES`,
                `*5* MOTORREDUCTOR`,
                `*6* TRANSFERENCIA DE BOTELLAS`,

              ])
            .addAnswer(
            [
             `*Escoge el numero correcto* `,
             `🐵` ,
            ],
              { capture: true },
              async (ctx, { state,gotoFlow,fallBack }) => {
                if(ctx.body=='1'){
                  ctx.body="EJES"
                  state.update({ Subconjunto: ctx.body });
                return gotoFlow(flowEscrito);
            }else{
              if(ctx.body=='2'){
                ctx.body="PIÑONES"
                state.update({ Subconjunto: ctx.body});
              return gotoFlow(flowEscrito);
          }else{
            if(ctx.body=='3'){
              ctx.body="CADENAS"
              state.update({ Subconjunto: ctx.body});
            return gotoFlow(flowEscrito);
        }else{
          if(ctx.body=='4'){
            ctx.body="SENSORES"
            state.update({ Subconjunto: ctx.body});
          return gotoFlow(flowEscrito);
      }else{
    if(ctx.body=='5'){
      ctx.body="MOTORREDUCTOR"
      state.update({ Subconjunto: ctx.body });
    return gotoFlow(flowEscrito);
  }else{
    if(ctx.body=='6'){
      ctx.body="TRANSFERENCIA DE BOTELLAS"
      state.update({ Subconjunto: ctx.body});
    return gotoFlow(flowEscrito);
  }else{
          if(ctx.body=='M2'){
            return gotoFlow(flowcedula);
          }else{
            if(ctx.body=='m2'){
              return gotoFlow(flowcedula);
            }else{
            return fallBack;
          }
            }
          }
                        }
        }
        }
      }
    }
  }

            );

            const flowconjL36TR = bot
            .addKeyword(bot.EVENTS.ACTION)
            .addAnswer(
              [
                `Escoge el numero correspondiente al subconjunto del tablero electrico!👓`,
                `*1* PLC`,
                `*2* VARIADORES`,
                `*3* CONTACTORES`,

              ])
            .addAnswer(
            [
             `*Escoge el numero correcto* `,
             `🐵` ,
            ],
              { capture: true },
              async (ctx, { state,gotoFlow,fallBack }) => {
                if(ctx.body=='1'){
                  ctx.body="PLC"
                  state.update({ Subconjunto: ctx.body });
                return gotoFlow(flowEscrito);
            }else{
              if(ctx.body=='2'){
                ctx.body="VARIADORES"
                state.update({ Subconjunto: ctx.body});
              return gotoFlow(flowEscrito);
          }else{
            if(ctx.body=='3'){
              ctx.body="CONTACTORES"
              state.update({ Subconjunto: ctx.body});
            return gotoFlow(flowEscrito);
        }else{
          if(ctx.body=='M2'){
            return gotoFlow(flowcedula);
          }else{
            if(ctx.body=='m2'){
              return gotoFlow(flowcedula);
            }else{
            return fallBack;
          }
            }
          }
                        }
        }
        }
            );

  
            const flowconjL32 = bot
            .addKeyword(bot.EVENTS.ACTION)
            .addAnswer(
              [
                `Escoge el numero correspondiente al subconjunto del cabezal de botellas!👓`,
                `*1* SENSORES`,
                `*2* VASTAGO`,
                `*3* SOLENOIDE`,
                `*4* COPAS DE SUJECCION`,
                `*5* MANGUERAS`,
                `*6* CILINDROS`,

              ])
            .addAnswer(
            [
             `*Escoge el numero correcto* `,
             `🐵` ,
            ],
              { capture: true },
              async (ctx, { state,gotoFlow,fallBack }) => {
                if(ctx.body=='1'){
                  ctx.body="SENSORES"
                  state.update({ Subconjunto: ctx.body });
                return gotoFlow(flowEscrito);
            }else{
              if(ctx.body=='2'){
                ctx.body="VASTAGO"
                state.update({ Subconjunto: ctx.body});
              return gotoFlow(flowEscrito);
          }else{
            if(ctx.body=='3'){
              ctx.body="SOLENOIDE"
              state.update({ Subconjunto: ctx.body});
            return gotoFlow(flowEscrito);
        }else{
          if(ctx.body=='4'){
            ctx.body="COPAS DE SUJECCION"
            state.update({ Subconjunto: ctx.body});
          return gotoFlow(flowEscrito);
      }else{
        if(ctx.body=='5'){
          ctx.body="MANGUERAS"
          state.update({ Subconjunto: ctx.body});
        return gotoFlow(flowEscrito);
    }else{
      if(ctx.body=='6'){
        ctx.body="CILINDROS"
        state.update({ Subconjunto: ctx.body});
      return gotoFlow(flowEscrito);
  }else{
          if(ctx.body=='M2'){
            return gotoFlow(flowcedula);
          }else{
            if(ctx.body=='m2'){
              return gotoFlow(flowcedula);
            }else{
            return fallBack;
          }
            }
          }
                        }
        }
        }
      }
    }
  }
            );


            const flowconjL33 = bot
            .addKeyword(bot.EVENTS.ACTION)
            .addAnswer(
              [
                `Escoge el numero correspondiente al subconjunto del transporte encajonado!👓`,
                `*1* SENSORES`,
                `*2* CADENAS`,
                `*3* CILINDRO`,
                `*4* MOTORREDUCTOR`,
                `*5* PARRILLA DE ENCAJONAMIENTO`,

              ])
            .addAnswer(
            [
             `*Escoge el numero correcto* `,
             `🐵` ,
            ],
              { capture: true },
              async (ctx, { state,gotoFlow,fallBack }) => {
                if(ctx.body=='1'){
                  ctx.body="SENSORES"
                  state.update({ Subconjunto: ctx.body });
                return gotoFlow(flowEscrito);
            }else{
              if(ctx.body=='2'){
                ctx.body="CADENAS"
                state.update({ Subconjunto: ctx.body});
              return gotoFlow(flowEscrito);
          }else{
            if(ctx.body=='3'){
              ctx.body="CILINDRO"
              state.update({ Subconjunto: ctx.body});
            return gotoFlow(flowEscrito);
        }else{
          if(ctx.body=='4'){
            ctx.body="MOTORREDUCTOR"
            state.update({ Subconjunto: ctx.body});
          return gotoFlow(flowEscrito);
      }else{
        if(ctx.body=='5'){
          ctx.body="PARRILLA DE ENCAJONAMIENTO"
          state.update({ Subconjunto: ctx.body});
        return gotoFlow(flowEscrito);
    }else{
          if(ctx.body=='M2'){
            return gotoFlow(flowcedula);
          }else{
            if(ctx.body=='m2'){
              return gotoFlow(flowcedula);
            }else{
            return fallBack;
          }
            }
          }
                        }
        }
        }
      }
    }
            );

            const flowconjL33R = bot
            .addKeyword(bot.EVENTS.ACTION)
            .addAnswer(
              [
                `Escoge el numero correspondiente al subconjunto del transporte desencajonado!👓`,
                `*1* SENSORES`,
                `*2* CADENAS`,
                `*3* CILINDRO`,
                `*4* MOTORREDUCTOR`,

              ])
            .addAnswer(
            [
             `*Escoge el numero correcto* `,
             `🐵` ,
            ],
              { capture: true },
              async (ctx, { state,gotoFlow,fallBack }) => {
                if(ctx.body=='1'){
                  ctx.body="SENSORES"
                  state.update({ Subconjunto: ctx.body });
                return gotoFlow(flowEscrito);
            }else{
              if(ctx.body=='2'){
                ctx.body="CADENAS"
                state.update({ Subconjunto: ctx.body});
              return gotoFlow(flowEscrito);
          }else{
            if(ctx.body=='3'){
              ctx.body="CILINDRO"
              state.update({ Subconjunto: ctx.body});
            return gotoFlow(flowEscrito);
        }else{
          if(ctx.body=='4'){
            ctx.body="MOTORREDUCTOR"
            state.update({ Subconjunto: ctx.body});
          return gotoFlow(flowEscrito);
      }else{
        if(ctx.body=='5'){
          ctx.body="PARRILLA DE ENCAJONAMIENTO"
          state.update({ Subconjunto: ctx.body});
        return gotoFlow(flowEscrito);
    }else{
          if(ctx.body=='M2'){
            return gotoFlow(flowcedula);
          }else{
            if(ctx.body=='m2'){
              return gotoFlow(flowcedula);
            }else{
            return fallBack;
          }
            }
          }
                        }
        }
        }
      }
    }
            );

            const flowconjL34 = bot
            .addKeyword(bot.EVENTS.ACTION)
            .addAnswer(
              [
                `Escoge el numero correspondiente al subconjunto de transmision principal!👓`,
                `*1* SENSORES`,
                `*2* MOTORES`,
                `*3* CARDAN`,
                `*4* BRAZOS DE CARGA`,

              ])
            .addAnswer(
            [
             `*Escoge el numero correcto* `,
             `🐵` ,
            ],
              { capture: true },
              async (ctx, { state,gotoFlow,fallBack }) => {
                if(ctx.body=='1'){
                  ctx.body="SENSORES"
                  state.update({ Subconjunto: ctx.body });
                return gotoFlow(flowEscrito);
            }else{
              if(ctx.body=='2'){
                ctx.body="MOTORES"
                state.update({ Subconjunto: ctx.body});
              return gotoFlow(flowEscrito);
          }else{
            if(ctx.body=='3'){
              ctx.body="CARDAN"
              state.update({ Subconjunto: ctx.body});
            return gotoFlow(flowEscrito);
        }else{
          if(ctx.body=='4'){
            ctx.body="BRAZOS DE CARGA"
            state.update({ Subconjunto: ctx.body});
          return gotoFlow(flowEscrito);
      }else{
          if(ctx.body=='M2'){
            return gotoFlow(flowcedula);
          }else{
            if(ctx.body=='m2'){
              return gotoFlow(flowcedula);
            }else{
            return fallBack;
          }
            }
          }
                        }
        }
        }
      }
            );


            const flowconjL35 = bot
            .addKeyword(bot.EVENTS.ACTION)
            .addAnswer(
              [
                `Escoge el numero correspondiente al subconjunto del tablero electrico!👓`,
                `*1* PLC`,
                `*2* VARIADORES`,
                `*3* CONTACTORES`,
                `*4* CONTROL NEUMATICO`,

              ])
            .addAnswer(
            [
             `*Escoge el numero correcto* `,
             `🐵` ,
            ],
              { capture: true },
              async (ctx, { state,gotoFlow,fallBack }) => {
                if(ctx.body=='1'){
                  ctx.body="PLC"
                  state.update({ Subconjunto: ctx.body });
                return gotoFlow(flowEscrito);
            }else{
              if(ctx.body=='2'){
                ctx.body="VARIADORES"
                state.update({ Subconjunto: ctx.body});
              return gotoFlow(flowEscrito);
          }else{
            if(ctx.body=='3'){
              ctx.body="CONTACTORES"
              state.update({ Subconjunto: ctx.body});
            return gotoFlow(flowEscrito);
        }else{
          if(ctx.body=='4'){
            ctx.body="CONTROL NEUMATICO"
            state.update({ Subconjunto: ctx.body});
          return gotoFlow(flowEscrito);
      }else{
          if(ctx.body=='M2'){
            return gotoFlow(flowcedula);
          }else{
            if(ctx.body=='m2'){
              return gotoFlow(flowcedula);
            }else{
            return fallBack;
          }
            }
          }
                        }
        }
        }
      }
            );


            const flowconjL36 = bot
            .addKeyword(bot.EVENTS.ACTION)
            .addAnswer(
              [
                `Escoge el numero correspondiente al subconjunto de entrada de cajas!👓`,
                `*1* TRANSPORTE BASCULANTE`,
                `*2* CADENAS`,
                `*3* CILINDRO`,
                `*4* MOTORREDUCTOR`,

              ])
            .addAnswer(
            [
             `*Escoge el numero correcto* `,
             `🐵` ,
            ],
              { capture: true },
              async (ctx, { state,gotoFlow,fallBack }) => {
                if(ctx.body=='1'){
                  ctx.body="TRANSPORTE BASCULANTE"
                  state.update({ Subconjunto: ctx.body });
                return gotoFlow(flowEscrito);
            }else{
              if(ctx.body=='2'){
                ctx.body="CADENAS"
                state.update({ Subconjunto: ctx.body});
              return gotoFlow(flowEscrito);
          }else{
            if(ctx.body=='3'){
              ctx.body="CILINDRO"
              state.update({ Subconjunto: ctx.body});
            return gotoFlow(flowEscrito);
        }else{
          if(ctx.body=='4'){
            ctx.body="MOTORREDUCTOR"
            state.update({ Subconjunto: ctx.body});
          return gotoFlow(flowEscrito);
      }else{
          if(ctx.body=='M2'){
            return gotoFlow(flowcedula);
          }else{
            if(ctx.body=='m2'){
              return gotoFlow(flowcedula);
            }else{
            return fallBack;
          }
            }
          }
                        }
        }
        }
      }
            );


  const flowFalla8 = bot
            .addKeyword(bot.EVENTS.ACTION)
            .addAnswer(
              [
                `Escoge el numero correspondiente al conjunto del contiflow!👓`,
                `*1* Entrada agua`,
                `*2* Entrada jarabe`,
                `*3* Tanque Mezcla`,
                `*4* Intercambiador de refrigeración`,
                `*5* Materia prima`,
                `*6* Falla Humana`,
              ])
            .addAnswer(
            [
             `*Escoge el numero correcto* `,
             `🐵` ,
            ],
              { capture: true },
              async (ctx, { state,gotoFlow,fallBack }) => {
                if(ctx.body=='1'){
                  ctx.body="Entrada agua"
                  state.update({ Conjunto: ctx.body });
                return gotoFlow(flowEquipo81);
            }else{
                if(ctx.body=='2'){
                  ctx.body="Entrada jarabe"
                  state.update({ Conjunto: ctx.body });
                  return gotoFlow(flowEquipo81);
                }else{
                  if(ctx.body=='3'){
                    ctx.body="Tanque mezcla"
                    state.update({ Conjunto: ctx.body });
                    return gotoFlow(flowEquipo81);
                  }else{
                    if(ctx.body=='4'){
                      ctx.body="Intercambiador de refrigeración"
                      state.update({ Conjunto: ctx.body, Subconjunto:"NA" });
                      return gotoFlow(flowEscrito);
                    }else{
                      if(ctx.body=='5'){
                    ctx.body="Materia Prima"
                    state.update({ Conjunto: ctx.body, Subconjunto: "NA" });
                    return gotoFlow(flowEscrito);}else{
                      if(ctx.body=='6'){
                    ctx.body="Falla Humana"
                    state.update({ Conjunto: ctx.body, Subconjunto: "NA" });
                    return gotoFlow(flowEscrito);}else{
                      if(ctx.body=='M2'){
                        return gotoFlow(flowcedula);
                      }else{
                        if(ctx.body=='m2'){
                          return gotoFlow(flowcedula);
                        }else{
                          return fallBack();
                        }
                      }
                    }
                    }
                    }
                    }
                    }
                  }
                }
            );

const flowEquipo81 = bot
            .addKeyword(bot.EVENTS.ACTION)
            .addAnswer(
              [
                `Escoge el numero correspondiente al subconjunto!👓`,
                `*1* Válvulas`,
                `*2* Bombas`,
                `*3* Sensores`,
              ])
            .addAnswer(
            [
             `*Escoge el numero correcto* `,
             `🐵` ,
            ],
              { capture: true },
              async (ctx, { state,gotoFlow,fallBack }) => {
                if(ctx.body== '1'){
                    ctx.body="Válvulas"
                    state.update({ Subconjunto: ctx.body });
                    return gotoFlow(flowEscrito);
                }else{
                  if(ctx.body=='2'){
                  ctx.body="Bombas"
                  state.update({ Subconjunto: ctx.body });
                  return gotoFlow(flowEscrito);
                  } else{
                    if(ctx.body=='3'){
                      ctx.body="Sensores"
                      state.update({ Subconjunto: ctx.body });
                      return gotoFlow(flowEscrito);
                      }else{
                        if(ctx.body=='M2'){
                          return gotoFlow(flowcedula);
                        }else{
                          if(ctx.body=='m2'){
                            return gotoFlow(flowcedula);
                          }else{
                            return fallBack();
                          }
                        }
                      }
        
                  }
                }
              });
    
              const flowFallal9 = bot
              .addKeyword(bot.EVENTS.ACTION)
              .addAnswer(
                [
                  `Escoge el numero correspondiente al conjunto del transportador!👓`,
                  `*1* Motores`,
                  `*2* Piñones`,
                  `*3* Rodillos`,
                  `*4* Bandas`,
                ])
              .addAnswer(
              [
               `*Escoge el numero correcto* `,
               `🐵` ,
              ],
                { capture: true },
                async (ctx, { state,gotoFlow,fallBack }) => {
                  if(ctx.body=='1'){
                    ctx.body="Motores"
                    state.update({ Conjunto: ctx.body});
                  return gotoFlow(flowEquipol91);
              }else{
                if(ctx.body=='2'){
                  ctx.body="Piñones"
                  state.update({ Conjunto: ctx.body,Subconjunto:"NA" });
                return gotoFlow(flowEscrito);
            }else{
              if(ctx.body=='3'){
                ctx.body="Rodillos"
                state.update({ Conjunto: ctx.body,Subconjunto:"NA" });
              return gotoFlow(flowEscrito);
          }else{
            if(ctx.body=='4'){
              ctx.body="Bandas"
              state.update({ Conjunto: ctx.body,Subconjunto:"NA"  });
            return gotoFlow(flowEscrito);
          }else{
            if(ctx.body=='M2'){
              return gotoFlow(flowcedula);
            }else{
              if(ctx.body=='m2'){
                return gotoFlow(flowcedula);
              }else{
                return fallBack();
              }
            }
                          }
          }
          }
            }
              }
              );
    
              const flowEquipol91 = bot
              .addKeyword(bot.EVENTS.ACTION)
              .addAnswer(
                [
                  `Escoge el numero correspondiente al subconjunto!👓`,
                  `*1* Caja de transmision`,
                  `*2* Correas`,
                  `*3* Poleas`,
                  `*4* Nivel aceite`,
                ])
              .addAnswer(
              [
               `*Escoge el numero correcto* `,
               `🐵` ,
              ],
                { capture: true },
                async (ctx, { state,gotoFlow,fallBack }) => {
                  if(ctx.body== '1'){
                      ctx.body="Caja de transmision"
                      state.update({ Subconjunto: ctx.body });
                      return gotoFlow(flowEscrito);
                  }else{
                    if(ctx.body=='2'){
                    ctx.body="Correas"
                    state.update({ Subconjunto: ctx.body });
                    return gotoFlow(flowEscrito);
                    } else{
                      if(ctx.body=='3'){
                        ctx.body="Poleas"
                        state.update({ Subconjunto: ctx.body });
                        return gotoFlow(flowEscrito);
                        }else{
                          if(ctx.body=='4'){
                            ctx.body="Nivel aceite"
                            state.update({ Subconjunto: ctx.body });
                            return gotoFlow(flowEscrito);
                            }else{
                              if(ctx.body=='M2'){
                                return gotoFlow(flowcedula);
                              }else{
                                if(ctx.body=='m2'){
                                  return gotoFlow(flowcedula);
                                }else{
                                  return fallBack();
                                }
                              }
                            }
                        }
          
                    }
                  }
                });

    const flowFalla9 = bot
    .addKeyword(bot.EVENTS.ACTION)
    .addAnswer(
      [
        `Escoge el numero correspondiente al conjunto de la Etiquetadora!👓`,
        `*1* Agregado 1`,
        `*2* Carrusel`,
        `*3* Agregado 2`,
        `*4* Materia prima`,
        `*5* Falla Humana`,
        `*6* Estrellas de manejo`,
      ])
    .addAnswer(
    [
     `*Escoge el numero correcto* `,
     `🐵` ,
    ],
      { capture: true },
      async (ctx, { state,gotoFlow,fallBack }) => {
        state.update({ Conjunto: ctx.body });
        if(ctx.body=='1'){
          ctx.body="Agregado 1"
          state.update({ Conjunto: ctx.body });
        return gotoFlow(flowEquipo91);
    }else{
        if(ctx.body=='2'){
          ctx.body="Carrusel"
          state.update({ Conjunto: ctx.body });
          return gotoFlow(flowEquipo92);
        }else{
          if(ctx.body=='3'){
                    ctx.body="Agregado 2"
                    state.update({ Conjunto: ctx.body});
                    return gotoFlow(flowEquipo91);}else{
                      if(ctx.body=='4'){
                    ctx.body="Materia prima"
                    state.update({ Conjunto: ctx.body, Subconjunto: "NA" });
                    return gotoFlow(flowEscrito);}else{
                      if(ctx.body=='5'){
                    ctx.body="Falla Humana"
                    state.update({ Conjunto: ctx.body, Subconjunto: "NA" });
                    return gotoFlow(flowEscrito);}else{
                      if(ctx.body=='M2'){
                        return gotoFlow(flowcedula);
                      }else{
                        if(ctx.body=='m2'){
                          return gotoFlow(flowcedula);
                        }else{
                          if(ctx.body=='6'){
                            ctx.body="Estrellas de manejo"
                            state.update({ Conjunto: ctx.body, Subconjunto: "NA" });
                            return gotoFlow(flowEscrito);}else{
                              return fallBack();
                            }
                        }
                      }
                    }
                    }
                    }
            }
          }
        }
    );

const flowEquipo91 = bot
    .addKeyword(bot.EVENTS.ACTION)
    .addAnswer(
      [
        `Escoge el numero correspondiente al subconjunto del agregado 1 o 2!👓`,
        `*1* Servoaccionamientos`,
        `*2* Sistema encolado`,
        `*3* Cilindros transferencia`,
        `*4* Sistema corte`,
      ])
    .addAnswer(
    [
     `*Escoge el numero correcto* `,
     `🐵` ,
    ],
      { capture: true },
      async (ctx, { state,gotoFlow,fallBack }) => {
        if(ctx.body== '1'){
          ctx.body="Servoaccionamientos"
          state.update({ Subconjunto: ctx.body });
          return gotoFlow(flowEscrito);
      }else{
        if(ctx.body== '2'){
          ctx.body="Sistema encolado"
          state.update({ Subconjunto: ctx.body });
          return gotoFlow(flowEscrito);
      }else{
        if(ctx.body== '3'){
          ctx.body="Cilindros transferencia"
          state.update({ Subconjunto: ctx.body });
          return gotoFlow(flowEscrito);
      }else{
        if(ctx.body== '4'){
          ctx.body="Sistema corte"
          state.update({ Subconjunto: ctx.body });
          return gotoFlow(flowEscrito);
      }else{
        if(ctx.body=='M2'){
          return gotoFlow(flowcedula);
        }else{
          if(ctx.body=='m2'){
            return gotoFlow(flowcedula);
          }else{
            return fallBack();
          }
        }
      }
      }
      }
        }
      });

const flowEquipo92 = bot
    .addKeyword(bot.EVENTS.ACTION)
    .addAnswer(
      [
        `Escoge el numero correspondiente al subconjunto del carrusel!👓`,
        `*1* Servoaccionamientos`,
        `*2* Estrellas transferencia`,
      ])
    .addAnswer(
    [
     `*Escoge el numero correcto* `,
     `🐵` ,
    ],
      { capture: true },
      async (ctx, { state,gotoFlow,fallBack }) => {
        if(ctx.body== '1'){
          ctx.body="Servoaccionamientos"
          state.update({ Subconjunto: ctx.body });
          return gotoFlow(flowEscrito);
      }else{
        if(ctx.body== '2'){
          ctx.body="Estrellas transferencia"
          state.update({ Subconjunto: ctx.body });
          return gotoFlow(flowEscrito);
      }else{
        if(ctx.body=='M2'){
          return gotoFlow(flowcedula);
        }else{
          if(ctx.body=='m2'){
            return gotoFlow(flowcedula);
          }else{
            return fallBack();
          }
        }
      }
        }
      });


      const flowFalla10 = bot
      .addKeyword(bot.EVENTS.ACTION)
      .addAnswer(
        [
          `Escribe el numero correspondiente de la banda!👓`
        ])
      .addAnswer(
      [
       `*Ejemplo: Banda #4* `,
       `🐵` ,
      ],
        { capture: true },
        async (ctx, { state,gotoFlow }) => {
          state.update({ Conjunto: ctx.body });
          return gotoFlow(flowEquipo101);
          }
      );

      const flowEquipo101 = bot
      .addKeyword(bot.EVENTS.ACTION)
      .addAnswer(
        [
          `Escoge el numero correspondiente al subconjunto de la banda!👓`,
          `*1* Motor`,
          `*2* Sensor`,
          `*3* Soporte transportador`,
        ])
      .addAnswer(
      [
       `*Escoge el numero correcto* `,
       `🐵` ,
      ],
        { capture: true },
        async (ctx, { state,gotoFlow,fallBack }) => {
          if(ctx.body== '1'){
              ctx.body="Motor"
              state.update({ Subconjunto: ctx.body });
              return gotoFlow(flowEscrito);
          }else{
            if(ctx.body=='2'){
            ctx.body="Sensor"
            state.update({ Subconjunto: ctx.body });
            return gotoFlow(flowEscrito);
            } else{
              if(ctx.body=='3'){
                ctx.body="Soportador transportador"
                state.update({ Subconjunto: ctx.body });
                return gotoFlow(flowEscrito);
                }else{
                  if(ctx.body=='M2'){
                    return gotoFlow(flowcedula);
                  }else{
                    if(ctx.body=='m2'){
                      return gotoFlow(flowcedula);
                    }else{
                      return fallBack();
                    }
                  }
                }
  
            }
          }
        });

const flowFalla11 = bot
        .addKeyword(bot.EVENTS.ACTION)
        .addAnswer(
          [
            `Escoge el numero correspondiente al conjunto del transporte de palets!👓`,
            `*1* Estación de estibas`,
            `*2* Estación de cartón`,
            `*3* Transporte estibas llena`,
            `*4* Materia prima`,
            `*5* Falla Humana`,
          ])
        .addAnswer(
        [
         `*Escoge el numero correcto* `,
         `🐵` ,
        ],
          { capture: true },
          async (ctx, { state,gotoFlow,fallBack }) => {
            if(ctx.body=='1'){
              ctx.body="Estación de estibas"
              state.update({ Conjunto: ctx.body });
            return gotoFlow(flowEquipo111);
        }else{
            if(ctx.body=='2'){
              ctx.body="Estación de cartón"
              state.update({ Conjunto: ctx.body });
              return gotoFlow(flowEquipo111);
            }else{
              if(ctx.body=='3'){
                ctx.body="Transporte estibas llena"
                state.update({ Conjunto: ctx.body });
                return gotoFlow(flowEquipo111);
              }else{
                if(ctx.body=='4'){
                    ctx.body="Materia prima"
                    state.update({ Conjunto: ctx.body, Subconjunto: "NA" });
                    return gotoFlow(flowEscrito);}else{
                      if(ctx.body=='5'){
                    ctx.body="Falla Humana"
                    state.update({ Conjunto: ctx.body, Subconjunto: "NA" });
                    return gotoFlow(flowEscrito);}else{
                      if(ctx.body=='M2'){
                        return gotoFlow(flowcedula);
                      }else{
                        if(ctx.body=='m2'){
                          return gotoFlow(flowcedula);
                        }else{
                          return fallBack();
                        }
                      }
                    }
                    }
                    }
                }
              }
            }
        );


        const flowFallal12 = bot
        .addKeyword(bot.EVENTS.ACTION)
        .addAnswer(
          [
            `Escoge el numero correspondiente al conjunto de la Etiquetadora!👓`,
            `*1* Cilindros`,
            `*2* Carrusel`,
            `*3* Bomba vacio`,
            `*4* Materia prima`,
            `*5* Falla Humana`,
          ])
        .addAnswer(
        [
         `*Escoge el numero correcto* `,
         `🐵` ,
        ],
          { capture: true },
          async (ctx, { state,gotoFlow,fallBack }) => {
            state.update({ Conjunto: ctx.body });
            if(ctx.body=='1'){
              ctx.body="Cilindros"
              state.update({ Conjunto: ctx.body });
            return gotoFlow(flowEquipol121);
        }else{
            if(ctx.body=='2'){
              ctx.body="Carrusel"
              state.update({ Conjunto: ctx.body });
              return gotoFlow(flowEquipo92);
            }else{
              if(ctx.body=='3'){
                        ctx.body="Bomba vacio"
                        state.update({ Conjunto: ctx.body});
                        return gotoFlow(flowEscrito);}else{
                          if(ctx.body=='4'){
                        ctx.body="Materia prima"
                        state.update({ Conjunto: ctx.body, Subconjunto: "NA" });
                        return gotoFlow(flowEscrito);}else{
                          if(ctx.body=='5'){
                        ctx.body="Falla Humana"
                        state.update({ Conjunto: ctx.body, Subconjunto: "NA" });
                        return gotoFlow(flowEscrito);}else{
                          if(ctx.body=='M2'){
                            return gotoFlow(flowcedula);
                          }else{
                            if(ctx.body=='m2'){
                              return gotoFlow(flowcedula);
                            }else{
                              return fallBack();
                            }
                          }
                        }
                        }
                        }
                }
              }
            }
        );

        const flowEquipol121 = bot
        .addKeyword(bot.EVENTS.ACTION)
        .addAnswer(
          [
            `Escoge el numero correspondiente al subconjunto de los cilindros!👓`,
            `*1* Cilindro transferencia`,
            `*2* Cilindro encolado`,
          ])
        .addAnswer(
        [
         `*Escoge el numero correcto* `,
         `🐵` ,
        ],
          { capture: true },
          async (ctx, { state,gotoFlow,fallBack }) => {
            if(ctx.body== '1'){
                ctx.body="Cilindro transferencia"
                state.update({ Subconjunto: ctx.body });
                return gotoFlow(flowEscrito);
            }else{
              if(ctx.body=='2'){
              ctx.body="Cilindro encolado"
              state.update({ Subconjunto: ctx.body });
              return gotoFlow(flowEscrito);
              } else{
                
                if(ctx.body=='M2'){
                  return gotoFlow(flowcedula);
                }else{
                  if(ctx.body=='m2'){
                    return gotoFlow(flowcedula);
                  }else{
                    return fallBack();
                  }
                }
    
              }
            }
          });

const flowEquipo111 = bot
        .addKeyword(bot.EVENTS.ACTION)
        .addAnswer(
          [
            `Escoge el numero correspondiente al subconjunto!👓`,
            `*1* Motor`,
            `*2* Sensor`,
            `*3* Soporte o Estructura`,
          ])
        .addAnswer(
        [
         `*Escoge el numero correcto* `,
         `🐵` ,
        ],
          { capture: true },
          async (ctx, { state,gotoFlow,fallBack }) => {
            if(ctx.body== '1'){
              ctx.body="Motor"
              state.update({ Subconjunto: ctx.body });
              return gotoFlow(flowEscrito);
          }else{
            if(ctx.body== '2'){
              ctx.body="Sensor"
              state.update({ Subconjunto: ctx.body });
              return gotoFlow(flowEscrito);
          }else{
            if(ctx.body== '3'){
              ctx.body="Soporte estructura"
              state.update({ Subconjunto: ctx.body });
              return gotoFlow(flowEscrito);
          }else{
            if(ctx.body=='M2'){
              return gotoFlow(flowcedula);
            }else{
              if(ctx.body=='m2'){
                return gotoFlow(flowcedula);
              }else{
                return fallBack();
              }
            }
          }
          }
            }
          });

const flowFalla13 = bot
          .addKeyword(bot.EVENTS.ACTION)
          .addAnswer(
            [
              `Escribe el numero correspondiente de la banda!👓`
            ])
          .addAnswer(
          [
           `*Ejemplo: Banda #4* `,
           `🐵` ,
          ],
            { capture: true },
            async (ctx, { state,gotoFlow }) => {
              state.update({ Conjunto: ctx.body, Subconjunto:"NA" });
              return gotoFlow(flowEscrito);
              }
          );

const flowFalla14 = bot
        .addKeyword(bot.EVENTS.ACTION)
        .addAnswer(
          [
            `Escoge el numero correspondiente al conjunto de la Sopladora!👓`,
            `*1* Materia prima`,
            `*2* Falla Humana`,
          ])
        .addAnswer(
        [
         `*Escoge el numero correcto* `,
         `🐵` ,
        ],
          { capture: true },
          async (ctx, { state,gotoFlow,fallBack }) => {
                if(ctx.body=='1'){
                    ctx.body="Materia prima"
                    state.update({ Conjunto: ctx.body, Subconjunto: "NA" });
                    return gotoFlow(flowEscrito);}else{
                      if(ctx.body=='2'){
                    ctx.body="Falla Humana"
                    state.update({ Conjunto: ctx.body, Subconjunto: "NA" });
                    return gotoFlow(flowEscrito);}
                      else{
                        if(ctx.body=='M2'){
                          return gotoFlow(flowcedula);
                        }else{
                          if(ctx.body=='m2'){
                            return gotoFlow(flowcedula);
                          }else{
                            return fallBack();
                          }
                        }
                    }
                    }
                    }
        );


        const flowFallal14 = bot
        .addKeyword(bot.EVENTS.ACTION)
        .addAnswer(
          [
            `Escoge el numero correspondiente al conjunto del enrutador de tapa!👓`,
            `*1* Motores`,
            `*2* Bandas`,
            `*3* Sensores`,
            `*4* Materia prima`,
          ])
        .addAnswer(
        [
         `*Escoge el numero correcto* `,
         `🐵` ,
        ],
          { capture: true },
          async (ctx, { state,gotoFlow,fallBack }) => {
                if(ctx.body=='1'){
                    ctx.body="Motores"
                    state.update({ Conjunto: ctx.body, Subconjunto: "NA" });
                    return gotoFlow(flowEscrito);}else{
                      if(ctx.body=='2'){
                    ctx.body="Bandas"
                    state.update({ Conjunto: ctx.body, Subconjunto: "NA" });
                    return gotoFlow(flowEscrito);}
                      else{
                        if(ctx.body=='3'){
                          ctx.body="Sensores"
                          state.update({ Conjunto: ctx.body, Subconjunto: "NA" });
                          return gotoFlow(flowEscrito);}
                            else{
                              if(ctx.body=='4'){
                                ctx.body="Materia prima"
                                state.update({ Conjunto: ctx.body, Subconjunto: "NA" });
                                return gotoFlow(flowEscrito);}
                                  else{
                                    if(ctx.body=='M2'){
                                      return gotoFlow(flowcedula);
                                    }else{
                                      if(ctx.body=='m2'){
                                        return gotoFlow(flowcedula);
                                      }else{
                                        return fallBack();
                                      }
                                    }
                                  }
                            }
                    }
                    }
                    }
        );


        const flowFallal15 = bot
        .addKeyword(bot.EVENTS.ACTION)
        .addAnswer(
          [
            `Escoge el numero correspondiente al conjunto sistema de inyeccion de nitrogeno!👓`,
            `*1* Separador de fase`,
            `*2* Cañon dosificador`,
            `*3* Sensores`,

          ])
        .addAnswer(
        [
         `*Escoge el numero correcto* `,
         `🐵` ,
        ],
          { capture: true },
          async (ctx, { state,gotoFlow,fallBack }) => {
                if(ctx.body=='1'){
                    ctx.body="Separador de fase"
                    state.update({ Conjunto: ctx.body, Subconjunto: "NA" });
                    return gotoFlow(flowEscrito);}else{
                      if(ctx.body=='2'){
                    ctx.body="Cañon dosificador"
                    state.update({ Conjunto: ctx.body, Subconjunto: "NA" });
                    return gotoFlow(flowEscrito);}
                      else{
                        if(ctx.body=='M2'){
                          return gotoFlow(flowcedula);
                        }else{
                          if(ctx.body=='m2'){
                            return gotoFlow(flowcedula);
                          }else{
                            if(ctx.body=='3'){
                              ctx.body="Sensores"
                              state.update({ Conjunto: ctx.body, Subconjunto: "NA" });
                              return gotoFlow(flowEscrito);

                            }else{
                              return fallBack();
                            }
                          }
                        }
                                  }
                            }
                    
                    
                    }
        );


const flowEscrito = bot
    .addKeyword(bot.EVENTS.ACTION)
    .addAnswer(
        "*Escribe la descripcion detallada del aviso*",
          { capture: true },
          async (ctx, { state,gotoFlow }) => {
            if(ctx.body=='M2'){
              return gotoFlow(flowcedula);
            }else{
              if(ctx.body=='m2'){
                return gotoFlow(flowcedula);
              }else{
                state.update({ Descripcion: ctx.body });
              }
            }
            
            }
          )
    .addAnswer(
          "Hora Inicio de la falla, ejemplo: *04:02:00*")
    .addAnswer([
      `*Escribe la hora en el formato correcto* `,
      `🐵` ,
     ],
          { capture: true },
          async (ctx, { state,gotoFlow,fallBack }) => {
            state.update({ horain: ctx.body });
            if(validarHora(ctx.body)){
              return gotoFlow(flowfechain);
            }else{
              if(ctx.body=='M2'){
                return gotoFlow(flowcedula);
              }else{
                if(ctx.body=='m2'){
                  return gotoFlow(flowcedula);
                }else{
                  return fallBack();
                }
              }
            }
          }
        );

const flowfechain=bot
.addKeyword(bot.EVENTS.ACTION)
.addAnswer("Ingresa el día que inicio la averia,*Ejemplo: 21*")
.addAnswer([
  "*Escribe el dia correcto* ",
  "🐵",
],
  { capture: true },
  async (ctx, { state, gotoFlow,fallBack }) => {
    const dayEntered = parseInt(ctx.body); // Convertir el día a número

    if ((dayEntered < 1) || (dayEntered > 31)||(ctx.body.includes(":"))||(ctx.body.includes("."))||(ctx.body.includes("/"))
    ||(ctx.body.match(/[a-zA-Z]/)))
     {
      return fallBack();
    } else {
      const fechaActual = new Date();
      fechaActual.setDate(dayEntered);
      const dia = fechaActual.getDate();
      const mes = fechaActual.getMonth() + 1;
      const año = fechaActual.getFullYear() % 100;
      const fechaFormateada = `${dia.toString().padStart(2, '0')}.${mes.toString().padStart(2, '0')}.${año.toString().padStart(2, '0')}`;
      ctx.body = fechaFormateada;
      state.update({ fechaInicio: ctx.body });
      return gotoFlow(flowHorafin);
    }
  }
);




const flowHorafin = bot
    .addKeyword(bot.EVENTS.ACTION)
    .addAnswer(
      "Hora fin de la falla, ejemplo: *04:05:00*")
    .addAnswer([
      `*Escribe la hora en el formato correcto* `,
      `🐵` ,
      ],
          { capture: true },
          async (ctx, { state,gotoFlow,fallBack }) => {
            state.update({ horafin: ctx.body });
            if(validarHora(ctx.body)){
              return gotoFlow(flowFinal);
            }else{
              if(ctx.body=='M2'){
                return gotoFlow(flowcedula);
              }else{
                if(ctx.body=='m2'){
                  return gotoFlow(flowcedula);
                }else{
                  return fallBack();
                }
              }
            }
          }
        );
const flowcedula= bot
    .addKeyword(["M2", "m2","m2 ", "M2 "])
    .addAnswer(
          "Ingrese su *cédula*")
          .addAnswer(
            [
              `*Escribe la cedula correspondiente* `,
              `🐵`,
            ],
            { capture: true },
            async (ctx, { state, gotoFlow, fallBack }) => {
              
              const dayNumber = 2;
              const getMenuDay2 = await googelSheet.retriveDayMenu(dayNumber);
              const getMenuDay3 = await googelSheet.retriveDayMenu(3); // Obtener columna para dayNumber 3
              const cedulaString = ctx.body.toString();
              state.update({ cedula: ctx.body});
              let foundMatch = false;
              let correspondingValue = null;
          
              for (let i = 0; i < getMenuDay2.length; i++) {
                const menuString = getMenuDay2[i].toString();
          
                if (cedulaString === menuString) {
                  foundMatch = true;
                  correspondingValue = getMenuDay3[i]; // Obtener el valor correspondiente para dayNumber 3
                  
                  break;
                }
              }
          
              if (foundMatch) {
                
                state.update({ acronimo: correspondingValue });
                return gotoFlow(flowPrincipal);
              } else {
                return fallBack();
              }
            }
          );
          
          
const flowFinal= bot
    .addKeyword(bot.EVENTS.ACTION)
    .addAnswer(
          ["Aviso Guardado, muchas gracias.😉","Cualquier duda, preguntar en oficina de mantenimiento por Stiven Quintero"],
          null,
          async (ctx, { state }) => {
              const currentState = state.getMyState();
              const currentDate = new Date();
              const day = String(currentDate.getDate()).padStart(2, '0');
              const month = String(currentDate.getMonth() + 1).padStart(2, '0');
              const year = currentDate.getFullYear();
              const formattedDate = `${day}.${month}.${year}`;
            await googelSheet.saveOrder({
              fecha: formattedDate,
              telefono: ctx.from,
              ubicacion: currentState.ubicacion,
              Equipo: currentState.Equipo,
              CodEquipo:currentState.CodEquipo,
              Falla: currentState.Falla,
              Conjunto: currentState.Conjunto,
              Subconjunto: currentState.Subconjunto,
              aviso: currentState.aviso,
              Descripcion:currentState.Descripcion,
              horain: currentState.horain,
              fechaInicio: currentState.fechaInicio,
              horafin: currentState.horafin,
              cedula: currentState.cedula,
              acronimo: currentState.acronimo,

            });
          }
        );
  // .addAnswer(
  //     `Por favor`,
  //     null,
  //     async (_, { flowDynamic }) => {
  //       const dayNumber = 2;
  //       const getMenu = await googelSheet.retriveDayMenu(dayNumber);
  //       for (const menu of getMenu) {
  //         GLOBAL_STATE.push(menu);
  //         //await flowDynamic(menu);
  //       }
  //     }
  //   )
  // .addAnswer(
  //   `Escribe el correspondiente al tuyo 🤓`,
  //   { capture: true },
  //   async (ctx, { gotoFlow, state }) => {
  //     const txt = ctx.body;
  //     const check = await chatgpt.completion(`
  //   Los acronimos correspondientes por cada usuario son los siguiente:
  //   "
  //   ${GLOBAL_STATE.join("\n")}
  //   "
  //   El usuario es  "${txt}"
  //   Basado en los acronimos y en lo que escribio el usuario determinar (EXISTE, NO_EXISTE).
  //   El acronimo
  //   `);

  //     const getCheck = check.data.choices[0].text
  //       .trim()
  //       .replace("\n", "")
  //       .replace(".", "")
  //       .replace(" ", "");

  //     if (getCheck.includes("NO_EXISTE")) {
  //       return gotoFlow(flowEmpty);
  //     } else {
  //       state.update({acronimo:ctx.body})
  //       return gotoFlow(flowacronimo);
  //     }
  //   }
  // );


// const flowEmpty = bot
//   .addKeyword(bot.EVENTS.ACTION)
//   .addAnswer("Escribe bien tu ACRONIMO!", null, async (_, { gotoFlow }) => {
//     return gotoFlow(flowLinea10);
//   });

const main = async () => {
  const adapterDB = new MockAdapter();
  const adapterFlow = bot.createFlow([
    flowPrincipal,
    flowLinea10,
    flowLinea8,
    flowLinea1,
    flowLinea3,
    flowBotellones,
    flowBolsas,
    flowFalla1,
    flowFalla2,
    flowFalla3,
    flowFalla4,
    flowFallal4,
    flowFalla5,
    flowFallal5,
    flowFalla6,
    flowFallal6,
    flowFalla7,
    flowFalla8,
    flowFallal8,
    flowFalla9,
    flowFallal9,
    flowFalla10,
    flowFalla11,
    flowFallal12,
    flowFalla13,
    flowFalla14,
    flowEquipo11,
    flowEquipo12,
    flowEquipo13,
    flowEquipo14,
    flowEquipo15,
    flowEquipo91,
    flowEquipo92,
    flowEquipol91,
    flowEquipol121,
    flowEquipo32,
    flowEquipo31,
    flowEquipo61,
    flowEquipo62,
    flowEquipo81,
    flowEquipo101,
    flowEquipo111,
    flowFallal14,
    flowFallal15,
    flowconjL31,
    flowconjL32,
    flowconjL33,
    flowconjL34,
    flowconjL35,
    flowconjL36,
    flowconjL36TR,
    flowEscrito,
    flowcedula,
    flowHorafin,
    flowconjL31D,
    flowconjL33R,
    flowconjL3Transporte,
    flowconjL3Mesa,
    flowconjTanque1,
    flowconjTanque4,
    flowconjtransmision,
    flowFallaL3Desempacadora,
    flowfechain,
    flowFallaL3CODIFICADOR,
    flowFallaL3Empacadora,
    flowFallaL3TRANSPORTADORCAJAS,
    flowFallaL3TRANSPORTADORBOTELLA,
    flowFallaL3DESPITILLADORA,
    flowFallaL3LLENADORA,
    flowL3LAVADORACAJAS,
    flowFallaL3LAVADORABOTELLAS,
    flowconjL3Tan,
    flowconjL3Trans,
    flowconjL3Tab,
    flowL3LLENADORAcalderin,
    flowL3LLENADORAcoronador,
    flowsubTanques,
    flowconjcontiflow,
    flowL3INSPECTOR,
    flowconjsistema1,
    flowconjsistema2,
    flowconjsistema3,
    flowconjtarjetas,
    flowL1LLENADORA,
    flowL1INSPECTOR,
    flowL1ENJUAGADORA,
    flowL1CONJCARRUSEL,
    flowL1CONJTAPONADORA,
    flowL1CONJTRANSPORTADOR,
    flowL1CONJTABLERO,
    flowL1CONJSENSORES,
    flowL1ENJUAGADORA,
    flowsubtransmision,
    flowsubabridor,
    flowL1EMBANDEJADORA,
    flowL1CONJMESA,
    flowL1CONJBARRAS,
    flowL1CONJCLASIFICADOR,
    flowL1CONJELECTRICO,
    flowL1CONJFORMADO,
    flowL1CONJENTRADA,
    flowL1CONJSISTEMA,
    flowL1CONJCORTE,
    flowL1CONJPORTABOBINAS,
    flowL1HORNOVARIOPAC,
    flowL1CONJZONA1,
    flowL1CONJTABLEROL1,
    flowL1TRANSPORTEMALLA,
    flowL1VENTILADORES,
    flowL1SALIDA,
    flowL1TRANSPORTADOR,
    flowL1CONJflowliner,
    flowL1CONJbandas,
    flowL1tableroelectrico,
    flowL1EMBALAJES,
    flowL1PROCESADOR,
    flowL1tanques,
    flowL1TABLEROELECTRICOL1,
    flowL1ALMACEN,
    flowL1CONJESTIBAS,
    flowL1CONJMECANISMO,
    flowPaletizadora,
    flowL1Multidivisor,
    flowL1Viasentradas,
    flowL1Mesaagrupamiento,
    flowL1conjuntoE,
    flowL1Aplicador,
    flowL1CODIFICADOR,
    flowL1ELEVADOR,
    flowL1TOLVA,
    flowL1ENVOLVEDORA,
    flowL1Anillo,
    flowL1Soldadura,
    flowL1Elevacion,
    flowL1DOSIFICADOR,
    flowL1RESERVORIO,
    flowL1NIVEL,
    flowL1ALIMENTACIONN2,
    flowL1TABLEROV2,
    flowL1ADHESIVO,
    flowL1tanqueRESERVORIO,
    flowL1dosiadhesivo,
    flowL1AEREO,
    flowL1ETIQUETADORA,
    flowL1BARRANDILLAS,
    flowL1MAQUINA,
    flowL1AGREGADO,
    flowL1PLATOS,
    flowL1ETIQUETA,
    flowL1CORTE,
    flowconjtransportebotellas,
    flowReparacion(chatGPT),
    flowPrincipalIA,
    flowLinea1Ia,
    flowFinal,

    
  ]);
  const adapterProvider = bot.createProvider(BaileysProvider);

  bot.createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });

  QRPortalWeb();
};

main();
