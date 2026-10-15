import { useState } from 'react'
import { ArrowRight, Box, MoreHorizontal, X } from 'lucide-react'
import { EmptyState, PageHeader, TableSearch } from '../../components/ui'
import { ModalDialog } from '../../components/ui/ModalDialog'
import { products, subscriptions, transactions } from '../../data/index'
import { money } from '../../utils'
import type { Product } from '../../types'

export function ProductsPage() {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Product | null>(null)
  const filtered = products.filter((product) => `${product.name} ${product.description}`.toLowerCase().includes(query.toLowerCase()))
  return (
    <>
      <PageHeader eyebrow="WHAT YOU OFFER" title="Products" description="Explore your plans, subscriber mix, and revenue contribution." />
      <div className="products-toolbar"><TableSearch value={query} onChange={setQuery} placeholder="Search plans..." /><span>{filtered.length} plans</span></div>
      <section className="products-grid">
        {filtered.length === 0 ? <div className="card"><EmptyState title="No plans found" message="Try searching for another product." /></div> : filtered.map((product) => {
          const active = subscriptions.filter((subscription) => subscription.planId === product.id && subscription.status === 'active')
          const revenue = transactions.filter((transaction) => transaction.productId === product.id && transaction.status === 'paid').reduce((sum, transaction) => sum + transaction.amount, 0)
          const contribution = transactions.filter((transaction) => transaction.status === 'paid').reduce((sum, transaction) => sum + transaction.amount, 0)
          return (
            <article className="card product-card" key={product.id}>
              <div className="product-top"><span className="product-icon" style={{ background: `${product.color}18`, color: product.color }}><Box size={20} /></span><button type="button" className="icon-button" aria-label={`View ${product.name} details`} onClick={() => setSelected(product)}><MoreHorizontal size={18} /></button></div>
              <div className="product-tier">{product.tier} PLAN</div>
              <h2>{product.name}</h2>
              <p>{product.description}</p>
              <div className="product-price"><strong>{money(product.monthlyPrice)}</strong><span>/ month</span></div>
              <div className="product-stats"><div><span>Active subscribers</span><strong>{active.length}</strong></div><div><span>All-time revenue</span><strong>{money(revenue)}</strong></div></div>
              <div className="contribution-track" aria-label={`${contribution ? Math.round((revenue / contribution) * 100) : 0}% of revenue`}><span style={{ width: `${contribution ? Math.max(4, (revenue / contribution) * 100) : 0}%`, background: product.color }} /></div>
              <button type="button" className="product-detail-link" onClick={() => setSelected(product)}>View product details <ArrowRight size={15} /></button>
            </article>
          )
        })}
      </section>
      {selected && <ProductDialog product={selected} onClose={() => setSelected(null)} />}
    </>
  )
}

function ProductDialog({ product, onClose }: { product: Product; onClose: () => void }) {
  const subs = subscriptions.filter((subscription) => subscription.planId === product.id)
  const active = subs.filter((subscription) => subscription.status === 'active')
  return (
    <ModalDialog titleId="product-title" onClose={onClose}>
        <div className="dialog-top"><div><span className="eyebrow">PRODUCT DETAILS</span><h2 id="product-title">{product.name}</h2></div><button className="icon-button" type="button" aria-label="Close product details" onClick={onClose}><X size={18} /></button></div>
        <p className="dialog-description">{product.description}</p>
        <div className="dialog-amount">{money(product.monthlyPrice)}<small> / month</small></div>
        <dl className="detail-list"><div><dt>Plan type</dt><dd>{product.tier}</dd></div><div><dt>Active subscribers</dt><dd>{active.length}</dd></div><div><dt>Total subscriptions</dt><dd>{subs.length}</dd></div><div><dt>Monthly recurring revenue</dt><dd>{money(active.reduce((sum, subscription) => sum + subscription.monthlyAmount, 0))}</dd></div></dl>
    </ModalDialog>
  )
}
