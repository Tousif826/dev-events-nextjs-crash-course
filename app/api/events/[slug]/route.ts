import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { connectToDatabase } from '@/lib/mongodb';
import { Event } from '@/database';

/**
 * Route params for `/api/events/[slug]`.
 */
interface EventBySlugParams {
  slug: string;
}

/**
 * GET /api/events/[slug]
 *
 * Returns a single event identified by its slug.
 */
export async function GET(
  _request: NextRequest,
  context: { params: EventBySlugParams },
) {
  const { slug } = await context.params;

  console.log('Fetching event with slug:', slug);

  // Validate that a non-empty slug was provided.
  if (!slug || typeof slug !== 'string' || !slug.trim()) {
    return NextResponse.json(
      { message: 'A valid slug parameter is required.',slug },
      { status: 400 },
    );
  }

  try {
    // Ensure database connection is established before querying.
    await connectToDatabase();

    // Fetch the event by slug.
    const event = await Event.findOne({ slug: slug.trim() }).lean().exec();

    if (!event) {
      return NextResponse.json(
        { message: 'Event not found.' },
        { status: 404 },
      );
    }

    // Successful response with the event payload.
    return NextResponse.json(event, { status: 200 });
  } catch (error) {
    // In production you would typically log this error to an observability system.
    console.error('Failed to fetch event by slug:', error);

    return NextResponse.json(
      { message: 'An unexpected error occurred while fetching the event.' },
      { status: 500 },
    );
  }
}
