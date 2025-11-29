import ExploreBtn from "@/components/ExploreBtn";
import EventCard from "@/components/EventCard";
import { IEvent } from "@/database";
import { Suspense } from "react";

const EventList = async () => {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const response = await fetch(`${BASE_URL}/api/events`, {
    next: { revalidate: 0 },
  });
  const { events } = await response.json();

  return (
    <ul className="events">
      {events?.map((event: IEvent) => (
        <li key={event.title} className="list-none">
          <EventCard {...event} />
        </li>
      ))}
    </ul>
  );
};

const Page = () => {
  return (
    <section>
      <h1 className="text-center">
        The Hub for Every Dev <br /> Event You Can&apos;t Miss
      </h1>
      <p className="text-center mt-5">
        Hackathons, Meetups, and Conferences, All in One Place
      </p>

      <ExploreBtn />

      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>

        <Suspense fallback={<p>Loading events...</p>}>
          <EventList />
        </Suspense>
      </div>
    </section>
  );
};

export default Page;
