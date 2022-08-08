const createHttpError = require("http-errors");
const { Registro } = require("../db/models");
const jwt = require("jsonwebtoken");
const ms = require("ms");



function createAccessToken(id) {
    // essa função cria o token de acesso
    const token = jwt.sign(
        { id }, 
        process.env.ACCESS_TOKEN_SECRET, 
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION }
    );

    return token;
}

async function login(req, res, next) {
    // essa função faz o login do usuário e retorna o token de acesso
    try {
        const { credential, password } = req.body;

        let registro = await Registro.findOne({ where: { username: credential } });
        
        if (!registro) {
            throw new createHttpError(401, "Credenciais inválidas");
        }
        
        const isPasswordValid = registro.isPasswordValid(password);
        // verifica se a senha é válida
        if (!isPasswordValid) {
            throw new createHttpError(401, "Credenciais inválidas");
        }
        // cria o token de acesso
        const accessToken = createAccessToken(registro.id);

        res.json({ accessToken });

    } catch (error) {
        console.log(error);
        next(error);
    }
}
async function register(req, res, next) {
    // essa função faz o registro do usuário e retorna o token de acesso
    try {
        const user = {
            ...req.body
        }
        const { password,  username } = user;

        const [newUser, created] = await Registro.findOrCreate({
            where: { username },
            defaults: { password, username }
        });

        if (!created) {
            throw new createHttpError(409, "Este usuário já existe");
        }

        res.json(newUser);
    } catch (err) {
        console.log(err);
        next(err);
    }
}






module.exports = {
    login,
    register
}