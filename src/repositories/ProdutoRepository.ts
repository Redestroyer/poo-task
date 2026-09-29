import type { Produto } from "../entities";

export class ProdutoRepository {
  constructor(
    private _products: Produto[] = []
  ) {
    for (let i = 0; i < _products.length; i++) {
      for (let j = i + 1; j < _products.length; j++) {
        if (_products[i]!.id == _products[j]!.id)
          throw "Repositório inicializado com produtos repetidos.";
      }
    }
  }

  listarTodos(): Produto[] {
    return this._products;
  }
  get quantidade(): number {
    return this._products.length;
  }
  consultarPorCódigo(código: number): Produto | null {
    return this._products.find(p => p.id == código) ?? null;
  }
  cadastrar(produto: Produto): this {
    if (this.consultarPorCódigo(produto.id))
      throw `Produto de código ${produto.id} já existente.`;
    this._products.push(produto);
    return this;
  }
}