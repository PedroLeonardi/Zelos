import jwt from "jsonwebtoken";

// Segredo de teste (use variável de ambiente em produção)
const JWT_SECRET = '320c2a4afff5ab80f94f1264f3e643a15d6d391affa6cde663a458c515f76e2d6e171700fa0c8916bdc1a0ee376627ac8b239faed6b5b7e533b1565ba789d60c';

 // Substitua pela sua chave secreta
//export const JWT_SECRET = 'SUA_CHAVE_SECRETA_GERADA'; // Substitua pela sua chave secreta
// Usuário fake só para gerar token
const usuarioFake = {
  id: 1,
  id_login: "24250386",
  funcao: "tecnico"
};

// Gera o token
const token = jwt.sign(
  {
    id: usuarioFake.id,
    id_login: usuarioFake.id_login,
    funcao: usuarioFake.funcao
  },
  JWT_SECRET,
  { expiresIn: "1h" }
);

console.log("=== TOKEN DE TESTE GERADO ===\n");
console.log(token, "\n");
console.log("Use este token no header Authorization: Bearer <token>");
