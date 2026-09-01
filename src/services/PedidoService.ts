import { Pedido, type Cliente } from "../entities";

export class PedidoService {
  criarPedido(cliente: Cliente) {
    return new Pedido(cliente);
  }
}
export default PedidoService;