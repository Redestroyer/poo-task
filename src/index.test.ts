import { describe, expect, test } from "bun:test";

import { Produto, ItemPedido, ItemPedidoPromocional, Cliente, Pedido } from "./entities";
import { PedidoService } from "./services";
import { ProdutoRepository } from "./repositories";

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

  const pedido = pedidoService.criarPedido(cliente, [item1, item2, item3]);
  expect(pedido.itens).toEqual([item1, item2, item3]);
  expect(pedido.calcularTotal()).toBeCloseTo(8340.0);
});

describe("Histórias de usuário", () => {
  const café = new Produto(1, "Café", 5.00);
  const bolo = new Produto(2, "Bolo", 8.00);
  const suco = new Produto(3, "Suco", 6.00);
  const sanduíche = new Produto(4, "Sanduíche", 15.00);
  const pedidoServicePrimitivo = new PedidoService();
  const ana = new Cliente(1, "Ana");
  test("HU01", () => {
    const pedido = pedidoServicePrimitivo.criarPedido(ana, [café, bolo, suco]);
    expect(pedido.itens.map(e => e.produto)).toEqual([café, bolo, suco]);
    expect(pedido.toString()).toBe("Total do pedido: R$ 19,00");
  });
  test("HU02", () => {
    const pedido = pedidoServicePrimitivo.criarPedido(ana, [café, bolo, suco]);
    pedido.removerPedido(bolo);
    expect(pedido.itens.map(e => e.produto)).not.toContain(bolo);
    expect(pedido.toString()).toBe("Total do pedido: R$ 11,00")
  });
  test("HU03", () => {
    const pedido = pedidoServicePrimitivo.criarPedido(ana, [café, bolo]);
    expect(pedido.itens.map(e => [e.produto, e.quantidade])).toEqual([[café, 1], [bolo, 1]]);
    pedido.alterarQuantidadeDeProduto(café, 3);
    expect(pedido.itens.map(e => [e.produto, e.quantidade])).toEqual([[café, 3], [bolo, 1]]);
    expect(() => {
      pedido.alterarQuantidadeDeProduto(suco, 4);
    }).toThrow("Produto 3 não encontrado.");
    expect(() => {
      pedido.alterarQuantidadeDeProduto(bolo, 0);
    }).toThrow("A quantidade de um item deve ser maior que zero.");
    expect(() => {
      pedido.alterarQuantidadeDeProduto(bolo, -2);
    }).toThrow("A quantidade de um item deve ser maior que zero.");
  });
  test("HU04", () => {
    const pedido = pedidoServicePrimitivo.criarPedido(ana, [café, bolo]);
    expect(pedido.aberto).toBe(true);
    pedido.finalizar();
    expect(pedido.finalizado).toBe(true);
    expect(() => {
      pedido.adicionarItem(suco);
    }).toThrow("Pedido já finalizado.");
    expect(() => {
      pedido.removerPedido(café);
    }).toThrow("Pedido já finalizado.");
    expect(() => {
      pedido.alterarQuantidadeDeProduto(bolo, 2);
    }).toThrow("Pedido já finalizado.");
  });
  test("HU05", () => {
    const pedido = pedidoServicePrimitivo.criarPedido(ana, [café, café, bolo]);
    expect(pedido.aberto).toBe(true);
    pedido.cancelar();
    expect(pedido.cancelado).toBe(true);
    expect(() => {
      pedido.adicionarItem(suco);
    }).toThrow("Pedido já cancelado.");
    expect(() => {
      pedido.removerPedido(café);
    }).toThrow("Pedido já cancelado.");
    expect(() => {
      pedido.alterarQuantidadeDeProduto(bolo, 2);
    }).toThrow("Pedido já cancelado.");
  });
  test("HU06", () => {
    const cardápio = new ProdutoRepository([café, bolo, suco, sanduíche]);
    expect(cardápio.quantidade).toBe(4);
    expect(() => cardápio.cadastrar(new Produto(2, "Torta", 10.00))).toThrow("Produto de código 2 já existente.");
    expect(cardápio.consultarPorCódigo(2)).toEqual(bolo);
    expect(cardápio.quantidade).toBe(4);
  });
  test("HU07", () => {
    const cardápio = new ProdutoRepository([café, bolo, suco, sanduíche]);
    expect(cardápio.listarTodos().map(({ id, nome, preço }) => ({ id, nome, preço }))).toEqual([
      { id: 1, nome: "Café", preço: 5.00 },
      { id: 2, nome: "Bolo", preço: 8.00 },
      { id: 3, nome: "Suco", preço: 6.00 },
      { id: 4, nome: "Sanduíche", preço: 15.00 },
    ]);
    expect(cardápio.consultarPorCódigo(4)).toEqual(sanduíche);
    expect(cardápio.consultarPorCódigo(99)).toEqual(null);
  });
  test("HU08", () => {
    const cardápio = new ProdutoRepository([café, bolo, suco, sanduíche]);
    const pedidoService = new PedidoService(cardápio);
    {
      const { id } = pedidoService.criarPedido(ana);
      expect(id).toBe(1);
    }
    pedidoService
      .adicionarProduto(1, 1, 2)
      .adicionarProduto(1, 2, 1)
    ;
    expect(() => {
      pedidoService.adicionarProduto(1, 99);
    }).toThrow("Produto 99 não encontrado.");
    const pedido = pedidoService.consultarPedido(1)!;
    expect(pedido.calcularTotal()).toEqual(18.00);
    expect(() => {
      pedidoService.consultarPedido(50);
    }).toThrow("Pedido 50 não encontrado.");
    expect(() => {
      pedidoService.adicionarProduto(50, 1);
    }).toThrow("Pedido 50 não encontrado.");
  });
  {
    const cardápio = new ProdutoRepository([café, bolo, suco, sanduíche]);
    const pedidoService = new PedidoService(cardápio);
    const ana = new Cliente(1, "Ana");
    pedidoService
      .criarPedido(ana, [café, bolo])
      .finalizar()
    ;
    const bruno = new Cliente(2, "Bruno");
    pedidoService
      .criarPedido(bruno)
      .adicionarItem(suco, 2)
    ;
    const carla = new Cliente(3, "Carla");
    pedidoService
      .criarPedido(carla, [sanduíche])
      .cancelar()
    ;
    const diego = new Cliente(4, "Diego");
    pedidoService
      .criarPedido(diego)
      .adicionarItem(café, 2)
      .adicionarItem(sanduíche)
      .finalizar()
    ;
    test("HU09", () => {
      const map = (p: Pedido) => ({ id: p.id, cliente: p.cliente, total: p.calcularTotal() });
      
      const abertos = pedidoService
        .listarPedidosAbertos()
        .map(map)
      ;
      expect(abertos).toContainEqual({ id: 2, cliente: bruno, total: 12.00 });

      const finalizados = pedidoService
        .listarPedidosFinalizados()
        .map(map)
      ;
      expect(finalizados).toContainEqual({ id: 1, cliente: ana, total: 13.00 });
      expect(finalizados).toContainEqual({ id: 4, cliente: diego, total: 25.00 });

      const cancelados = pedidoService
        .listarPedidosCancelados()
        .map(map)
      ;
      expect(cancelados).toContainEqual({ id: 3, cliente: carla, total: 15.00 });
    });
    test("HU10", () => {
      expect(new PedidoService().resumir())
      .toBe("Pedidos vendidos: 0\nTotal vendido:    R$ 0,00\nTicket médio:     R$ 0,00");
      expect(pedidoService.resumir())
      .toBe("Pedidos vendidos: 2\nTotal vendido:    R$ 38,00\nTicket médio:     R$ 19,00");
      pedidoService.finalizarPedido(2);
      expect(pedidoService.resumir())
      .toBe("Pedidos vendidos: 3\nTotal vendido:    R$ 50,00\nTicket médio:     R$ 16,67");
    });
  }
});
