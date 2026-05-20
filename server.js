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

// HU01 - Cadastro de Usuário
app.post('/cadastro', async (req, res) => {
    const { nome, email, senha } = req.body;
    try {
        const hash = await bcrypt.hash(senha, 10); // Criptografia da senha
        db.query('INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)', 
        [nome, email, hash], (err, result) => {
            if (err) return res.status(500).json({ erro: 'Erro ao cadastrar ou e-mail já existe.' });
            res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!' });
        });
    } catch (err) {
        res.status(500).json({ erro: 'Erro interno' });
    }
});

// HU02 - Login
app.post('/login', (req, res) => {
    const { email, senha } = req.body;
    db.query('SELECT * FROM usuarios WHERE email = ?', [email], async (err, results) => {
        if (err || results.length === 0) return res.status(401).json({ erro: 'Usuário não encontrado.' });
        
        const usuario = results[0];
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        
        if (!senhaValida) return res.status(401).json({ erro: 'Senha incorreta.' });
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

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));