import { useState, useEffect, useRef } from 'react'
import './App.css'

const PIN = '6010'
const AGENT = {
  name: 'Carolyn Githieya-Dennis',
  title: 'REALTOR®',
  phone: '404-981-6370',
  email: 'cgithieya@kw.com',
  website: 'carolyngdennis.kw.com',
  location: 'Atlanta, Georgia',
  brokerage: 'Keller Williams West ATL',
  brandColor: '#7A5C4F',
  accentColor: '#0C3EBB',
  photo: '',
  bio: "I'm Carolyn Githieya-Dennis, a dedicated REALTOR® with Keller Williams West ATL. My mission is to provide every client with exceptional service, expert guidance, and a seamless real estate experience — whether you're buying, selling, or renting in the greater Atlanta area.",
  credentials: 'REALTOR® · Licensed in Georgia · Keller Williams West ATL',
  yearsExperience: 10,
  calendlyUrl: 'https://carolyngdennis.kw.com/book-a-consultation',
}

const T = {
  cream: '#FFFAF6',
  card: '#ffffff',
  secondary: '#E8EBF2',
  border: '#DBE0EB',
  text: '#273144',
  muted: '#5A6478',
  hint: '#8E98AA',
  accent: '#0C3EBB',
  accentLight: '#E6ECFB',
  brand: '#7A5C4F',
}
const COLORS = {
  seller: { p: '#D85A30', bg: '#FAECE7', txt: '#712B13', bd: '#F0997B' },
  buyer: { p: '#378ADD', bg: '#E6F1FB', txt: '#0C447C', bd: '#85B7EB' },
  landlord: { p: '#639922', bg: '#EAF3DE', txt: '#27500A', bd: '#97C459' },
  tenant: { p: '#7F77DD', bg: '#EEEDFE', txt: '#3C3489', bd: '#AFA9EC' },
}
const STEPS = {
  seller: ['Select A Real Estate Agent','Sign Listing Agreement','Listing Consultation','Home Prep & Staging','Active On Market','Offers & Negotiation','Under Contract','Closing'],
  buyer: ['Select A Real Estate Agent','Sign Buyer Agreement','Pre-Approval','Buyer Consultation','Property Search','Make Offer','Under Contract','Inspection & Appraisal','Funding And Closing','Take Possession Of Your Home'],
  landlord: ['Select A Real Estate Agent','Sign Listing Agreement','Rental Listing Consultation','Property Listed','Show Tenants','Review Applications','Tenant Selected','Lease Signed & Move-In/Move-Out Form Signed','Tenant Move-In'],
  tenant: ['Select A Real Estate Agent','Sign Tenant Agreement','Tenant Consultation','Property Search','Submit Application','Application Approved','Lease Review','Lease Signed & Move-In/Move-Out Form Signed','Move-In'],
}
const uid = () => Math.random().toString(36).slice(2, 8)
const last4 = phone => (phone || '').replace(/\D/g, '').slice(-4) || Math.floor(1000 + Math.random() * 9000).toString()

const DEFAULT_RESOURCES = {
  seller:   [{ id: 'rs1', title: 'Carolyn\'s Home Seller Guide', url: 'https://bit.ly/m/CarolynHomeSellerGuide', type: 'guide' }],
  buyer:    [{ id: 'rb1', title: 'Carolyn\'s Home Buyer Guide',  url: 'https://bit.ly/m/CarolynsBuyerGuide',    type: 'guide', thumbnail: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600' }],
  landlord: [{ id: 'rl2', title: 'Carolyn\'s Rentals', url: 'https://bit.ly/m/CarolynsRentals', type: 'guide' }, { id: 'rl1', title: 'Carolyn\'s Home Seller Guide', url: 'https://bit.ly/m/CarolynHomeSellerGuide', type: 'guide' }],
  tenant:   [{ id: 'rt2', title: 'Carolyn\'s Rentals', url: 'https://bit.ly/m/CarolynsRentals', type: 'guide' }, { id: 'rt1', title: 'Carolyn\'s Home Buyer Guide',  url: 'https://bit.ly/m/CarolynsBuyerGuide',    type: 'guide', thumbnail: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600' }],
}

const firstName = name => (name || '').trim().split(' ')[0] || 'there'

const DEFAULT_WELCOME = {
  buyer:    n => `Welcome, ${firstName(n)}! I'm excited to help you find your perfect home. You're in great hands — let's make this journey smooth and enjoyable.`,
  seller:   n => `Welcome, ${firstName(n)}! I'm excited to help you sell your home for top dollar. Let's work together to make this process stress-free.`,
  landlord: n => `Welcome, ${firstName(n)}! I'm excited to help you find the perfect tenant for your property. I'll guide you every step of the way.`,
  tenant:   n => `Welcome, ${firstName(n)}! I'm excited to help you find your perfect rental home. Let's get started on finding the right fit for you.`,
}

const DEFAULT_NEXT_STEPS = {
  buyer: [
    'Sign your exclusive buyer agreement',
    'Schedule your buyer consultation with Carolyn',
    'Get pre-approved with one of our preferred lenders',
    'Review your property matches and save your favorites',
  ],
  seller: [
    'Sign your exclusive listing agreement',
    'Schedule your home walkthrough and pricing consultation',
    'Prepare your home for photos and showings',
  ],
  landlord: [
    'Sign your exclusive leasing listing agreement',
    'Schedule your property walkthrough',
    'Review comparable rental listings in your area',
    'Prepare your property for tenant showings',
  ],
  tenant: [
    'Sign your exclusive tenant brokerage agreement',
    'Complete your rental application and gather documents',
    'Review your property matches and save your favorites',
    'Schedule your tenant consultation with Carolyn',
  ],
}

const LENDERS = [
  {
    id: 'l1',
    name: 'Joel Gardner',
    company: 'South State Bank',
    phone: '+1 (205) 789-7481',
    email: 'joel.gardner@southstatebank.com',
    url: null,
  },
  {
    id: 'l2',
    name: 'Stephen Morris',
    company: 'Bank with United',
    phone: '202-494-3284',
    email: null,
    url: 'https://www.bankwithunited.com/personal-banking/mortgage/loan-officers/stephen-morris.html',
  },
  {
    id: 'l3',
    name: 'Kim Arrington',
    company: 'Guild Mortgage',
    phone: null,
    email: null,
    url: 'http://www.guildmortgage.com/kimarrington',
  },
]

const DEMO = [{
  id: 'c1', name: 'Sarah Johnson', type: 'buyer', clientPhone: '(555) 123-6370', accessCode: '6370', stage: 4,
  agentName: AGENT.name, agentPhone: AGENT.phone, agentEmail: AGENT.email,
  welcomeMessage: DEFAULT_WELCOME.buyer('Sarah Johnson'),
  nextSteps: DEFAULT_NEXT_STEPS.buyer,
  resources: [
    { id: 'rb1', title: "Carolyn's Home Buyer Guide", url: 'https://bit.ly/m/CarolynsBuyerGuide', type: 'guide', thumbnail: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600' },
    { id: 'r2', title: 'Mortgage pre-approval checklist', url: '#', type: 'checklist' },
  ],
  documents: [
    { id: 'd1', title: 'Exclusive Buyer Agreement', url: '#', status: 'signed' },
    { id: 'd10', title: 'Buyer Brochures', url: '#', status: 'pending' },
  ],
  properties: [
    { id: 'p1', address: '1842 Peachtree Rd NE', city: 'Atlanta', zip: '30309', price: 485000, beds: 3, baths: 2, sqft: 1850, year: 2005,
      photos: ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800'],
      mlsUrl: '#', agentNote: 'Great location near Ansley Park.', status: 'Active',
      description: "Stunning Craftsman-style home in Buckhead. Open floor plan, chef's kitchen, master suite with spa bath." },
    { id: 'p2', address: '540 Freedom Pkwy NE', city: 'Atlanta', zip: '30312', price: 425000, beds: 3, baths: 2, sqft: 1720, year: 1998,
      photos: ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800'],
      mlsUrl: '#', agentNote: 'Intown gem near Ponce City Market.', status: 'Active',
      description: 'Charming bungalow in Old Fourth Ward. Large backyard, covered porch. Steps from the BeltLine.' },
    { id: 'p3', address: '2265 Lenox Rd NE', city: 'Atlanta', zip: '30324', price: 399000, beds: 2, baths: 2, sqft: 1540, year: 2015,
      photos: ['https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800'],
      mlsUrl: '#', agentNote: 'Best value on the list.', status: 'Active',
      description: 'Modern condo near Lenox Square. Resort-style pool, fitness center, secure parking.' },
  ],
  favorites: [], propertyComments: {}, messages: [],
  wishlist: { budget: '$400,000 – $500,000', beds: '3+', baths: '2+', neighborhoods: 'Buckhead, Old Fourth Ward, Intown Atlanta', mustHaves: 'Garage, outdoor space, updated kitchen' },
  marketSnapshot: { medianPrice: '$425,000', daysOnMarket: '18 days', listToSale: '98%', note: 'Atlanta intown market is competitive. Homes priced well are moving quickly with multiple offers.' },
  activityFeed: [
    { id: 'a1', text: 'Client portal created', date: 'Jun 10, 2026' },
    { id: 'a2', text: 'Exclusive Buyer Agreement signed', date: 'Jun 12, 2026' },
    { id: 'a3', text: 'Property matches added to your portal', date: 'Jun 14, 2026' },
  ],
},{
  id: 'c2', name: 'Marcus Thompson', type: 'seller', clientPhone: '(404) 555-8821', accessCode: '8821', stage: 2,
  agentName: AGENT.name, agentPhone: AGENT.phone, agentEmail: AGENT.email,
  welcomeMessage: DEFAULT_WELCOME.seller('Marcus Thompson'),
  nextSteps: DEFAULT_NEXT_STEPS.seller,
  resources: [...DEFAULT_RESOURCES.seller],
  documents: [
    { id: 'd4', title: 'Exclusive Listing Agreement', url: '#', status: 'signed' },
    { id: 'd5', title: 'Seller Disclosure Form', url: '#', status: 'pending' },
    { id: 'd11', title: 'Seller Brochures', url: '#', status: 'pending' },
  ],
  properties: [],
  favorites: [], propertyComments: {}, messages: [],
  homeValue: { low: 525000, high: 565000, cmaSummary: 'Based on recent comparable sales in East Atlanta Village, your home is positioned competitively. Three similar 4BR homes closed between $520K–$558K in the last 90 days.' },
  marketSnapshot: { medianPrice: '$540,000', daysOnMarket: '22 days', listToSale: '97%', note: 'East Atlanta Village continues to see strong demand. Well-presented homes are receiving offers within the first two weeks.' },
  activityFeed: [
    { id: 'a1', text: 'Client portal created', date: 'Jun 8, 2026' },
    { id: 'a2', text: 'Exclusive Listing Agreement signed', date: 'Jun 10, 2026' },
    { id: 'a3', text: 'Listing consultation scheduled', date: 'Jun 15, 2026' },
  ],
},{
  id: 'c3', name: 'Priya Nair', type: 'tenant', clientPhone: '(678) 555-4490', accessCode: '4490', stage: 3,
  agentName: AGENT.name, agentPhone: AGENT.phone, agentEmail: AGENT.email,
  welcomeMessage: DEFAULT_WELCOME.tenant('Priya Nair'),
  nextSteps: DEFAULT_NEXT_STEPS.tenant,
  resources: [...DEFAULT_RESOURCES.tenant],
  documents: [
    { id: 'd6', title: 'Exclusive Tenant Brokerage Agreement', url: '#', status: 'signed' },
    { id: 'd7', title: 'Rental Application', url: '#', status: 'pending' },
  ],
  properties: [
    { id: 'p5', address: '775 Juniper St NE', city: 'Atlanta', zip: '30308', price: 2200, beds: 2, baths: 1, sqft: 1050, year: 2012,
      photos: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800'],
      mlsUrl: '#', agentNote: 'Great Midtown location, pet-friendly.', status: 'Active',
      description: 'Bright Midtown apartment with updated kitchen, hardwoods throughout, rooftop deck, and walkable to everything.' },
    { id: 'p6', address: '1020 Piedmont Ave NE', city: 'Atlanta', zip: '30309', price: 1950, beds: 1, baths: 1, sqft: 820, year: 2008,
      photos: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
      mlsUrl: '#', agentNote: 'Best price per sqft on the list.', status: 'Active',
      description: 'Cozy 1BR steps from Piedmont Park. In-unit laundry, secure building, assigned parking included.' },
  ],
  favorites: [], propertyComments: {}, messages: [],
  wishlist: { budget: '$1,800 – $2,500/mo', beds: '2', baths: '1+', neighborhoods: 'Midtown, Piedmont Park area, Virginia-Highland', mustHaves: 'In-unit laundry, pet-friendly, parking' },
  activityFeed: [
    { id: 'a1', text: 'Client portal created', date: 'Jun 11, 2026' },
    { id: 'a2', text: 'Exclusive Tenant Brokerage Agreement signed', date: 'Jun 13, 2026' },
    { id: 'a3', text: 'Rental properties added to your portal', date: 'Jun 15, 2026' },
  ],
},{
  id: 'c4', name: 'Denise Walker', type: 'landlord', clientPhone: '(770) 555-3317', accessCode: '3317', stage: 1,
  agentName: AGENT.name, agentPhone: AGENT.phone, agentEmail: AGENT.email,
  welcomeMessage: DEFAULT_WELCOME.landlord('Denise Walker'),
  nextSteps: DEFAULT_NEXT_STEPS.landlord,
  resources: [...DEFAULT_RESOURCES.landlord],
  documents: [
    { id: 'd8', title: 'Exclusive Leasing Listing Agreement', url: '#', status: 'pending' },
    { id: 'd12', title: 'Landlord Brochures', url: '#', status: 'pending' },
  ],
  properties: [
    { id: 'p7', address: '642 Cascade Ave SW', city: 'Atlanta', zip: '30310', price: 1750, beds: 3, baths: 2, sqft: 1400, year: 1996,
      photos: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'],
      mlsUrl: '#', agentNote: 'Move-in ready, great West End location.', status: 'Coming Soon',
      description: 'Well-maintained 3BR/2BA in West End. Updated kitchen, private backyard, off-street parking. Close to the BeltLine and downtown.' },
  ],
  favorites: [], propertyComments: {}, messages: [],
  activityFeed: [
    { id: 'a1', text: 'Client portal created', date: 'Jun 12, 2026' },
    { id: 'a2', text: 'Exclusive Leasing Listing Agreement sent for signature', date: 'Jun 14, 2026' },
  ],
}]

function BrandHeader() {
  return (
    <div style={{ background: T.brand, padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(255,255,255,0.35)', color: '#fff', fontWeight: 700, fontSize: '16px' }}>CG</div>
        <div>
          <p style={{ color: '#fff', fontWeight: 700, fontSize: '16px', letterSpacing: '0.02em' }}>{AGENT.name}</p>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '12px', letterSpacing: '0.06em' }}>{AGENT.title} · {AGENT.brokerage}</p>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <a href={`tel:${AGENT.phone}`} style={{ color: 'rgba(255,255,255,0.9)', fontSize: '13px', textDecoration: 'none' }}>📞 {AGENT.phone}</a>
        <a href={`mailto:${AGENT.email}`} style={{ color: 'rgba(255,255,255,0.9)', fontSize: '13px', textDecoration: 'none' }}>✉️ {AGENT.email}</a>
        <a href={`https://${AGENT.website}`} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.9)', fontSize: '13px', textDecoration: 'none' }}>🌐 {AGENT.website}</a>
      </div>
    </div>
  )
}

function BrandFooter() {
  return (
    <div style={{ background: T.brand, padding: '24px', marginTop: '48px' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
        <p style={{ color: '#fff', fontWeight: 700, fontSize: '15px', marginBottom: '4px' }}>{AGENT.name}</p>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', marginBottom: '14px' }}>{AGENT.title} · {AGENT.brokerage} · {AGENT.location}</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
          <a href={`tel:${AGENT.phone}`} style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px', textDecoration: 'none' }}>{AGENT.phone}</a>
          <a href={`mailto:${AGENT.email}`} style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px', textDecoration: 'none' }}>{AGENT.email}</a>
          <a href={`https://${AGENT.website}`} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px', textDecoration: 'none' }}>{AGENT.website}</a>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', marginTop: '16px' }}>© {new Date().getFullYear()} {AGENT.name} · All rights reserved</p>
      </div>
    </div>
  )
}

function LendersSection() {
  return (
    <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: '12px', padding: '16px', marginTop: '4px' }}>
      <p style={{ fontSize: '13px', fontWeight: 700, color: T.text, marginBottom: '4px' }}>🏦 Preferred lenders</p>
      <p style={{ fontSize: '12px', color: T.muted, marginBottom: '14px' }}>Carolyn recommends these trusted lenders to get you pre-approved.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {LENDERS.map(l => (
          <div key={l.id} style={{ background: T.secondary, borderRadius: '10px', padding: '12px 14px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: T.accentLight, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.accent, fontWeight: 700, fontSize: '14px', flexShrink: 0 }}>
              {l.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '14px', fontWeight: 600, color: T.text }}>{l.name}</p>
              <p style={{ fontSize: '12px', color: T.muted, marginBottom: '6px' }}>{l.company}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {l.phone && <a href={`tel:${l.phone}`} style={{ fontSize: '12px', color: T.accent, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>📞 {l.phone}</a>}
                {l.email && <a href={`mailto:${l.email}`} style={{ fontSize: '12px', color: T.accent, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>✉️ {l.email}</a>}
                {l.url && <a href={l.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: T.accent, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>🌐 View profile</a>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Login({ clients, onClient, onRealtor }) {
  const [mode, setMode] = useState(null)
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [pin, setPin] = useState('')
  const [err, setErr] = useState('')
  const doClient = () => {
    const c = clients.find(x => x.name.toLowerCase().trim() === name.toLowerCase().trim() && x.accessCode === code.trim().toUpperCase())
    if (c) { setErr(''); onClient(c.id) } else setErr('Name or access code not recognized.')
  }
  const doRealtor = () => { if (pin === PIN) { setErr(''); onRealtor() } else setErr('Incorrect PIN.') }
  return (
    <div style={{ minHeight: '100vh', background: T.cream }}>
      <BrandHeader />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 20px' }}>
      <div style={{ width: '100%', maxWidth: '400px', background: T.card, borderRadius: '16px', padding: '36px', border: `1px solid ${T.border}`, boxShadow: '0 4px 24px rgba(39,49,68,0.08)' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: T.brand, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', color: '#fff', fontWeight: 700, fontSize: '18px' }}>CG</div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '4px', color: T.text }}>{AGENT.name}</h1>
          <p style={{ fontSize: '12px', color: T.muted, letterSpacing: '0.06em' }}>{AGENT.title} · {AGENT.brokerage}</p>
          <p style={{ fontSize: '13px', color: T.hint, marginTop: '6px' }}>Client Portal</p>
        </div>
        {!mode && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[{ id: 'client', title: "I'm a client", sub: 'View my property portal', color: '#378ADD' },
              { id: 'realtor', title: "I'm the realtor", sub: 'Manage client portals', color: '#639922' }].map(opt => (
              <button key={opt.id} onClick={() => setMode(opt.id)} style={{ padding: '14px 16px', borderRadius: '10px', border: `1px solid ${T.border}`, background: T.card, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: T.text }}>{opt.title}</p>
                  <p style={{ fontSize: '12px', color: T.muted }}>{opt.sub}</p>
                </div>
                <span style={{ color: '#ccc' }}>→</span>
              </button>
            ))}
          </div>
        )}
        {mode === 'client' && (
          <div>
            <button onClick={() => { setMode(null); setErr('') }} style={{ fontSize: '13px', color: T.muted, background: 'none', border: 'none', cursor: 'pointer', marginBottom: '16px' }}>← Back</button>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" style={{ width: '100%', padding: '10px', border: `1px solid ${T.border}`, borderRadius: '8px', marginBottom: '10px', fontSize: '14px', color: T.text }} />
            <input value={code} onChange={e => setCode(e.target.value)} placeholder="4-digit access code (e.g. 6370)" style={{ width: '100%', padding: '10px', border: `1px solid ${T.border}`, borderRadius: '8px', marginBottom: '14px', fontSize: '14px', color: T.text }} onKeyDown={e => e.key === 'Enter' && doClient()} />
            {err && <p style={{ color: '#c0392b', fontSize: '13px', marginBottom: '10px' }}>{err}</p>}
            <button onClick={doClient} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: 'none', background: T.accent, color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer', letterSpacing: '0.02em' }}>Access my portal</button>
            <p style={{ fontSize: '11px', color: T.hint, textAlign: 'center', marginTop: '10px' }}>Demo: "Sarah Johnson" 6370 (buyer) &nbsp;·&nbsp; "Marcus Thompson" 8821 (seller) &nbsp;·&nbsp; "Priya Nair" 4490 (tenant) &nbsp;·&nbsp; "Denise Walker" 3317 (landlord)</p>
          </div>
        )}
        {mode === 'realtor' && (
          <div>
            <button onClick={() => { setMode(null); setErr('') }} style={{ fontSize: '13px', color: T.muted, background: 'none', border: 'none', cursor: 'pointer', marginBottom: '16px' }}>← Back</button>
            <input type="password" value={pin} onChange={e => setPin(e.target.value)} placeholder="Realtor PIN" style={{ width: '100%', padding: '10px', border: `1px solid ${T.border}`, borderRadius: '8px', marginBottom: '14px', fontSize: '14px', color: T.text }} onKeyDown={e => e.key === 'Enter' && doRealtor()} />
            {err && <p style={{ color: '#c0392b', fontSize: '13px', marginBottom: '10px' }}>{err}</p>}
            <button onClick={doRealtor} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: 'none', background: T.text, color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>Access dashboard</button>
            <p style={{ fontSize: '11px', color: T.hint, textAlign: 'center', marginTop: '10px' }}>Demo PIN: 1234</p>
          </div>
        )}
      </div>
      </div>
      <BrandFooter />
    </div>
  )
}

function ClientPortal({ client, onLogout, onUpdate }) {
  const [tab, setTab] = useState('overview')
  const [msgText, setMsgText] = useState('')
  const c = COLORS[client.type] || COLORS.buyer
  const steps = STEPS[client.type] || []
  const pct = Math.round((client.stage / (steps.length - 1)) * 100)
  const pending = (client.documents || []).filter(d => d.status !== 'signed').length
  const isFav = id => (client.favorites || []).includes(id)
  const toggleFav = id => {
    const f = client.favorites || []
    onUpdate({ favorites: isFav(id) ? f.filter(x => x !== id) : [...f, id] })
  }
  const setComment = (id, txt) => onUpdate({ propertyComments: { ...(client.propertyComments || {}), [id]: txt } })
  const [selProp, setSelProp] = useState(null)
  const sendMsg = () => {
    if (!msgText.trim()) return
    const msgs = [...(client.messages || []), { id: uid(), from: 'client', text: msgText.trim(), date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }]
    onUpdate({ messages: msgs })
    setMsgText('')
  }

  const card = { background: T.card, borderRadius: '12px', padding: '16px', border: `1px solid ${T.border}` }
  const label = { fontSize: '12px', color: T.muted, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }

  return (
    <div style={{ minHeight: '100vh', background: T.cream }}>
      <BrandHeader />
      <div style={{ background: c.p, padding: '16px 24px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ fontSize: '11px', opacity: .75, marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{client.type} client portal</p>
          <p style={{ fontSize: '20px', fontWeight: 700 }}>Welcome, {client.name}</p>
        </div>
      </div>
      <div style={{ display: 'flex', background: T.card, borderBottom: `1px solid ${T.border}`, overflowX: 'auto' }}>
        {['overview', 'journey', 'documents', 'resources', 'messages'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: '12px 16px', fontSize: '13px', border: 'none', borderBottom: `2px solid ${tab === t ? c.p : 'transparent'}`, background: 'none', cursor: 'pointer', color: tab === t ? c.p : '#888', fontWeight: tab === t ? 600 : 400, whiteSpace: 'nowrap', textTransform: 'capitalize' }}>{t}</button>
        ))}
        <button onClick={onLogout} style={{ marginLeft: 'auto', padding: '12px 16px', fontSize: '13px', border: 'none', background: 'none', cursor: 'pointer', color: T.hint }}>Log out</button>
      </div>
      <div style={{ padding: '20px 24px', maxWidth: '700px', margin: '0 auto' }}>
        {tab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

            {pending > 0 && <div style={{ background: '#FAEEDA', border: '1px solid #FAC775', borderRadius: '10px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '13px', color: '#412402', flex: 1 }}>⚠️ {pending} document{pending > 1 ? 's' : ''} need your signature.</span>
              <button onClick={() => setTab('documents')} style={{ fontSize: '12px', color: '#BA7517', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>View →</button>
            </div>}

            <div style={card}>
              <p style={label}>Journey progress</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <div style={{ flex: 1, height: '6px', background: '#eee', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: c.p, borderRadius: '3px' }} />
                </div>
                <span style={{ fontSize: '12px', fontWeight: 600, color: c.p }}>{pct}%</span>
              </div>
              <p style={{ fontSize: '13px' }}>Current step: <strong>{steps[client.stage]}</strong></p>
            </div>

            <div style={card}>
              <p style={label}>From your agent</p>
              <p style={{ fontSize: '14px', lineHeight: 1.7 }}>{client.welcomeMessage}</p>
            </div>

            {client.nextSteps?.length > 0 && <div style={{ background: c.bg, border: `1px solid ${c.bd}`, borderRadius: '12px', padding: '16px' }}>
              <p style={{ fontSize: '12px', fontWeight: 600, color: c.txt, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your next steps</p>
              {client.nextSteps.map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '8px', alignItems: 'flex-start' }}>
                  <div style={{ minWidth: '22px', height: '22px', borderRadius: '50%', background: c.p, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 600, flexShrink: 0 }}>{i + 1}</div>
                  <p style={{ fontSize: '13px', color: c.txt, lineHeight: 1.5, paddingTop: '3px' }}>{s}</p>
                </div>
              ))}
            </div>}

            <div style={card}>
              <p style={label}>Schedule time with Carolyn</p>
              <p style={{ fontSize: '13px', color: T.text, marginBottom: '12px', lineHeight: 1.6 }}>Ready to schedule a showing, consultation, or follow-up call? Book directly on Carolyn's calendar.</p>
              {AGENT.calendlyUrl
                ? <a href={AGENT.calendlyUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', background: c.p, color: '#fff', padding: '10px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>Book an appointment →</a>
                : <p style={{ fontSize: '13px', color: T.muted }}>📅 Call or email Carolyn: <strong>{AGENT.phone}</strong> · <strong>{AGENT.email}</strong></p>
              }
            </div>

            {(client.type === 'buyer' || client.type === 'seller') && client.marketSnapshot && Object.keys(client.marketSnapshot).length > 0 && <div style={card}>
              <p style={label}>Market snapshot</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: client.marketSnapshot.note ? '12px' : '0' }}>
                {client.marketSnapshot.medianPrice && <div style={{ background: T.secondary, borderRadius: '8px', padding: '10px 12px', textAlign: 'center' }}>
                  <p style={{ fontSize: '11px', color: T.muted, marginBottom: '4px' }}>Median price</p>
                  <p style={{ fontSize: '15px', fontWeight: 600, color: T.text }}>{client.marketSnapshot.medianPrice}</p>
                </div>}
                {client.marketSnapshot.daysOnMarket && <div style={{ background: T.secondary, borderRadius: '8px', padding: '10px 12px', textAlign: 'center' }}>
                  <p style={{ fontSize: '11px', color: T.muted, marginBottom: '4px' }}>Avg days on market</p>
                  <p style={{ fontSize: '15px', fontWeight: 600, color: T.text }}>{client.marketSnapshot.daysOnMarket}</p>
                </div>}
                {client.marketSnapshot.listToSale && <div style={{ background: T.secondary, borderRadius: '8px', padding: '10px 12px', textAlign: 'center' }}>
                  <p style={{ fontSize: '11px', color: T.muted, marginBottom: '4px' }}>List-to-sale ratio</p>
                  <p style={{ fontSize: '15px', fontWeight: 600, color: T.text }}>{client.marketSnapshot.listToSale}</p>
                </div>}
              </div>
              {client.marketSnapshot.note && <p style={{ fontSize: '12px', color: T.muted, lineHeight: 1.6 }}>{client.marketSnapshot.note}</p>}
            </div>}

            {client.type === 'seller' && client.homeValue && Object.keys(client.homeValue).length > 0 && <div style={{ background: c.bg, border: `1px solid ${c.bd}`, borderRadius: '12px', padding: '16px' }}>
              <p style={{ fontSize: '12px', fontWeight: 600, color: c.txt, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Home value estimate</p>
              {client.homeValue.low && client.homeValue.high && <p style={{ fontSize: '24px', fontWeight: 700, color: c.p, marginBottom: '8px' }}>${Number(client.homeValue.low).toLocaleString()} – ${Number(client.homeValue.high).toLocaleString()}</p>}
              {client.homeValue.cmaSummary && <p style={{ fontSize: '13px', color: c.txt, lineHeight: 1.6 }}>{client.homeValue.cmaSummary}</p>}
            </div>}

            {(client.type === 'buyer' || client.type === 'tenant') && client.wishlist && Object.keys(client.wishlist).length > 0 && <div style={card}>
              <p style={label}>Your search criteria</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {client.wishlist.budget && <div><p style={{ fontSize: '11px', color: T.hint, marginBottom: '2px' }}>Budget</p><p style={{ fontSize: '13px', fontWeight: 600, color: T.text }}>{client.wishlist.budget}</p></div>}
                {client.wishlist.beds && <div><p style={{ fontSize: '11px', color: T.hint, marginBottom: '2px' }}>Bedrooms</p><p style={{ fontSize: '13px', fontWeight: 600, color: T.text }}>{client.wishlist.beds}</p></div>}
                {client.wishlist.baths && <div><p style={{ fontSize: '11px', color: T.hint, marginBottom: '2px' }}>Bathrooms</p><p style={{ fontSize: '13px', fontWeight: 600, color: T.text }}>{client.wishlist.baths}</p></div>}
                {client.wishlist.neighborhoods && <div style={{ gridColumn: '1 / -1' }}><p style={{ fontSize: '11px', color: T.hint, marginBottom: '2px' }}>Preferred neighborhoods</p><p style={{ fontSize: '13px', fontWeight: 600, color: T.text }}>{client.wishlist.neighborhoods}</p></div>}
                {client.wishlist.mustHaves && <div style={{ gridColumn: '1 / -1' }}><p style={{ fontSize: '11px', color: T.hint, marginBottom: '2px' }}>Must-haves</p><p style={{ fontSize: '13px', fontWeight: 600, color: T.text }}>{client.wishlist.mustHaves}</p></div>}
              </div>
            </div>}

            <div style={card}>
              <p style={label}>Your agent</p>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                {AGENT.photo
                  ? <img src={AGENT.photo} alt={AGENT.name} style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                  : <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: AGENT.brandColor, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 700, flexShrink: 0, letterSpacing: '-1px' }}>CG</div>
                }
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '16px', fontWeight: 700, color: T.text, marginBottom: '2px' }}>{AGENT.name}</p>
                  <p style={{ fontSize: '12px', color: T.muted, marginBottom: '4px' }}>{AGENT.credentials}</p>
                  <p style={{ fontSize: '12px', color: T.muted, marginBottom: '10px' }}>{AGENT.yearsExperience}+ years of experience</p>
                  <p style={{ fontSize: '13px', color: T.text, lineHeight: 1.7 }}>{AGENT.bio}</p>
                </div>
              </div>
            </div>

            {client.type === 'buyer' && <LendersSection />}
          </div>
        )}
        {tab === 'journey' && (
          <div>
            {steps.map((s, i) => {
              const done = i < client.stage, cur = i === client.stage
              return (
                <div key={i} style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: '26px', height: '26px', borderRadius: '50%', border: `2px solid ${done || cur ? c.p : '#ddd'}`, background: done ? c.p : cur ? c.bg : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {done && <span style={{ color: '#fff', fontSize: '12px' }}>✓</span>}
                      {cur && <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: c.p }} />}
                    </div>
                    {i < steps.length - 1 && <div style={{ width: '2px', flex: 1, minHeight: '18px', background: done ? c.p : '#eee', margin: '2px 0' }} />}
                  </div>
                  <div style={{ paddingBottom: '14px', flex: 1, paddingTop: '3px' }}>
                    <p style={{ fontSize: '14px', fontWeight: cur ? 600 : 400, color: cur ? c.p : done ? '#aaa' : '#111' }}>{s}</p>
                    {cur && <span style={{ fontSize: '11px', background: c.bg, color: c.txt, padding: '2px 8px', borderRadius: '10px' }}>Current step</span>}
                    {s.toLowerCase().includes('consultation') && <div style={{ marginTop: '10px', background: c.bg, border: `1px solid ${c.bd}`, borderRadius: '10px', padding: '12px 14px' }}>
                      <p style={{ fontSize: '13px', color: c.txt, marginBottom: '8px', fontWeight: 600 }}>📅 Ready to schedule your listing consultation?</p>
                      <p style={{ fontSize: '12px', color: c.txt, marginBottom: '10px', lineHeight: 1.5 }}>Book directly on Carolyn's calendar — pick a time that works for you.</p>
                      <a href={AGENT.calendlyUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', background: c.p, color: '#fff', padding: '9px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}>Book a Consultation →</a>
                    </div>}
                  </div>
                </div>
              )
            })}
          </div>
        )}
        {tab === 'documents' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {(client.documents || []).map(d => (
              <div key={d.id} style={{ border: `1px solid ${T.border}`, borderRadius: '10px', padding: '14px 16px', background: T.card, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '20px' }}>📄</span>
                <p style={{ flex: 1, fontSize: '13px', fontWeight: 600 }}>{d.title}</p>
                <span style={{ fontSize: '11px', padding: '3px 9px', borderRadius: '12px', background: d.status === 'signed' ? '#EAF3DE' : d.status === 'sent' ? '#E6F1FB' : '#FAEEDA', color: d.status === 'signed' ? '#27500A' : d.status === 'sent' ? '#0C447C' : '#633806', fontWeight: 600 }}>{d.status}</span>
                {d.status !== 'signed' && <a href={d.url} style={{ fontSize: '12px', color: c.p, fontWeight: 600, textDecoration: 'none' }}>Sign →</a>}
              </div>
            ))}
          </div>
        )}
        {tab === 'resources' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {(client.resources || []).map(r => (
              r.thumbnail
                ? <a key={r.id} href={r.url} target="_blank" rel="noopener noreferrer" style={{ border: `1px solid ${T.border}`, borderRadius: '12px', overflow: 'hidden', background: T.card, textDecoration: 'none', color: 'inherit', display: 'block' }}>
                    <img src={r.thumbnail} alt={r.title} style={{ width: '100%', height: '160px', objectFit: 'cover', display: 'block' }} />
                    <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <p style={{ flex: 1, fontSize: '14px', fontWeight: 600, color: T.text }}>{r.title}</p>
                      <span style={{ fontSize: '12px', color: c.p, fontWeight: 600 }}>Open →</span>
                    </div>
                  </a>
                : <a key={r.id} href={r.url} target="_blank" rel="noopener noreferrer" style={{ border: `1px solid ${T.border}`, borderRadius: '10px', padding: '14px 16px', background: T.card, display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'inherit' }}>
                    <span style={{ fontSize: '20px' }}>📎</span>
                    <p style={{ flex: 1, fontSize: '13px', fontWeight: 600, color: T.text }}>{r.title}</p>
                    <span style={{ fontSize: '11px', color: T.muted }}>{r.type} →</span>
                  </a>
            ))}
            {client.type === 'buyer' && <LendersSection />}
          </div>
        )}
        {tab === 'messages' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minHeight: '320px' }}>
              {(client.messages || []).length === 0
                ? <div style={{ textAlign: 'center', paddingTop: '60px' }}>
                    <p style={{ fontSize: '24px', marginBottom: '8px' }}>💬</p>
                    <p style={{ fontSize: '14px', color: T.muted }}>No messages yet.</p>
                    <p style={{ fontSize: '13px', color: T.hint, marginTop: '4px' }}>Send a message to Carolyn below.</p>
                  </div>
                : (client.messages || []).map(m => (
                    <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: m.from === 'client' ? 'flex-end' : 'flex-start' }}>
                      <div style={{ maxWidth: '80%', background: m.from === 'client' ? c.p : T.card, color: m.from === 'client' ? '#fff' : T.text, borderRadius: '12px', padding: '10px 14px', border: m.from === 'agent' ? `1px solid ${T.border}` : 'none' }}>
                        <p style={{ fontSize: '13px', lineHeight: 1.6 }}>{m.text}</p>
                      </div>
                      <p style={{ fontSize: '11px', color: T.hint, marginTop: '4px' }}>{m.from === 'client' ? 'You' : AGENT.name} · {m.date}</p>
                    </div>
                  ))
              }
            </div>
            <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: '12px', display: 'flex', gap: '8px' }}>
              <textarea value={msgText} onChange={e => setMsgText(e.target.value)} placeholder="Message Carolyn…" style={{ flex: 1, padding: '10px 12px', fontSize: '13px', borderRadius: '8px', border: `1px solid ${T.border}`, resize: 'none', minHeight: '64px', fontFamily: 'inherit' }} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg() } }} />
              <button onClick={sendMsg} style={{ alignSelf: 'flex-end', background: c.p, color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 18px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Send</button>
            </div>
            <p style={{ fontSize: '11px', color: T.hint }}>Messages are forwarded to {AGENT.email}</p>
          </div>
        )}
      </div>
      <BrandFooter />
    </div>
  )
}

function RealtorDashboard({ clients, setClients, onLogout }) {
  const [selId, setSelId] = useState(clients[0]?.id || null)
  const [preview, setPreview] = useState(null)
  const sel = clients.find(c => c.id === selId)
  const upd = (field, val) => setClients(cs => cs.map(c => c.id === selId ? { ...c, [field]: val } : c))
  const steps = sel ? STEPS[sel.type] || [] : []
  const addClient = () => {
    const type = 'buyer'
    const name = 'New client'
    const nc = { id: uid(), name, type, clientPhone: '', accessCode: '', stage: 0, agentName: AGENT.name, agentPhone: AGENT.phone, agentEmail: AGENT.email, welcomeMessage: DEFAULT_WELCOME[type](name), nextSteps: [...DEFAULT_NEXT_STEPS[type]], resources: [...(DEFAULT_RESOURCES[type] || [])], documents: [], properties: [], favorites: [], propertyComments: {} }
    setClients(cs => [...cs, nc]); setSelId(nc.id)
  }
  const delClient = id => { setClients(cs => cs.filter(c => c.id !== id)); setSelId(clients.find(c => c.id !== id)?.id || null) }

  if (preview) {
    const pc = clients.find(c => c.id === preview)
    if (pc) return (
      <div>
        <div style={{ padding: '10px 16px', background: '#1E2535', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => setPreview(null)} style={{ color: '#fff', background: 'none', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontSize: '13px' }}>← Realtor view</button>
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>Previewing: {pc.name}</span>
        </div>
        <ClientPortal client={pc} onLogout={() => setPreview(null)} onUpdate={u => setClients(cs => cs.map(c => c.id === preview ? { ...c, ...u } : c))} />
      </div>
    )
  }

  if (!sel) return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
      <button onClick={addClient} style={{ padding: '12px 24px', borderRadius: '8px', border: '1px solid #ddd', cursor: 'pointer', fontSize: '14px' }}>+ Add first client</button>
    </div>
  )

  const favs = sel.favorites || []
  const commentEntries = Object.entries(sel.propertyComments || {}).filter(([, v]) => v)

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', minHeight: '100vh' }}>
      <div style={{ background: '#1E2535', padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '4px 8px', marginBottom: '8px' }}>Clients</p>
        {clients.map(c => (
          <button key={c.id} onClick={() => setSelId(c.id)} style={{ padding: '8px 10px', borderRadius: '8px', border: 'none', background: selId === c.id ? 'rgba(255,255,255,0.1)' : 'none', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: COLORS[c.type]?.p || '#888', flexShrink: 0 }} />
            <span style={{ fontSize: '13px', color: '#fff', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</span>
            {((c.favorites || []).length > 0 || Object.values(c.propertyComments || {}).some(v => v)) && <span style={{ fontSize: '11px' }}>🔔</span>}
          </button>
        ))}
        <button onClick={addClient} style={{ margin: '8px 0 0', padding: '8px 10px', borderRadius: '8px', border: '1px dashed rgba(255,255,255,0.2)', background: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>+ Add client</button>
        <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '12px' }}>
          <button onClick={onLogout} style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: 'none', background: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', fontSize: '13px', textAlign: 'left' }}>Log out</button>
        </div>
      </div>
      <div style={{ padding: '24px', overflowY: 'auto', maxHeight: '100vh' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Edit: {sel.name}</h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setPreview(selId)} style={{ padding: '8px 14px', fontSize: '13px', borderRadius: '8px', border: '1px solid #ddd', background: '#fff', cursor: 'pointer' }}>Preview client view →</button>
            <button onClick={() => delClient(selId)} style={{ padding: '8px 10px', fontSize: '13px', borderRadius: '8px', border: '1px solid #fcc', background: '#fff5f5', color: '#c0392b', cursor: 'pointer' }}>🗑</button>
          </div>
        </div>
        {(favs.length > 0 || commentEntries.length > 0) && (
          <div style={{ background: '#FAEEDA', border: '1px solid #FAC775', borderRadius: '10px', padding: '14px 16px', marginBottom: '20px' }}>
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#412402', marginBottom: '8px' }}>🔔 Client activity on listings</p>
            {favs.length > 0 && <p style={{ fontSize: '13px', color: '#633806', marginBottom: '6px' }}>Saved {favs.length} propert{favs.length === 1 ? 'y' : 'ies'}: {sel.properties.filter(p => favs.includes(p.id)).map(p => p.address).join(', ')}</p>}
            {commentEntries.map(([pid, txt]) => {
              const p = sel.properties.find(x => x.id === pid)
              return p ? <div key={pid} style={{ background: 'rgba(255,255,255,0.6)', borderRadius: '6px', padding: '8px 10px', marginTop: '6px' }}>
                <p style={{ fontSize: '11px', color: '#633806', fontWeight: 600, marginBottom: '2px' }}>{p.address}</p>
                <p style={{ fontSize: '13px', color: '#412402' }}>{txt}</p>
              </div> : null
            })}
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
          {[['name', 'Client name'], ['type', 'Client type']].map(([f, l]) => (
            <div key={f}>
              <label style={{ fontSize: '12px', color: T.muted, display: 'block', marginBottom: '4px' }}>{l}</label>
              {f === 'type' ? (
                <select value={sel.type} onChange={e => { const t = e.target.value; upd('type', t); upd('stage', 0); upd('resources', [...(DEFAULT_RESOURCES[t] || [])]) }} style={{ width: '100%', padding: '8px 10px', border: `1px solid ${T.border}`, borderRadius: '8px', fontSize: '13px' }}>
                  <option value="buyer">Buyer</option><option value="seller">Seller</option><option value="landlord">Landlord</option><option value="tenant">Tenant</option>
                </select>
              ) : (
                <input value={sel[f] || ''} onChange={e => { upd(f, e.target.value); if (f === 'name') upd('welcomeMessage', DEFAULT_WELCOME[sel.type](e.target.value)) }} style={{ width: '100%', padding: '8px 10px', border: `1px solid ${T.border}`, borderRadius: '8px', fontSize: '13px' }} />
              )}
            </div>
          ))}
        </div>
        <div style={{ marginBottom: '14px' }}>
          <label style={{ fontSize: '12px', color: T.muted, display: 'block', marginBottom: '4px' }}>Client phone number</label>
          <input
            value={sel.clientPhone || ''}
            onChange={e => {
              const phone = e.target.value
              upd('clientPhone', phone)
              const code = last4(phone)
              if (code.length === 4) upd('accessCode', code)
            }}
            placeholder="(404) 555-6370"
            style={{ width: '100%', padding: '8px 10px', border: `1px solid ${T.border}`, borderRadius: '8px', fontSize: '13px', color: T.text }}
          />
        </div>
        <div style={{ background: T.secondary, border: `1px solid ${T.border}`, borderRadius: '10px', padding: '12px 14px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div>
            <p style={{ fontSize: '11px', color: T.muted, marginBottom: '2px' }}>Access code (last 4 digits of their phone)</p>
            <p style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '0.12em', color: T.text }}>{sel.accessCode || '—'}</p>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
            <button onClick={() => navigator.clipboard?.writeText(sel.accessCode)} style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '6px', border: `1px solid ${T.border}`, background: T.card, cursor: 'pointer', color: T.text }}>Copy</button>
            <button onClick={() => { const c = prompt('Enter a custom 4-digit code:'); if (c && /^\d{4}$/.test(c)) upd('accessCode', c) }} style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '6px', border: `1px solid ${T.border}`, background: T.card, cursor: 'pointer', color: T.text }}>Edit</button>
          </div>
        </div>
        <div style={{ marginBottom: '14px' }}>
          <label style={{ fontSize: '12px', color: T.muted, display: 'block', marginBottom: '4px' }}>Current journey step</label>
          <select value={sel.stage} onChange={e => upd('stage', Number(e.target.value))} style={{ width: '100%', padding: '8px 10px', border: `1px solid ${T.border}`, borderRadius: '8px', fontSize: '13px' }}>
            {steps.map((s, i) => <option key={i} value={i}>{i + 1}. {s}</option>)}
          </select>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '14px' }}>
          {[['agentName', 'Your name'], ['agentPhone', 'Your phone'], ['agentEmail', 'Your email']].map(([f, l]) => (
            <div key={f}>
              <label style={{ fontSize: '12px', color: T.muted, display: 'block', marginBottom: '4px' }}>{l}</label>
              <input value={sel[f] || ''} onChange={e => upd(f, e.target.value)} style={{ width: '100%', padding: '8px 10px', border: `1px solid ${T.border}`, borderRadius: '8px', fontSize: '13px' }} />
            </div>
          ))}
        </div>
        <div style={{ marginBottom: '14px' }}>
          <label style={{ fontSize: '12px', color: T.muted, display: 'block', marginBottom: '4px' }}>Welcome message</label>
          <textarea value={sel.welcomeMessage || ''} onChange={e => upd('welcomeMessage', e.target.value)} style={{ width: '100%', minHeight: '80px', padding: '8px 10px', border: `1px solid ${T.border}`, borderRadius: '8px', fontSize: '13px', resize: 'vertical' }} />
        </div>
        <div style={{ marginBottom: '14px' }}>
          <label style={{ fontSize: '12px', color: T.muted, display: 'block', marginBottom: '4px' }}>Next steps (one per line)</label>
          <textarea value={(sel.nextSteps || []).join('\n')} onChange={e => upd('nextSteps', e.target.value.split('\n').filter(s => s.trim()))} style={{ width: '100%', minHeight: '80px', padding: '8px 10px', border: `1px solid ${T.border}`, borderRadius: '8px', fontSize: '13px', resize: 'vertical' }} />
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [clients, setClients] = useState(DEMO)
  const [view, setView] = useState('login')
  const [clientId, setClientId] = useState(null)
  const client = clients.find(c => c.id === clientId)
  return (
    <>
      {view === 'login' && <Login clients={clients} onClient={id => { setClientId(id); setView('client') }} onRealtor={() => setView('realtor')} />}
      {view === 'client' && client && <ClientPortal client={client} onLogout={() => setView('login')} onUpdate={u => setClients(cs => cs.map(c => c.id === clientId ? { ...c, ...u } : c))} />}
      {view === 'realtor' && <RealtorDashboard clients={clients} setClients={setClients} onLogout={() => setView('login')} />}
    </>
  )
}