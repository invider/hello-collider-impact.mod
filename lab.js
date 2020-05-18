const RAIN = 1

let r = 50
let x = rx(.5)
let y = ry(.5)

let dx = ry(.2)
let dy = ry(.2)

let impacts = 0
const asteroids = []

function init() {
    lab.background = '#050508'
}

function spawnAsteroid() {
    asteroids.push({
        r: 25,
        x: rnd(rx(1)),
        y: -50,
        dx: rnd(ry(.2)) - ry(.1),
        dy: ry(.2),

        evo: function(dt) {
            this.x += this.dx * dt
            this.y += this.dy * dt

            // planet collision
            const d = dist(this.x, this.y, x, y)
            if (d < (this.r + r)) {
                // boom!
                res.impact.currentTime = 0 
                res.impact.play()
                impacts ++
                this.toKill = true
            }
        },

        draw: function() {
            image(res.asteroid, this.x-this.r, this.y-this.r, 2*this.r, 2*this.r)
        }, 

        kill: function() {
            const i = asteroids.indexOf(this)
            asteroids.splice(i, 1)
        }
    })
}

function boing() {
    res.boing.currentTime = 0 
    res.boing.play()
}

function evo(dt) {
    x += dx * dt
    y += dy * dt

    // bounce off the screen edges
    if ((dx > 0 && x >= rx(1)-r) || (dx < 0 && x < r)) {
        dx *= -1
        boing()
    }
    if ((dy > 0 && y >= ry(1)-r) || (dy < 0 && y < r)) {
        dy *= -1
        boing()
    }

    let toKill
    asteroids.forEach(a => {
        a.evo(dt)
        if (a.y > 1.2*ry(1) || a.toKill) toKill = a
    })
    if (toKill) toKill.kill()
    if (rnd() < RAIN*dt) spawnAsteroid()
}

function draw() {
    lineWidth(4)
    stroke(.6, .5, .5)
    circle(x, y, r)
    image(res.planet, x-r, y-r, 2*r, 2*r)

    asteroids.forEach(a => a.draw())

    font('36px moon')
    alignLeft()
    baseTop()
    fill('#b0c400')
    text('Hits: ' + impacts, 20, 20)
}
