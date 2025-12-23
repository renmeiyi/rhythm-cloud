// src/utils/lyric.js
export function parseLyric (lrc = '') {
  const lines = lrc.split('\n')
  const result = []

  const timeReg = /\[(\d+):(\d+\.?\d*)\]/

  for (const line of lines) {
    const match = line.match(timeReg)
    if (!match) continue

    const min = Number(match[1])
    const sec = Number(match[2])
    const time = min * 60 + sec

    const text = line.replace(timeReg, '').trim()
    if (text) {
      result.push({ time, text })
    }
  }

  return result
}
