import ItemPedido from "./ItemPedido";
import type Produto from "./Produto";

export class ItemPedidoPromocional extends ItemPedido {
  private _desconto: number;
  constructor(
    produto: Produto,
    quantidade: number,
    desconto?: number
  ) {
    super(produto, quantidade);
    this._desconto = desconto ?? 0.1;
  }
  get desconto() { return this._desconto; }

  override calcularSubtotal() {
    const subtotalOriginal = super.calcularSubtotal();
    return subtotalOriginal * (1 - this._desconto);
  }
  override canMergeWith(other: ItemPedido): boolean {
    return other instanceof ItemPedidoPromocional
      && this.desconto == other.desconto
      && super.canMergeWith(other);
  }

  override toString() {
    return super.toString()+ ` [desconto: ${this._desconto*100}%]`;
  }
}
export default ItemPedidoPromocional;
