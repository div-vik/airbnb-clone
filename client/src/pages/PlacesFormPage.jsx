import axios from "axios";
import { useEffect, useState } from "react";
import PhotosUploader from "../components/PhotosUploader";
import Perks from "../components/Perks";
import AccountNav from "../components/AccountNav";
import { Navigate, useParams } from "react-router-dom";

const PlacesFormPage = () => {
  const { id } = useParams();
  // console.log(id);
  const [title, setTitle] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [address, setAddress] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);
  const [checkOut, setCheckOut] = useState("");
  const [extraInfo, setExtraInfo] = useState("");
  const [perks, setPerks] = useState("");
  const [price, setPrice] = useState(1000);
  const [description, setDescription] = useState("");
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("/places/getplaces/" + id).then((response) => {
      const { data } = response;
      setTitle(data.title);
      setAddress(data.address);
      setAddedPhotos(data.photos);
      setDescription(data.description);
      setPerks(data.perks);
      setExtraInfo(data.extraInfo);
      setCheckIn(data.checkIn);
      setCheckOut(data.checkOut);
      setMaxGuests(data.maxGuests);
      setPrice(data.price);
    });
  }, [id]);

  const inputHeader = (text) => {
    return <h2 className="text-2xl mt-4">{text}</h2>;
  };
  const inputDescription = (text) => {
    return <p className="text-gray-500 text-sm">{text}</p>;
  };
  const preInput = (header, description) => {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    );
  };

  const savePlace = async (e) => {
    e.preventDefault();

    const placeData = {
      title,
      address,
      addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    };

    if (id) {
      //update
      await axios.put("/places/updateplaces", {
        id,
        ...placeData,
      });
      setRedirect(true);
    } else {
      //new place
      await axios.post("/places/addplaces", placeData);
      setRedirect(true);
    }
  };

  if (redirect) {
    return <Navigate to={"/account/places"} />;
  }
  return (
    <div>
      <AccountNav />
      <div className="text-left">
        <form onSubmit={savePlace}>
          {preInput(
            "Title",
            "Title for your place. Should be short and classy as in advertisement"
          )}
          <input
            type="text"
            placeholder="title, for example: My loving apt."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {preInput("Address", "Address to this place")}
          <input
            type="text"
            placeholder="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          {preInput("Photos", "more = better")}
          <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />
          {preInput("Descriptiones", "description of the place")}
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {preInput("Perks", "select all the perks of your place")}
          <div className="grid gap-2 mt-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            <Perks selected={perks} onChange={setPerks} />
          </div>
          {preInput("Extra info", "house rules, etc..")}
          <textarea
            value={extraInfo}
            onChange={(e) => setExtraInfo(e.target.value)}
          />
          <h2 className="text-2xl mt-4">Check in & out times</h2>
          <p className="text-gray-500 text-sm">
            add check in and out times, remember to have some time window for
            claning the room between guests
          </p>
          <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
            <div>
              <h3 className="mt-2 -mb-1">Check in time</h3>
              <input
                type="text"
                placeholder="14"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
              />
            </div>
            <div>
              <h3 className="mt-2 -mb-1">Check out time</h3>
              <input
                type="text"
                placeholder="11"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </div>
            <div>
              <h3 className="mt-2 -mb-1">Max number of guests</h3>
              <input
                type="number"
                value={maxGuests}
                onChange={(e) => setMaxGuests(e.target.value)}
              />
            </div>
            <div>
              <h3 className="mt-2 -mb-1">Price per night</h3>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>
          <div>
            <button type="submit" className="primary my-4 max-w-xs">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlacesFormPage;
