import { useState } from 'react'
import { simular, brl } from './calc.js'

const TIPOS = [
  { id: '2d', nome: '2 dormitórios', area: 64, vagas: 1, preco: 489000, txt: 'Suíte, varanda gourmet e living integrado. Pensado para o primeiro apartamento ou para quem quer morar perto de tudo.',
    rooms: [[8,8,120,84,'Suíte'],[132,8,80,84,'Dorm.'],[8,100,100,64,'Cozinha'],[116,100,96,64,'Living'],[8,172,204,34,'Varanda']] },
  { id: '3d', nome: '3 dormitórios', area: 92, vagas: 2, preco: 689000, txt: 'Suíte master com closet, lavabo e varanda ampla voltada ao parque. Planta pensada para família.',
    rooms: [[8,8,100,80,'Suíte master'],[116,8,96,80,'Suíte'],[8,96,64,50,'Dorm.'],[80,96,132,50,'Cozinha'],[8,154,204,34,'Living'],[8,196,204,24,'Varanda']] },
  { id: 'gd', nome: 'Garden', area: 128, vagas: 2, preco: 949000, txt: 'Térreo com jardim privativo de 60 m², três suítes e acesso direto à área de lazer.',
    rooms: [[8,8,70,70,'Suíte'],[86,8,70,70,'Suíte'],[164,8,48,70,'Suíte'],[8,86,204,56,'Living + cozinha'],[8,150,204,66,'Jardim privativo']] },
]
const LOTES = [
  { id: 'A', nome: 'Torre Ipê', status: 'Esgotada', un: 96, x: 70, y: 60 },
  { id: 'B', nome: 'Torre Aroeira', status: '8 unidades', un: 96, x: 190, y: 60 },
  { id: 'C', nome: 'Torre Pinhão', status: 'Em lançamento', un: 96, x: 310, y: 60 },
  { id: 'D', nome: 'Torre Araucária', status: 'Fase 2 (2028)', un: 96, x: 130, y: 150 },
  { id: 'E', nome: 'Garden Houses', status: 'Pré-reserva', un: 24, x: 260, y: 150 },
]
const OBRA = [['Fundação', 100], ['Estrutura', 64], ['Alvenaria', 22], ['Áreas comuns', 0]]
const FAQ = [
  ['Quando as chaves são entregues?', 'Previsão de entrega em dezembro de 2028, com 6 meses de tolerância contratual (dado fictício).'],
  ['Posso usar o FGTS?', 'Sim, na entrada e na amortização, conforme as regras do programa vigente e análise de crédito do banco.'],
  ['Aceita permuta de imóvel?', 'Avaliamos permuta de imóveis em Curitiba e região metropolitana na fase de lançamento.'],
  ['Tem plantão de vendas?', 'Plantão com decorado no local, todos os dias das 9h às 19h.'],
]
const Logo = () => (<span className="logo"><svg width="22" height="22" viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3c6 5 9 10 9 15a9 9 0 0 1-18 0c0-5 3-10 9-15z" fill="currentColor" /></svg>Alameda Tapiré</span>)

function Planta({ t }) {
  return (
    <svg viewBox="0 0 220 228" className="planta" role="img" aria-label={`Planta esquemática ${t.nome}`}>
      {t.rooms.map(([x, y, w, h, l]) => (
        <g key={l + x + y}><rect x={x} y={y} width={w} height={h} rx="3" /><text x={x + w / 2} y={y + h / 2 + 4} textAnchor="middle">{l}</text></g>
      ))}
    </svg>
  )
}
function Implantacao() {
  const [sel, setSel] = useState(LOTES[2])
  return (
    <div className="impl">
      <svg viewBox="0 0 440 250" role="group" aria-label="Implantação esquemática do condomínio">
        <rect x="6" y="6" width="428" height="238" rx="18" className="terreno" />
        <path d="M20 215 C120 190 260 235 420 205" className="alameda" />
        <ellipse cx="370" cy="150" rx="46" ry="30" className="lago" />
        {LOTES.map(l => (
          <g key={l.id} tabIndex="0" role="button" aria-label={l.nome} className={'lote' + (sel.id === l.id ? ' on' : '')} onClick={() => setSel(l)} onFocus={() => setSel(l)} onMouseEnter={() => setSel(l)}>
            <rect x={l.x} y={l.y} width={l.id === 'E' ? 90 : 80} height="56" rx="8" />
            <text x={l.x + (l.id === 'E' ? 45 : 40)} y={l.y + 34} textAnchor="middle">{l.id}</text>
          </g>
        ))}
      </svg>
      <div className="impl-card" aria-live="polite">
        <small>Selecionado</small><h3>{sel.nome}</h3>
        <p>{sel.un} unidades · {sel.status}</p>
      </div>
    </div>
  )
}
function Simulador() {
  const [s, setS] = useState({ valor: 689000, entradaPct: 20, anos: 30, taxaAnual: 10.5 })
  const set = (k) => (e) => setS({ ...s, [k]: +e.target.value })
  const r = simular(s)
  return (
    <div className="sim">
      <div className="sim-in">
        <label>Valor do imóvel <b>{brl(s.valor)}</b><input type="range" min="400000" max="1000000" step="10000" value={s.valor} onChange={set('valor')} /></label>
        <label>Entrada <b>{s.entradaPct}%</b><input type="range" min="10" max="60" value={s.entradaPct} onChange={set('entradaPct')} /></label>
        <label>Prazo <b>{s.anos} anos</b><input type="range" min="5" max="35" value={s.anos} onChange={set('anos')} /></label>
        <label>Taxa de juros <b>{s.taxaAnual.toString().replace('.', ',')}% a.a.</b><input type="range" min="7" max="14" step="0.5" value={s.taxaAnual} onChange={set('taxaAnual')} /></label>
      </div>
      <div className="sim-out" aria-live="polite">
        <small>Parcela estimada</small>
        <strong>{brl(r.parcela)}<span>/mês</span></strong>
        <dl><div><dt>Entrada</dt><dd>{brl(r.entrada)}</dd></div><div><dt>Financiado</dt><dd>{brl(r.financiado)}</dd></div></dl>
        <p>Simulação ilustrativa (tabela Price). Não é oferta de crédito.</p>
      </div>
    </div>
  )
}
function Lead() {
  const [ok, setOk] = useState(false)
  if (ok) return <p className="ok" role="status">Recebemos seu interesse. Em breve um consultor entra em contato. <em>(Demo: nada foi enviado.)</em></p>
  return (
    <form className="lead" onSubmit={(e) => { e.preventDefault(); setOk(true) }}>
      <label>Nome<input required autoComplete="name" /></label>
      <label>WhatsApp<input required type="tel" autoComplete="tel" placeholder="(41) 90000-0000" /></label>
      <label>Interesse<select defaultValue="3d">{TIPOS.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}</select></label>
      <button className="btn" type="submit">Quero receber a tabela de preços</button>
      <small>Ao enviar você concorda em ser contatado. Formulário de demonstração.</small>
    </form>
  )
}

export default function App() {
  const [tid, setTid] = useState('3d')
  const t = TIPOS.find(x => x.id === tid)
  return (<>
    <header className="top"><Logo /><nav aria-label="Principal"><a href="#plantas">Plantas</a><a href="#implantacao">Implantação</a><a href="#financie">Simule</a><a className="btn sm" href="#contato">Falar com consultor</a></nav></header>
    <main>
      <section className="hero">
        <div>
          <p className="kicker">Lançamento · Curitiba, Bairro Ecoville</p>
          <h1>Um parque inteiro <em>para chamar de quintal.</em></h1>
          <p className="lead-p">Apartamentos de 64 a 128 m² dentro de 38 mil m² de bosque, a 6 minutos do Parque Barigui. Entrega prevista para dezembro de 2028.</p>
          <div className="cta"><a className="btn" href="#contato">Receber tabela</a><a className="ghost" href="#plantas">Ver plantas</a></div>
        </div>
        <svg className="art" viewBox="0 0 400 420" role="img" aria-label="Ilustração das torres entre árvores">
          <circle cx="290" cy="90" r="46" className="sol" />
          <rect x="60" y="130" width="90" height="230" rx="6" className="t1" /><rect x="160" y="80" width="100" height="280" rx="6" className="t2" /><rect x="270" y="170" width="80" height="190" rx="6" className="t1" />
          {[...Array(6)].map((_, r) => [0, 1, 2].map(c => <rect key={r + 'a' + c} x={72 + c * 26} y={150 + r * 34} width="14" height="20" rx="2" className="jan" />))}
          {[...Array(7)].map((_, r) => [0, 1, 2].map(c => <rect key={r + 'b' + c} x={176 + c * 28} y={100 + r * 34} width="16" height="20" rx="2" className="jan" />))}
          <path d="M0 360h400v60H0z" className="chao" />
          {[30, 380, 120, 330].map((x, i) => <g key={x}><rect x={x - 3} y={340 - i * 4} width="6" height="30" className="tr" /><circle cx={x} cy={325 - i * 4} r={26 - i * 2} className="cp" /></g>)}
        </svg>
      </section>

      <section className="nums" aria-label="Números do empreendimento">
        {[['38 mil m²', 'de terreno, 62% de área verde'], ['408', 'unidades em 4 torres e garden houses'], ['22', 'itens de lazer e serviços'], ['6 min', 'do Parque Barigui']].map(([a, b]) => <div key={a}><strong>{a}</strong><span>{b}</span></div>)}
      </section>

      <section id="plantas" className="sec">
        <h2>Plantas pensadas para morar</h2>
        <div className="tabs" role="group" aria-label="Tipologia">{TIPOS.map(x => <button key={x.id} aria-pressed={x.id === tid} onClick={() => setTid(x.id)}>{x.nome}</button>)}</div>
        <div className="tipo">
          <Planta t={t} />
          <div><p className="preco">A partir de <strong>{brl(t.preco)}</strong></p><p>{t.txt}</p>
            <ul><li><b>{t.area} m²</b> privativos</li><li><b>{t.vagas}</b> vaga(s) de garagem</li><li>Infra para ar-condicionado e carregador elétrico</li></ul></div>
        </div>
      </section>

      <section id="implantacao" className="sec alt">
        <h2>Implantação</h2><p className="sub">Passe o mouse ou toque em uma torre para ver o status.</p>
        <Implantacao />
        <div className="obra"><h3>Andamento da obra</h3>{OBRA.map(([n, p]) => <div key={n} className="barra"><span>{n}</span><div><i style={{ width: p + '%' }} /></div><b>{p}%</b></div>)}<small>Dados fictícios de demonstração.</small></div>
      </section>

      <section id="financie" className="sec"><h2>Simule seu financiamento</h2><Simulador /></section>

      <section className="sec alt"><h2>Perguntas frequentes</h2>
        <div className="faq">{FAQ.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div></section>

      <section id="contato" className="sec fim"><h2>Fale com um consultor</h2><p className="sub">Receba tabela, planta e condições de lançamento.</p><Lead /></section>
    </main>
    <footer><Logo /><p>Alameda Tapiré é um empreendimento <b>fictício</b> criado para demonstração de landing page. Imagens e valores ilustrativos. Projeto de portfólio de Alisson Littig.</p></footer>
  </>)
}
