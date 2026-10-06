import { type Cliente, type Pedido, type PedidoSituação } from "../entities";

export class PedidoRepository {
  constructor(
    private _orders: Pedido[] = []
  ) {
    for (let i = 0; i < _orders.length; i++) {
      for (let j = i + 1; j < _orders.length; j++) {
        if (_orders[i]!.id == _orders[j]!.id)
          throw "Repositório inicializado com pedidos repetidos.";
      }
    }
  }

  consultarPorCódigo(código: number): Pedido | null {
    return this._orders.find(p => p.id == código) ?? null;
  }
  listarPorCliente(cliente: Cliente): Pedido[] {
    return this._orders.filter(p => p.cliente.id == cliente.id);
  }
  listarPorSituação(situação: PedidoSituação): Pedido[] {
    return this._orders.filter(p => p.situação == situação);
  }

  cadastrar(pedido: Pedido): this {
    if (this.consultarPorCódigo(pedido.id))
      throw `Pedido de código ${pedido.id} já existente.`;
    this._orders.push(pedido);
    return this;
  }
}