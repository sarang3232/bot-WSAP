import pkg from '@bot-whatsapp/bot';

const { addKeyword } = pkg; // Solo importa la función que necesitas

// Luego puedes usar addKeyword como lo hacías antes
const flowPrincipal = addKeyword("REDBULL")
  .addAnswer(
    "Bivenido soy *IA*",
  )
  .addAnswer(
    [
        "¿Cómo podemos ayudarte?",
        "",
        "*1* Solucionario",
    ]
  )  
  .addAnswer('Responda con el número de la opción!');

export default flowPrincipal;
