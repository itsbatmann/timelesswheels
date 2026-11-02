/**
 * The preloader car, traced from src/Assets/vinatage cars.png.
 *
 * The contour data lives in ./carData.js, which is generated — see the header
 * there for how it was pulled out of the engraving. Everything here is stroked
 * and unfilled so DrawSVGPlugin can ink all of it.
 *
 * The two wheels are NOT traced. Their static spokes and hub were dropped at
 * export time and replaced with the generated wire wheels below, because a
 * traced wheel is a fixed shape and this one has to turn.
 */
import { CAR_PATHS, CAR_WHEELS, CAR_VIEWBOX, CAR_GROUND } from "./carData";

// Wire spokes, generated so the count is trivial to change and every spoke is
// exactly on its radius.
const spokes = (cx, cy, rIn, rOut, count) =>
  Array.from({ length: count }, (_, i) => {
    const rad = ((360 * i) / count) * (Math.PI / 180);
    return {
      i,
      x1: (cx + rIn * Math.cos(rad)).toFixed(1),
      y1: (cy + rIn * Math.sin(rad)).toFixed(1),
      x2: (cx + rOut * Math.cos(rad)).toFixed(1),
      y2: (cy + rOut * Math.sin(rad)).toFixed(1),
    };
  });

const Wheel = ({ cx, cy, r, side }) => (
  <g className={`car__wheel car__wheel--${side}`}>
    <circle className="car__rim" cx={cx} cy={cy} r={(r * 0.78).toFixed(1)} />
    <g className="car__spokes">
      {spokes(cx, cy, r * 0.17, r * 0.74, 32).map((s) => (
        <line
          key={s.i}
          className="car__spoke"
          x1={s.x1}
          y1={s.y1}
          x2={s.x2}
          y2={s.y2}
        />
      ))}
    </g>
    <circle className="car__hub" cx={cx} cy={cy} r={(r * 0.16).toFixed(1)} />
  </g>
);

// Road surface rushing past. The car stays put on screen, so without the world
// moving underneath it the turning wheels would just look like they were
// spinning on the spot. One dash pitch of travel loops seamlessly.
export const DASH_PITCH = 80;

// Where each wheel turns about, handed to GSAP as svgOrigin.
export const WHEEL_ORIGINS = Object.fromEntries(
  CAR_WHEELS.map((w) => [w.key, `${w.cx} ${w.cy}`])
);

const Car = () => (
  <svg className="pre__car" viewBox={CAR_VIEWBOX} aria-hidden="true">
    <line
      className="car__ground"
      x1="18"
      y1={CAR_GROUND}
      x2="942"
      y2={CAR_GROUND}
    />

    <g className="car__road">
      {Array.from({ length: 14 }, (_, i) => {
        const x = -DASH_PITCH + i * DASH_PITCH;
        return (
          <line
            key={i}
            className="car__dash"
            x1={x}
            y1={CAR_GROUND + 12}
            x2={x + 42}
            y2={CAR_GROUND + 12}
          />
        );
      })}
    </g>

    <g className="car__speed">
      {[60, 110, 160, 210, 262].map((y, i) => (
        <line
          key={y}
          className="car__streak"
          x1={40 + i * 30}
          y1={y}
          x2={230 + i * 30}
          y2={y}
        />
      ))}
    </g>

    <g className="car__body">
      {CAR_PATHS.map((d, i) => (
        <path className="car__line" key={i} d={d} />
      ))}

      {CAR_WHEELS.map((w) => (
        <Wheel key={w.key} cx={w.cx} cy={w.cy} r={w.r} side={w.key} />
      ))}
    </g>
  </svg>
);

export default Car;
