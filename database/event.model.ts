import { Schema, model, models, Document, Model } from 'mongoose';

/**
 * Event attributes as stored in MongoDB.
 */
export interface EventDocument extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string; // ISO date string (YYYY-MM-DD or full ISO)
  time: string; // Normalized time string, e.g. HH:mm
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type EventModel = Model<EventDocument>;

/**
 * Helper to normalize a date-like string to an ISO string.
 * Throws if the value cannot be parsed to a valid date.
 */
function normalizeDateToISO(dateValue: string): string {
  const parsed = new Date(dateValue);

  if (Number.isNaN(parsed.getTime())) {
    throw new Error('Invalid event date');
  }

  return parsed.toISOString();
}

/**
 * Helper to normalize time into a "HH:mm" 24-hour format.
 * Accepts values like "9:30", "09:30", "21:05" and rejects invalid times.
 */
function normalizeTimeToHHMM(timeValue: string): string {
  const trimmed = timeValue.trim();

  // Basic validation/normalization to HH:mm (24h).
  const match = /^([01]?\d|2[0-3]):([0-5]\d)$/.exec(trimmed);
  if (!match) {
    throw new Error('Invalid event time. Expected HH:mm in 24-hour format.');
  }

  const hours = match[1].padStart(2, '0');
  const minutes = match[2].padStart(2, '0');

  return `${hours}:${minutes}`;
}

/**
 * Mongoose schema for the Event collection.
 */
const EventSchema = new Schema<EventDocument, EventModel>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    overview: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    venue: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    mode: {
      type: String,
      required: true,
      trim: true,
    },
    audience: {
      type: String,
      required: true,
      trim: true,
    },
    agenda: {
      type: [String],
      required: true,
      validate: {
        validator: (value: string[]) => Array.isArray(value) && value.length > 0,
        message: 'Agenda must contain at least one item',
      },
    },
    organizer: {
      type: String,
      required: true,
      trim: true,
    },
    tags: {
      type: [String],
      required: true,
      validate: {
        validator: (value: string[]) => Array.isArray(value) && value.length > 0,
        message: 'Tags must contain at least one value',
      },
    },
  },
  {
    // Automatically manage `createdAt` and `updatedAt` fields.
    timestamps: true,
    strict: true,
  },
);

/**
 * Pre-save hook to:
 * - generate a URL-friendly slug from the title (only when the title changes)
 * - normalize `date` to an ISO string
 * - normalize `time` to a predictable HH:mm format
 * - ensure required string fields are non-empty after trimming
 */
EventSchema.pre<EventDocument>('save', async function () {
  const doc = this;

  doc.title = doc.title.trim();
  doc.description = doc.description.trim();
  doc.overview = doc.overview.trim();
  doc.image = doc.image.trim();
  doc.venue = doc.venue.trim();
  doc.location = doc.location.trim();
  doc.mode = doc.mode.trim();
  doc.audience = doc.audience.trim();
  doc.organizer = doc.organizer.trim();

  if (!doc.title) throw new Error('Field "title" is required and cannot be empty');
  if (!doc.description) throw new Error('Field "description" is required and cannot be empty');
  if (!doc.overview) throw new Error('Field "overview" is required and cannot be empty');
  if (!doc.image) throw new Error('Field "image" is required and cannot be empty');
  if (!doc.venue) throw new Error('Field "venue" is required and cannot be empty');
  if (!doc.location) throw new Error('Field "location" is required and cannot be empty');
  if (!doc.mode) throw new Error('Field "mode" is required and cannot be empty');
  if (!doc.audience) throw new Error('Field "audience" is required and cannot be empty');
  if (!doc.organizer) throw new Error('Field "organizer" is required and cannot be empty');

  doc.date = normalizeDateToISO(doc.date);
  doc.time = normalizeTimeToHHMM(doc.time);

  if (doc.isModified('title') || !doc.slug) {
    const baseSlug = doc.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    doc.slug = baseSlug;
  }
});



const Event =
  models.Event || model<EventDocument, EventModel>('Event', EventSchema);

export default Event;
