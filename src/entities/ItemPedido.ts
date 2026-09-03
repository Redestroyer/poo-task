import type Produto from "./Produto";

export class ItemPedido {
  constructor(
    private _produto: Produto,
    private _quantidade: number
  ) {
    ItemPedido.validarQuantidade(_quantidade);
  }

  get produto() { return this._produto; }
  get quantidade() { return this._quantidade; }
  set quantidade(value: number) {
    ItemPedido.validarQuantidade(value);
    this._quantidade = value;
  }

  static validarQuantidade(qtd: number) {
    if (qtd < 1 || !Number.isSafeInteger(qtd)) {
      throw new Error("A quantidade de um item deve ser maior que zero.");
    }
  }

  calcularSubtotal(){
    return this.produto.preco * this.quantidade;
  }
  canMergeWith(other: ItemPedido): boolean {
    return this.produto.id == other.produto.id;
  }

  static canMerge(one: ItemPedido, two: ItemPedido): boolean {
    return one.canMergeWith(two) && two.canMergeWith(one);
  }

  toString(){
    return(`Subtotal de (${this.produto} x ${this.quantidade}): R$ ${this.calcularSubtotal().toFixed(2).replace(".", ",")}`); 
  }
}
export default ItemPedido;