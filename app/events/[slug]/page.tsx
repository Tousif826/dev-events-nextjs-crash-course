import BookEvent from "@/components/BookEvent";
import EventCard from "@/components/EventCard";
import { EventDocument } from "@/database/event.model";
import { getSimilarEventsBySlug } from "@/lib/actions/event.actions";
import Image from "next/image";
import { notFound } from "next/navigation";

const EventDetailItem=({icon,alt,label}:{icon:string,alt:string,label:string})=>{
    return(
        <div className="flex gap-2 items-center">
            <Image src={icon} alt={alt} height={17} width={17}/>
            <p>{label}</p>
        </div>
    )
}

const EventAgenda=({agendaItems}:{agendaItems:string[]})=>{
    return(
        <div className="agenda">
        <h2>Agenda</h2>
        <ul>
            {agendaItems.map((item)=>(
                <li key={item}>{item}</li>
            ))}
        </ul>
            </div>
    )
}

const EventTags=({tags}:{tags:string[]})=>{
    return(
        <div className="flex-row gap-1.5 flex-wrap">
            {tags.map((tag)=>(
                <div key={tag} className="pill">{tag}</div>
            ))}
        </div>
    )
}


export default async function EventDetails ({params}:{params:Promise<{slug:string}>}) {
    const {slug} = await params;
    const BASE_URL= process.env.NEXT_PUBLIC_URL_BASE || "http://localhost:3000";
    const response=await fetch(`${BASE_URL}/api/events/${slug}`,{cache:"no-store"});
    const event= await response.json();
    const {description, image,overview,mode,agenda,audience,tags,organiser, date, time, location}= event;
    if (!event) return notFound(); 
    const bookings=10;
    const similarEvents: EventDocument[] = await getSimilarEventsBySlug(slug);
    console.log("similarevents",similarEvents);
    console.log("events",event);
    
    

  return (
    <section id="event">
        <div className="header">
            <h1 className="mt-2">Event Description</h1>
            <p>{description}</p>
        </div>
        <div className="details">
            <div className="content">
                <Image src={image} alt="Event Banner" width={800} height={400} className="banner"/>
                <section className="flex flex-col gap-2">
                    <h2>Overview</h2>
                    <p>{overview}</p>
                </section>
                <section className="flex flex-col gap-2">
                    <h2>Event Details</h2>
                   <EventDetailItem icon="/icons/calendar.svg" alt="calendar" label={date}/>
                   <EventDetailItem icon="/icons/clock.svg" alt="clock" label={time}/>
                   <EventDetailItem icon="/icons/pin.svg" alt="pin" label={location}/>
                   <EventDetailItem icon="/icons/mode.svg" alt="mode" label={mode}/>
                   <EventDetailItem icon="/icons/audience.svg" alt="audience" label={audience}/>
                </section>
                {agenda && agenda.length>0 && <EventAgenda agendaItems={agenda}/>}
                <section className="flex flex-col gap-2">
                    <h2>About the organiser</h2>
                    <p>{organiser}</p>
                </section>

                {tags && tags.length>0 && <EventTags tags={tags}/>}

            </div>
            <aside className="booking">
                <div className="signup-card">
                    <h2>Book Your Spot</h2>
                    {bookings>0?(
                        <p className="text-sm">
                            Join {bookings} people who have Booked their spot
                        </p>
                    ):(
                        <p className="text-sm">Be The First</p>
                    )}
                <BookEvent/>
                </div>
            </aside>
        </div>
        <div className="flex flex-col  w-full gap-4">
<h2>Similar Events</h2>
{similarEvents.map((simEvent) => {
  const plain = simEvent.toObject();
  return <EventCard key={plain.slug} {...plain} />;
})
}
        </div>
    </section>
  )
}
