import { type ItemPedido, Pedido, type Cliente, type Produto } from "../entities";
import type { Situação } from "../entities/Pedido";
import { PedidoRepository, ProdutoRepository } from "../repositories";

export enum Ação { FINALIZAR = "FINALIZAR", CANCELAR = "CANCELAR" }
type Populado<R> = (adicionar: (item: ItemPedido) => void) => R;

export class PedidoService {
  constructor(
    public readonly produtos: ProdutoRepository = new ProdutoRepository(),
    public readonly pedidos: PedidoRepository = new PedidoRepository(),
    private _index: number = 1
  ) {}

  private makeBlank(cliente: Cliente): Pedido {
    const pedido = new Pedido(this._index++, cliente);
    this.pedidos.cadastrar(pedido);
    return pedido;
  }

  criarPedido(cliente: Cliente): Pedido;
  criarPedido(cliente: Cliente, itens: (ItemPedido | Produto)[]): Pedido;
  criarPedido(cliente: Cliente, populador: (adicionar: (...args: [ItemPedido] | [Produto, quantidade?: number]) => void) => void): Pedido & { situação: Situação.FINALIZADO };
  criarPedido(cliente: Cliente, populador?: (ItemPedido | Produto)[] | ((adicionar: (...args: [ItemPedido] | [Produto, quantidade?: number]) => void) => void)) {
    const pedido = this.makeBlank(cliente);
    switch (typeof populador) {
      case "undefined":
        return pedido;
    
      case "object":
        return populador.reduce((p, i) => p.adicionarItem(i as any), pedido);
      
      case "function":
        populador(pedido.adicionarItem as any);
        return pedido;
    }
  }

  criarPedidoCancelável(cliente: Cliente, populador: (adicionar: (...args: [ItemPedido] | [Produto, quantidade?: number]) => void) => Ação): Pedido & ({ situação: Situação.FINALIZADO } | { situação: Situação.CANCELADO }) {
    const pedido = this.makeBlank(cliente);
    const act = populador(pedido.adicionarItem as any);
    if (act == Ação.CANCELAR)
      return pedido.cancelar();
    return pedido.finalizar();
  }

  consultarPedido(id: number): Pedido {
    const order = this.pedidos.consultarPorCódigo(id);
    if (!order)
      throw new Error(`Pedido ${id} não encontrado.`);
    return order;
  }
  consultarProduto(id: number): Produto {
    const product = this.produtos.consultarPorCódigo(id);
    if (!product)
      throw new Error(`Produto ${id} não encontrado.`);
    return product;
  }
  listarPedidosAbertos(): Pedido[] {
    return this.pedidos.listarPorSituação(Pedido.Situação.ABERTO);
  }
  listarPedidosFinalizados(): Pedido[] {
    return this.pedidos.listarPorSituação(Pedido.Situação.FINALIZADO);
  }
  listarPedidosCancelados(): Pedido[] {
    return this.pedidos.listarPorSituação(Pedido.Situação.CANCELADO);
  }
  resumir(): string {
    const orders = this.listarPedidosFinalizados();
    const howMany = orders.length;
    const total = orders.reduce((s, p) => s + p.calcularTotal(), 0);
    const average = (howMany == 0 ? total : total / howMany).toFixed(2).replace(".", ",")
    return `Pedidos vendidos: ${howMany}\nTotal vendido:    R$ ${total.toFixed(2).replace(".", ",")}\nTicket médio:     R$ ${average}`;
  }

  adicionarProduto(pedido: number, produto: number, quantidade: number = 1): this {
    const order = this.consultarPedido(pedido);
    const product = this.consultarProduto(produto);
    order.adicionarItem(product, quantidade)

    return this;
  }
  removerProduto(pedido: number, produto: number): this {
    const order = this.consultarPedido(pedido);
    if (!order.itens.find(i => i.produto.id == produto))
      throw new Error(`Produto ${produto} não encontrado no pedido ${pedido}.`);
    order.removerPedido(i => i.produto.id == produto);

    return this;
  }
  alterarQuantidade(pedido: number, produto: number, quantidade: number): this {
    const order = this.consultarPedido(pedido);
    const product = this.consultarProduto(produto);
    order.alterarQuantidadeDeProduto(product, quantidade);
    
    return this;
  }
  finalizarPedido(pedido: number) {
    const order = this.consultarPedido(pedido);
    return order.finalizar();
  }
  cancelarPedido(pedido: number) {
    const order = this.consultarPedido(pedido);
    return order.cancelar();
  }
}
export default PedidoService;