import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import { events } from "@/lib/constants";
import Image from "next/image";


export default function Home() {
  return (
<section>
  <h1 className="text-center">The hub for every dev <br />Event you can't miss</h1>
  <p className="text-center mt-5">Hackathons,Meetup and Conferences, All in One</p>
  <ExploreBtn/>
  <div className="mt-20 space-y-7">
    <h3>Featured Events</h3>
    <ul className="events">
      {events.map((event)=>(
        <li key={event.title}>
          <EventCard {...event}/>
        </li>
      ))}
    </ul>
  </div>
</section>
  );
}
