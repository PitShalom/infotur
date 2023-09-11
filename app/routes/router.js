var express = require('express')
var router = express.Router()
var bcrypt = require('bcryptjs')
var salr = bcrypt.genSaltSync(12)
var mysql = require('mysql')
var { body, validationResult } = require('express-validator')

var fabricDeConexao = require('../../config/connection-factory')
const session = require('express-session')
var bd = fabricDeConexao()

bd.connect((err) => {
    if(err){
      throw err
    }
    console.log('Concectado ao banco de dados MySQL')
})

router.get('/', function(req, res){
    res.render('pages/index')
})

router.get('/cadastro', function(req, res){
    res.render('pages/cadastro')
})

router.post('/cadastro',  (req, res) => {
    const { nome, email, senha , cpf, telefone} = req.body

    if (nome && email && senha && cpf && telefone){
    bd.query('select * from cadastro where email = ?',
    [email],
    (error, results) => {
        if(results.length > 0) {
            res.send('Email já cadastrado')
        } else {
            const hashedPassword = bcrypt.hashSync(senha)

            bd.query(
            'insert into cadastro (nome, email, senha ,cpf, telefone) values (?, ?, ?, ?, ?)',
            [nome, email, hashedPassword, cpf , telefone],
            (error, results) => {
                if(error){
                    console.error('Erro ao cadastrar o usuário:', error);
                    res.send('Erro ao cadastrar o usuário');
                } else {
                    res.send('Cadastro realizado com sucesso!')
                }
            }
            )
        }
    })
    } else {
        res.send('Por favor, preencha todos os campos')
    }
})



router.get('/login', function(req, res){
    res.render('pages/login');
});

router.post('/login', (req, res) => {
    const { email, senha } = req.body;

    if (email && senha) {
        bd.query(
            'SELECT * FROM cadastro WHERE email = ?',
            [email],
            (error, results) => {
                if (error) {
                    console.error(error);
                    res.send('Ocorreu um erro ao autenticar.');
                    return;
                }

                if (results && results.length > 0){
                    const storedPassword = results[0].senha;
                    if(bcrypt.compareSync(senha, storedPassword)){
                        req.session.loggedin = true;
                        req.session.email = email;
                        res.send('Login realizado com sucesso!'); 
                    } else {
                        res.send('Senha incorreta');
                    }
                } else {
                    res.send('Email não encontrado');
                }
            }
        );
    } else {
        res.send('Informe um email e senha');
    }
});




module.exports = router