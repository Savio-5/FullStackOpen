const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={message.error}>
      {message.name}
    </div>
  )
}

export default Notification