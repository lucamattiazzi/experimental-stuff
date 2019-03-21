export function getIntersectionPoints(
  radius: number,
  sides: number,
  firstDelta: number,
  secondDelta: number,
): { angle: number; distance: number }[] {
  // I wish I could draw how I got to this, but no
  // but it should work
  // It's a simple enough formula, no way to explain here
  // trust me

  const intersections = sides * 2

  const internalAngle = (Math.PI * 2) / sides
  const delta = (secondDelta - firstDelta) % internalAngle

  const oddAlpha = internalAngle - delta
  const evenAlpha = delta
  const oddAngle = firstDelta + delta + oddAlpha / 2
  const evenAngle = firstDelta + internalAngle * 0.5 + evenAlpha / 2
  const beta = (Math.PI - internalAngle) / 2
  const oddGamma = Math.PI - beta - oddAlpha / 2
  const evenGamma = Math.PI - beta - evenAlpha / 2
  const oddDistance = (Math.sin(beta) / Math.sin(oddGamma)) * radius
  const evenDistance = (Math.sin(beta) / Math.sin(evenGamma)) * radius

  const points = Array(intersections)
    .fill(undefined)
    .map((_, i) => {
      const isEven = i % 2 === 1
      const baseAngle = isEven ? evenAngle : oddAngle
      const angle = baseAngle + i * (internalAngle / 2)
      const distance = isEven ? evenDistance : oddDistance
      return { angle, distance }
    })
  return points
}

export function pointsDist(from: [number, number], to: [number, number]) {
  return Math.sqrt(Math.pow(from[0] - to[0], 2) + Math.pow(from[1] - to[1], 2))
}
