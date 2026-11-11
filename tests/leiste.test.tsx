import { expect, test } from 'claude-code/testing'

const BAND = {
  plugin: 'egm-knoepfe',
  component: 'AbovePrompt',
  props: { hasSurvey: false, isCollapsed: false, isWorking: false, maxRows: 12, bodyColumns: 100, scroll: { offset: 0, bodyRows: 12 }, view: {} },
} as const

test('ein Knopf schreibt seinen Befehl ins Eingabefeld, auf jeder Oberfläche', async ($, on) => {
  const filled: string[] = []
  on('prompt.fill', (_, e) => { filled.push(e.text); return { isFilled: true } })

  for (const surface of ['terminal', 'desktop', 'vscode', 'mobile'] as const) {
    const ui = await $.ui.mount({ ...BAND, surface })
    expect(await ui.find({ type: 'Text', text: /Elefant: Idee gemeinsam/ })).toBeDefined()
    await ui.press({ key: 'review' })
    await ui.unmount()
  }
  expect(filled).toEqual(Array(4).fill('/egm:egm-review '))
})

test('× blendet die Leiste aus', async $ => {
  const ui = await $.ui.mount({ ...BAND, surface: 'desktop' })
  await ui.press({ key: 'hide' })
  expect(await ui.find({ key: 'brainstorm' })).toBeUndefined()
  await ui.unmount()
})

const PANE = {
  plugin: 'egm-knoepfe',
  component: 'Pane',
  requestId: 'egm',
  props: { title: 'EGM', isFocused: false, bodyColumns: 40, placement: 'dock', scroll: { offset: 0, bodyRows: 30 }, view: {} },
} as const

test('die Seitenleiste zeigt die Knöpfe auf jeder Oberfläche, auf dem Handy mit Erklärung', async ($, on) => {
  const filled: string[] = []
  on('prompt.fill', (_, e) => { filled.push(e.text); return { isFilled: true } })

  for (const surface of ['terminal', 'desktop', 'vscode', 'mobile'] as const) {
    const ui = await $.ui.mount({ ...PANE, surface })
    await ui.press({ key: 'p-draft-btn' })
    await ui.unmount()
  }
  expect(filled).toEqual(Array(4).fill('/egm:egm-draft '))

  const phone = await $.ui.mount({ ...PANE, surface: 'mobile' })
  expect(await phone.find({ type: 'Text', text: /Goldfische ohne Vorwissen/ })).toBeDefined()
  await phone.unmount()
})

test('die Antwort auf /egm zeigt die Knöpfe im Chat, auf jeder Oberfläche', async ($, on) => {
  const filled: string[] = []
  on('prompt.fill', (_, e) => { filled.push(e.text); return { isFilled: true } })

  for (const surface of ['terminal', 'desktop', 'vscode', 'mobile'] as const) {
    const ui = await $.ui.mount({ plugin: 'egm-knoepfe', component: 'CommandOutput', surface,
      props: { command: 'egm', args: '', text: 'EGM-Knöpfe hier im Chat.', isErrored: false } })
    await ui.press({ key: 'c-resolve-btn' })
    await ui.unmount()
  }
  expect(filled).toEqual(Array(4).fill('/egm:egm-resolve '))
})
