import { Produto, ItemPedido, ItemPedidoPromocional, Cliente } from "./entities";
import { PedidoService } from "./services";

try {
  const p1 = new Produto(1, "Notebook", 4000.0);
  const p2 = new Produto(2, "Mouse", 100.0);

  // Item regular
  const item1 = new ItemPedido(p1, 2);
  console.log(item1.toString()); // R$ 8000
  // console.log(`${item1}`); // R$ 8000

  // Item promocional com parâmetro opcional omitido (assume 10%)
  const item2 = new ItemPedidoPromocional(p2, 2);
  console.log(item2.toString()); // R$ 180 (100 * 2 - 10%)
  // console.log(`Subtotal Item 2 (Promo 10%): R$ ${item2.calcularSubtotal()}`); // R$ 180 (100 * 2 - 10%)

  // Item promocional com desconto explícito de 20%
  const item3 = new ItemPedidoPromocional(p2, 2, 0.2);
  console.log(item3.toString()); // R$ 160

  const pedidoService = new PedidoService();
  const cliente = new Cliente(1, "Say Gex")

  const pedido = pedidoService.criarPedido(cliente);
  pedido.adicionarItem(item1);
  pedido.adicionarItem(item2);
  pedido.adicionarItem(item3);
  console.log(pedido.toString());
} catch (error) {
  // Type Guard: Verificando com segurança se o erro é uma instância da classe Error
  if (error instanceof Error) {
    console.error(`Erro de validação: ${error.message}`);
  } else {
    console.error("Ocorreu um erro desconhecido.");
  }
}