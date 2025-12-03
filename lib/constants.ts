export interface Event {
  image: string;
  title: string;
  slug: string;
  location: string;
  date: string;
  time: string;
}

export const events: Event[] = [
  {
    image: '/images/event1.png',
    title: 'React Conf 2025',
    slug: 'react-conf-2025',
    location: 'Las Vegas, NV',
    date: 'May 15-16, 2025',
    time: '9:00 AM'
  },
  {
    image: '/images/event2.png',
    title: 'Next.js Summit',
    slug: 'nextjs-summit-2025',
    location: 'San Francisco, CA',
    date: 'June 20-21, 2025',
    time: '10:00 AM'
  },
  {
    image: '/images/event3.png',
    title: 'Web Summit 2025',
    slug: 'web-summit-2025',
    location: 'Lisbon, Portugal',
    date: 'November 3-5, 2025',
    time: '8:30 AM'
  },
  {
    image: '/images/event4.png',
    title: 'DevCon 2025',
    slug: 'devcon-2025',
    location: 'Bangkok, Thailand',
    date: 'April 14-16, 2025',
    time: '9:00 AM'
  },
  {
    image: '/images/event5.png',
    title: 'TechCrunch Disrupt 2025',
    slug: 'techcrunch-disrupt-2025',
    location: 'San Francisco, CA',
    date: 'September 22-24, 2025',
    time: '9:00 AM'
  },
  {
    image: '/images/event6.png',
    title: 'Node.js Conf',
    slug: 'nodejs-conf-2025',
    location: 'New York, NY',
    date: 'July 10-11, 2025',
    time: '9:30 AM'
  }
];