import React from 'react'

export const MARQUEE_ITEMS = [
  'WE SELL DIRT.\u2122',
  "BC's #1 Development Land Specialist",
  '19+ Years \u00b7 $4B+ Volume',
  'Court-Ordered Sales \u00b7 Land Assemblies \u00b7 Income Properties',
  '#1 Agent in BC & Canada \u2014 Homelife International 2014\u20132025 \u00b7 12 Consecutive Years',
]

export const SPECIALTIES = [
  { title: 'Court-Ordered Mandates', desc: 'Judicial sale and foreclosure specialists \u2014 protecting lender recovery and timelines with full legal coordination.' },
  { title: 'Land Assemblies', desc: 'Multi-parcel acquisitions coordinated for maximum rezoning and development potential.' },
  { title: 'Income Properties', desc: 'Revenue-generating multi-family and commercial assets across the Fraser Valley.' },
  { title: 'Advisory & Research', desc: 'Land-use analysis, portfolio management, and development consultation from first call to closing.' },
]

export const PROCESS_STEPS = [
  { title: 'Research & Strategy', desc: 'In-depth land-use analysis, networking with city officials, and buyer pool identification before the mandate begins.' },
  { title: 'Opportunity Analysis', desc: 'Comparative market analysis with land-use recommendations delivered to lenders and legal counsel.' },
  { title: 'Marketing', desc: 'Multi-channel outreach to our qualified buyer network \u2014 developers, investors, and builders. Court date support included.' },
  { title: 'Review Offers', desc: 'All offers presented with full reference checks on buyers. Lenders advised on each submission.' },
  { title: 'Bi-Weekly Updates', desc: 'Detailed marketing reports issued every two weeks directly to lenders and lawyers with market feedback.' },
  { title: 'Court Approval & Close', desc: 'Full coordination of deposits, closing documentation, and communication with all legal parties through to completion.' },
]

export const PROCESS_ICONS = [
  React.createElement('svg', { key: '0', width: 28, height: 28, viewBox: '0 0 28 28', fill: 'none', stroke: '#F0EAE0', strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round' },
    React.createElement('circle', { cx: 12, cy: 12, r: 8 }),
    React.createElement('line', { x1: 18.5, y1: 18.5, x2: 26, y2: 26 })
  ),
  React.createElement('svg', { key: '1', width: 28, height: 28, viewBox: '0 0 28 28', fill: 'none', stroke: '#F0EAE0', strokeWidth: 1.4, strokeLinecap: 'round' },
    React.createElement('rect', { x: 3, y: 16, width: 5, height: 9 }),
    React.createElement('rect', { x: 11.5, y: 10, width: 5, height: 15 }),
    React.createElement('rect', { x: 20, y: 4, width: 5, height: 21 })
  ),
  React.createElement('svg', { key: '2', width: 28, height: 28, viewBox: '0 0 28 28', fill: 'none', stroke: '#F0EAE0', strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round' },
    React.createElement('polygon', { points: '4,9 4,19 10,19 22,24 22,4 10,9' }),
    React.createElement('line', { x1: 10, y1: 9, x2: 10, y2: 19 }),
    React.createElement('line', { x1: 7, y1: 22, x2: 10, y2: 19 })
  ),
  React.createElement('svg', { key: '3', width: 28, height: 28, viewBox: '0 0 28 28', fill: 'none', stroke: '#F0EAE0', strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round' },
    React.createElement('rect', { x: 5, y: 2, width: 18, height: 24, rx: 1 }),
    React.createElement('line', { x1: 9, y1: 9, x2: 19, y2: 9 }),
    React.createElement('line', { x1: 9, y1: 14, x2: 19, y2: 14 }),
    React.createElement('polyline', { points: '9,20 12,23 19,18' })
  ),
  React.createElement('svg', { key: '4', width: 28, height: 28, viewBox: '0 0 28 28', fill: 'none', stroke: '#F0EAE0', strokeWidth: 1.4, strokeLinecap: 'round' },
    React.createElement('rect', { x: 3, y: 5, width: 22, height: 21, rx: 1 }),
    React.createElement('line', { x1: 3, y1: 12, x2: 25, y2: 12 }),
    React.createElement('line', { x1: 9, y1: 2, x2: 9, y2: 8 }),
    React.createElement('line', { x1: 19, y1: 2, x2: 19, y2: 8 }),
    React.createElement('line', { x1: 9, y1: 18, x2: 9, y2: 18, strokeWidth: 2 }),
    React.createElement('line', { x1: 14, y1: 18, x2: 14, y2: 18, strokeWidth: 2 }),
    React.createElement('line', { x1: 19, y1: 18, x2: 19, y2: 18, strokeWidth: 2 })
  ),
  React.createElement('svg', { key: '5', width: 28, height: 28, viewBox: '0 0 28 28', fill: 'none', stroke: '#F0EAE0', strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round' },
    React.createElement('rect', { x: 12, y: 2, width: 14, height: 8, rx: 1, transform: 'rotate(45 12 2)' }),
    React.createElement('line', { x1: 8, y1: 14, x2: 2, y2: 26 }),
    React.createElement('line', { x1: 3, y1: 24, x2: 14, y2: 24 })
  ),
]

export const AWARD_YEARS = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014]

export const PRESS_LOGOS = [
  { name: 'Western Investor', url: '/logos/press/western-investor.png', height: 28, invert: false },
  { name: 'Vancouver Courier', url: '/logos/press/vancouver-courier.jpg', height: 28, invert: true },
  { name: 'Top Agent Magazine', url: '/logos/press/top-agent.svg', height: 32, invert: false },
  { name: 'REP Canada', url: '/logos/press/rep-canada.jpg', height: 28, invert: true },
  { name: 'Homes & Land', url: '/logos/press/homes-and-land.jpg', height: 28, invert: true },
  { name: 'CBC News', url: '/logos/press/cbc-news.png', height: 40, invert: false },
  { name: 'Canadian Real Estate Wealth', url: '/logos/press/canadian-rew.png', height: 28, invert: false },
  { name: 'Business in Vancouver', url: '/logos/press/business-in-van.jpg', height: 28, invert: true },
  { name: 'Abbotsford Business Excellence', url: '/logos/press/abbotsford.jpg', height: 40, invert: true },
  { name: 'BCBusiness', url: '/logos/press/bcbusiness.svg', height: 26, invert: false },
  { name: 'Aldergrove Star', url: '/logos/press/aldergrove-star.png', height: 28, invert: false },
  { name: 'CoStar Power Broker', url: '/logos/press/costar.png', height: 34, invert: false },
]

export const FALLBACK_T = [
  { _id: 't1', name: 'Parm Purewall', role: 'Chairman & Founder', company: 'PHL Capital Corp.', logo: '/logos/phl-capital.svg', quote: 'Joe Varing and his team are true professionals, very experienced, knowledgeable and sincerely willing to assist in due diligence during a transaction. We have collaborated with Joe on several assets over the past few years. The best thing about him is that he is very personable and also always ready to answer our questions.' },
  { _id: 't2', name: 'Inde Sumal', role: 'President & CEO', company: 'Lighthouse Capital', logo: '/logos/lighthouse-capital.png', quote: 'I have known Joe for years and consult with him regularly regarding market intelligence that benefits my business. I hire him for buying and selling real estate as he is the trusted advisor in his market. Joe can work well in difficult markets also. We were successful in the sale of a Court Ordered Sale in Surrey with the help of Joe.' },
  { _id: 't3', name: 'Amar Sidhu', role: 'Vice President', company: 'Guards Capital', logo: '/logos/guards-capital.png', quote: "Joe has a strong grasp of debt financing and the way capital stacks influence development land deals. His foresight and professionalism give us confidence that transactions will be handled properly. He doesn\u2019t just focus on getting a sale done; he works to create outcomes that align with lender priorities and long-term stability." },
  { _id: 't4', name: 'Mitchell Urzinger', role: 'AVP', company: 'Atrium MIC', logo: '/logos/atrium-mic.png', quote: "What we\u2019ve appreciated most about working with Joe is his ability to adapt when deals don\u2019t go as planned. Financing challenges, shifting buyer interest, or unexpected conditions haven\u2019t slowed him down. Joe is able to structure creative solutions and is efficient." },
  { _id: 't5', name: 'Jeevan Khunkhun', role: 'Group President', company: 'Carevest Capital', logo: '/logos/carevest-capital.png', quote: "We\u2019ve worked with Joe on a number of projects and have consistently found him to be practical and thorough. He understands both the real estate side and the financing side, which makes the process smoother for everyone involved. That balanced approach, combined with his market knowledge, has made him a reliable partner for our team." },
  { _id: 't6', name: 'Sunjeev Bath', role: 'Principal', company: 'PHL Capital Corp.', logo: '/logos/phl-capital.svg', quote: 'Joe Varing has helped us on both the sell side and buy side of transactions. His hard work and dedication to his profession keep him apprised of any changes in a rapidly evolving marketplace. Joe does his best to give you a broad view of the general market conditions along with detailed analysis of the factors affecting a particular property.' },
  { _id: 't7', name: 'Amarjit Samra', role: 'Principal', company: 'Samra Group', logo: '/logos/samra-group.png', quote: "As a lender, working with Joe Varing has been a refreshing experience. He understands the complexities of foreclosure sales and the sensitivities involved when debt recovery is at stake. Joe\u2019s ability to navigate court-ordered processes, while maintaining professionalism with both borrowers and buyers, has consistently protected our interests." },
  { _id: 't8', name: 'Gary Mertens', role: 'Advisor', company: 'Qualico Communities', logo: '/logos/qualico.png', quote: 'Their team operates with a level of sophistication, experience, and professionalism that is rare in the land brokerage space. We rely on Joe for our Fraser Valley land acquisitions.' },
  { _id: 't9', name: 'Paul Grewal', role: 'Partner', company: 'Fasken Martineau', logo: '/logos/fasken.png', quote: 'Joe has assisted many of my clients with their most significant land acquisitions in the Fraser Valley. His legal awareness and market expertise make him an invaluable advisor.' },
]
