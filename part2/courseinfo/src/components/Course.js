const Header = ({ course }) => {
  return <h1>{course}</h1>;
};

const Part = ({ part, exercises }) => {
  return (
    <p>
      {part} {exercises}
    </p>
  );
};

const Total = ({ parts }) => {
  let total = parts.reduce((sum, parts) => {
    return sum + parts.exercises;
  }, 0);

  return (
    <div>
      <p>
        <b>total of {total} exercises</b>
      </p>
    </div>
  );
};

const Content = ({ parts }) => {
  return (
    <>
      {parts.map((parts) => (
        <Part key={parts.id} part={parts.name} exercises={parts.exercises} />
      ))}
    </>
  );
};

const Course = ({ course }) => {
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  );
};

export default Course;