import { useState,useEffect } from 'react'
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Notification from "./components/Notification";
import personService from "./services/persons";

const App = () => {

  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [newPerson, setNewPerson] = useState([])
  const [message, setMessage] = useState(null)

  useEffect(() => {
    personService.getAll().then(allPerson => {
      setPersons(allPerson)
      setNewPerson(allPerson)
    })
  }, [])

  useEffect(() => {
    setTimeout(
      () => setMessage(null),
      5000
    )
  }, [message])

  function handleEvent(event) {
    event.preventDefault()
    const person = persons.find(person => person.name === newName)
    if(person) {
      alert(`${newName} is already added to phonebook`)
      if(window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const changedPerson = {...person, number: newNumber}
        personService
        .update(person.id,changedPerson)
        .then(updatePerson => {
          setMessage({
            error: 'alert',
            name: `Updated ${updatePerson.name}`,
          })
          setPersons(persons.map(person => person.id !== updatePerson.id ? person : updatePerson))
          setNewPerson(persons.map(person => person.id !== updatePerson.id ? person : updatePerson))
        })
      }
    } else {
      const personObject = {
        id: persons.length + 1,
        name: newName,
        number: newNumber
      }

      personService.create(personObject).then(createPerson => {
        setMessage({
          error: 'success',
          name: `Added ${createPerson.name}`,
        })
        setPersons(persons.concat(createPerson))
        setNewPerson(persons.concat(createPerson))
      }).catch(error => {
        
        setMessage({
          error: 'error',
          name: error.response.data.error,
        })

        // console.log(error.response.data.error)
      })
    }
    setNewName('')
    setNewNumber('')
  }

  const deletePerson = (id,name) => {
    if(window.confirm(`Delete ${name} ?`)) {
      personService.remove(id).then(response => {
        setMessage({
          error: 'error',
          name: `Deleted ${name}`,
        })
        setPersons(persons.filter(person => person.id !== id))
        setNewPerson(persons.filter(person => person.id !== id))
      }).catch(error => {
        setMessage({
          error: 'error',
          name: `Information of ${name} has already been removed from server`,
        })
        setPersons(persons.filter(person => person.id !== id))
        setNewPerson(persons.filter(person => person.id !== id))
      })
    }
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

      <Notification message={message} />

      <Filter newFilter={newFilter} handleFilter={handleFilter} />

      <h3>Add a new</h3>

      <PersonForm 
        handleEvent={handleEvent}
        newName={newName}
        handleChangeName={handleChangeName}
        newNumber={newNumber}
        handleChangeNumber={handleChangeNumber}
      />

      <h3>Numbers</h3>

      <Persons newPerson={newPerson} deletePerson={deletePerson}/>
    </div>
  )
}

export default App