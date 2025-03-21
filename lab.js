const RAIN = 1

let r = 50
let x = rx(.5)
let y = ry(.5)
let angle = 0

let dx = ry(.2)
let dy = ry(.2)
let da = -.4

let impacts = 0
const asteroids = []

function init() {
    lab.background = '#050508'
}

function spawnAsteroid() {
    // create new asteroid
    asteroids.push({
        r: 10 + RND(35), // randomize the size
        x: rnd(rx(1)),   
        y: -50,          // create above upper screen edge
        a:  math.rnda(), // random rotation angle
        dx: rnd(ry(.2)) - ry(.1),
        dy: ry(.1) + ry(.2) * rnd(),
        da: math.rnds() * (.2 * PI + .6 * PI * rnd()), // rotate with random speed in random direction (clockwise or counter-clockwise)

        // evolve the asteroid for each time tick
        evo: function(dt) {
            this.x += this.dx * dt
            this.y += this.dy * dt
            this.a += this.da * dt

            // planet collision
            const d = distance(this.x, this.y, x, y)
            if (d < (this.r + r)) {
                // boom!
                res.impact.currentTime = 0 
                res.impact.play()
                impacts ++
                this.toKill = true
            }
        },

        // draw the asteroid
        draw: function() {
            save()                     // must save the rendering context, since we are going to manipulate it
            translate(this.x, this.y)  // translate the coordinates origin to the asteroid x:y (move to the asteroid coordinate system)
            rotate(this.a)             // rotate to the asteroid angle
                                       // this is why we needed to save and move
                                       // to the asteroid coordinate system in the first place

            image(res.asteroid, -this.r, -this.r, 2*this.r, 2*this.r)
            
            restore()                  // restore the previous rendering context state
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
    // move and rotate the planet
    x     += dx * dt
    y     += dy * dt
    angle += da * dt

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

function drawPlanet() {
    save()            // save the rendering context so we can safely translate and rotate
    translate(x, y)
    rotate(angle)

    lineWidth(4)
    stroke(.6, .5, .5)
    circle(0, 0, r)
    image(res.planet, -r, -r, 2*r, 2*r)

    restore()
}

function drawImpactScore() {
    font('36px moon')
    alignLeft()
    baseTop()
    fill('#b0c400')
    text('Hits: ' + impacts, 20, 20)
}

function draw() {
    this.drawPlanet()
    asteroids.forEach(a => a.draw())
    this.drawImpactScore()
}
