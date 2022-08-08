const createHttpError = require("http-errors");
const { Produto } = require("../db/models");


async function create(produto) {
    // essa função cria e retorna o objeto com os dados do produto criado
    try {

        const { id ,idComanda, nome, preco } = produto;
        
        // validar se o preço é válido
        if(isNaN(parseFloat(preco)) || parseFloat(preco) < 0 || parseFloat(preco) >= (10**9)){
            throw new createHttpError(400, "O preço informado não é válido");
        }
        //valida se o nome é válido
        if(nome.length < 2 || nome.length > 500){
            throw new createHttpError(400, "O nome inserido não é válido")
        }
        // cria o produto
        const [newProduto, created] = await Produto.findOrCreate({
            where:{id, idComanda},
            defaults:{
                id, idComanda, nome, preco
            }
        });
        // se o produto já existe, atualiza os dados
        if(!created){
            return update({id, idComanda, nome, preco})
        }
        return {id:newProduto.id, nome:newProduto.nome, preco: newProduto.preco}
        
    } catch (err) {
        console.log(err)
        throw new createHttpError(400, "Falha ao criar o produto");
    }
}


async function update(newData) {
    

    try {
        const produto = await Produto.findOne({
            where: {
                id: newData.id,
                idComanda: newData.idComanda
            }
        });

        if (!produto) throw new createHttpError(404, "Este produto não existe");

        Object.assign(produto, newData);

        const updated = await produto.save();

        return {id: updated.id, nome: updated.nome, preco: updated.preco}
    } catch (err) {
        console.log(err);
        throw new createHttpError(400, "Falha ao atualizar o produto");
    }
}


module.exports = {
    create,
    update
};