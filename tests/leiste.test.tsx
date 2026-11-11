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
