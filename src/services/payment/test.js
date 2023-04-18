const response = {
  object: 'charge',
  id: 'chrg_test_5ujjkywnhibtmevq4ul',
  location: '/charges/chrg_test_5ujjkywnhibtmevq4ul',
  amount: 100000,
  net: 96094,
  fee: 3650,
  fee_vat: 256,
  interest: 0,
  interest_vat: 0,
  funding_amount: 100000,
  refunded_amount: 0,
  transaction_fees: { fee_flat: '0.0', fee_rate: '3.65', vat_rate: '7.0' },
  platform_fee: { fixed: null, amount: null, percentage: null },
  currency: 'THB',
  funding_currency: 'THB',
  ip: null,
  refunds: {
    object: 'list',
    data: [],
    limit: 20,
    offset: 0,
    total: 0,
    location: '/charges/chrg_test_5ujjkywnhibtmevq4ul/refunds',
    order: 'chronological',
    from: '1970-01-01T00:00:00Z',
    to: '2023-01-21T11:23:11Z',
  },
  link: null,
  description: 'Charge for order 3947',
  metadata: {},
  card: {
    object: 'card',
    id: 'card_test_5ujjkj41yuh7zu1huuu',
    livemode: false,
    location: null,
    deleted: false,
    street1: null,
    street2: null,
    city: null,
    state: null,
    phone_number: null,
    postal_code: '10320',
    country: 'us',
    financing: 'credit',
    bank: 'JPMORGAN CHASE BANK N.A.',
    brand: 'Visa',
    fingerprint: 'MXiMdmONbZyAOxkB/FRtFe9NVAHtmh1jO5iG3SzV4LQ=',
    first_digits: null,
    last_digits: '4242',
    name: 'JOHN DOE',
    expiration_month: 3,
    expiration_year: 2030,
    security_code_check: true,
    tokenization_method: null,
    created_at: '2023-01-21T11:21:56Z',
  },
  source: null,
  schedule: null,
  customer: null,
  dispute: null,
  transaction: 'trxn_test_5ujjkz0jd74yba5vqzk',
  failure_code: null,
  failure_message: null,
  status: 'successful',
  authorize_uri:
    'https://api.omise.co/payments/paym_test_5ujjkywp5grbjdjxqu3/authorize',
  return_uri: 'http://www.example.com/orders/3947/complete',
  created_at: '2023-01-21T11:23:10Z',
  paid_at: '2023-01-21T11:23:11Z',
  expires_at: '2023-01-28T11:23:10Z',
  expired_at: null,
  reversed_at: null,
  zero_interest_installments: false,
  branch: null,
  terminal: null,
  device: null,
  authorized: true,
  capturable: false,
  capture: true,
  disputable: true,
  livemode: false,
  refundable: true,
  reversed: false,
  reversible: false,
  voided: false,
  paid: true,
  expired: false,
}
