import express from 'express';
import jwt from "jsonwebtoken";
import passport from '../config/ldap.js';
import { JWT_SECRET } from '../config/jwt.js';
import { createUser, readUser } from '../models/authModelTeste.js';

const router = express.Router();

router.post('/login', (req, res, next) => {
  passport.authenticate('ldapauth', { session: true }, async (err, user, info) => {
    try {
      if (err || !user) {
        return res.status(401).json({ error: info?.message || 'Autenticação falhou' });
      }

      req.logIn(user, async (loginErr) => {
        if (loginErr) {
          return res.status(500).json({ error: 'Erro ao criar sessão' });
        }

        console.log('Usuário autenticado:', user.displayName);
        let usuarioDoBanco;

        try {
          const dadosNovoUsuario = {
            nome: user.displayName,
            id_login: user.sAMAccountName,
            email: user.userPrincipalName,
            funcao: "Usuário"
          };

          

          await createUser(dadosNovoUsuario);


          
          [usuarioDoBanco] = await readUser(user.sAMAccountName);

        } catch (error) {
          if (error.code === 'ER_DUP_ENTRY' || error.code === '23505') {
            
            console.log("Usuário já existe no DB (ou foi criado por outra requisição). Apenas buscando...");
            [usuarioDoBanco] = await readUser(user.sAMAccountName);

          } else {
            console.error("Houve um erro na operação com o banco de dados: ", error);
            return res.status(500).json({ error: 'Erro ao processar dados do usuário.' });
          }
        }
        
        if (!usuarioDoBanco) {
            return res.status(500).json({ error: 'Falha dados do usuário, Caso seja seu primeiro login, reenvie o formulario, se o problema persistir entre em contato com o suporte.' });
        }

        const token = jwt.sign({
          id: usuarioDoBanco.id,
          id_login: usuarioDoBanco.id_login,
          funcao: usuarioDoBanco.funcao
        }, JWT_SECRET, { expiresIn: '1h' });

        return res.json({
          message: 'Autenticado com sucesso',
          token: token,
          user: usuarioDoBanco,
          user_id: usuarioDoBanco.id
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