   create database zelo;
   #drop database zelo;
   use zelo;
   

   -- Criação da tabela usuarios
    CREATE TABLE usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        id_login VARCHAR(10) NOT NULL unique,
        email VARCHAR(255) NOT NULL UNIQUE,
        funcao VARCHAR(100) NOT NULL,
        status ENUM('ativo', 'inativo') DEFAULT 'ativo',
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );






    -- Criação da tabela  servicos = Pool
    CREATE TABLE servicos (  

        id INT AUTO_INCREMENT PRIMARY KEY,
        titulo ENUM('externo', 'manutencao', 'apoio_tecnico', 'limpeza') NOT NULL,
        descricao TEXT,
        status ENUM('ativo', 'inativo') DEFAULT 'ativo',
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        created_by INT,
        updated_by INT,
        FOREIGN KEY (created_by) REFERENCES usuarios(id),
        FOREIGN KEY (updated_by) REFERENCES usuarios(id)
    );

    -- Criação da tabela chamados
    CREATE TABLE chamados (
        id INT AUTO_INCREMENT PRIMARY KEY,
        titulo VARCHAR(255) NOT NULL,
        descricao TEXT NOT NULL,
        id_patrimonio INT NOT NULL,
        servicos_id INt not null,
        tecnico_id INT,
        usuario_id INT NOT NULL,
        status ENUM('pendente', 'em andamento','aguardando aprovação', 'concluído') DEFAULT 'pendente',
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (servicos_id) REFERENCES servicos(id),
        FOREIGN KEY (tecnico_id) REFERENCES usuarios(id),
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    );

    -- Criação da tabela apontamentos
    CREATE TABLE apontamentos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        chamado_id INT not null,
        tecnico_id INT not null,
        descricao TEXT,
        comeco DATETIME NOT NULL,
        fim DATETIME NOT NULL,
        duracao INT AS (TIMESTAMPDIFF(SECOND, comeco, fim)) STORED, -- Calcula a duração em segundos
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (chamado_id) REFERENCES chamados(id),
        FOREIGN KEY (tecnico_id) REFERENCES usuarios(id)
    );

    -- Criação da tabela Especialidades = pool_tecnico
    CREATE TABLE Especialidades (   
        id INT AUTO_INCREMENT PRIMARY KEY,
        id_servicos INT,
        id_tecnico INT,
        FOREIGN KEY (id_servicos) REFERENCES servicos(id),
        FOREIGN KEY (id_tecnico) REFERENCES usuarios(id)
    );


#------------------------------------------------------------------------------------

-- Inserir dados na tabela usuarios

INSERT INTO usuarios (nome, id_login, email, funcao, status)
VALUES
('Ana Silva', 'USR001', 'ana@example.com', 'Administradora', 'ativo'),
('Carlos Souza', 'USR002', 'carlos@example.com', 'Técnico', 'ativo'),
('Mariana Lima', 'USR003', 'mariana@example.com', 'Usuário', 'inativo');

-- Inserir dados na tabela servicos
INSERT INTO servicos (titulo, descricao, status, created_by, updated_by)

VALUES
('externo', 'Serviços externos diversos', 'ativo', 1, 1),
('manutencao', 'Manutenção de equipamentos', 'ativo', 1, 2),
('apoio_tecnico', 'Suporte técnico interno', 'inativo', 2, 1);

-- Inserir dados na tabela chamados
INSERT INTO chamados (titulo, descricao, servicos_id, tecnico_id, usuario_id, status)

VALUES
('Troca de lâmpada', 'Solicitação para troca de lâmpada no corredor', 2, 2, 3, 'pendente'),
('Erro no sistema', 'Sistema apresentando falhas ao logar', 3, 2, 3, 'em andamento'),
('Pintura externa', 'Solicitação para pintura do muro externo', 1, 1, 3, 'concluído');

-- Inserir dados na tabela apontamentos

INSERT INTO apontamentos (chamado_id, tecnico_id, descricao, comeco, fim)
VALUES
(1, 2, 'Trocada lâmpada queimada', '2025-08-11 08:00:00', '2025-08-11 08:20:00'),
(2, 2, 'Correção de bug no sistema', '2025-08-11 09:00:00', '2025-08-11 10:15:00'),
(3, 1, 'Preparação para pintura', '2025-08-11 11:00:00', '2025-08-11 13:30:00');

select *from apontamentos;

-- Inserir dados na tabela Especialidades
INSERT INTO Especialidades (id_servicos, id_tecnico)

VALUES
(1, 1), -- Técnico associado ao pool externo
(2, 2), -- Técnico associado ao pool manutenção
(3, 2); -- Técnico associado ao pool apoio técnico

#-----------------------------------------------------------------------------------------


CREATE OR REPLACE VIEW View_Chamados AS
SELECT
    c.id AS chamado_id,
    c.titulo AS chamado_titulo,
    c.descricao AS descricao,
    c.status AS chamado_status,
    c.criado_em AS data_criacao,
    c.atualizado_em AS data_fechamento,
    p.titulo AS tipo_chamado,
    u.id AS tecnico_id,
    u.nome AS tecnico_nome
FROM chamados c
LEFT JOIN servicos p ON c.servicos_id = p.id
LEFT JOIN Especialidades pt ON p.id = pt.id_servicos

LEFT JOIN usuarios u ON pt.id_tecnico = u.id;


SELECT * FROM View_Chamados;

#nao esqueça de fala com o pedro sobre pegar o id_patrimonio como chaver estrangeira
#-----------------------------------------------------------------------------------------cdcd 




    -- Índices adicionais para otimização
    CREATE INDEX idx_usuarios_email ON usuarios(email);
    CREATE INDEX idx_chamados_status ON chamados(status);
    CREATE INDEX idx_apontamentos_comeco_fim ON apontamentos(comeco, fim);
    
    
    #DROP DATABASE zelo;