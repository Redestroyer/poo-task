# Repositories
## `ProdutoRepository`
Stores `Produto`s.
### Properties:
- `quantidade: number`: How many products are registered.
### Functions:
- `listarTodos(): Produto[]`: Returns a list over all products.
- `consultarPorCódigo(código: number): Produto | null`: Returns the product with ID `código` or `null` if missing.
- `cadastrar(produto: Produto): this`: Registers `produto` into the repository unless another product with the same ID is found, in which case an exception is thrown.
## `PedidoRepository`
Stores `Pedido`s.
### Functions:
- `listarTodos(): Pedido[]`: Returns a list over all orders.
- `consultarPorCódigo(código: number): Pedido | null`: Returns the order with ID `código` or `null` if missing.
- `consultarPorCliente(cliente: Cliente): Pedido[]`: Returns all orders for `cliente`.
- `cadastrar(produto: Pedido): this`: Registers `pedido` into the repository unless another order with the same ID is found, in which case an exception is thrown.
# Services
## `PedidoService`
### Functions
- `adicionarProduto(pedido: number, produto: number, quantidade: number)`
- `removerProduto(pedido: number, produto: number)`: Returns the removed items of given product.
- `alterarQuantidade(pedido: number, produto: number, quantidade: number)`
- `finalizarPedido(pedido: number)`
- `cancelarPedido(pedido: number)`