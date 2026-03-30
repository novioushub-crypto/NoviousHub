// Google Analytics helper functions
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', GA_TRACKING_ID, {
      page_path: url,
    })
  }
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }: {
  action: string
  category: string
  label: string
  value?: number
}) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// E-commerce tracking
export const trackPurchase = (transaction: {
  transaction_id: string
  value: number
  currency: string
  items: Array<{
    item_id: string
    item_name: string
    price: number
    quantity: number
  }>
}) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'purchase', transaction)
  }
}

export const trackAddToCart = (item: {
  item_id: string
  item_name: string
  price: number
  quantity: number
}) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'add_to_cart', {
      items: [item],
    })
  }
}

export const trackViewItem = (item: {
  item_id: string
  item_name: string
  price: number
}) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'view_item', {
      items: [item],
    })
  }
}
