import ui from './ui'
import instructions from './instructions'
import arg from './arguments'
import register from './registers'
import memory from './memory'
import list from './lists'
import err from './errors'
import assemblo from './assemblo'
import allinstructions from './instructions-set'

const docs = {} as any

docs[instructions.name] = instructions
docs[arg.name] = arg
docs[register.name] = register
docs[memory.name] = memory
docs[list.name] = list
docs[err.name] = err
docs[assemblo.name] = assemblo

for (const i of allinstructions) {
  docs[i.name] = i
}


const urlParams = new URLSearchParams(window.location.search)
const paramItem = urlParams.get('item') || ''


ui.renderDocList(docs['assemblo'])
ui.renderDocList(docs['registers'])
ui.renderDocList(docs['memory'])
ui.renderDocList(docs['arguments'])
ui.renderDocList(docs['lists'])
ui.renderDocList(docs['errors'])
ui.renderDocList(docs['instructions'])

const instructionEle = document.getElementById('instructionsListTitle') as HTMLDivElement

for (const i of allinstructions) {
  ui.renderDocListItem(instructionEle, i)
}

ui.renderDocContent(docs[paramItem])


document.addEventListener('DOMContentLoaded', function () {
  const themeToggle = document.getElementById('themeToggle')
  const htmlElement = document.documentElement

  const savedTheme = localStorage.getItem('theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')

  if (savedTheme === 'dark') {
    htmlElement.setAttribute('data-bs-theme', 'dark')
  }


  themeToggle?.addEventListener('click', function () {
    if (htmlElement.getAttribute('data-bs-theme') === 'dark') {
      htmlElement.setAttribute('data-bs-theme', 'light')
      localStorage.setItem('theme', 'light')
    } else {
      htmlElement.setAttribute('data-bs-theme', 'dark')
      localStorage.setItem('theme', 'dark')
    }
  })
})