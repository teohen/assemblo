import Program, { status } from '../../assemblo/program'
import { Challenge } from '../challenges/challenges'
import challenges from '../challenges/challenges'
import editor from './codemirror'
import ui from './ui'

const runBtn = document.getElementById('runBtn') as HTMLButtonElement
const debugBtn = document.getElementById('debugBtn') as HTMLButtonElement
const nextLineBtn = document.getElementById('nextLineBtn') as HTMLButtonElement
const restoreBtn = document.getElementById('restoreBtn') as HTMLButtonElement
const submitBtn = document.getElementById('submitBtn') as HTMLButtonElement
const delay = document.getElementById('runDelay')
const runDelay = delay?.firstElementChild as HTMLInputElement

const urlParams = new URLSearchParams(window.location.search)
const paramChallenge = urlParams.get('challenge')

const p = Program.newProgram()
let inputStack: number[] = []
let expected: number[] = []
let challenge
const ch = challenges.getChallenge(paramChallenge)
if (ch) {
  inputStack = ch.input
  expected = ch.expected
  challenge = ch
  if (submitBtn) submitBtn.hidden = false
}

ui.renderChallengeInfo(challenge as Challenge | undefined)
p.reset(inputStack)
ui.updateUI(p)

runBtn?.addEventListener('click', function() {
  if (p.program.status === status.RUNNING) return

  const code = editor.getValue()
  p.reset(inputStack)
  p.run(code,
    () => {
      ui.updateUI(p)
      ui.updateEditor(p)
    },
    () => {
      if (expected.length > 0) {
        p.test(expected)
      }
      ui.updateUI(p)
    },
    parseInt(runDelay?.value)
  )
})

debugBtn?.addEventListener('click', function() {
  if (p.program.status === status.READY) {
    p.prepareOperations(editor.getValue())
  } else {
    p.reset(inputStack)
  }

  ui.updateUI(p)
  editor.setOption('readOnly', !editor.options.readOnly)
})

nextLineBtn?.addEventListener('click', () => {
  p.nextLine()
  ui.updateUI(p)
  ui.updateEditor(p)
})

restoreBtn?.addEventListener('click', () => {
  p.reset(inputStack)
  ui.updateUI(p)
  ui.updateEditor(p)
})

submitBtn?.addEventListener('click', () => {
  const code = editor.getValue()
  p.reset(inputStack)

  p.run(code, () => {
    ui.updateUI(p)
  }, () => {
    p.test(expected)
    ui.updateUI(p)
  }, 1)
})


let autoSaveTimeout: ReturnType<typeof setTimeout>

editor.on('change', function() {
  if (autoSaveTimeout) clearTimeout(autoSaveTimeout)
  autoSaveTimeout = setTimeout(function() {
    localStorage.setItem('code', editor.getValue())
  }, 750)
})


