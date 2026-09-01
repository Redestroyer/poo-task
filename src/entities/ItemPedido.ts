import type Produto from "./Produto";

export class ItemPedido {
  constructor(
    private _produto: Produto,
    private _quantidade: number
  ) {
    ItemPedido.validarQuantidade(_quantidade);
  }

  get quantidade(){
    return this._quantidade;
  }

  calcularSubtotal(){
    return this._produto.preco * this.quantidade;
  }

  private static validarQuantidade(qtd: number) {
    if (qtd < 0 || !Number.isSafeInteger(qtd)) {
      throw new Error("A quantidade de um item deve ser maior que zero.");
    }
  }
  toString(){
    return(`Subtotal de (${this._produto} x ${this.quantidade}): R$ ${this.calcularSubtotal()}`); 
  }
}
export default ItemPedido;