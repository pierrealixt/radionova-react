import { StrictMode, useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { Client, Databases, Query } from "appwrite";

const database = () => {
  const client = new Client();
  client
    .setEndpoint("https://appwrite.pierrealix.fr/v1")
    .setProject("6410a2a175f66668f520");
  return new Databases(client);
};

const Track = ({ track, nextTrack }) => {
  const ref = useRef(null);
  return (
    <form
      ref={ref}
      onSubmit={async (event) => {
        event.preventDefault();
        const formData = new FormData(ref.current);
        console.log(formData.get("track_id"));
        console.log(formData.get("youtube_id"));

        const result = await database().updateDocument(
          "6410a34e2c9775636d92",
          "6410a3542de87cf5ccbf",
          formData.get("track_id"),
          {
            youtube_id: formData.get("youtube_id"),
          }
        );
        if (result) {
          nextTrack();
        }
      }}
    >
      <input type="hidden" name="track_id" defaultValue={track.$id} />
      <input type="text" defaultValue={track.artist} />
      <input type="text" defaultValue={track.title} />
      <a
        target="_blank"
        href={`https://google.com/search?q=youtube ${track.artist} ${track.title}`}
      >
        google
      </a>
      <input type="text" name="youtube_id" />
      <input type="submit" />
    </form>
  );
};

const App = () => {
  const [track, setTrack] = useState(null);
  useEffect(() => {
    async function fetchTrack() {
      const list = async (cursor) => {
        const queries = [Query.limit(1)];
        if (cursor) {
          queries.push(Query.cursorAfter(cursor));
        }
        return await database().listDocuments(
          "6410a34e2c9775636d92",
          "6410a3542de87cf5ccbf",
          queries
        );
      };

      const loop = async (cursor) => {
        const result = await list(cursor);
        if (!result.documents[0].youtube_id) {
          return result.documents[0];
        }

        return await loop(result.documents[result.documents.length - 1].$id);
      };

      const track = await loop(null);
      setTrack(track);
    }

    if (track == null) {
      fetchTrack();
    }
  });
  return (
    <StrictMode>
      {track && <Track track={track} nextTrack={() => setTrack(null)} />}
      {track == null && <p>Loading...</p>}
    </StrictMode>
  );
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
