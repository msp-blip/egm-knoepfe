# egm-knoepfe

Eine Knopfleiste über dem Eingabefeld von Claude Code für die Befehle des EGM-Plugins von Google
(github.com/google/elephant-goldfish-model). Jeder Knopf schreibt seinen Befehl ins Eingabefeld, dahinter
kommt das Thema oder der Dateipfad, dann Enter. Fährt die Maus über einen Knopf, steht darunter, was der
Befehl tut. `/egm-leiste` oder × blendet die Leiste aus und wieder ein. Die Leiste zeichnen nur das
Terminal und die lokale Desktop-App; überall sonst (Cloud-Sitzungen in der App, Handy) gibt es dieselben
Knöpfe als Seitenleiste, die beim Start aufgeht; `/egm` zeigt die Knöpfe außerdem direkt im Chat. Die Claude-App zeigt bei Cloud-Sitzungen nur Text; dort gibt `/egm` eine Übersicht aller Befehle mit Erklärung aus. Auf dem Handy steht
die Erklärung immer unter dem Knopf. Setzt das EGM-Plugin voraus
(`claude plugin marketplace add google/elephant-goldfish-model && claude plugin install egm@egm`).

## Installieren

Im Terminal, an der Eingabe von Claude Code:

```
/plugin install egm-knoepfe --marketplace msp-blip/egm-knoepfe
```

Danach `y` (Marktplatz hinzufügen) und Enter (Bereich: Benutzer).

Aus einer Shell:

```
claude plugin install egm-knoepfe --marketplace msp-blip/egm-knoepfe
```

In der Desktop-App, wo `/plugin` nicht läuft: + neben dem Eingabefeld, dann Plugins, Add marketplace mit
`msp-blip/egm-knoepfe`, dann Add plugin.

Das Repository ist privat: Die Installation klappt nur auf Rechnern, auf denen Git bei GitHub angemeldet ist
(SSH-Schlüssel, oder `gh auth login` und danach `gh auth setup-git`).
