import type Cliente from "./Cliente";
import ItemPedido from "./ItemPedido";
import Produto from "./Produto";

export enum Situação {
  ABERTO = "ABERTO",
  FINALIZADO = "FINALIZADO",
  CANCELADO = "CANCELADO",
}

export class Pedido {
  private _itens: ItemPedido[]
  private _situação: Situação = Situação.ABERTO;

  constructor(
    private _cliente: Cliente,
    itens?: ItemPedido[]
  ) {
    this._itens = itens ?? [];
  }

  get cliente() { return this._cliente; }
  get itens() { return this._itens.filter(_ => true); }

  get situação() { return this._situação; }
  get aberto() { return this.situação === Situação.ABERTO}
  estáAberto(): this is { situação: Situação.ABERTO } { return this.aberto; }
  get finalizado() { return this.situação === Situação.FINALIZADO}
  estáFinalizado(): this is { situação: Situação.FINALIZADO } { return this.finalizado; }
  get cancelado() { return this.situação === Situação.CANCELADO}
  estáCancelado(): this is { situação: Situação.CANCELADO } { return this.cancelado; }

  guardAberto(): this & { situação: Situação.ABERTO } {
    if (!this.estáAberto())
      throw new Error(`Pedido já ${this.situação.toLowerCase()}.`);

    return this;
  }
  finalizar(): this & { situação: Situação.FINALIZADO } {
    this.guardAberto();

    this._situação = Situação.FINALIZADO;
    return this as any;
  }
  cancelar(): this & { situação: Situação.CANCELADO } {
    this.guardAberto();

    this._situação = Situação.CANCELADO;
    return this as any;
  }

  adicionarItem(item: ItemPedido): this;
  adicionarItem(produto: Produto, quantidade?: number): this;
  adicionarItem(item: ItemPedido | Produto, quantidade?: number): this {
    this.guardAberto();

    if (item instanceof Produto) {
      return this.adicionarItem(new ItemPedido(item, quantidade ?? 1));
    }

    const existing = this._itens.find(e => ItemPedido.canMerge(item, e));
    if (existing) {
      existing.quantidade += item.quantidade;
      return this;
    }

    this._itens.push(item);
    return this;
  }

  removerPedido(item: ItemPedido): this;
  removerPedido(item: Produto): this;
  removerPedido(item: Produto, quantidade: number): this;
  removerPedido(condição: (item: ItemPedido) => boolean): this;
  removerPedido(condição: ItemPedido | Produto | ((item: ItemPedido) => boolean), quantidade?: number): this {
    this.guardAberto();

    if (condição instanceof ItemPedido)
      return this.removerPedido(e => e.produto.id == condição.produto.id && e.quantidade == condição.quantidade);
    if (condição instanceof Produto)
      return this.removerPedido(e => e.produto.id == condição.id && (quantidade === undefined || e.quantidade == quantidade));

    this._itens = this._itens.filter(e => !condição(e));
    return this;
  }
  
  alterarQuantidadeDeProduto(produto: Produto, quantidade: number): this;
  alterarQuantidadeDeProduto(produto: Produto, quantidade: (anterior: number) => number): this;
  alterarQuantidadeDeProduto(produto: Produto, quantidade: number | ((anterior: number) => number)): this {
    this.guardAberto();

    if (typeof quantidade === "number")
      return this.alterarQuantidadeDeProduto(produto, _ => quantidade);

    const existing = this._itens.find(e => e.produto.id == produto.id);
    if (!existing)
      throw new Error("Produto não encontrado.");
    existing.quantidade = quantidade(existing.quantidade);
    return this;
  }

  calcularTotal(inicial: number = 0) {
    return this.itens.reduce((sum, item) => sum + item.calcularSubtotal(), inicial);
  }

  toString() {
    return `Total do pedido: R$ ${this.calcularTotal().toFixed(2).replace(".", ",")}`;
  }
}
export default Pedido;