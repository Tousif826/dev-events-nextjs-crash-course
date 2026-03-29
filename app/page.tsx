import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import { EventDocument } from "@/database/event.model";
import { events } from "@/lib/constants";

const BASE_URL= process.env.NEXT_PUBLIC_URL_BASE || "http://localhost:3000";


export default async function Home() {
  const response= await fetch(`${BASE_URL}/api/events`,{cache:"no-store"});
  const {events}= await response.json();
  return (
<section>
  <h1 className="text-center">The hub for every dev <br />Event you can't miss</h1>
  <p className="text-center mt-5">Hackathons,Meetup and Conferences, All in One</p>
  <ExploreBtn/>
  <div className="mt-20 space-y-7 main max-w-6xl mx-auto">
    <h3>Featured Events</h3>
    <ul className="events">
      {events && events.length>0 && events.map((event: EventDocument,index:number)=>(
        <li key={index} className="list-none">
          <EventCard {...event}/>
        </li>
      ))}
    </ul>
  </div>
</section>
  );
}
