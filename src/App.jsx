import React from "react";
import { createRoot } from "react-dom/client";

const Radio = (props) => {
  const [track, setTrack] = React.useState(null);
  React.useEffect(() => {
    async function fetchTrack () {
      const response = await fetch(`https://www.nova.fr/wp-json/radios/${props.name}`)
      const data = await response.json()
      if (data.currentTrack) {
        setTrack(data.currentTrack)
      }
    }

    fetchTrack()
  }, [])
  return (
    <>
      {track && (
      <form
        style={{
          margin: "2rem 0"
        }}
        onSubmit={(e) => {
          e.preventDefault()
          const formData = new FormData(e.target)
          for (const entry of formData.entries()) {
            console.log(entry)
          }
        }}
      >
        <fieldset         style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem"
        }}
>
          <legend>{props.name}</legend>
          <input type="text" name="artist" defaultValue={track.artist} />
          <input type="text" name="title" defaultValue={track.title} />
          <button onClick={(e) => {
            e.preventDefault()
            window.open(`https://google.com/search?q=youtube+${track.artist}+${track.title}`)
          }}>youtube</button>
          <input type="text" placeholder="youtube id" name="youtube_id" />
          <input type="submit" value="submit" />
        </fieldset>
      </form>
    )}
      </>
  )
}
const App = () => {
  return (
    <div>
      <Radio name="nova-soul" />

      <Radio name="nova-la-nuit" />

      <Radio name="nova-classics" />

      <Radio name="nouvo-nova" />
    </div>
  );
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);