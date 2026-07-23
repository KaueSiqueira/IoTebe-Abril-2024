// No-op: o mock-amplify.js já substitui Amplify inteiro.
// src/config/aws.js importa aws-amplify e chama Amplify.configure() —
// com o alias apontando aqui, o configure nunca é chamado no ambiente de demo.
export default {};
