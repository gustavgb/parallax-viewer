function componentTime (state) {
  const now = Date.now()
  state.time.deltaTime = (now - state.time.lastTime) / 1000
  state.time.lastTime = now
  state.time.runTime += state.time.deltaTime
}

function componentInput (state) {
  const mouseDown = game.mouseDown
  const lastMouseDown = state.input.mouseDown

  state.input.event = {}
  if (mouseDown && !lastMouseDown) {
    state.input.event.mousedown = true
  } else if (!mouseDown && lastMouseDown) {
    state.input.event.mouseup = true
  }

  state.input.mousePosition = game.mousePosition
  state.input.mouseDown = game.mouseDown

  const lastKeys = Object.assign({}, state.input.keys)

  if (game.keys.arrowleft || game.keys.a) {
    if (!lastKeys.left) {
      state.input.event.keyLeftDown = true
    }
    state.input.keys.left = true
  } else {
    if (lastKeys.left) {
      state.input.event.keyLeftUp = true
    }
    state.input.keys.left = false
  }

  if (game.keys.arrowup || game.keys.w) {
    if (!lastKeys.up) {
      state.input.event.keyUpDown = true
    }
    state.input.keys.up = true
  } else {
    if (lastKeys.up) {
      state.input.event.keyUpUp = true
    }
    state.input.keys.up = false
  }

  if (game.keys.arrowright || game.keys.d) {
    if (!lastKeys.right) {
      state.input.event.keyRightDown = true
    }
    state.input.keys.right = true
  } else {
    if (lastKeys.right) {
      state.input.event.keyRightUp = true
    }
    state.input.keys.right = false
  }

  if (game.keys.arrowdown || game.keys.s) {
    if (!lastKeys.down) {
      state.input.event.keyDownDown = true
    }
    state.input.keys.down = true
  } else {
    if (lastKeys.down) {
      state.input.event.keyDownUp = true
    }
    state.input.keys.down = false
  }

  if (game.keys.x || game.keys[' ']) {
    if (!lastKeys.jump) {
      state.input.event.keyJumpDown = true
    }
    state.input.keys.jump = true
  } else {
    if (lastKeys.jump) {
      state.input.event.keyJumpUp = true
    }
    state.input.keys.jump = false
  }

  if (game.keys.z || game.keys.shift) {
    if (!lastKeys.action) {
      state.input.event.keyActionDown = true
    }
    state.input.keys.action = true
  } else {
    if (lastKeys.action) {
      state.input.event.keyActionUp = true
    }
    state.input.keys.action = false
  }
}

function componentPlayer (state) {
  if (state.gameOver) {
    return
  }

  const keys = state.input.keys
  const event = state.input.event
  const player = state.player
  const position = Object.assign({}, player.position)
  const velocity = Object.assign({}, player.velocity)
  const deltaTime = state.time.deltaTime

  const speedX = player.running ? player.runSpeed : player.walkSpeed
  // const speedZ = player.walkSpeed
  let walkState = player.walkState
  let moving = false
  let direction = player.direction
  const bounds = player.bounds

  if (event.keyActionDown && player.grounded) {
    player.running = true
  } else if (event.keyActionUp) {
    player.running = false
  }

  if (keys.left && position.x > bounds.minX) {
    velocity.x = -speedX
    moving = true
    direction = -1
  } else if (keys.right) {
    velocity.x = speedX
    moving = true
    direction = 1
  } else {
    velocity.x = 0
  }

  if (moving) {
    if (player.running) {
      walkState += 0.50
      if (Math.floor(walkState) > 11) {
        walkState = 0
      }
    } else {
      walkState += 0.25
      if (Math.floor(walkState) > 5) {
        walkState = 0
      }
    }
  }

  // Is player grounded?
  if (position.y >= -60) {
    player.grounded = true
    position.y = -60
  }

  if (!player.grounded || velocity.y < 0) {
    velocity.y += state.gravity
  }

  if (keys.jump && player.grounded) {
    velocity.y = -500
    player.grounded = false
  }

  position.x += velocity.x * deltaTime
  position.y += velocity.y * deltaTime

  state.player.velocity = velocity
  state.player.position = position
  state.player.walkState = walkState
  state.player.direction = direction
  state.player.moving = moving
}

function componentCamera (state) {
  const target = {
    x: state.player.position.x + 150,
    y: -170
  }

  const dx = target.x - state.camera.x
  const dy = target.y - state.camera.y

  state.camera.x += dx / 10
  state.camera.y += dy / 10
}

function getProjectedCoordinates (x, y, z) {
  return {
    x: x - z / 4,
    y: y + z / 2
  }
}

function componentRender (state, ctx) {
  if (state.loadedImages < state.totalImages) {
    ctx.fillStyle = '#222'
    ctx.fillRect(0, 0, state.width, state.height)

    if (state.time.runTime > 0.5) {
      ctx.textBaseline = 'middle'
      ctx.textAlign = 'center'
      ctx.font = '20px sans-serif'
      ctx.fillStyle = 'white'
      ctx.fillText(state.loadedImages + ' / ' + state.totalImages + ' assets loaded.', state.width / 2, state.height / 2)
    }

    return
  }

  const images = state.images
  const camera = state.camera
  const player = state.player

  ctx.drawImage(images.bg4, -(camera.x / 6 % 800) + 800, 0, 800, 600)
  ctx.drawImage(images.bg4, -(camera.x / 6 % 800), 0, 800, 600)
  ctx.drawImage(images.bg3, -(camera.x / 5 % 800) + 800, 0, 800, 600)
  ctx.drawImage(images.bg3, -(camera.x / 5 % 800), 0, 800, 600)
  ctx.drawImage(images.bg2, -(camera.x / 4 % 800) + 800, 0, 800, 600)
  ctx.drawImage(images.bg2, -(camera.x / 4 % 800), 0, 800, 600)
  ctx.drawImage(images.bg1, -(camera.x / 3 % 800) + 800, 0, 800, 600)
  ctx.drawImage(images.bg1, -(camera.x / 3 % 800), 0, 800, 600)
  ctx.drawImage(images.bg0, -(camera.x / 1.5 % 800) + 800, 0, 800, 600)
  ctx.drawImage(images.bg0, -(camera.x / 1.5 % 800), 0, 800, 600)

  ctx.fillStyle = '#87875C'
  ctx.fillRect(0, 300 - camera.y, 800, 600)

  // ctx.drawImage(images.cloud, -((camera.x / 5 + state.time.runTime * 10) % 800) + 800, 0, 800, 300)
  // ctx.drawImage(images.cloud, -((camera.x / 5 + state.time.runTime * 10) % 800), 0, 800, 300)

  const translateX = -camera.x + state.width / 2
  const translateY = -camera.y + state.height / 2
  ctx.translate(translateX, translateY)

  ctx.save()
  const pos = getProjectedCoordinates(player.position.x, player.position.y, player.position.z)
  ctx.translate(pos.x, pos.y)
  ctx.scale(-1 * player.direction, 1)

  if (player.insideBush) {
    ctx.globalAlpha = 0.5
  }

  let img
  if (!player.grounded) {
    img = images.playerJump
  } else if (player.moving && player.running) {
    img = images['playerRun' + Math.floor(player.walkState)]
  } else if (player.moving) {
    img = images['playerWalk' + Math.floor(player.walkState)]
  } else {
    img = images.playerIdle
  }

  ctx.drawImage(img, -player.w / 2, -player.h / 2, player.w, player.h)
  ctx.restore()

  ctx.translate(-translateX, -translateY)

  ctx.drawImage(images.fg4, -(camera.x / 0.9 % 800) + 800, 0, 800, 600)
  ctx.drawImage(images.fg4, -(camera.x / 0.9 % 800), 0, 800, 600)
  ctx.drawImage(images.fg3, -(camera.x / 0.75 % 800) + 800, 0, 800, 600)
  ctx.drawImage(images.fg3, -(camera.x / 0.75 % 800), 0, 800, 600)
  ctx.drawImage(images.fg2, -(camera.x / 0.6 % 800) + 800, 0, 800, 600)
  ctx.drawImage(images.fg2, -(camera.x / 0.6 % 800), 0, 800, 600)
  ctx.drawImage(images.fg1, -(camera.x / 0.45 % 800) + 800, 0, 800, 600)
  ctx.drawImage(images.fg1, -(camera.x / 0.45 % 800), 0, 800, 600)
  ctx.drawImage(images.fg0, -(camera.x / 0.3 % 800) + 800, 0, 800, 600)
  ctx.drawImage(images.fg0, -(camera.x / 0.3 % 800), 0, 800, 600)

  if (state.gameOver) {
    ctx.fillStyle = 'rgba(34, 34, 34, ' + ((Date.now() - state.gameOverTime) / 1000) + ')'
    ctx.fillRect(0, 0, state.width, state.height)
  }
}

var running = true
var game = {}
const graph = [
  componentInput,
  componentPlayer,
  componentCamera,
  componentRender
]

let counter = 0
const terminatedGames = {}
function handleGame (id) {
  if (id === undefined) {
    id = ++counter
  }

  if (terminatedGames[id]) {
    return
  }

  window.requestAnimationFrame(function () { handleGame(id) })

  componentTime(game.state, game.ctx)

  if (!running) {
    return
  }
  graph.forEach(function (component) {
    component(game.state, game.ctx)
  })
}

function init (force) {
  if (game.hasInitiated && !force) {
    return
  }

  terminatedGames[counter] = true

  let checkpoint
  if (game.state) {
    checkpoint = game.state.checkpoint
  }

  game = {
    state: {
      gameOver: false,
      gameOverTime: 0,
      checkpoint: null,
      width: 800,
      height: 600,
      gravity: 20,
      time: {
        deltaTime: 0,
        lastTime: 0,
        runTime: 0
      },
      input: {
        event: {},
        keys: {
          left: false,
          right: false,
          up: false,
          down: false,
          jump: false,
          throw: false
        },
        lastMouseDown: false
      },
      player: {
        position: {
          x: 0,
          y: 0,
          z: 0
        },
        bounds: {
          minZ: -100,
          maxZ: 0,
          minX: 50
        },
        velocity: {
          x: 0,
          y: 0,
          z: 0
        },
        insideBush: false,
        w: 100,
        h: 120,
        walkState: 0,
        walkSpeed: 150,
        runSpeed: 650,
        direction: 1,
        moving: false,
        grounded: true,
        running: false
      },
      camera: {
        x: 0,
        y: 0,
        zoom: 1
      },
      images: {},
      totalImages: 0,
      loadedImages: 0
    },
    mousePosition: { x: 0, y: 0 },
    mouseDown: false,
    keys: {},
    canvas: null,
    ctx: null,
    hasInitiated: false
  }

  game.canvas = document.getElementById('can')
  game.ctx = game.canvas.getContext('2d')

  game.canvas.width = 800
  game.canvas.height = 600

  game.state.time.deltaTime = 1000 / 60
  game.state.time.lastTime = Date.now()

  game.state.images = {}
  game.state.totalImages = 0
  game.state.loadedImages = 0

  function loadMultiple (propName, pathPrefix, min, max) {
    const a = {}
    for (let i = min; i <= max; i++) {
      a[propName + i] = pathPrefix + i + '.png'
    }
    return a
  }

  const paths = {
    playerIdle: 'image/player/idle.png',
    playerJump: 'image/player/jump.png',
    ...loadMultiple('playerWalk', 'image/player/walk', 0, 5),
    ...loadMultiple('playerRun', 'image/player/run', 0, 11),
    ...loadMultiple('bg', 'image/marshland/bg', 0, 4),
    ...loadMultiple('fg', 'image/marshland/fg', 0, 4)
  }

  Object.keys(paths).forEach(key => {
    const img = new window.Image()
    img.src = paths[key]
    img.loaded = false
    game.state.totalImages++
    img.onload = function () {
      img.loaded = true
      game.state.loadedImages++
    }

    game.state.images[key] = img
  })

  game.state.player.position = checkpoint || {
    x: 100,
    y: -60,
    z: 0
  }

  game.state.checkpoint = Object.assign({}, game.state.player.position)

  game.state.camera.x = game.state.player.position.x + 150
  game.state.camera.y = -170

  game.hasInitiated = true

  handleGame()
}

window.addEventListener('keydown', function (e) {
  if (!game.keys.control) e.preventDefault()
  game.keys[e.key.toLowerCase()] = true
})

window.addEventListener('keyup', function (e) {
  if (!game.keys.control) e.preventDefault()
  delete game.keys[e.key.toLowerCase()]
})

function getTrueMousePosition (e) {
  const rect = game.canvas.getBoundingClientRect()

  return {
    x: e.clientX - rect.x,
    y: e.clientY - rect.y
  }
}

window.addEventListener('mousedown', function (e) {
  game.mouseDown = true

  game.mousePosition = getTrueMousePosition(e)
})

window.addEventListener('mousemove', function (e) {
  game.mousePosition = getTrueMousePosition(e)
})

window.addEventListener('mouseup', function (e) {
  game.mouseDown = false
})

window.addEventListener('blur', function () {
  running = false
})

window.addEventListener('focus', function () {
  running = true
})

window.addEventListener('load', init)
