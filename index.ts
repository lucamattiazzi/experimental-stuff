import { pointsDist, getIntersectionPoints } from './lib'
class World {
  canvas: HTMLCanvasElement
  start: number
  drawing: boolean = true

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.start = Date.now()
    this.resize()
    window.onresize = this.resize
    this.canvas.onclick = this.handleClick
    this.draw()
  }

  get size(): number {
    return Math.min(window.innerHeight, window.innerWidth)
  }

  get radius(): number {
    return this.size / 3
  }

  get center(): [number, number] {
    const x = this.canvas.width / 2
    const y = this.canvas.height / 2
    return [x, y]
  }

  get ctx(): CanvasRenderingContext2D {
    return this.canvas.getContext('2d')
  }

  resize = () => {
    this.canvas.width = this.size
    this.canvas.height = this.size
    this.canvas.style.width = `${this.size}px`
    this.canvas.style.height = `${this.size}px`
  }

  handleClick = (e: MouseEvent) => {
    this.drawing = !this.drawing
    if (this.drawing) this.draw()
  }

  reset = () => {
    this.ctx.clearRect(0, 0, this.size, this.size)
  }

  drawCircle = () => {
    const ctx = this.canvas.getContext('2d')
    const [x, y] = this.center
    ctx.beginPath()
    ctx.arc(x, y, this.radius, 0, Math.PI * 2)
    ctx.stroke()
  }

  drawPolygon = (sides: number, alpha: number) => {
    const rotAngle = (Math.PI * 2) / sides
    this.ctx.beginPath()
    for (let i = 0; i < sides + 1; i++) {
      // wooo magic
      const angle = rotAngle * i + alpha
      const x = this.center[0] + this.radius * Math.sin(angle)
      const y = this.center[1] + this.radius * Math.cos(angle)
      this.ctx.lineTo(x, y)
      this.ctx.moveTo(this.center[0], this.center[1])
      this.ctx.lineTo(x, y)
    }
    this.ctx.stroke()
  }

  drawStupidPolygon = (sides: number, alpha: number) => {
    const rotAngle = (Math.PI * 2) / sides
    this.ctx.beginPath()
    const points = [] as [number, number][]
    while (true) {
      // yeah why not
      const angle = rotAngle * points.length + alpha
      const x = this.center[0] + this.radius * Math.sin(angle)
      const y = this.center[1] + this.radius * Math.cos(angle)
      this.ctx.lineTo(x, y)
      this.ctx.moveTo(this.center[0], this.center[1])
      this.ctx.lineTo(x, y)
      const closePoint = points.find(p => pointsDist(p, [x, y]) < 0.5)
      points.push([x, y])
      if (closePoint) break
      if (points.length > 100) break
    }
    this.ctx.stroke()
  }

  drawIntersections = (polygons: [number, number][]) => {
    const sides = polygons[0][0]
    const firstDelta = polygons[0][1]
    const secondDelta = polygons[1][1]
    const points = getIntersectionPoints(this.radius, sides, firstDelta, secondDelta)
    const pointsCoords = points.map(({ angle, distance }) => {
      const x = Math.sin(angle) * distance + this.center[0]
      const y = Math.cos(angle) * distance + this.center[1]
      return [x, y]
    })
    this.ctx.beginPath()
    this.ctx.fillStyle = 'gray'
    for (let i = 0; i < pointsCoords.length + 1; i++) {
      const [x, y] = pointsCoords[i % pointsCoords.length]
      this.ctx.lineTo(x, y)
    }
    this.ctx.fill()
  }

  draw = () => {
    const angle = Math.sin((Date.now() - this.start) / 10000) * Math.PI
    const polygons = [[3, 0], [3, angle]] as [number, number][]
    this.reset()
    this.drawCircle()
    polygons.forEach(([sides, delta]) => {
      this.drawPolygon(sides, delta)
    })
    this.drawIntersections(polygons)
    this.drawStupidPolygon(angle, angle)
    if (!this.drawing) return
    window.requestAnimationFrame(this.draw)
  }
}

const world = new World(document.getElementById('canvas') as HTMLCanvasElement)
