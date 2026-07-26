import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { clampPage, idRangeForPage, paginate } from './pagination.ts';

describe('paginate', () => {
  it('devuelve pagina vacia si no hay items', () => {
    const result = paginate([], 1, 10);
    assert.equal(result.total, 0);
    assert.equal(result.totalPages, 0);
    assert.deepEqual(result.items, []);
  });

  it('reparte items en paginas de tamano fijo', () => {
    const items = [1, 2, 3, 4, 5];
    const page1 = paginate(items, 1, 2);
    assert.deepEqual(page1.items, [1, 2]);
    assert.equal(page1.totalPages, 3);

    const page3 = paginate(items, 3, 2);
    assert.deepEqual(page3.items, [5]);
  });

  it('ajusta pagina fuera de rango', () => {
    const items = [1, 2, 3];
    const result = paginate(items, 99, 2);
    assert.equal(result.page, 2);
    assert.deepEqual(result.items, [3]);
  });
});

describe('clampPage', () => {
  it('mantiene limites validos', () => {
    assert.equal(clampPage(0, 5), 1);
    assert.equal(clampPage(3, 5), 3);
    assert.equal(clampPage(9, 5), 5);
    assert.equal(clampPage(2, 0), 1);
  });
});

describe('idRangeForPage', () => {
  it('prioriza IDs mas recientes', () => {
    const page1 = idRangeForPage(25, 1, 10);
    assert.equal(page1.start, 16);
    assert.equal(page1.end, 25);
    assert.equal(page1.totalPages, 3);

    const page3 = idRangeForPage(25, 3, 10);
    assert.equal(page3.start, 1);
    assert.equal(page3.end, 5);
  });

  it('maneja total 0', () => {
    const empty = idRangeForPage(0, 1, 10);
    assert.equal(empty.start, 0);
    assert.equal(empty.end, 0);
    assert.equal(empty.totalPages, 0);
  });
});
