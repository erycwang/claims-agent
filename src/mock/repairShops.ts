export interface RepairShop {
  id: string
  name: string
  address: string
  city: string
  distance: string
  rating: number
  reviews: number
  specialty: string
  phone: string
  hours: string
  available: boolean
  preferred?: boolean
}

export const MOCK_REPAIR_SHOPS: RepairShop[] = [
  {
    id: 'shop1',
    name: 'Greenway Auto Body',
    address: '1482 Oak Street',
    city: 'San Francisco, CA',
    distance: '0.8 mi',
    rating: 4.8,
    reviews: 142,
    specialty: 'Tesla Certified Collision Center',
    phone: '(555) 204-8833',
    hours: 'Mon–Fri 8am–6pm',
    available: true,
    preferred: true,
  },
  {
    id: 'shop2',
    name: 'Bay Area Collision Center',
    address: '290 Market Street',
    city: 'San Francisco, CA',
    distance: '1.2 mi',
    rating: 4.6,
    reviews: 89,
    specialty: 'EV & Hybrid Specialist',
    phone: '(555) 302-1144',
    hours: 'Mon–Sat 8am–7pm',
    available: true,
    preferred: false,
  },
  {
    id: 'shop3',
    name: 'Golden Gate Auto Repair',
    address: '55 Valencia Street',
    city: 'San Francisco, CA',
    distance: '2.1 mi',
    rating: 4.5,
    reviews: 211,
    specialty: 'Full Service Collision',
    phone: '(555) 488-7722',
    hours: 'Mon–Fri 7am–6pm',
    available: false,
    preferred: false,
  },
  {
    id: 'shop4',
    name: 'Pacific Auto Works',
    address: '789 Mission Street',
    city: 'San Francisco, CA',
    distance: '2.8 mi',
    rating: 4.3,
    reviews: 67,
    specialty: 'General Body Work',
    phone: '(555) 612-9900',
    hours: 'Mon–Fri 8am–5pm',
    available: true,
    preferred: false,
  },
]
