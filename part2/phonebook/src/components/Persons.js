const Persons = ({ newPerson, deletePerson }) => {
  return (
    <div>
      {newPerson.map(person => {
        return (<div key={person.id}>
          <p key={person.id}>{person.name} {person.number}<button key={person.id} onClick={() => deletePerson(person.id,person.name)}>delete</button></p>
        </div>)
      })}
    </div>
  )
}

export default Persons;