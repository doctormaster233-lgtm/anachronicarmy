'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

const TAGS = ['MANGO', 'CAPTAIN', 'WIZARD', 'BUBBLES', 'ROCKET', 'PICKLE', 'CHIEF', 'NINJA']
const ROUND_TIME = 5

function Character({ mood }: { mood: 'ready' | 'good' | 'bad' }) {
  return (
    <div className={`character character-${mood}`} aria-label="Your nametag-switching character">
      <div className="spark spark-one" />
      <div className="spark spark-two" />
      <div className="character-shadow" />
      <div className="body">
        <div className="ear ear-left" />
        <div className="ear ear-right" />
        <div className="face">
          <div className="eye eye-left" /><div className="eye eye-right" />
          <div className="cheek cheek-left" /><div className="cheek cheek-right" />
          <div className="mouth" />
        </div>
        <div className="arm arm-left" /><div className="arm arm-right" />
      </div>
    </div>
  )
}

export default function Page() {
  const [started, setStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [target, setTarget] = useState('MANGO')
  const [current, setCurrent] = useState('MANGO')
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [lives, setLives] = useState(3)
  const [time, setTime] = useState(ROUND_TIME)
  const [feedback, setFeedback] = useState('')
  const [best, setBest] = useState(0)
  const tagIndex = useRef(0)

  useEffect(() => {
    const saved = Number(window.localStorage.getItem('alias-attack-best') || 0)
    setBest(saved)
  }, [])

  const nextTarget = useCallback(() => {
    setTarget(TAGS[Math.floor(Math.random() * TAGS.length)])
    setTime(ROUND_TIME)
  }, [])

  const finish = useCallback(() => {
    setStarted(false)
    setGameOver(true)
    setBest((previous) => {
      const next = Math.max(previous, score)
      window.localStorage.setItem('alias-attack-best', String(next))
      return next
    })
  }, [score])

  useEffect(() => {
    if (!started || gameOver) return
    const switcher = window.setInterval(() => {
      tagIndex.current = (tagIndex.current + 1) % TAGS.length
      setCurrent(TAGS[tagIndex.current])
    }, 560)
    const countdown = window.setInterval(() => {
      setTime((value) => {
        if (value <= 1) {
          setLives((remaining) => {
            if (remaining <= 1) return 0
            return remaining - 1
          })
          setStreak(0)
          setFeedback('TOO SLOW')
          nextTarget()
          return ROUND_TIME
        }
        return value - 1
      })
    }, 1000)
    return () => { window.clearInterval(switcher); window.clearInterval(countdown) }
  }, [started, gameOver, nextTarget])

  useEffect(() => {
    if (lives === 0 && started) finish()
  }, [lives, started, finish])

  const lockIn = useCallback(() => {
    if (!started || gameOver) return
    if (current === target) {
      setScore((value) => value + 100 + streak * 25)
      setStreak((value) => value + 1)
      setFeedback('NICE CATCH')
      nextTarget()
    } else {
      setLives((value) => Math.max(0, value - 1))
      setStreak(0)
      setFeedback('WRONG TAG')
      nextTarget()
    }
  }, [started, gameOver, current, target, streak, nextTarget])

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.code === 'Space' || event.key === 'Enter') {
        event.preventDefault()
        lockIn()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [lockIn])

  const begin = () => {
    setScore(0); setStreak(0); setLives(3); setGameOver(false); setFeedback(''); setCurrent('MANGO'); setTarget('MANGO'); setTime(ROUND_TIME); tagIndex.current = 0; setStarted(true)
  }

  const mood = feedback === 'NICE CATCH' ? 'good' : feedback ? 'bad' : 'ready'
  const meterWidth = `${(time / ROUND_TIME) * 100}%`
  const status = useMemo(() => gameOver ? 'ROUND OVER' : started ? 'LOCK THE MATCH' : 'READY PLAYER ONE', [gameOver, started])

  return (
    <main className="game-shell">
      <header className="topbar">
        <div className="brand"><span className="brand-mark">AA</span><span>ANACHRONIC ARMY</span></div>
        <div className="top-stat"><span>BEST</span><strong>{String(best).padStart(4, '0')}</strong></div>
      </header>

      <section className="game-grid">
        <div className="hero-copy">
          <p className="eyebrow">THE NAMETAG GAME</p>
          <h1>Catch the<br /><em>right</em> name.</h1>
          <p className="intro">Your character keeps switching aliases. Lock in when the nametag matches the target.</p>
          <div className="instructions"><span className="keycap">SPACE</span><span>or tap to lock the current tag</span></div>
        </div>

        <div className="play-card">
          <div className="play-head"><span className="round-label">{status}</span><span className="round-number">ROUND <b>{score ? Math.floor(score / 100) + 1 : '01'}</b></span></div>
          <div className="target-panel"><span className="target-label">FIND THIS TAG</span><strong>{target}</strong></div>
          <div className="stage">
            <Character mood={mood} />
            <div className="live-tag">{current}</div>
            {feedback && <div className={`feedback ${mood}`}>{feedback}</div>}
          </div>
          <div className="timer-row"><span>TIME LEFT</span><b>0{time}</b></div>
          <div className="meter"><div style={{ width: meterWidth }} /></div>
          <div className="action-row">
            <div className="lives" aria-label={`${lives} lives remaining`}><span className="heart">♥</span><span className={lives < 1 ? 'lost' : ''}>♥</span><span className={lives < 2 ? 'lost' : ''}>♥</span></div>
            <button className="lock-button" onClick={started ? lockIn : begin}>{gameOver ? 'PLAY AGAIN' : started ? 'LOCK IT IN' : 'START GAME'}<span>↗</span></button>
          </div>
        </div>

        <aside className="score-rail">
          <div className="rail-card"><span>SCORE</span><strong>{String(score).padStart(4, '0')}</strong></div>
          <div className="rail-card streak-card"><span>STREAK</span><strong>{String(streak).padStart(2, '0')}</strong><small>{streak > 1 ? 'KEEP GOING' : 'BUILD IT UP'}</small></div>
          <div className="tip-card"><span className="tip-star">✦</span><p>Fast eyes.<br /><b>Faster fingers.</b></p></div>
        </aside>
      </section>
      <footer><span>© 2026 ANACHRONIC ARMY</span><span>NO TWO ROUNDS LOOK THE SAME</span><a href="mailto:doctormaster233@gmail.com">CONTACT ME ↗</a><a href="/cv" style={{ opacity: 0.6, fontSize: '0.85em' }}>CV</a></footer>
    </main>
  )
}
