import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Form } from "react-bootstrap";
import { phonePrefixes } from "./data/phone_prefixes";
import { useState, useEffect, useMemo } from "react";

function App() {
  const [callingCode, setCallingCode] = useState("+");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [link, setLink] = useState("");
  const sortPhonePrefixes = [...phonePrefixes];

  useEffect(() => {
    // Get browser language
    const navIsoCode = navigator.language.split("-")[1];

    const result = phonePrefixes.filter((item) => item.alpha2 === navIsoCode);

    // Set default calling code
    if (result.length > 0) {
      const { alpha2, calling_code } = result[0];
      setCallingCode(calling_code);
      setSelectedCountry(alpha2 + calling_code);
    }
  }, []);

  useMemo(() => {
    // Update the link of the WA API
    const prefix = callingCode.replace("+", "");
    const cPhone = phone.replace(/\s/g, "");

    if (cPhone) {
      setLink(`https://api.whatsapp.com/send?phone=${prefix}${cPhone}`);
    } else {
      setLink("");
    }
  }, [callingCode, phone]);

  sortPhonePrefixes.sort((a, b) => {
    const countryA = a.country.toLowerCase();
    const countryB = b.country.toLowerCase();

    if (countryA < countryB) {
      return -1;
    }
    if (countryA > countryB) {
      return 1;
    }
    return 0;
  });

  const handleCallingCode = (e: { target: { value: string } }) => {
    const value =
      "+" +
      e.target.value
        .replace(/\D/g, "") // Replace non numeric chars
        .replace(/\s/g, ""); // Replace all spaces;

    if (value.length > 6) return;

    const result = sortPhonePrefixes.filter(
      (item) => item.calling_code === value
    );

    if (result.length > 0) {
      const { alpha2, calling_code } = result[0];
      setSelectedCountry(alpha2 + calling_code);
    } else {
      setSelectedCountry("-");
    }

    setCallingCode(value);
  };

  const handlePhone = (e: { target: { value: string } }) => {
    if (!e.target.value) setPhone("");
    if (e.target.value.length > 40) return;

    const segments = e.target.value
      .replace(/\D/g, "") // Replace non numeric chars
      .replace(/\s/g, "") // Replace all spaces
      .match(/.{1,3}/g);

    const result = segments?.join(" ");

    setPhone(result ? result : "");
  };

  const handleSelectCountry = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    if (value === "-") {
      setCallingCode("+");
      setSelectedCountry("-");
    } else {
      const code = value.split("+")[1];
      setCallingCode("+" + code);
      setSelectedCountry(e.target.value);
    }
  };

  const onSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    window.open(link + "", "_blank");
  };

  return (
    <>
      <div className="text-center mt-5 px-3">
        <img
          className="img-fluid"
          src="https://raw.githubusercontent.com/javierorp/wa-no-contact/gh-pages/logo.svg"
          alt="Logo"
          width={100}
        />
        <h1 className="mt-3">Send WA no contact</h1>
        <p style={{ fontSize: "1.2rem" }}>
          Send messages via WhatsApp without storing the contact*
        </p>
        <p>
          <i style={{ backgroundColor: "lightgray", fontWeight: "bold" }}>
            No cookies are used and no phone or other information is stored
          </i>
        </p>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Form onSubmit={onSubmit} className="mt-1 px-3">
          <Form.Label htmlFor="countryCode" className="mt-2">
            Select country
          </Form.Label>
          <Form.Select
            id="countryCode"
            aria-label="Select country"
            value={selectedCountry}
            onChange={handleSelectCountry}
            style={{ maxWidth: 500 }}
          >
            <option key="-" value="-">
              -- Select country --
            </option>
            {sortPhonePrefixes.map((item) => (
              <option
                key={item.country}
                value={`${item.alpha2}${item.calling_code}`}
              >
                {item.country} ({item.calling_code})
              </option>
            ))}
          </Form.Select>

          <Form.Label htmlFor="callingCode" className="mt-3">
            International calling code
          </Form.Label>
          <Form.Control
            id="callingCode"
            aria-label="International Calling Code"
            value={callingCode}
            onChange={handleCallingCode}
            style={{ maxWidth: 500 }}
          />

          <Form.Label htmlFor="phoneNumber" className="mt-3">
            Number
          </Form.Label>
          <Form.Control
            type="text"
            inputMode="numeric"
            aria-label="Phone number"
            id="phoneNumber"
            placeholder="000 000 000"
            value={phone}
            onChange={handlePhone}
            style={{ maxWidth: 500 }}
          />
          <div className="text-center mt-4">
            <Button
              className="btn-lg"
              variant="success"
              type="submit"
              onClick={onSubmit}
              disabled={!callingCode || !phone}
            >
              Send message
            </Button>
          </div>
        </Form>
      </div>
      {link && (
        <p
          className="text-center px-3 mt-4"
          style={{ overflow: "auto", animation: "fadeIn 0.5s" }}
        >
          If the button does not work correctly, copy this link in your browser:
          <br />
          <a title="Link to WhatsApp API" target="_blank" href={link}>
            {link}
          </a>
        </p>
      )}

      <p className="text-center mt-4">
        *The app and a WhatApp account are required
      </p>

      <hr className="m-4" />

      <footer className="text-center px-3">
        <p>
          Created by{" "}
          <a
            title="Created by Javierorp"
            target="_blank"
            href="https://github.com/javierorp"
          >
            <strong>Javierorp</strong>
          </a>{" "}
          (2024)
        </p>
        <p>
          The code of this website is available on{" "}
          <a
            title="GitHub link"
            target="_blank"
            href="https://github.com/javierorp/wa-no-contact"
          >
            GitHub
          </a>
        </p>
        <p className="mb-3">
          This website is not associated in any way with Meta, Facebook or
          WhatsApp
        </p>
      </footer>
    </>
  );
}

export default App;
