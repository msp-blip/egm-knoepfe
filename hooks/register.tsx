import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

// Die Befehle des EGM-Plugins (google/elephant-goldfish-model) in der Reihenfolge des Ablaufs, mit
// der Erklärung, die beim Drüberfahren erscheint. Ein Druck schreibt den Befehl ins Eingabefeld,
// statt ihn abzuschicken: Fast jeder Befehl braucht noch ein Thema oder einen Dateipfad dahinter.
const COMMANDS = [
  { key: 'brainstorm', label: '1 Ideen', hint: 'Elefant: Idee gemeinsam durchdenken, mit vollem Projektwissen, noch kein Code. Dahinter dein Thema schreiben.' },
  { key: 'draft', label: '2 Entwurf', hint: 'Elefant: schreibt das Planungsdokument Abschnitt für Abschnitt (Problem, Lösung, Alternativen, betroffene Dateien).' },
  { key: 'review', label: '3 Prüfen', hint: 'Goldfische ohne Vorwissen prüfen das Dokument in fünf Runden: Überblick, Verständnis, Kritik, Umsetzungsreife.' },
  { key: 'review-loop', label: 'Prüfschleife', hint: 'Prüft ein Dokument (Plan, README, Spezifikation) automatisch gegen Standards und baut freigegebene Korrekturen ein.' },
  { key: 'resolve', label: 'Einarbeiten', hint: 'Elefant: arbeitet die Befunde der Goldfische ein; du entscheidest bei jedem Vorschlag mit.' },
  { key: 'drift-report', label: 'Abgleich', hint: 'Vergleicht Planungsdokumente und READMEs mit dem Code und listet, wo sie auseinanderlaufen.' },
  { key: 'bootstrap', label: 'READMEs', hint: 'Legt README-Dateien für die Ordner eines Projektteils an. Schreibt Dateien, nur bewusst starten.' },
] as const

const isHidden = atom({ plugin: 'egm-knoepfe', key: 'isHidden' } as const, false)

export const register: Register = on => {
  // /egm-leiste blendet die Leiste aus und wieder ein.
  on('session.start', async ($, e, next) => {
    await $.command.register({ name: 'egm-leiste', description: 'EGM-Knopfleiste ein- oder ausblenden' })
    return next(e)
  })

  on('command.run', { command: 'egm-leiste' }, async $ => {
    const hidden = await update($, isHidden, h => !h)
    return { text: hidden ? 'EGM-Leiste ausgeblendet.' : 'EGM-Leiste eingeblendet.' }
  })

  // Die Leiste: eine Reihe Knöpfe, darunter eine Zeile, in der die Erklärung des Knopfs unter dem
  // Mauszeiger erscheint (Hover-Gruppe je Befehl, ohne dass ein Hook laufen muss).
  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (e.props.hasSurvey || (await read($, isHidden))) return next(e)
    const { Box, Button, Text } = $.ui.resolve(e)
    const fill = (key: string) => () => void $.prompt.fill({ text: `/egm:egm-${key} `, mode: 'replace' })

    return (
      <Box key="egm" flexDirection="column">
        <Box flexDirection="row" flexWrap="wrap" gap={1}>
          <Text dimColor>EGM</Text>
          {COMMANDS.map(c => (
            <Box key={`b-${c.key}`} hover={{ scope: `egm-${c.key}` }}>
              <Button key={c.key} label={c.label} variant={c.key === 'brainstorm' ? 'primary' : undefined}
                dimColor={c.key === 'bootstrap'} onPress={fill(c.key)} />
            </Box>
          ))}
          <Button key="hide" label="×" plain role="dismiss" dimColor onPress={() => void update($, isHidden, () => true)} />
        </Box>
        {COMMANDS.map(c => (
          <Box key={`h-${c.key}`} display="none" hover={{ scope: `egm-${c.key}`, display: 'flex' }}>
            <Text dimColor>{`/egm:egm-${c.key}: ${c.hint}`}</Text>
          </Box>
        ))}
      </Box>
    )
  })
}
