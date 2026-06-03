const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

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

// HU01 - Cadastro de Usuário
app.post('/cadastro', (req, res) => {
    const { nome, email, senha } = req.body;
    
    db.query('INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)', 
    [nome, email, senha], (err, result) => {
        if (err) return res.status(500).json({ erro: 'Erro ao cadastrar ou e-mail já existe.' });
        res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!' });
    });
});

// HU02 - Login
app.post('/login', (req, res) => {
    const { email, senha } = req.body;
    
    db.query('SELECT * FROM usuarios WHERE email = ?', [email], (err, results) => {
        if (err || results.length === 0) return res.status(401).json({ erro: 'Usuário não encontrado.' });
        
        const usuario = results[0];
        
        if (senha !== usuario.senha) {
            return res.status(401).json({ erro: 'Senha incorreta.' });
        }
        
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

// Buscar dados do usuário logado
app.get('/usuarios/:id', (req, res) => {
    const usuarioId = req.params.id;
    db.query('SELECT nome, email FROM usuarios WHERE id = ?', [usuarioId], (err, results) => {
        if (err) return res.status(500).json({ erro: 'Erro ao buscar usuário.' });
        if (results.length === 0) return res.status(404).json({ erro: 'Usuário não encontrado.' });
        res.status(200).json(results[0]);
    });
});

// HU03 - Editar dados do usuário
app.put('/usuarios/:id', (req, res) => {
    const usuarioId = req.params.id;
    const { nome, email } = req.body;

    db.query('UPDATE usuarios SET nome = ?, email = ? WHERE id = ?', 
    [nome, email, usuarioId], (err, result) => {
        if (err) return res.status(500).json({ erro: 'Erro ao atualizar dados ou e-mail já existe.' });
        if (result.affectedRows === 0) return res.status(404).json({ erro: 'Usuário não encontrado.' });
        res.status(200).json({ mensagem: 'Dados atualizados com sucesso!' });
    });
});

// HU04 - Exclusão de conta
app.delete('/usuarios/:id', (req, res) => {
    const usuarioId = req.params.id;

    db.query('DELETE FROM usuarios WHERE id = ?', [usuarioId], (err, result) => {
        if (err) return res.status(500).json({ erro: 'Erro ao excluir conta.' });
        if (result.affectedRows === 0) return res.status(404).json({ erro: 'Usuário não encontrado.' });
        res.status(200).json({ mensagem: 'Conta e dados pessoais excluídos com sucesso.' });
    });
});

// HU06 - Inscrição em curso
app.post('/inscricoes', (req, res) => {
    const { usuario_id, curso_id } = req.body;

    db.query('SELECT * FROM inscricoes WHERE usuario_id = ? AND curso_id = ?', 
    [usuario_id, curso_id], (err, results) => {
        if (err) return res.status(500).json({ erro: 'Erro ao verificar inscrição.' });
        if (results.length > 0) return res.status(400).json({ erro: 'Você já está inscrito neste curso.' });

        db.query('INSERT INTO inscricoes (usuario_id, curso_id) VALUES (?, ?)', 
        [usuario_id, curso_id], (err, result) => {
            if (err) return res.status(500).json({ erro: 'Erro ao realizar inscrição.' });
            res.status(201).json({ mensagem: 'Inscrição realizada com sucesso!' });
        });
    });
});

// HU07 - Acompanhar progresso
app.get('/inscricoes/:usuario_id', (req, res) => {
    const usuarioId = req.params.usuario_id;

    const query = `
        SELECT i.id as inscricao_id, c.id as curso_id, c.titulo, c.descricao, i.progresso 
        FROM inscricoes i
        JOIN cursos c ON i.curso_id = c.id
        WHERE i.usuario_id = ?
    `;

    db.query(query, [usuarioId], (err, results) => {
        if (err) return res.status(500).json({ erro: 'Erro ao buscar inscrições.' });
        res.status(200).json(results);
    });
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));