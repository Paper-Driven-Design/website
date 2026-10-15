#!/usr/bin/env bash
# Generuje testowy plik MP3 o zadanej długości: cichy sygnał co 30 s + lektor (macOS `say`)
# czytający tytuł rozdziału w momencie jego rozpoczęcia.
#
# Użycie: scripts/make-test-audio.sh <wyjście.mp3> <długość_s> "<intro>" <sek>|"<tytuł rozdziału>" ...
set -euo pipefail

OUT="$1"; DURATION="$2"; INTRO="$3"; shift 3
VOICE="Zosia"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

# wejście 0: sygnał 880 Hz przez 120 ms co 30 s
INPUTS=(-f lavfi -i "aevalsrc=0.25*sin(2*PI*880*t)*lt(mod(t\,30)\,0.12):d=${DURATION}:s=22050")
FILTER=""
MIX="[0:a]"

# wejście 1: intro od sekundy 0
say -v "$VOICE" -o "$TMP/intro.aiff" "$INTRO"
INPUTS+=(-i "$TMP/intro.aiff")
FILTER+="[1:a]aformat=sample_rates=22050:channel_layouts=mono,volume=1.6[v1];"
MIX+="[v1]"

IDX=2; N=1
for spec in "$@"; do
  SEC="${spec%%|*}"; TITLE="${spec#*|}"
  MIN=$((SEC / 60)); S=$((SEC % 60))
  say -v "$VOICE" -o "$TMP/ch$N.aiff" "Rozdział $N. $TITLE. Minuta $MIN, sekunda $S."
  INPUTS+=(-i "$TMP/ch$N.aiff")
  DELAY_MS=$((SEC * 1000))
  # rozdział zaczynający się w sekundzie 0 puszczamy po intrze
  if [ "$SEC" -eq 0 ]; then DELAY_MS=14000; fi
  FILTER+="[$IDX:a]aformat=sample_rates=22050:channel_layouts=mono,volume=1.6,adelay=${DELAY_MS}|${DELAY_MS}[v$IDX];"
  MIX+="[v$IDX]"
  IDX=$((IDX + 1)); N=$((N + 1))
done
FILTER+="${MIX}amix=inputs=$IDX:duration=first:normalize=0[out]"

mkdir -p "$(dirname "$OUT")"
ffmpeg -y -loglevel error "${INPUTS[@]}" -filter_complex "$FILTER" -map "[out]" \
  -ac 1 -ar 22050 -c:a libmp3lame -b:a 24k -t "$DURATION" "$OUT"
echo "zapisano: $OUT ($(du -h "$OUT" | cut -f1))"
