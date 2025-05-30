import { getFullUserFromCookies } from "@/lib/auth";
import { getPersonsForUser } from "@/lib/db/fetchPersons";
import PersonList from "./PersonList";
import { PersonType } from "@/lib/types/Person";

export default async function ServerPersonList() {
  const user = await getFullUserFromCookies();
  if (!user) return <div>Nema korisnika</div>;

  const persons = await getPersonsForUser(user._id.toString());

  const serializedPersons = persons.map((person) => ({
    _id: person._id.toString(),
    userId: person.userId?.toString() ?? "",
    name: person.name,
    surname: person.surname,
    nickname: person.nickname ?? "",
    age: person.age ?? undefined,
    birthday: person.birthday ? new Date(person.birthday).toISOString() : null,
    email: person.email ?? "",
    phone: person.phone ?? "",
    address: person.address ?? "",
    company: person.company ?? "",
    occupation: person.occupation ?? "",
    relationship: person.relationship ?? "",
    notes: person.notes ?? "",
    createdAt: person.createdAt ? new Date(person.createdAt).toISOString() : "",
    updatedAt: person.updatedAt ? new Date(person.updatedAt).toISOString() : "",
    customFields: person.customFields ?? {},
  }));

  return <PersonList initialPersons={serializedPersons} />;
}
