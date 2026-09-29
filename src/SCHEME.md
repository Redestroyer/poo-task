# Repositories
## `ProdutoRepository`
Stores `Produto`s.
### Properties:
- `quantidade: number`: How many products are registered.
### Functions:
- `listarTodos(): Produto[]`: Returns a list over all products.
- `consultarPorCódigo(código: number): Produto | null`: Returns the product with ID `código` or `null` if missing.
- `cadastrar(produto: Produto): this`: Registers `produto` into the repository unless another product with the same ID is found, in which case an exception is thrown.
