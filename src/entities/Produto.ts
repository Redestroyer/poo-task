export class Produto {
  constructor(
    private readonly _id: number,
    private _nome: string,
    private _preco: number
  ) {
    Produto.validarPreco(_preco);
  }

  get id() {
    return this._id;
  }
  get nome() {
    return this._nome;
  }
  get preco() {
    return this._preco;
  }

  set preco(novoPreco) {
    Produto.validarPreco(novoPreco);
    this._preco = novoPreco;
  }

  private static validarPreco(preco: number) {
    if (preco < 0) {
      throw new Error("O preço do produto não pode ser negativo.");
    }
  }

  toString(){
    return `Produto(${this.id},${this.nome},${this.preco.toFixed(2).replace(".", ",")})`;
  }
}
export default Produto;
