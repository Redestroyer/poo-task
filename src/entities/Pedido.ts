import type Cliente from "./Cliente";
import ItemPedido from "./ItemPedido";
import Produto from "./Produto";

export class Pedido {
  private _itens: ItemPedido[]

  constructor(
    private _cliente: Cliente,
    itens?: ItemPedido[]
  ) {
    this._itens = itens ?? [];
  }

  get cliente() { return this._cliente; }
  get itens() { return this._itens.filter(_ => true); }

  adicionarItem(item: ItemPedido): void;
  adicionarItem(produto: Produto, quantidade: number): void;
  adicionarItem(item: ItemPedido | Produto, quantidade?: number) {
    if (item instanceof Produto)
      return this.adicionarItem(new ItemPedido(item, quantidade ?? 1));
    this._itens.push(item);
  }
  removerPedido(item: ItemPedido) {
    this._itens = this._itens.filter(e => item != e);
  }
  calcularTotal(inicial: number = 0) {
    return this.itens.reduce((sum, item) => sum + item.calcularSubtotal(), inicial);
  }

  toString() {
    return `[${this.itens.join(", ")}]`
  }
}
export default Pedido