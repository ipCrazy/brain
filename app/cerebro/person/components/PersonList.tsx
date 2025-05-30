import { PersonType } from "@/lib/types/Person";

export default function PersonList({
  initialPersons,
}: {
  initialPersons: PersonType[];
}) {
  return (
    <div className="space-y-4">
      {initialPersons.length === 0 && <p>Nema poznatih osoba još uvek.</p>}

      {initialPersons.map((person) => (
        <div
          key={person._id}
          className="border p-4 rounded-lg bg-white dark:bg-neutral-900 shadow"
        >
          <h2 className="font-bold text-lg mb-2">
            {person.name} {person.surname}
          </h2>
          <div className="space-y-1">
            {Object.entries(person).map(([key, value]) => (
              <div key={key} className="text-sm text-neutral-700">
                <span className="font-medium">{key}:</span>{" "}
                {typeof value === "object" && value !== null
                  ? JSON.stringify(value)
                  : String(value)}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
