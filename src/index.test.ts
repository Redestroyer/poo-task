import { describe, expect, test } from "bun:test";

import { Produto, ItemPedido, ItemPedidoPromocional, Cliente } from "./entities";
import { PedidoService } from "./services";

test("Função geral", () => {
  const p1 = new Produto(1, "Notebook", 4000.0);
  const p2 = new Produto(2, "Mouse", 100.0);

  // Item regular
  const item1 = new ItemPedido(p1, 2);
  expect(item1.calcularSubtotal()).toBeCloseTo(8000.0)

  // Item promocional com parâmetro opcional omitido (assume 10%)
  const item2 = new ItemPedidoPromocional(p2, 2);
  expect(item2.desconto).toBeCloseTo(0.1);
  expect(item2.calcularSubtotal()).toBeCloseTo(180.0);

  // Item promocional com desconto explícito de 20%
  const item3 = new ItemPedidoPromocional(p2, 2, 0.2);
  expect(item3.desconto).toBeCloseTo(0.2);
  expect(item3.calcularSubtotal()).toBeCloseTo(160.0);

  const pedidoService = new PedidoService();
  const cliente = new Cliente(1, "Say Gex")

  const pedido = pedidoService.criarPedido(cliente);
  pedido.adicionarItem(item1);
  pedido.adicionarItem(item2);
  pedido.adicionarItem(item3);
  expect(pedido.itens).toEqual([item1, item2, item3]);
  expect(pedido.calcularTotal()).toBeCloseTo(8340.0);
});

describe("Histórias de usuário", () => {
  const café = new Produto(1, "Café", 5.00);
  const bolo = new Produto(2, "Bolo", 8.00);
  const suco = new Produto(3, "Suco", 6.00);
  const pedidoService = new PedidoService();
  const ana = new Cliente(1, "Ana");
  test("HU01", () => {
    const pedido = pedidoService.criarPedido(ana)
      .adicionarItem(café)
      .adicionarItem(bolo)
      .adicionarItem(suco)
    ;
    expect(pedido.itens.map(e => e.produto)).toEqual([café, bolo, suco]);
    expect(pedido.toString()).toBe("Total do pedido: R$ 19,00");
  });
  test("HU02", () => {
    const pedido = pedidoService.criarPedido(ana)
      .adicionarItem(café)
      .adicionarItem(bolo)
      .adicionarItem(suco)
    ;
    pedido.removerPedido(bolo);
    expect(pedido.itens.map(e => e.produto)).not.toEqual([café, bolo, suco]);
    expect(pedido.toString()).toBe("Total do pedido: R$ 11,00")
  });
  test("HU03", () => {
    const pedido = pedidoService.criarPedido(ana)
      .adicionarItem(café)
      .adicionarItem(bolo);
    expect(pedido.itens.map(e => [e.produto, e.quantidade])).toEqual([[café, 1], [bolo, 1]]);
    pedido.alterarQuantidadeDeProduto(café, 3);
    expect(pedido.itens.map(e => [e.produto, e.quantidade])).toEqual([[café, 3], [bolo, 1]]);
    expect(() => {
      pedido.alterarQuantidadeDeProduto(suco, 4);
    }).toThrow("Produto não encontrado.");
    expect(() => {
      pedido.alterarQuantidadeDeProduto(bolo, 0);
    }).toThrow("A quantidade de um item deve ser maior que zero.");
    expect(() => {
      pedido.alterarQuantidadeDeProduto(bolo, -2);
    }).toThrow("A quantidade de um item deve ser maior que zero.");
  });
});
