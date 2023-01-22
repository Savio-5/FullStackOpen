import { useState } from 'react'

const FeedbackHeader = () => <h1>give feedback</h1>
const StatisticHeader = () => <h1>statistics</h1>

const Button = ({handleClick, text}) => <button onClick={handleClick}>{text}</button>

const StatisticLine = ({text,type}) => <p>{text} {type}</p>

const Statistics = ({good,neutral,bad,all}) => {
  return(
    <>
      <StatisticHeader />
      <StatisticLine text='good' type={good}/>
      <StatisticLine text='neutral' type={neutral}/>
      <StatisticLine text='bad' type={bad}/>
      <StatisticLine text='all' type={all}/>
      <StatisticLine text='average' type={(good - bad) / all}/>
      <StatisticLine text='positive' type={((good / all) * 100) + ' %' }/>
    </>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const all = good + neutral + bad

  return (
    <div>
      <FeedbackHeader />
      <Button handleClick={() => setGood(good+1)} text='good'/>
      <Button handleClick={() => setNeutral(neutral+1)} text='neutral'/>
      <Button handleClick={() => setBad(bad+1)} text='bad'/>
      <Statistics good={good} neutral={neutral} bad={bad} all={all}/>
    </div>
  )
}

export default App