import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, onlyWithMotion } from "../anim/gsap";
import "./Style/Contact.css";

import visitImg from "../Assets/f1.jpg";

/**
 * Contact — "Visit card on a photograph".
 *
 * A full-bleed photograph of the place carries one solid card and nothing
 * else. The card holds the address, the hours and the phone, and ends in the
 * page's primary action.
 *
 * The address, hours and number are sample content: they must be replaced
 * with the workshop's real details before this goes live.
 */
const HOURS = [
  ["Tuesday – Friday", "8.00 – 18.00"],
  ["Saturday", "9.00 – 13.00"],
  ["Sunday, Monday", "By appointment"],
];

const Contact = () => {
  const root = useRef(null);

  useGSAP(
    () => {
      onlyWithMotion(() => {
        gsap.from(".visit__card", {
          y: 28,
          autoAlpha: 0,
          duration: 0.9,
          ease: "coast",
          scrollTrigger: {
            trigger: root.current,
            start: "top 65%",
            toggleActions: "play none none none",
          },
        });
  
        // The one moving picture: a slow drift on the photograph as it passes.
        gsap.fromTo(
          ".visit__img",
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          }
        );
        });
    },
    { scope: root }
  );

  return (
    <section className="visit" id="visit" ref={root}>
      <img
        className="visit__img"
        src={visitImg}
        alt="The workshop floor with a car under the lights"
        loading="lazy"
        width="1600"
        height="900"
      />

      <div className="visit__card">
        <h2 className="visit__title">Come and see one</h2>

        <address className="visit__address">
          Timeless Wheels
          <br />
          14 Hartwell Lane, Dorset DT2 8QA
        </address>

        <dl className="visit__hours tw-nums">
          {HOURS.map(([day, time]) => (
            <div className="visit__row" key={day}>
              <dt>{day}</dt>
              <dd>{time}</dd>
            </div>
          ))}
        </dl>

        <a className="visit__phone tw-nums" href="tel:+441305770175">
          +44 1305 770 175
        </a>

        <a
          className="visit__action tw-button"
          href="mailto:workshop@timelesswheels.example?subject=Workshop%20visit&body=I%27d%20like%20to%20come%20and%20see%20the%20workshop.%0A%0APreferred%20day%3A%0ACar%20or%20bike%3A%0A"
        >
          Book a visit
        </a>
      </div>
    </section>
  );
};

export default Contact;
