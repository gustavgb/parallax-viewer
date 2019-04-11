let menu = 'background'

let settings = window.settings = {
  background: [],
  foreground: [],
  counter: 0
}

function createImageElement (context, img) {
  const id = img.id
  const result = [
    '<div class="image-el">',
    '<div class="image-left">',
    '<label>',
    '<img id="preview-' + id + '" class="file-preview" src="' + (img.path || 'image/browse.png') + '">',
    '<input type="file" class="file-select" id="img-file-' + id + '" onchange="setImageFile(\'' + context + '\', ' + id + ', this)">',
    '</label>',
    '</div><div class="image-right">',
    '<p class="image-el-header">#' + id + '</p>',
    '<button class="rm-btn" onclick="removeImage(\'' + context + '\', ' + id + ')">Remove</button>',
    '<input type="number" class="speed-select" value="' + (img.speed || '') + '" step="0.1" placeholder="Speed %" id="img-speed-' + id + '" onchange="setImageSpeed(\'' + context + '\', ' + id + ', this.value)">',
    '<button class="pos-btn" onclick="moveImage(\'' + context + '\', ' + id + ', 1)">Down</button>',
    '<button class="pos-btn" onclick="moveImage(\'' + context + '\', ' + id + ', -1)">Up</button>',
    '</div></div>'
  ].join('')
  return result
}

function selectMenu (nextMenu) {
  menu = nextMenu
  renderMenu()
}

function renderMenu () {
  const result = [
    '<button class="add-btn" onclick="addImage(\'' + menu + '\')">+</button>'
  ].concat(settings[menu].map(img => createImageElement(menu, img))).join('')

  document.getElementById('menu').innerHTML = result
}

window.addImage = function addImage (context) {
  const id = settings.counter++
  settings[context].push({
    id,
    path: '',
    speed: 1
  })
  renderMenu()
  save()
}

window.moveImage = function moveImage (context, id, direction) {
  const index = settings[context].findIndex(img => img.id === id)
  if (index + direction >= 0 && index + direction < settings[context].length) {
    const hold = settings[context][index + direction]
    settings[context][index + direction] = settings[context][index]
    settings[context][index] = hold
  }
  renderMenu()
  save()
}

window.setImageFile = function setImageFile (context, id, e) {
  const reader = new window.FileReader()
  reader.onload = function () {
    const src = reader.result
    settings[context].find(img => img.id === id).path = src
    renderMenu()
    save()
  }
  reader.readAsDataURL(e.files[0])
}

window.setImageSpeed = function setImageSpeed (context, id, speed) {
  settings[context].find(img => img.id === id).speed = speed
  save()
}

window.removeImage = function removeImage (context, id) {
  if (window.confirm('Are you sure?')) {
    settings[context] = settings[context].filter(img => img.id !== id)
    renderMenu()
    save()
  }
}

function save () {
  window.localStorage.setItem('save', JSON.stringify(settings))
}

window.addEventListener('load', function () {
  try {
    const saved = window.localStorage.getItem('save')

    if (saved) {
      settings = window.settings = JSON.parse(saved)
    }
  } catch (e) {
    console.log('Could not find saved content')
  }
  selectMenu('background')
})
