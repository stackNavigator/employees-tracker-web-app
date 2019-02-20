module.exports = {
  createLoader() {
    const loaderCol = document.createElement('div')
    loaderCol.classList.add('col', 's12')
    const loader = document.createElement('loader-component')
    loaderCol.appendChild(loader)
    return loaderCol
  }
}