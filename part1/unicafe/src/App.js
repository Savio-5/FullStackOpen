import { useState } from 'react'

const FeedbackHeader = () => <h1>give feedback</h1>
const StatisticHeader = () => <h1>statistics</h1>

const Button = ({handleClick, text}) => <button onClick={handleClick}>{text}</button>

const Statistic = ({text,type}) => <p>{text} {type}</p>

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
      <StatisticHeader />
      <Statistic text='good' type={good}/>
      <Statistic text='neutral' type={neutral}/>
      <Statistic text='bad' type={bad}/>
      <Statistic text='all' type={all}/>
      <Statistic text='average' type={(good - bad) / all}/>
      <Statistic text='positive' type={((good / all) * 100) + ' %' }/>
    </div>
  )
}

export default App