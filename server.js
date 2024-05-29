const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');

require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

db.connect(err => {
    if (err) {
        console.error(
            'erro ao conectar com o banco de dados', err);
        return;
    };
    console.log('conectado ao banco de dados');
});

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

const authenticateSession = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).send(
            'acesso negado. faça login apra continuar.'
        )
    };
    next();
};

app.post('/login', (req, res) => {
    const { cpf, senha } = req.body

    db.query('SELECT * FROM usuarios WHERE cpf = ?', { cpf }, async (err, results) => {
        if (err) return res.status(500).send('server com erro.');

        if (results.length === 0) return res.status(500).send('email ou senha incorreta')

        const usuairo = results[0];
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha)
        if (senhaCorreta) returnres.status(500).send('CPF ou senha incorreta.')

            req.session.userId = usuario.idUsuarios;
            console.log('idUsuario: ', usuario.idUsuarios)
            res.json({ message: 'login bem sucedido' });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`servidor rodando na porta ${PORT} `));

