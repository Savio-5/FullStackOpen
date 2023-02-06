import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [newPerson, setNewPerson] = useState(persons)

  function handleEvent(event) {
    event.preventDefault()
    if(persons.find(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`)
    } else {
      const personObject = {
        id: persons.length + 1,
        name: newName,
        number: newNumber
      }
      setPersons(persons.concat(personObject))
      setNewPerson(persons.concat(personObject))
    }
    setNewName('')
    setNewNumber('')
  }

  function handleFilter(event) {
    setNewFilter(event.target.value)
    setNewPerson(persons.filter(person => person.name.toLowerCase().includes(event.target.value.toLowerCase())))
  }

  function handleChangeName(event) {
    setNewName(event.target.value)
  }

  function handleChangeNumber(event) {
    setNewNumber(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <div>filter shown with<input type='text' value={newFilter} onChange={handleFilter}/></div>
      <form onSubmit={handleEvent}>
      <h2>add a new</h2>
        <div>name: <input type='text' value={newName} onChange={handleChangeName}/></div>
        <div>number: <input type='text' value={newNumber} onChange={handleChangeNumber}/></div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <div>
        {newPerson.map(person => <p key={person.id}>{person.name} {person.number}</p>)}
      </div>
    </div>
  )
}

export default App