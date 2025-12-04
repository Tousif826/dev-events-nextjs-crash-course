import { Schema, model, models, Document, Model, Types } from 'mongoose';
import  Event  from './event.model';

/**
 * Booking document representation.
 */
export interface BookingDocument extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export type BookingModel = Model<BookingDocument>;

/**
 * Simple email validator using a conservative regular expression.
 */
function isValidEmail(email: string): boolean {
  const trimmed = email.trim();
  // Intentionally conservative regex to avoid over-accepting malformed emails.
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(trimmed);
}

const BookingSchema = new Schema<BookingDocument, BookingModel>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
      index: true, // indexed for faster event lookups
    },
    email: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (value: string) => isValidEmail(value),
        message: 'Invalid email address',
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
 * Pre-save hook that ensures:
 * - the referenced event exists
 * - the email is normalized/validated
 */
BookingSchema.pre<BookingDocument>('save', async function () {
  const doc = this;

  // Normalize and validate email
  const normalizedEmail = doc.email.trim();
  if (!isValidEmail(normalizedEmail)) {
    throw new Error('Invalid email address');
  }
  doc.email = normalizedEmail;

  // Verify referenced event exists
  const eventExists = await Event.exists({ _id: doc.eventId });
  if (!eventExists) {
    throw new Error('Cannot create booking: referenced event does not exist');
  }
});

// Reuse the model if it is already compiled (important in Next.js dev mode).
export const Booking: BookingModel =
  (models.Booking as BookingModel | undefined) ||
  model<BookingDocument, BookingModel>('Booking', BookingSchema);
