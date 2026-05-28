'use client'

import { useState, useEffect } from 'react'

interface Props {
  titles: string[]
  accentColor: string
  textColor: string
  intervalMs?: number
}

function renderTitle(title: string, accentColor: string, textColor: string) {
  return title.split('*').map((part, i, arr) =>
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

export default function AnimatedTitle({ titles, accentColor, textColor, intervalMs = 5000 }: Props) {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (titles.length <= 1) return
    const timer = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIndex(i => (i + 1) % titles.length)
        setVisible(true)
      }, 400)
    }, intervalMs)
    return () => clearInterval(timer)
  }, [titles.length, intervalMs])

  return (
    <span
      style={{
        color: textColor,
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.4s ease',
        display: 'inline',
      }}
    >
      {renderTitle(titles[index], accentColor, textColor)}
    </span>
  )
}
