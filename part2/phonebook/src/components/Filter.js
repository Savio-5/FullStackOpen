const Filter = ({newFilter, handleFilter}) => {
  return (
    <div>filter shown with<input type='text' value={newFilter} onChange={handleFilter}/></div>
  )
}

export default Filter;