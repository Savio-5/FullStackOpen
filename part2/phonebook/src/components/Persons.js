const Persons = ({ newPerson }) => {
  return (
    <div>
      {newPerson.map(person => <p key={person.id}>{person.name} {person.number}</p>)}
    </div>
  )
}

export default Persons;