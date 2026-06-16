import { useState, useEffect } from 'react'
import { db } from './firebase'
import {
  doc, getDoc, setDoc, collection,
  onSnapshot, serverTimestamp,
} from 'firebase/firestore'
import {
  STAGES, RIDERS, JERSEYS, TYPE_CFG,
  calcScore, stageRiders, jerseyRiders, byId,
} from './data'

// ════════════════════════════════════════════════════════════════
//  DESIGN TOKENS
// ════════════════════════════════════════════════════════════════

const C = {
  bg:        '#060C1A',
  card:      '#0D1630',
  card2:     '#091025',
  border:    'rgba(247,197,0,0.12)',
  borderSel: 'rgba(247,197,0,0.4)',
  yellow:    '#F7C500',
  text:      '#F0F4FF',
  text2:     '#8899B4',
  text3:     '#4A5578',
  green:     '#10B981',
  red:       '#EF4444',
}
const ff = "-apple-system,'Inter',system-ui,sans-serif"
const BtnBase = {
  width:'100%', border:'none', borderRadius:12, padding:'14px 20px',
  fontSize:15, fontWeight:700, cursor:'pointer', fontFamily:ff, transition:'all .2s',
}

// ════════════════════════════════════════════════════════════════
//  MICRO COMPONENTS
// ════════════════════════════════════════════════════════════════

function Label({ children }) {
  return <div style={{ color:C.text2, fontSize:12, fontWeight:600, letterSpacing:1, marginBottom:8, textTransform:'uppercase' }}>{children}</div>
}

function TInput({ value, onChange, placeholder, maxLength, type='text', style={} }) {
  return (
    <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
      maxLength={maxLength} type={type} autoComplete="off"
      style={{ width:'100%', background:'#091025', border:`1px solid ${C.border}`, borderRadius:10,
        padding:'12px 14px', color:C.text, fontSize:16, outline:'none', fontFamily:ff, marginBottom:16, ...style }} />
  )
}

function TBtn({ onClick, disabled, children, variant='primary' }) {
  const variants = {
    primary: { background: disabled ? '#1A2240' : C.yellow, color: disabled ? C.text3 : '#000' },
    outline:  { background:'transparent', color:C.yellow, border:`1px solid ${C.yellow}` },
    ghost:    { background:C.card, color:C.text, border:`1px solid ${C.border}` },
  }
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ ...BtnBase, ...variants[variant], cursor:disabled?'default':'pointer' }}>
      {children}
    </button>
  )
}

function Shead({ label }) {
  return <div style={{ padding:'18px 16px 8px', fontSize:10, letterSpacing:3, fontWeight:700, color:C.yellow }}>{label}</div>
}

function Toast({ toast }) {
  if (!toast) return null
  return (
    <div style={{ position:'fixed', bottom:96, left:'50%', transform:'translateX(-50%)',
      background: toast.type==='ok' ? '#064E3B' : '#7F1D1D',
      color:'#fff', borderRadius:10, padding:'11px 20px', fontSize:14, fontWeight:600,
      zIndex:200, boxShadow:'0 4px 24px rgba(0,0,0,0.5)', whiteSpace:'nowrap', pointerEvents:'none' }}>
      {toast.msg}
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
//  UTILITIES
// ════════════════════════════════════════════════════════════════

function genCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return 'TDF' + Array.from({ length:3 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

// Persist session in localStorage so refresh doesn't log out
const SESSION_KEY = 'tdf2026_session'
function loadSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)) } catch { return null }
}
function saveSession(u) {
  try { localStorage.setItem(SESSION_KEY, JSON.stringify(u)) } catch {}
}
function clearSession() {
  try { localStorage.removeItem(SESSION_KEY) } catch {}
}

// ════════════════════════════════════════════════════════════════
//  WELCOME SCREENS
// ════════════════════════════════════════════════════════════════

function FormLayout({ title, onBack, children }) {
  return (
    <div style={{ minHeight:'100vh', background:C.bg, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24, fontFamily:ff }}>
      <div style={{ width:'100%', maxWidth:380 }}>
        <button onClick={onBack} style={{ background:'none', border:'none', color:C.text2, cursor:'pointer', fontSize:14, marginBottom:24, padding:0 }}>← Retour</button>
        <h2 style={{ color:C.text, fontSize:22, fontWeight:800, margin:'0 0 24px' }}>{title}</h2>
        {children}
      </div>
    </div>
  )
}

function CodeReveal({ code, groupName, name, onEnter }) {
  const [copied, setCopied] = useState(false)

  function copy() {
    const msg = `🚴 TDF 2026 Pronostics\nRejoins mon groupe : ${groupName}\nCode : ${code}\nOuvre l'appli et clique sur "Rejoindre avec un code" !`
    navigator.clipboard.writeText(msg).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500) })
  }

  return (
    <div style={{ minHeight:'100vh', background:C.bg, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24, fontFamily:ff }}>
      <div style={{ width:'100%', maxWidth:380, textAlign:'center' }}>
        <div style={{ fontSize:52, marginBottom:16 }}>🎉</div>
        <div style={{ fontSize:11, color:C.yellow, letterSpacing:3, fontWeight:700, marginBottom:8 }}>GROUPE CRÉÉ</div>
        <h2 style={{ color:C.text, margin:'0 0 28px', fontSize:24 }}>{groupName}</h2>

        <div style={{ background:C.card, border:`2px solid ${C.yellow}`, borderRadius:20, padding:'28px 24px', marginBottom:24 }}>
          <div style={{ fontSize:11, color:C.text3, letterSpacing:2, marginBottom:12 }}>CODE DU GROUPE</div>
          <div style={{ fontSize:52, fontWeight:900, color:C.yellow, letterSpacing:10 }}>{code}</div>
          <p style={{ color:C.text3, fontSize:13, marginTop:12 }}>
            Partage ce code sur WhatsApp ou par message.<br />
            Les autres cliquent sur "Rejoindre" et saisissent ce code.
          </p>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          <TBtn onClick={copy} variant="outline">
            {copied ? '✅ Message copié !' : '📋 Copier le message à envoyer'}
          </TBtn>
          <TBtn onClick={onEnter}>Commencer mes pronostics →</TBtn>
        </div>
      </div>
    </div>
  )
}

function WelcomeFlow({ onEnter }) {
  const [step, setStep] = useState('home')
  const [name, setName] = useState('')
  const [groupName, setGroupName] = useState('')
  const [joinCode, setJoinCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [createdCode, setCreatedCode] = useState('')
  const [createdGroup, setCreatedGroup] = useState('')

  async function handleCreate() {
    if (!name.trim() || !groupName.trim()) return
    setLoading(true)
    setError('')
    try {
      const code = genCode()
      await setDoc(doc(db, 'groups', code), {
        name: groupName.trim(),
        createdBy: name.trim(),
        createdAt: serverTimestamp(),
      })
      setCreatedCode(code)
      setCreatedGroup(groupName.trim())
      setStep('code')
    } catch {
      setError('Erreur de connexion. Vérifie la configuration Firebase.')
    }
    setLoading(false)
  }

  async function handleJoin() {
    if (!name.trim() || joinCode.length < 6) return
    setLoading(true)
    setError('')
    try {
      const code = joinCode.toUpperCase().trim()
      const snap = await getDoc(doc(db, 'groups', code))
      if (!snap.exists()) {
        setError('Code invalide. Demande le bon code au créateur du groupe.')
        setLoading(false)
        return
      }
      const u = { name: name.trim(), code, groupName: snap.data().name }
      saveSession(u)
      onEnter(u)
    } catch {
      setError('Erreur de connexion.')
    }
    setLoading(false)
  }

  if (step === 'code') {
    return (
      <CodeReveal
        code={createdCode} groupName={createdGroup} name={name}
        onEnter={() => {
          const u = { name: name.trim(), code: createdCode, groupName: createdGroup }
          saveSession(u)
          onEnter(u)
        }}
      />
    )
  }

  if (step === 'create') return (
    <FormLayout title="Créer un groupe" onBack={() => { setStep('home'); setError('') }}>
      <Label>Ton prénom</Label>
      <TInput value={name} onChange={setName} placeholder="Ex: Brice" />
      <Label>Nom du groupe</Label>
      <TInput value={groupName} onChange={setGroupName} placeholder="Ex: Collègues TdF 2026" />
      {error && <div style={{ color:C.red, fontSize:13, marginBottom:12 }}>{error}</div>}
      <TBtn onClick={handleCreate} disabled={!name.trim() || !groupName.trim() || loading}>
        {loading ? 'Création…' : '🆕 Créer le groupe →'}
      </TBtn>
    </FormLayout>
  )

  if (step === 'join') return (
    <FormLayout title="Rejoindre un groupe" onBack={() => { setStep('home'); setError('') }}>
      <Label>Ton prénom</Label>
      <TInput value={name} onChange={setName} placeholder="Ex: Thomas" />
      <Label>Code du groupe</Label>
      <TInput value={joinCode} onChange={v => setJoinCode(v.toUpperCase())} placeholder="TDFXXX"
        maxLength={6} style={{ letterSpacing:8, fontWeight:700, fontSize:22, textAlign:'center', textTransform:'uppercase' }} />
      {error && <div style={{ color:C.red, fontSize:13, marginBottom:12 }}>{error}</div>}
      <TBtn onClick={handleJoin} disabled={!name.trim() || joinCode.length < 6 || loading}>
        {loading ? 'Vérification…' : '🔑 Rejoindre →'}
      </TBtn>
    </FormLayout>
  )

  // ── HOME ──
  return (
    <div style={{ minHeight:'100vh', background:C.bg, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24, fontFamily:ff }}>
      <div style={{ textAlign:'center', marginBottom:40 }}>
        <div style={{ fontSize:64, lineHeight:1, marginBottom:12 }}>🚴</div>
        <div style={{ fontSize:11, letterSpacing:4, color:C.yellow, fontWeight:700, textTransform:'uppercase', marginBottom:6 }}>Tour de France 2026</div>
        <h1 style={{ fontSize:38, fontWeight:900, color:C.text, margin:0, letterSpacing:-1.5 }}>Pronostics</h1>
        <p style={{ color:C.text2, marginTop:10, fontSize:14 }}>Barcelone → Paris · 4–26 juillet</p>
        <p style={{ color:C.text3, fontSize:12 }}>21 étapes · 3 333 km · 54 000 m D+</p>
      </div>

      <div style={{ width:'100%', maxWidth:380, display:'flex', flexDirection:'column', gap:12, marginBottom:24 }}>
        <TBtn onClick={() => setStep('create')}>🆕 Créer un groupe</TBtn>
        <TBtn onClick={() => setStep('join')} variant="ghost">🔑 Rejoindre avec un code</TBtn>
      </div>

      <div style={{ width:'100%', maxWidth:380, background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:'18px 20px' }}>
        <div style={{ color:C.yellow, fontSize:10, fontWeight:700, letterSpacing:3, marginBottom:14 }}>BARÈME DES POINTS</div>
        {[['🟡','Maillot Jaune','20 pts'],['🟢','Maillot Vert','10 pts'],['🔴','Maillot à Pois','10 pts'],['⚪','Maillot Blanc','10 pts'],['⭐','Vainqueur d\'étape','5 pts']].map(([e,l,p]) => (
          <div key={l} style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
            <span style={{ color:C.text2, fontSize:13 }}>{e} {l}</span>
            <span style={{ color:C.yellow, fontWeight:700, fontSize:13 }}>{p}</span>
          </div>
        ))}
        <div style={{ borderTop:`1px solid ${C.border}`, marginTop:10, paddingTop:10, color:C.text3, fontSize:11, textAlign:'center' }}>
          Score maximum : 155 pts · Plusieurs groupes possibles
        </div>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
//  PRONOSTICS TAB
// ════════════════════════════════════════════════════════════════

function PronosticsTab({ preds, setPreds, results, onSave, saving }) {
  const setJ = (id, v) => setPreds(p => ({ ...p, jerseys:{ ...p.jerseys, [id]:v } }))
  const setS = (n, v) => setPreds(p => ({ ...p, stages:{ ...p.stages, [String(n)]:v } }))
  const done = Object.keys(preds.stages||{}).length + Object.keys(preds.jerseys||{}).length
  const total = STAGES.length + JERSEYS.length

  return (
    <div style={{ paddingBottom:80 }}>
      {/* JERSEYS */}
      <Shead label="MAILLOTS — 50 PTS" />
      <div style={{ padding:'0 14px 8px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
        {JERSEYS.map(j => {
          const sel = preds.jerseys?.[j.id]
          const correct = results.jerseys?.[j.id]
          const ok = correct && sel === correct
          const bad = correct && sel && sel !== correct
          const r = byId(sel)
          return (
            <div key={j.id} style={{ background:C.card, border:`1px solid ${ok?'#10B981':bad?C.red:sel?C.borderSel:C.border}`, borderRadius:13, padding:12, transition:'border-color .2s' }}>
              <div style={{ background:j.bg, color:j.txt, borderRadius:6, padding:'3px 8px', fontSize:10, fontWeight:700, display:'inline-block', marginBottom:6 }}>{j.name}</div>
              <div style={{ fontSize:11, color:C.text3, marginBottom:8 }}>{j.sub}</div>
              <div style={{ fontSize:11, color:C.yellow, fontWeight:700, marginBottom:8 }}>+{j.pts} pts</div>
              <select value={sel||''} onChange={e=>setJ(j.id,e.target.value)}
                style={{ width:'100%', background:C.card2, color:sel?C.text:C.text3, border:`1px solid ${C.border}`, borderRadius:8, padding:'7px 6px', fontSize:12, outline:'none', cursor:'pointer' }}>
                <option value="">Choisir…</option>
                {jerseyRiders(j).map(r => <option key={r.id} value={r.id}>{r.flag} {r.name}</option>)}
              </select>
              {ok && <div style={{ marginTop:6, fontSize:11, color:C.green }}>✓ Correct ! +{j.pts} pts</div>}
              {bad && <div style={{ marginTop:6, fontSize:11, color:C.red }}>✗ → {byId(correct)?.name}</div>}
            </div>
          )
        })}
      </div>

      {/* STAGES */}
      <Shead label="ÉTAPES — 21 × 5 PTS" />
      <div style={{ padding:'0 14px 8px' }}>
        {STAGES.map(s => {
          const sel = preds.stages?.[String(s.n)]
          const correct = results.stages?.[String(s.n)]
          const ok = correct && sel === correct
          const bad = correct && sel && sel !== correct
          const tc = TYPE_CFG[s.type]
          return (
            <div key={s.n}>
              {s.restBefore && (
                <div style={{ display:'flex', alignItems:'center', gap:8, margin:'12px 0 8px' }}>
                  <div style={{ flex:1, height:1, background:C.border }} />
                  <span style={{ color:C.text3, fontSize:11 }}>🛌 Repos</span>
                  <div style={{ flex:1, height:1, background:C.border }} />
                </div>
              )}
              <div style={{ background:C.card, border:`1px solid ${ok?'#10B981':bad?C.red:sel?C.borderSel:C.border}`, borderLeft:`3px solid ${tc.bg}`, borderRadius:12, padding:'11px 12px', marginBottom:7, transition:'border-color .2s' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:s.note?4:8 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                    <div style={{ background:sel?C.yellow:C.card2, color:sel?'#000':C.text3, width:28, height:28, borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:800, flexShrink:0, transition:'all .2s' }}>{s.n}</div>
                    <div>
                      <div style={{ fontSize:13, fontWeight:600, color:C.text, lineHeight:1.3 }}>{s.from} → {s.to}</div>
                      <div style={{ fontSize:11, color:C.text3 }}>{s.date} · {s.km} km</div>
                    </div>
                  </div>
                  <div style={{ background:tc.bg, color:tc.text, borderRadius:6, padding:'3px 7px', fontSize:9, fontWeight:700, whiteSpace:'nowrap', flexShrink:0, marginLeft:8 }}>{tc.icon} {tc.label}</div>
                </div>
                {s.note && <div style={{ fontSize:11, color:C.text3, marginBottom:8, paddingLeft:37 }}>↳ {s.note}</div>}
                <select value={sel||''} onChange={e=>setS(s.n,e.target.value)}
                  style={{ width:'100%', background:C.card2, color:sel?C.text:C.text3, border:`1px solid ${C.border}`, borderRadius:8, padding:'8px 10px', fontSize:13, outline:'none', cursor:'pointer' }}>
                  <option value="">Choisir le vainqueur…</option>
                  {stageRiders(s.type).map(r => <option key={r.id} value={r.id}>{r.flag} {r.name} · {r.team}</option>)}
                </select>
                {ok && <div style={{ marginTop:7, fontSize:11, color:C.green }}>✓ Correct ! +5 pts</div>}
                {bad && <div style={{ marginTop:7, fontSize:11, color:C.red }}>✗ Vainqueur : {byId(correct)?.flag} {byId(correct)?.name}</div>}
              </div>
            </div>
          )
        })}
      </div>

      {/* SAVE BAR */}
      <div style={{ position:'fixed', bottom:0, left:'50%', transform:'translateX(-50%)', width:'100%', maxWidth:600, background:C.card2, borderTop:`1px solid ${C.border}`, padding:'10px 18px', display:'flex', alignItems:'center', gap:12 }}>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:12, color:C.text2, fontWeight:600 }}>{done}/{total} sélectionnés</div>
          {done < total && <div style={{ fontSize:11, color:C.text3 }}>{total-done} restant{total-done>1?'s':''}</div>}
        </div>
        <button onClick={()=>onSave(preds)} disabled={saving}
          style={{ background:C.yellow, color:'#000', border:'none', borderRadius:10, padding:'11px 24px', fontSize:14, fontWeight:700, cursor:'pointer', opacity:saving?0.7:1 }}>
          {saving ? 'Sauvegarde…' : '💾 Sauvegarder'}
        </button>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
//  CLASSEMENT TAB
// ════════════════════════════════════════════════════════════════

function ClassementTab({ board, myName, hasResults }) {
  const medals = ['🥇','🥈','🥉']
  const myEntry = board.find(e => e.name === myName)
  const myRank = board.findIndex(e => e.name === myName) + 1

  return (
    <div style={{ padding:'16px 14px' }}>
      {/* My score hero */}
      <div style={{ background:'linear-gradient(135deg,#101A08 0%,#0A1228 100%)', border:`1px solid ${C.yellow}`, borderRadius:16, padding:20, marginBottom:18, textAlign:'center' }}>
        <div style={{ fontSize:10, color:C.text3, letterSpacing:3, marginBottom:4 }}>MON SCORE</div>
        <div style={{ fontSize:60, fontWeight:900, color:C.yellow, lineHeight:1 }}>{myEntry?.score ?? 0}</div>
        <div style={{ fontSize:13, color:C.text2, marginTop:4 }}>
          {hasResults ? 'points' : '⏳ En attente des premiers résultats'}
        </div>
        {myRank > 0 && (
          <div style={{ marginTop:10, fontSize:14, color:C.text2 }}>
            {medals[myRank-1] || `#${myRank}`} sur {board.length} participant{board.length>1?'s':''}
          </div>
        )}
      </div>

      {!hasResults && (
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:14, marginBottom:14, textAlign:'center', color:C.text3, fontSize:13 }}>
          Les scores se calculent automatiquement après chaque étape publiée.
        </div>
      )}

      {board.length === 0
        ? (
          <div style={{ textAlign:'center', color:C.text3, padding:40, fontSize:14 }}>
            Personne encore.<br />
            <span style={{ fontSize:12 }}>Sauvegarde tes pronostics pour apparaître ici.</span>
          </div>
        )
        : board.map((e, i) => {
          const isMe = e.name === myName
          return (
            <div key={e.name} style={{ background:isMe?'rgba(247,197,0,0.07)':C.card, border:`1px solid ${isMe?C.yellow:C.border}`, borderRadius:12, padding:'13px 15px', marginBottom:8, display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:32, textAlign:'center', fontSize:medals[i]?20:14, color:C.text2, fontWeight:700 }}>
                {medals[i] || `${i+1}`}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, fontSize:15, color:isMe?C.yellow:C.text }}>{e.name}{isMe?' (moi)':''}</div>
                <div style={{ fontSize:11, color:C.text3, marginTop:2 }}>{e.done}/25 pronostics · màj {e.updatedAt||'—'}</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontSize:24, fontWeight:900, color:hasResults?C.yellow:C.text3 }}>{e.score}</div>
                <div style={{ fontSize:10, color:C.text3 }}>pts</div>
              </div>
            </div>
          )
        })
      }
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
//  ADMIN TAB
// ════════════════════════════════════════════════════════════════

function AdminTab({ adminMode, setAdminMode, results, setResults, onSave, showToast }) {
  const [pwd, setPwd] = useState('')
  const setJR = (id, v) => setResults(r => ({ ...r, jerseys:{ ...r.jerseys, [id]:v } }))
  const setSR = (n, v) => setResults(r => ({ ...r, stages:{ ...r.stages, [String(n)]:v } }))

  if (!adminMode) {
    return (
      <div style={{ padding:24, maxWidth:340, margin:'40px auto 0' }}>
        <div style={{ textAlign:'center', marginBottom:24 }}>
          <div style={{ fontSize:44, marginBottom:10 }}>🔐</div>
          <h2 style={{ color:C.text, margin:0, fontSize:20 }}>Accès Admin</h2>
          <p style={{ color:C.text3, fontSize:13, marginTop:8 }}>
            Saisie des résultats · Code : <strong style={{ color:C.yellow }}>TOUR2026</strong>
          </p>
        </div>
        <TInput value={pwd} onChange={setPwd} placeholder="Code admin" type="password"
          style={{ textAlign:'center', letterSpacing:4 }} />
        <TBtn onClick={() => pwd === 'TOUR2026' ? setAdminMode(true) : showToast('Code incorrect','err')}>
          Déverrouiller
        </TBtn>
      </div>
    )
  }

  return (
    <div style={{ padding:'0 14px 24px' }}>
      <Shead label="MAILLOTS FINAUX" />
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:8 }}>
        {JERSEYS.map(j => (
          <div key={j.id} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:12 }}>
            <div style={{ background:j.bg, color:j.txt, borderRadius:6, padding:'3px 8px', fontSize:10, fontWeight:700, display:'inline-block', marginBottom:10 }}>{j.name}</div>
            <select value={results.jerseys?.[j.id]||''} onChange={e=>setJR(j.id,e.target.value)}
              style={{ width:'100%', background:C.card2, color:C.text, border:`1px solid ${C.border}`, borderRadius:8, padding:'7px 6px', fontSize:12, outline:'none' }}>
              <option value="">Non défini</option>
              {jerseyRiders(j).map(r => <option key={r.id} value={r.id}>{r.flag} {r.name}</option>)}
            </select>
          </div>
        ))}
      </div>

      <Shead label="VAINQUEURS D'ÉTAPES" />
      {STAGES.map(s => (
        <div key={s.n} style={{ background:C.card, border:`1px solid ${C.border}`, borderLeft:`3px solid ${TYPE_CFG[s.type].bg}`, borderRadius:10, padding:'9px 11px', marginBottom:6, display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ background:results.stages?.[String(s.n)]?C.yellow:C.card2, color:results.stages?.[String(s.n)]?'#000':C.text3, width:26, height:26, borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:800, flexShrink:0, transition:'all .2s' }}>
            {s.n}
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:12, fontWeight:600, color:C.text, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{s.from} → {s.to}</div>
            <div style={{ fontSize:10, color:C.text3 }}>{s.date}</div>
          </div>
          <select value={results.stages?.[String(s.n)]||''} onChange={e=>setSR(s.n,e.target.value)}
            style={{ background:C.card2, color:C.text, border:`1px solid ${C.border}`, borderRadius:8, padding:'6px 8px', fontSize:12, outline:'none', maxWidth:160 }}>
            <option value="">—</option>
            {stageRiders(s.type).map(r => <option key={r.id} value={r.id}>{r.flag} {r.name}</option>)}
          </select>
        </div>
      ))}

      <button onClick={()=>onSave(results)}
        style={{ width:'100%', marginTop:16, background:C.yellow, color:'#000', border:'none', borderRadius:12, padding:14, fontSize:16, fontWeight:700, cursor:'pointer' }}>
        Publier les résultats 🚩
      </button>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
//  MAIN APP
// ════════════════════════════════════════════════════════════════

export default function App() {
  const [screen, setScreen] = useState('welcome')
  const [user, setUser] = useState(null)
  const [tab, setTab] = useState('pronostics')
  const [preds, setPreds] = useState({ stages:{}, jerseys:{} })
  const [results, setResults] = useState({ stages:{}, jerseys:{} })
  const [board, setBoard] = useState([])
  const [toast, setToast] = useState(null)
  const [adminMode, setAdminMode] = useState(false)
  const [saving, setSaving] = useState(false)

  // Restore session on load
  useEffect(() => {
    const saved = loadSession()
    if (saved) { setUser(saved); setScreen('app') }
  }, [])

  // Firestore listeners when user is set
  useEffect(() => {
    if (!user) return

    // Load my saved predictions once
    getDoc(doc(db, 'groups', user.code, 'predictions', user.name)).then(snap => {
      if (snap.exists()) setPreds(snap.data())
    })

    // Real-time leaderboard: re-score whenever any prediction changes
    const unsubPreds = onSnapshot(collection(db, 'groups', user.code, 'predictions'), async snap => {
      const resSnap = await getDoc(doc(db, 'groups', user.code, 'results', 'official'))
      const res = resSnap.exists() ? resSnap.data() : {}
      const entries = snap.docs.map(d => {
        const data = d.data()
        return {
          name: d.id,
          score: calcScore(data, res),
          done: Object.keys(data.stages||{}).length + Object.keys(data.jerseys||{}).length,
          updatedAt: data.updatedAt?.toDate?.()?.toLocaleDateString('fr') || '',
        }
      })
      entries.sort((a, b) => b.score - a.score || b.done - a.done)
      setBoard(entries)
    })

    // Real-time results
    const unsubRes = onSnapshot(doc(db, 'groups', user.code, 'results', 'official'), snap => {
      if (snap.exists()) setResults(snap.data())
    })

    return () => { unsubPreds(); unsubRes() }
  }, [user])

  function showToast(msg, type = 'ok') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  async function savePreds(newPreds) {
    setSaving(true)
    try {
      await setDoc(doc(db, 'groups', user.code, 'predictions', user.name), {
        ...newPreds, updatedAt: serverTimestamp()
      })
      setPreds(newPreds)
      showToast('Pronostics sauvegardés ! 🎉')
    } catch {
      showToast('Erreur de sauvegarde.', 'err')
    }
    setSaving(false)
  }

  async function saveResults(newRes) {
    try {
      await setDoc(doc(db, 'groups', user.code, 'results', 'official'), {
        ...newRes, updatedAt: serverTimestamp()
      })
      setResults(newRes)
      showToast('Résultats publiés ! 🚩')
    } catch {
      showToast('Erreur.', 'err')
    }
  }

  function logout() {
    clearSession()
    setUser(null)
    setScreen('welcome')
    setPreds({ stages:{}, jerseys:{} })
    setResults({ stages:{}, jerseys:{} })
    setBoard([])
    setAdminMode(false)
  }

  // ── Welcome ──
  if (screen === 'welcome') {
    return <WelcomeFlow onEnter={u => { setUser(u); setScreen('app') }} />
  }

  // ── App ──
  const done = Object.keys(preds.stages||{}).length + Object.keys(preds.jerseys||{}).length
  const total = STAGES.length + JERSEYS.length // 25
  const pct = Math.round(done / total * 100)
  const hasResults = Object.keys(results.stages||{}).length > 0 || Object.keys(results.jerseys||{}).length > 0

  return (
    <div style={{ minHeight:'100vh', background:C.bg, fontFamily:ff, color:C.text, maxWidth:600, margin:'0 auto' }}>

      {/* HEADER */}
      <div style={{ background:C.card2, borderBottom:`1px solid ${C.border}`, padding:'12px 18px 10px', position:'sticky', top:0, zIndex:100 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <div style={{ fontSize:10, color:C.yellow, letterSpacing:2.5, fontWeight:700, marginBottom:2 }}>
              🚴 TDF 2026 · {user.groupName}
            </div>
            <div style={{ fontSize:19, fontWeight:800, letterSpacing:-0.5 }}>{user.name}</div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:2 }}>
            <div style={{ fontSize:10, color:C.text3 }}>code groupe</div>
            <div style={{ fontSize:17, fontWeight:900, color:C.yellow, letterSpacing:4, cursor:'pointer' }}
              onClick={() => {
                navigator.clipboard.writeText(user.code)
                showToast('Code copié !')
              }}
              title="Clic pour copier">
              {user.code}
            </div>
          </div>
        </div>
        <div style={{ marginTop:10, background:'rgba(255,255,255,0.05)', borderRadius:4, height:4 }}>
          <div style={{ width:`${pct}%`, height:'100%', background:`linear-gradient(90deg,${C.yellow},#FF9500)`, borderRadius:4, transition:'width .5s' }} />
        </div>
        <div style={{ marginTop:5, fontSize:11, color:C.text3 }}>{done}/{total} pronostics · {total-done} restant{total-done!==1?'s':''}</div>
      </div>

      {/* TABS */}
      <div style={{ display:'flex', background:C.card2, borderBottom:`1px solid ${C.border}` }}>
        {[{id:'pronostics',label:'🎯 Pronostics'},{id:'classement',label:'🏆 Classement'},{id:'admin',label:'⚙️ Admin'}].map(t => (
          <button key={t.id} onClick={()=>setTab(t.id)}
            style={{ flex:1, background:'none', border:'none', cursor:'pointer', padding:'11px 6px', fontSize:12, fontWeight:tab===t.id?700:400, color:tab===t.id?C.yellow:C.text2, borderBottom:tab===t.id?`2px solid ${C.yellow}`:'2px solid transparent' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      {tab === 'pronostics' && <PronosticsTab preds={preds} setPreds={setPreds} results={results} onSave={savePreds} saving={saving} />}
      {tab === 'classement' && <ClassementTab board={board} myName={user.name} hasResults={hasResults} />}
      {tab === 'admin' && <AdminTab adminMode={adminMode} setAdminMode={setAdminMode} results={results} setResults={setResults} onSave={saveResults} showToast={showToast} />}

      {/* CHANGE GROUP / LOGOUT */}
      <div style={{ padding:'24px 16px 8px', textAlign:'center' }}>
        <button onClick={logout}
          style={{ background:'none', border:`1px solid ${C.border}`, borderRadius:8, padding:'8px 20px', color:C.text3, fontSize:12, cursor:'pointer' }}>
          ↩ Changer de groupe
        </button>
      </div>

      <Toast toast={toast} />
    </div>
  )
}
