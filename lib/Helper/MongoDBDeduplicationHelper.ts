import { Connection } from "mongoose";

const deduplicationCollectionName = "event_bus_processing_events";

export async function canStartProcessingEvent(connection: Connection, eventId: string): Promise<boolean> {
  try {
    await connection.db.collection(deduplicationCollectionName).insertOne({
      eventId,
      processingStartedAt: new Date(),
    });
    return true;
  } catch (error) {
    if ((error instanceof Error ? error.message : undefined)?.includes("E11000 duplicate")) {
      return false;
    } else {
      console.log(
        "Encountered unexpected error while checking duplication",
        error instanceof Error ? error.stack : error
      );
      return true;
    }
  }
}
