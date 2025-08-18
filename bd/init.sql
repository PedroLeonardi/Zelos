   drop database zelo;
   create database zelo;
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

create table patrimonio (
	id int auto_increment PRIMARY KEY,
    categoria text,
    descricao text,
    aquisicao datetime,
    n_patrimonio varchar(15) not null UNIQUE
);


    -- Criação da tabela chamados
    CREATE TABLE chamados (
        id INT AUTO_INCREMENT PRIMARY KEY,
        titulo VARCHAR(255) NOT NULL,
        descricao TEXT,
        n_patrimonio varchar(15) ,
        servicos_id INt not null,
        tecnico_id INT,
        usuario_id INT NOT NULL,
        status ENUM('pendente', 'em andamento','aguardando aprovação', 'concluído') DEFAULT 'pendente',
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (n_patrimonio) REFERENCES patrimonio(n_patrimonio),
        FOREIGN KEY (servicos_id) REFERENCES servicos(id),
        FOREIGN KEY (tecnico_id) REFERENCES usuarios(id_login),
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id_login)
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

-- Inserir usuários
INSERT INTO usuarios (nome, id_login, email, funcao)
VALUES
('Pedro Silva', 'P001', 'pedro@zelo.com', 'técnico'),
('Maria Souza', 'M001', 'maria@zelo.com', 'usuário'),
('Carlos Lima', 'C001', 'carlos@zelo.com', 'técnico');

-- Inserir serviços
INSERT INTO servicos (titulo, descricao, created_by, updated_by)
VALUES
('manutencao', 'Reparo de equipamentos', 1, 1),
('apoio_tecnico', 'Suporte ao usuário', 1, 1),
('limpeza', 'Limpeza interna', 1, 1);

-- Inserir patrimônio
INSERT INTO patrimonio (categoria, descricao, aquisicao, n_patrimonio)
VALUES
('Computador', 'PC Dell Optiplex', '2024-01-15', 'PAT001'),
('Impressora', 'HP LaserJet', '2023-08-20', 'PAT002'),
('Projetor', 'Epson Full HD', '2022-05-05', 'PAT003');

-- Inserir chamados
INSERT INTO chamados (titulo, descricao, n_patrimonio, servicos_id, tecnico_id, usuario_id, status)
VALUES
('Troca de memória RAM', 'Computador com problemas de desempenho', 'PAT001', 1, 1, 2, 'pendente'),
('Configuração de impressora', 'Instalação de drivers e rede', 'PAT002', 2, 3, 2, 'em andamento'),
('Manutenção no projetor', 'Troca de lâmpada', 'PAT003', 1, 1, 2, 'aguardando aprovação');



#-----------------------------------------------------------------------------------------

#drop view View_Chamados;

CREATE OR REPLACE VIEW View_Chamados AS
SELECT
    c.id            AS chamado_id,
    c.titulo        AS chamado_titulo,
    c.descricao     AS descricao,
    c.status        AS chamado_status,
    c.criado_em     AS data_criacao,
    c.atualizado_em AS data_fechamento,
    s.titulo        AS tipo_chamado,
    pa.n_patrimonio,
    u.id            AS tecnico_id,
    u.nome          AS tecnico_nome
FROM chamados c
LEFT JOIN servicos   s  ON c.servicos_id  = s.id
LEFT JOIN patrimonio pa ON c.n_patrimonio = pa.n_patrimonio
LEFT JOIN usuarios   u  ON c.tecnico_id   = u.id;




SELECT * FROM View_Chamados;

#nao esqueça de fala com o pedro sobre pegar o id_patrimonio como chaver estrangeira
#-----------------------------------------------------------------------------------------cdcd 




    -- Índices adicionais para otimização
    CREATE INDEX idx_usuarios_email ON usuarios(email);
    CREATE INDEX idx_chamados_status ON chamados(status);
    CREATE INDEX idx_apontamentos_comeco_fim ON apontamentos(comeco, fim);
    
    