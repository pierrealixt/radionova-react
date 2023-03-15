import { StrictMode, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Account, Client, Databases } from "appwrite";

const Radio = (props) => {
  const [track, setTrack] = useState(null);
  useEffect(() => {
    async function fetchTrack() {
      const response = await fetch(
        `https://www.nova.fr/wp-json/radios/${props.name}`
      );
      const data = await response.json();
      if (data.currentTrack) {
        setTrack(data.currentTrack);
      }
    }

    fetchTrack();
  }, []);
  return (
    <>
      {track && (
        <form
          style={{
            margin: "2rem 0",
          }}
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            for (const entry of formData.entries()) {
              console.log(entry);
            }

            const client = new Client()
              .setEndpoint("https://appwrite.pierrealix.fr/v1")
              .setProject("6410a2a175f66668f520");
            const account = new Account(client);
            await account.createEmailSession(
              "myradionova@pierrealix.fr",
              "appwrite-myradionova"
            );

            const databases = new Databases(client);

            await databases.createDocument(
              "6410a34e2c9775636d92",
              "6410a3542de87cf5ccbf",
              crypto.randomUUID(),
              {
                artist: formData.get("artist"),
                title: formData.get("title"),
                youtube_id: formData.get("youtube_id"),
              }
            );
          }}
        >
          <fieldset
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <legend>{props.name}</legend>
            <input type="text" name="artist" defaultValue={track.artist} />
            <input type="text" name="title" defaultValue={track.title} />
            <button
              onClick={(e) => {
                e.preventDefault();
                window.open(
                  `https://google.com/search?q=youtube+${track.artist}+${track.title}`
                );
              }}
            >
              youtube
            </button>
            <input type="text" placeholder="youtube id" name="youtube_id" />
            <input type="submit" value="submit" />
          </fieldset>
        </form>
      )}
    </>
  );
};
const App = () => {
  return (
    <StrictMode>
      <Radio name="nova-soul" />
      <Radio name="nova-la-nuit" />
      <Radio name="nova-classics" />
      <Radio name="nouvo-nova" />
    </StrictMode>
  );
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
