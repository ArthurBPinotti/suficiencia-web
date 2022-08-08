const { Op } = require("sequelize");
const createHttpError = require("http-errors");
const { Comanda, Produto } = require("../db/models");
const produtosControllers = require("./produtosControllers");



async function getAll(req, res, next) {
    try {
        // busca todas as comandas
        const comandas = await Comanda.findAll({
            attributes: [
                "id",
                "idUsuario",
                "nomeUsuario",
                "telefoneUsuario"
            ]
        })
        
        res.json(comandas);
    } catch (err) {
        console.log(err);
        next
    }
}

async function getOne(req, res, next) {
    // busca a comanda pelo id passado na url
    const id = req.params.id
    try {
        const comanda =  await Comanda.findOne({
                where: {id: id},
                include: {
                    model: Produto,
                    attributes: [
                        "id", "nome", "preco"
                    ]
                },
                attributes: [
                    "id",
                    "idUsuario",
                    "nomeUsuario",
                    "telefoneUsuario"
                ]
            })
        
        if(!comanda){
            throw new createHttpError(404, "Esta comanda não existe");
        }

        res.json(comanda);
    } catch (err) {
        console.log(err);
        next(err)
    }
}

async function create(req, res, next) {
    try {
        // essa função cria e retorna o objeto com os dados da comanda criada
        const comanda = {
            ...req.body
        }
        // separa os campos da comanda
        const { idUsuario, telefoneUsuario, nomeUsuario, produtos } = comanda;
        // cria a comanda
        const newComanda = await Comanda.create({idUsuario, telefoneUsuario, nomeUsuario});

        if (!newComanda) {
            throw new createHttpError(400, "Falha ao criar a comanda");
        }
        // criar os produtos
        let listaProd = []
        if(produtos){
            for(let produto of produtos){
                const prod = await produtosControllers.create({id: produto.id, idComanda: newComanda.id, nome: produto.nome, preco:produto.preco } )
                listaProd.push(prod)
            }
        }
        // retorna a comanda criada e os produtos criados
        const comandaRes = {
            id: newComanda.id,
            idUsuario: newComanda.idUsuario,
            nomeUsuario: newComanda.nomeUsuario,
            telefoneUsuario: newComanda.telefoneUsuario,
            produtos: listaProd
        }

        res.json(comandaRes);
    } catch (err) {
        console.log(err);
        next(err);
    }
}


async function deleteComanda(req, res, next) {
    const target = req.params.id
    // deleta a comanda
    try {
        //deleta os produtos da comanda por causa do cascade
        const comanda = await Comanda.findByPk(target);
        
        if (!comanda) throw new createHttpError(404, "Esta comanda não existe");

        Comanda.destroy({ where: { id: target } })

        res.json({"success":{"text":"comanda removida"}})
    } catch (err) {
        console.log(err);
        next(err);
    }
}

async function update(req, res, next) {
    const target = req.params.id
    const newData = { 
        ...req.body
    }

    try {
        const comanda = await Comanda.findByPk(target);

        if (!comanda) throw new createHttpError(404, "Esta comanda não existe");

        Object.assign(comanda, newData);


        const updated = await comanda.save();

        let listaProd = []
        if(newData.produtos){
            for(let produto of newData.produtos){
                const prod = await produtosControllers.create({id: produto.id, idComanda: req.params.id, nome: produto.nome, preco:produto.preco } )
                listaProd.push(prod)
            }
        }

        res.json({
            id: updated.id,
            idUsuario: updated.idUsuario,
            nomeUsuario: updated.nomeUsuario,
            telefoneUsuario: updated.telefoneUsuario,
            produtos: listaProd
        })
    } catch (err) {
        console.log(err);
        next(err);
    }
}


module.exports = {
    getAll,
    getOne,
    create,
    deleteComanda,
    update
};