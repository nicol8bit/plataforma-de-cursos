const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());

// Conexão com o banco
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'plataforma_cursos'
});

// HU01 - Cadastro de Usuário com opção de consentimento para marketing
app.post('/cadastro', async (req, res) => {
    const { nome, email, senha, aceita_marketing } = req.body; 
    
    try {
        const hash = await bcrypt.hash(senha, 10);
        
        const marketingSql = aceita_marketing ? 1 : 0; 
        
        db.query('INSERT INTO usuarios (nome, email, senha, aceita_marketing) VALUES (?, ?, ?, ?)', 
        [nome, email, hash, marketingSql], (err, result) => {
            if (err) return res.status(500).json({ erro: 'Erro ao cadastrar ou e-mail já existe.' });
            res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!' });
        });
    } catch (err) {
        res.status(500).json({ erro: 'Erro interno no servidor.' });
    }
});

// HU02 - Login e HU12 - Registro de logs de autenticação
app.post('/login', (req, res) => {
    const { email, senha } = req.body;
    
    db.query('SELECT * FROM usuarios WHERE email = ?', [email], async (err, results) => {
        if (err || results.length === 0) return res.status(401).json({ erro: 'Usuário não encontrado.' });
        
        const usuario = results[0];
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        
        if (!senhaValida) return res.status(401).json({ erro: 'Senha incorreta.' });
        
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        db.query("INSERT INTO logs_auth (usuario_id, evento, ip) VALUES (?, 'LOGIN', ?)", [usuario.id, ip]);
        
        res.status(200).json({ mensagem: 'Login realizado com sucesso!', id: usuario.id });
    });
});

// HU05 - Listar Cursos
app.get('/cursos', (req, res) => {
    db.query('SELECT * FROM cursos', (err, results) => {
        if (err) return res.status(500).json({ erro: 'Erro ao buscar cursos.' });
        res.status(200).json(results);
    });
});

// HU03 - Editar dados e HU08 – Consentimento para marketing
app.put('/usuarios/:id', (req, res) => {
    const usuarioId = req.params.id;
    const { nome, email, aceita_marketing } = req.body; 
    const marketingSql = aceita_marketing ? 1 : 0;

    db.query('UPDATE usuarios SET nome = ?, email = ?, aceita_marketing = ? WHERE id = ?', 
    [nome, email, marketingSql, usuarioId], (err, result) => {
        if (err) return res.status(500).json({ erro: 'Erro ao atualizar dados.' });
        res.status(200).json({ mensagem: 'Preferências atualizadas com sucesso!' });
    });
});

app.get('/usuarios/:id', (req, res) => {
    const usuarioId = req.params.id;
    db.query('SELECT nome, email, aceita_marketing FROM usuarios WHERE id = ?', [usuarioId], (err, results) => {
        if (err) return res.status(500).json({ erro: 'Erro ao buscar usuário.' });
        if (results.length === 0) return res.status(404).json({ erro: 'Usuário não encontrado.' });
        res.status(200).json(results[0]);
    });
});

// HU04 - Exclusão de conta
app.delete('/usuarios/:id', (req, res) => {
    const usuarioId = req.params.id;
    db.query('DELETE FROM usuarios WHERE id = ?', [usuarioId], (err, result) => {
        if (err) return res.status(500).json({ erro: 'Erro ao excluir conta.' });
        res.status(200).json({ mensagem: 'Conta e dados pessoais excluídos com sucesso.' });
    });
});

// HU06 - Inscrição em curso
app.post('/inscricoes', (req, res) => {
    const { usuario_id, curso_id } = req.body;
    db.query('SELECT * FROM inscricoes WHERE usuario_id = ? AND curso_id = ?', 
    [usuario_id, curso_id], (err, results) => {
        if (results.length > 0) return res.status(400).json({ erro: 'Você já está inscrito.' });
        db.query('INSERT INTO inscricoes (usuario_id, curso_id) VALUES (?, ?)', 
        [usuario_id, curso_id], (err) => {
            res.status(201).json({ mensagem: 'Inscrição realizada com sucesso!' });
        });
    });
});

// HU07 - Acompanhar progresso
app.get('/inscricoes/:usuario_id', (req, res) => {
    const usuarioId = req.params.usuario_id;
    const query = `
        SELECT i.id as inscricao_id, c.id as curso_id, c.titulo, c.descricao, i.progresso 
        FROM inscricoes i JOIN cursos c ON i.curso_id = c.id WHERE i.usuario_id = ?
    `;
    db.query(query, [usuarioId], (err, results) => {
        res.status(200).json(results);
    });
});

// HU12 - Registra o Log de Logout
app.post('/logout', (req, res) => {
    const { usuario_id } = req.body;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    
    db.query("INSERT INTO logs_auth (usuario_id, evento, ip) VALUES (?, 'LOGOUT', ?)", [usuario_id, ip], (err) => {
        if (err) return res.status(500).json({ erro: 'Erro ao registrar log.' });
        res.status(200).json({ mensagem: 'Saída registrada com sucesso.' });
    });
});

app.get('/logs/:usuario_id', (req, res) => {
    const usuarioId = req.params.usuario_id;
    
    const query = 'SELECT evento, data_hora, ip FROM logs_auth WHERE usuario_id = ? ORDER BY data_hora ASC';
    
    db.query(query, [usuarioId], (err, results) => {
        if (err) return res.status(500).json({ erro: 'Erro ao buscar logs.' });
        res.status(200).json(results);
    });
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));