import React from "react";
import { intelligenceToConfidence } from "../../services/personnelService";

type Person = {
  id: string;
  name: string;
  intelligenceLevel?: number;
};

export default function Profile({ person }: { person: Person }) {
  const confidence =
    person.intelligenceLevel !== undefined
      ? intelligenceToConfidence(person.intelligenceLevel)
      : 100;

  return (
    <div style={{ padding: 12, border: "1px solid #ddd", borderRadius: 6 }}>
      <div style={{ fontSize: 18, fontWeight: 700 }}>{person.name}</div>
      <div style={{ marginTop: 8 }}>Confidence: {confidence}%</div>
    </div>
  );
}
