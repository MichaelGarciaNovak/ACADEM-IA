'use client'

import { useState, useEffect, useRef } from 'react'

interface Props {
  titles: string[]
  accentColor: string
  textColor: string
  pauseMs?: number   // how long to hold the full title
  typeSpeed?: number // ms per character typing
  deleteSpeed?: number // ms per character deleting
}

function renderTyped(text: string, accentColor: string, textColor: string) {
  return text.split('*').map((part, i, arr) =>
    i < arr.length - 1 ? (
      <span key={i}>
        {part}
        <span style={{ color: accentColor }}>*</span>
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  )
}

export default function AnimatedTitle({
  titles,
  accentColor,
  textColor,
  pauseMs = 3000,
  typeSpeed = 55,
  deleteSpeed = 30,
}: Props) {
  const [displayed, setDisplayed] = useState('')
  const [titleIndex, setTitleIndex] = useState(0)
  const phase = useRef<'typing' | 'pausing' | 'deleting'>('typing')
  const charIndex = useRef(0)

  useEffect(() => {
    if (titles.length <= 1) {
      setDisplayed(titles[0] ?? '')
      return
    }

    let timeout: NodeJS.Timeout

    const tick = () => {
      const current = titles[titleIndex]

      if (phase.current === 'typing') {
        charIndex.current += 1
        setDisplayed(current.slice(0, charIndex.current))
        if (charIndex.current >= current.length) {
          phase.current = 'pausing'
          timeout = setTimeout(tick, pauseMs)
        } else {
          timeout = setTimeout(tick, typeSpeed)
        }
      } else if (phase.current === 'pausing') {
        phase.current = 'deleting'
        timeout = setTimeout(tick, deleteSpeed)
      } else {
        // deleting
        charIndex.current -= 1
        setDisplayed(current.slice(0, charIndex.current))
        if (charIndex.current <= 0) {
          phase.current = 'typing'
          setTitleIndex(i => (i + 1) % titles.length)
        } else {
          timeout = setTimeout(tick, deleteSpeed)
        }
      }
    }

    timeout = setTimeout(tick, typeSpeed)
    return () => clearTimeout(timeout)
  }, [titleIndex, titles, pauseMs, typeSpeed, deleteSpeed])

  return (
    <span style={{ color: textColor }}>
      {renderTyped(displayed, accentColor, textColor)}
      <span
        style={{
          display: 'inline-block',
          width: '3px',
          height: '0.85em',
          backgroundColor: accentColor,
          marginLeft: '4px',
          marginRight: '-7px', // absorb own width so cursor never forces a new line
          verticalAlign: 'middle',
          animation: 'blink 1s step-end infinite',
        }}
      />
      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
    </span>
  )
}
