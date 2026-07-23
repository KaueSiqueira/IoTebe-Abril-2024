import React from "react";

export default function Note({width, height}) {
  return (
    <svg width={width} height={height} viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M24 0H2.985C1.335 0 0 1.35 0 3L0.015 24C0.015 25.65 1.35 27 3 27H18L27 18V3C27 1.35 25.65 0 24 0ZM6 7.5H21V10.5H6V7.5ZM13.5 16.5H6V13.5H13.5V16.5ZM16.5 24.75V16.5H24.75L16.5 24.75Z"
      />
    </svg>
  );
}
