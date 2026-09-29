import { type ItemPedido, Pedido, type Cliente, type Produto } from "../entities";
import type { Situação } from "../entities/Pedido";

export enum Ação { FINALIZAR = "FINALIZAR", CANCELAR = "CANCELAR" }
type Populado<R> = (adicionar: (item: ItemPedido) => void) => R;

export class PedidoService {
  criarPedido(cliente: Cliente): Pedido;
  criarPedido(cliente: Cliente, itens: (ItemPedido | Produto)[]): Pedido;
  criarPedido(cliente: Cliente, populador: (adicionar: (...args: [ItemPedido] | [Produto, quantidade?: number]) => void) => void): Pedido & { situação: Situação.FINALIZADO };
  criarPedido(cliente: Cliente, populador?: (ItemPedido | Produto)[] | ((adicionar: (...args: [ItemPedido] | [Produto, quantidade?: number]) => void) => void)) {
    const pedido = new Pedido(cliente);
    switch (typeof populador) {
      case "undefined":
        return pedido;
    
      case "object":
        return populador.reduce((p, i) => p.adicionarItem(i as any), pedido);
      
      case "function":
        populador(pedido.adicionarItem as any);
        return pedido.finalizar();
    }
  }

  criarPedidoCancelável(cliente: Cliente, populador: (adicionar: (...args: [ItemPedido] | [Produto, quantidade?: number]) => void) => Ação): Pedido & ({ situação: Situação.FINALIZADO } | { situação: Situação.CANCELADO }) {
    const pedido = new Pedido(cliente);
    const act = populador(pedido.adicionarItem as any);
    if (act == Ação.CANCELAR)
      return pedido.cancelar();
    return pedido.finalizar();
  }
}
export default PedidoService;