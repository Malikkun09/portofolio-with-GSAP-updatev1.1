import type { RouteNode } from './tech-stack-config'

/** Radial spokes from hub to each node — one energy burst per discipline. */
export function buildSpokePath(hub: RouteNode, node: RouteNode): string {
  return `M ${hub.x} ${hub.y} L ${node.x} ${node.y}`
}

export function buildSpokeTrack(hub: RouteNode, nodes: RouteNode[]): string {
  return nodes.map((node) => buildSpokePath(hub, node)).join(' ')
}
