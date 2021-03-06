import { Matrix, Model, IndexMap, Edge } from '../layout/types'

export const getDegree = (n: number, nodeIdxMap: IndexMap, edges: Edge[] | null) => {
  const degrees: number[] = []
  for (let i = 0; i < n; i++) {
    degrees[i] = 0
  }
  if (!edges) return degrees
  edges.forEach((e) => {
    if (e.source) {
      degrees[nodeIdxMap[e.source]] += 1
    }
    if (e.target) {
      degrees[nodeIdxMap[e.target]] += 1
    }
  })
  return degrees
}

export const floydWarshall = (adjMatrix: Matrix[]): Matrix[] => {
  // initialize
  const dist: Matrix[] = []
  const size = adjMatrix.length
  for (let i = 0; i < size; i += 1) {
    dist[i] = []
    for (let j = 0; j < size; j += 1) {
      if (i === j) {
        dist[i][j] = 0
      } else if (adjMatrix[i][j] === 0 || !adjMatrix[i][j]) {
        dist[i][j] = Infinity
      } else {
        dist[i][j] = adjMatrix[i][j]
      }
    }
  }
  // floyd
  for (let k = 0; k < size; k += 1) {
    for (let i = 0; i < size; i += 1) {
      for (let j = 0; j < size; j += 1) {
        if (dist[i][j] > dist[i][k] + dist[k][j]) {
          dist[i][j] = dist[i][k] + dist[k][j]
        }
      }
    }
  }
  return dist
}

export const getAdjMatrix = (data: Model, directed: boolean): Matrix[] => {
  const {
    nodes,
    edges
  } = data
  const matrix: Matrix[] = []
  // map node with index in data.nodes
  const nodeMap: {
    [key: string]: number;
  } = {}

  if (!nodes) {
    throw new Error('invalid nodes data!')
  }
  if (nodes) {
    nodes.forEach((node, i) => {
      nodeMap[node.id] = i
      const row: number[] = []
      matrix.push(row)
    })
  }

  if (edges) {
    edges.forEach((e) => {
      const {
        source,
        target
      } = e
      const sIndex = nodeMap[source as string]
      const tIndex = nodeMap[target as string]
      matrix[sIndex][tIndex] = 1
      if (!directed) {
        matrix[tIndex][sIndex] = 1
      }
    })
  }

  return matrix
}

/**
 * scale matrix
 * @param matrix [ [], [], [] ]
 * @param ratio
 */
export const scaleMatrix = (matrix: Matrix[], ratio: number) => {
  const result: Matrix[] = []
  matrix.forEach((row) => {
    const newRow: number[] = []
    row.forEach((v) => {
      newRow.push(v * ratio)
    })
    result.push(newRow)
  })
  return result
}

/**
 * depth first traverse, from leaves to root, children in inverse order
 *  if the fn returns false, terminate the traverse
 */
const traverseUp = <T extends { children?: T[] }>(data: T, fn: (param: T) => boolean) => {
  if (data && data.children) {
    for (let i = data.children.length - 1; i >= 0; i--) {
      if (!traverseUp(data.children[i], fn)) return
    }
  }

  if (!fn(data)) {
    return false
  }
  return true
}

/**
 * depth first traverse, from leaves to root, children in inverse order
 * if the fn returns false, terminate the traverse
 */
export const traverseTreeUp = <T extends { children?: T[] }>(
  data: T,
  fn: (param: T) => boolean,
) => {
  if (typeof fn !== 'function') {
    return
  }
  traverseUp(data, fn)
}
