import express from 'express';
import jwt from "jsonwebtoken";
import passport from '../config/ldap.js';
import { JWT_SECRET } from '../config/jwt.js';

// IMPORTANTE: Agora importamos createUser E readUser diretamente do MODELO!
import { createUser, readUser } from '../models/authModelTeste.js';

const router = express.Router();

router.post('/login', (req, res, next) => {
  passport.authenticate('ldapauth', { session: true }, async (err, user, info) => {
    try {
      if (err || !user) {
        // ... seu tratamento de erro de autenticação ...
        return res.status(401).json({ error: info?.message || 'Autenticação falhou' });
      }

      req.logIn(user, async (loginErr) => {
        if (loginErr) {
          // ... seu tratamento de erro de sessão ...
          return res.status(500).json({ error: 'Erro ao criar sessão' });
        }

        console.log('Usuário autenticado:', user.displayName);
        let usuarioDoBanco;

        try {
          // ETAPA 1: Tenta criar o usuário diretamente.
          const dadosNovoUsuario = {
            nome: user.displayName,
            id_login: user.sAMAccountName,
            email: user.name,
            funcao: "tecnico"// --------------------------------------------------------------------------------------------------------------------
          };
          await createUser(dadosNovoUsuario);

          // Se a criação deu certo, lemos os dados para retornar ao cliente.
          // readUser retorna um array, pegamos o primeiro elemento.
          [usuarioDoBanco] = await readUser(user.sAMAccountName);

        } catch (error) {
          // ETAPA 2: Se deu erro, verificamos o motivo.
          // Verifique o código de erro do seu banco de dados!
          // 'ER_DUP_ENTRY' é para MySQL/MariaDB. '23505' é para PostgreSQL.
          if (error.code === 'ER_DUP_ENTRY' || error.code === '23505') {
            
            // É um erro de duplicidade? ÓTIMO! Significa que o usuário já existe.
            console.log("Usuário já existe no DB (ou foi criado por outra requisição). Apenas buscando...");
            // Apenas lemos os dados do usuário que já está lá.
            [usuarioDoBanco] = await readUser(user.sAMAccountName);

          } else {
            // Se for qualquer outro erro (conexão com DB caiu, dados inválidos, etc.), é um problema real.
            console.error("Houve um erro na operação com o banco de dados: ", error);
            return res.status(500).json({ error: 'Erro ao processar dados do usuário.' });
          }
        }
        
        // Se, por algum motivo, o usuário ainda não foi encontrado, algo está muito errado.
        if (!usuarioDoBanco) {
            return res.status(500).json({ error: 'Falha dados do usuário, Caso seja seu primeiro login, reenvie o formulario, se o problema persistir entre em contato com o suporte.' });
        }

        // ETAPA 3: Criação do Token e Resposta Final
        const token = jwt.sign({
          id: usuarioDoBanco.ra,
          funcao: usuarioDoBanco.funcao
        }, JWT_SECRET, { expiresIn: '1h' });

        return res.json({
          message: 'Autenticado com sucesso',
          token: token,
          user: usuarioDoBanco
        });
      });
    } catch (error) {
      console.error('Erro inesperado:', error);
      res.status(500).json({ error: 'Erro inesperado no servidor' });
    }
  })(req, res, next);
});


// Rota de Logout
router.post('/logout', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Nenhum usuário autenticado' });
  }

  console.log('Usuário deslogando:', req.user?.username);
  
  req.logout((err) => {
    if (err) {
      console.error('Erro no logout:', err);
      return res.status(500).json({ error: 'Erro ao realizar logout' });
    }
    
    // Destrói a sessão completamente
    req.session.destroy((destroyErr) => {
      if (destroyErr) {
        console.error('Erro ao destruir sessão:', destroyErr);
        return res.status(500).json({ error: 'Erro ao encerrar sessão' });
      }
      
      res.clearCookie('connect.sid'); // Remove o cookie de sessão
      res.json({ message: 'Logout realizado com sucesso' });
    });
  });
});

// Rota para verificar autenticação
router.get('/check-auth', (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({ 
      authenticated: true,
      user: {
        username: req.user.username,
        displayName: req.user.displayName
      }
    });
  }
  res.status(401).json({ authenticated: false });
});


export default router;